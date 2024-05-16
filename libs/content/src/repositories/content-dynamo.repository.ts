import { Inject, Injectable } from '@nestjs/common';
import {
  IContent,
  IContentRepository,
  ICreateContentDbCredentials,
  IDeleteItemCredentials,
  IFindItemCredentials,
} from '../interfaces';
import {
  ContentTableAttributes,
  DATABASE_CLIENT_TOKEN,
  TABLES,
} from 'libs/database/constants';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  deleteItem,
  getItem,
  putItem,
  queryItems,
} from 'libs/database/commands';
import { createContentItemPrimaryKey } from '../helpers';
import { transformDynamoAttributesToItem } from 'libs/database/helpers';

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

  public findItem(input: IFindItemCredentials): Promise<any> {
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
}
