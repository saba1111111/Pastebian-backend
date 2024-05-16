import { AttributeValue } from '@aws-sdk/client-dynamodb';

export interface ITransformDynamoAttributesToItem {
  [k: string]: AttributeValue;
}
