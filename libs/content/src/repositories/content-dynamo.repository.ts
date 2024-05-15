import { Inject, Injectable } from '@nestjs/common';
import {
  IContent,
  IContentRepository,
  ICreateContentDbCredentials,
} from '../interfaces';
import { DATABASE_CLIENT_TOKEN, TABLES } from 'libs/database/constants';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { putItem } from 'libs/database/commands';

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
      Attributes.push({
        column: key,
        value: input[key],
        type: typeof input[key] === 'string' ? 'S' : 'N',
      });
    }

    const item = putItem({
      TableName: this.table,
      Attributes,
    });
    await this.dynamoClient.send(item);
    return input;
  }
}
