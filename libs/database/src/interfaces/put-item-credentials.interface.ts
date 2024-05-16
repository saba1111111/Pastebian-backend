import {
  ReturnConsumedCapacity,
  ReturnItemCollectionMetrics,
  ReturnValue,
  ReturnValuesOnConditionCheckFailure,
} from '@aws-sdk/client-dynamodb';
import { IAttribute, IExpressionAttributeValue } from './items.interface';

export interface IPutItemCredentials {
  Attributes: IAttribute[];
  TableName: string;
  ConditionExpression?: string;
  ExpressionAttributeNames?: { [k: string]: string };
  ExpressionAttributeValuesList?: IExpressionAttributeValue[];
  ReturnConsumedCapacity?: ReturnConsumedCapacity;
  ReturnItemCollectionMetrics?: ReturnItemCollectionMetrics;
  ReturnValues?: ReturnValue;
  ReturnValuesOnConditionCheckFailure?: ReturnValuesOnConditionCheckFailure;
}