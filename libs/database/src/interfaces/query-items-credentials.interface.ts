import {
  AttributeValue,
  ReturnConsumedCapacity,
  Select,
} from '@aws-sdk/client-dynamodb';
import { IExpressionAttributeValue } from './items.interface';

export interface IQueryItemsCredentials {
  TableName: string;
  ConsistentRead?: boolean;
  ExclusiveStartKey?: { [k: string]: AttributeValue };
  ExpressionAttributeNames?: { [k: string]: string };
  ExpressionAttributeValuesList?: IExpressionAttributeValue[];
  FilterExpression?: string;
  IndexName?: string;
  KeyConditionExpression?: string;
  Limit?: number;
  ProjectionExpression?: string;
  ReturnConsumedCapacity?: ReturnConsumedCapacity;
  ScanIndexForward?: boolean;
  Select?: Select;
}
