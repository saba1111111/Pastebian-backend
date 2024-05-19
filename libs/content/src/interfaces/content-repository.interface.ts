import { IPaginationInput, IPaginationResponse } from 'libs/common/interfaces';
import { IContent } from './content.interface';
import { ICreateContentDbCredentials } from './create-content-credentials.interface';
import { IDeleteItemCredentials } from './delete-item-credentials.interface';
import { IIdentifyContentItem } from './identify-item-credentials.interface';

export interface IContentRepository {
  create(input: ICreateContentDbCredentials): Promise<IContent>;
  findItem(input: IIdentifyContentItem): Promise<IContent>;
  deleteItem(input: IDeleteItemCredentials): Promise<number>;
  findItemById(id: string): Promise<IContent>;
  getExpiredItems(input?: IPaginationInput): Promise<IPaginationResponse>;
  deleteItems(
    items: IIdentifyContentItem[],
  ): Promise<{ unprocessedItems: IIdentifyContentItem[] }>;
}
