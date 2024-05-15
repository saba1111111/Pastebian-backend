import { IContent } from './content.interface';
import { ICreateContentDbCredentials } from './create-content-credentials.interface';

export interface IContentRepository {
  create(input: ICreateContentDbCredentials): Promise<IContent>;
}
