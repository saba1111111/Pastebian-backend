import { IPaginationInput, IPaginationResponse } from 'libs/common/interfaces';
import { IContent } from './content.interface';
import { ICreateContentDbCredentials } from './create-content-credentials.interface';
import { IDeleteItemCredentials } from './delete-item-credentials.interface';
import { IFindItemCredentials } from './find-item-credentials.interface';

export interface IContentRepository {
  create(input: ICreateContentDbCredentials): Promise<IContent>;
  findItem(input: IFindItemCredentials): Promise<IContent>;
  deleteItem(input: IDeleteItemCredentials): Promise<number>;
  findItemById(id: string): Promise<IContent>;
  getExpiredItems(input?: IPaginationInput): Promise<IPaginationResponse>;
}
