import { Inject, Injectable } from '@nestjs/common';
import {
  IContent,
  IContentRepository,
  ICreateContentDbCredentials,
  IDeleteItemCredentials,
  IIdentifyContentItem,
} from '../interfaces';
import {
  ContentTableAttributes,
  DATABASE_CLIENT_TOKEN,
  TABLES,
} from 'libs/database/constants';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  batchWriteItems,
  deleteItem,
  getItem,
  putItem,
  queryItems,
  scanItems,
} from 'libs/database/commands';
import { createContentItemPrimaryKey, parseToken } from '../helpers';
import {
  transformDynamoAttributesToItem,
  transformDeleteRequestUnprocessedItems,
} from 'libs/database/helpers';
import { IPaginationInput, IPaginationResponse } from 'libs/common/interfaces';

@Injectable()
export class ContentDynamoRepository implements IContentRepository {
  private readonly table: string = TABLES.PASTEBIAN_TABLE;
  constructor(
    @Inject(DATABASE_CLIENT_TOKEN)
    private readonly dynamoClient: DynamoDBClient,
  ) {}

  public async create(input: ICreateContentDbCredentials): Promise<IContent> {
    const Attributes = [];
    for (const key in input) {
      if (key in ContentTableAttributes) {
        const attribute = ContentTableAttributes[key];

        Attributes.push({
          name: attribute.name,
          value: input[key],
          type: attribute.type,
        });
      }
    }

    const item = putItem({
      TableName: this.table,
      Attributes,
    });
    await this.dynamoClient.send(item);
    return input;
  }

  public findItem(input: IIdentifyContentItem): Promise<any> {
    const item = getItem({
      TableName: this.table,
      Key: createContentItemPrimaryKey(input),
      ConsistentRead: true,
    });

    return this.dynamoClient.send(item);
  }

  public async deleteItem(input: IDeleteItemCredentials): Promise<number> {
    const item = deleteItem({
      Key: createContentItemPrimaryKey(input),
      TableName: this.table,
    });

    const result = await this.dynamoClient.send(item);
    if (result?.$metadata?.httpStatusCode === 200) {
      return 1;
    }
    return 0;
  }

  public async findItemById(id: string): Promise<IContent> {
    const { id: idAttribute } = ContentTableAttributes;
    const idExpression = `:${idAttribute.name}`;

    const items = queryItems({
      TableName: this.table,
      ConsistentRead: true,
      KeyConditionExpression: `${idAttribute.name} = ${idExpression}`,
      ExpressionAttributeValuesList: [
        { name: `${idExpression}`, value: id, type: idAttribute.type },
      ],
    });

    const { Items } = await this.dynamoClient.send(items);
    const item = Items?.[0];

    if (!item) {
      return null;
    }

    return transformDynamoAttributesToItem(item) as IContent;
  }

  public async getExpiredItems(
    input?: IPaginationInput,
  ): Promise<IPaginationResponse> {
    const { Limit, fields } = input || {};
    const nextPageToken = parseToken(input.nextPageToken);

    const items = scanItems({
      TableName: this.table,
      FilterExpression: `expireAt <= :now`,
      ExpressionAttributeValuesList: [
        { name: `:now`, value: Date.now(), type: 'N' },
      ],
      ...(Limit ? { Limit } : {}),
      ...(nextPageToken ? { ExclusiveStartKey: nextPageToken } : {}),
      ...(fields ? { ProjectionExpression: fields } : {}),
    });

    const { Items, LastEvaluatedKey } = await this.dynamoClient.send(items);

    const newNextPageToken = LastEvaluatedKey
      ? JSON.stringify(LastEvaluatedKey)
      : null;

    return {
      items: Items
        ? Items.map((item) => transformDynamoAttributesToItem(item) as IContent)
        : [],
      nextPageToken: newNextPageToken,
    };
  }

  public async deleteItems(items: IIdentifyContentItem[]) {
    try {
      const deleteCommands = items.map((item) => ({
        DeleteRequest: {
          Key: {
            id: { S: item.id },
            expireAt: { N: `${item.expireAt}` },
          },
        },
      }));

      const result = await this.dynamoClient.send(
        batchWriteItems({
          RequestItems: {
            [this.table]: deleteCommands,
          },
        }),
      );

      const unprocessedItems =
        transformDeleteRequestUnprocessedItems<IIdentifyContentItem>({
          table: this.table,
          unprocessedDynamoItems: result.UnprocessedItems,
        });

      return { unprocessedItems };
    } catch (error) {}
  }

  public async createExpiredTestItems(): Promise<any> {
    const items = Array.from({ length: 25 }, (_, i) => ({
      id: `test-id-${i}`,
      expireAt: Date.now() - 3600000,
      content: `content-${i}`,
    }));

    const putCommands = items.map((item) => ({
      PutRequest: {
        Item: {
          id: { S: item.id },
          expireAt: { N: item.expireAt.toString() },
          content: { S: item.content },
        },
      },
    }));

    return this.dynamoClient.send(
      batchWriteItems({
        RequestItems: {
          [this.table]: putCommands,
        },
      }),
    );
  }
}
