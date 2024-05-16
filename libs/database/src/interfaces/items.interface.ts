import { ScalarAttributeType } from '@aws-sdk/client-dynamodb';

export interface IAttribute {
  name: string;
  value: string | number;
  type: ScalarAttributeType;
}
