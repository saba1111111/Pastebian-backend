import {
  ReturnConsumedCapacity,
  ReturnItemCollectionMetrics,
  ReturnValue,
  ReturnValuesOnConditionCheckFailure,
  ScalarAttributeType,
} from '@aws-sdk/client-dynamodb';

export interface IPutItemCredentials {
  Attributes: { column: string; value: string; type: ScalarAttributeType }[];
  TableName: string;
  ConditionExpression?: string;
  ExpressionAttributeNames?: { [k: string]: string };
  ExpressionAttributeValuesList?: {
    name: string;
    value: string;
    type: ScalarAttributeType;
  }[];
  ReturnConsumedCapacity?: ReturnConsumedCapacity;
  ReturnItemCollectionMetrics?: ReturnItemCollectionMetrics;
  ReturnValues?: ReturnValue;
  ReturnValuesOnConditionCheckFailure?: ReturnValuesOnConditionCheckFailure;
}
