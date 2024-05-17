import {
  AttributeValue,
  ReturnConsumedCapacity,
  Select,
} from '@aws-sdk/client-dynamodb';
import { IAttribute } from './items.interface';

export type TExclusiveStartKey = { [k: string]: AttributeValue };

interface IFetchItemsCredentials {
  TableName: string;
  ConsistentRead?: boolean;
  ExclusiveStartKey?: TExclusiveStartKey;
  ExpressionAttributeNames?: { [k: string]: string };
  ExpressionAttributeValuesList?: IAttribute[];
  FilterExpression?: string;
  IndexName?: string;
  Limit?: number;
  ProjectionExpression?: string;
  ReturnConsumedCapacity?: ReturnConsumedCapacity;
  Select?: Select;
}

export interface IQueryItemsCredentials extends IFetchItemsCredentials {
  KeyConditionExpression?: string;
  ScanIndexForward?: boolean;
}

export interface IScanItemsCredentials extends IFetchItemsCredentials {
  Segment?: number;
  TotalSegments?: number;
}
