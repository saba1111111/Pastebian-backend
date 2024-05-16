import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import {
  IDeleteItemCredentials,
  IGetItemCredentials,
  IPutItemCredentials,
  IQueryItemsCredentials,
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
