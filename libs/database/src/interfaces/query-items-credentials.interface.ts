import {
  AttributeValue,
  ReturnConsumedCapacity,
  Select,
} from '@aws-sdk/client-dynamodb';
import { IAttribute } from './items.interface';

export interface IQueryItemsCredentials {
  TableName: string;
  ConsistentRead?: boolean;
  ExclusiveStartKey?: { [k: string]: AttributeValue };
  ExpressionAttributeNames?: { [k: string]: string };
  ExpressionAttributeValuesList?: IAttribute[];
  FilterExpression?: string;
  IndexName?: string;
  KeyConditionExpression?: string;
  Limit?: number;
  ProjectionExpression?: string;
  ReturnConsumedCapacity?: ReturnConsumedCapacity;
  ScanIndexForward?: boolean;
  Select?: Select;
}
