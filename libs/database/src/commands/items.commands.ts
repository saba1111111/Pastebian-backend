import {
  BatchWriteItemCommand,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import {
  IBatchWriteItems,
  IDeleteItemCredentials,
  IGetItemCredentials,
  IPutItemCredentials,
  IQueryItemsCredentials,
  IScanItemsCredentials,
} from '../interfaces';
import { transformAttributeValuesInDynamoFormat } from '../helpers';

export const putItem = (input: IPutItemCredentials) => {
  const { Attributes, ExpressionAttributeValuesList, ...rest } = input;

  const Item = transformAttributeValuesInDynamoFormat(Attributes);

  const ExpressionAttributeValues = transformAttributeValuesInDynamoFormat(
    ExpressionAttributeValuesList,
  );

  return new PutItemCommand({ Item, ExpressionAttributeValues, ...rest });
};

export const getItem = (input: IGetItemCredentials) => {
  const Key = transformAttributeValuesInDynamoFormat(input.Key);

  return new GetItemCommand({ ...input, Key });
};

export const deleteItem = (input: IDeleteItemCredentials) => {
  const { ExpressionAttributeValuesList, ...rest } = input;

  const Key = transformAttributeValuesInDynamoFormat(input.Key);

  const ExpressionAttributeValues = transformAttributeValuesInDynamoFormat(
    ExpressionAttributeValuesList,
  );

  return new DeleteItemCommand({ ...rest, Key, ExpressionAttributeValues });
};

export const queryItems = (input: IQueryItemsCredentials) => {
  const { ExpressionAttributeValuesList, ...rest } = input;

  const ExpressionAttributeValues = transformAttributeValuesInDynamoFormat(
    ExpressionAttributeValuesList,
  );

  return new QueryCommand({ ExpressionAttributeValues, ...rest });
};

export const scanItems = (input: IScanItemsCredentials) => {
  const { ExpressionAttributeValuesList, ...rest } = input;

  const ExpressionAttributeValues = transformAttributeValuesInDynamoFormat(
    ExpressionAttributeValuesList,
  );

  return new ScanCommand({ ExpressionAttributeValues, ...rest });
};

export const batchWriteItems = (input: IBatchWriteItems) => {
  return new BatchWriteItemCommand(input);
};
