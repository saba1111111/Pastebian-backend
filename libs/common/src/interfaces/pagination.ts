import { IContent } from 'libs/content/interfaces';

export interface IPaginationInput {
  fields?: string;
  nextPageToken?: string;
  Limit?: number;
}

export interface IPaginationResponse {
  items: IContent[];
  nextPageToken?: string;
}
