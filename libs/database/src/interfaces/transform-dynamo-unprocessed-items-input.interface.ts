import { RequestItems } from './batch-write-items-credentials.interface';

export interface ITransformDynamoUnProcessedItemsInput {
  table: string;
  unprocessedDynamoItems: RequestItems;
}
