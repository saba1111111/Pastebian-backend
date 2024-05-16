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
          column: attribute.name,
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

  public async deleteItem(input: IDeleteItemCredentials): Promise<any> {
    const item = deleteItem({
      Key: createContentItemPrimaryKey(input),
      TableName: this.table,
    });

    return this.dynamoClient.send(item);
  }

  public findItemById(id: string) {
    const { id: idAttribute } = ContentTableAttributes;
    const idExpression = `:${idAttribute.name}`;

    const items = queryItems({
      TableName: this.table,
      ConsistentRead: true,
      KeyConditionExpression: `${idAttribute.name} = ${idExpression}'`,
      ExpressionAttributeValuesList: [
        { name: `${idExpression}`, value: id, type: idAttribute.type },
      ],
    });

    return this.dynamoClient.send(items);
  }
}
