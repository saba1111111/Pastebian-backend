import { ReturnConsumedCapacity } from '@aws-sdk/client-dynamodb';
import { IAttribute } from './items.interface';

export interface IGetItemCredentials {
  Key: IAttribute[];
  TableName: string;
  ConsistentRead?: boolean;
  ExpressionAttributeNames?: { [k: string]: string };
  ProjectionExpression?: string;
  ReturnConsumedCapacity?: ReturnConsumedCapacity;
}
