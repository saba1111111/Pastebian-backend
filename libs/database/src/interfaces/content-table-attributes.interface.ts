import { ScalarAttributeType } from '@aws-sdk/client-dynamodb';

export interface IContentTableAttributes {
  [k: string]: { name: string; type: ScalarAttributeType };
}
