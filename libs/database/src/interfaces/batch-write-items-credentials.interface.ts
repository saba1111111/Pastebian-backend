import {
  AttributeValue,
  ReturnConsumedCapacity,
  ReturnItemCollectionMetrics,
} from '@aws-sdk/client-dynamodb';

export interface RequestItems {
  [tableName: string]: Array<{
    PutRequest?: {
      Item: { [key: string]: AttributeValue };
    };
    DeleteRequest?: {
      Key: { [key: string]: AttributeValue };
    };
  }>;
}

export interface IBatchWriteItems {
  RequestItems: RequestItems;
  ReturnConsumedCapacity?: ReturnConsumedCapacity;
  ReturnItemCollectionMetrics?: ReturnItemCollectionMetrics;
}
