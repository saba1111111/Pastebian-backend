import { ScalarAttributeType } from '@aws-sdk/client-dynamodb';

export interface IExpressionAttributeValue {
  name: string;
  value: string;
  type: ScalarAttributeType;
}

export interface IAttribute {
  column: string;
  value: string | number;
  type: ScalarAttributeType;
}
