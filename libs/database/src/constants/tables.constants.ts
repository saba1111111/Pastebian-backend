import { ICreateTableCredentials } from '../interfaces';

export const TABLES = {
  PASTEBIAN_TABLE: 'pastebianContent',
};

const PastebianContentTableAttributes = {
  contentId: 'contentId',
  expireAt: 'expireAt',
};

export const PASTEBIAN_CONTENT_TABLE_CONFIGURATION: ICreateTableCredentials = {
  TableName: TABLES.PASTEBIAN_TABLE,
  Columns: [
    {
      AttributeName: PastebianContentTableAttributes.contentId,
      AttributeType: 'S',
    },
    {
      AttributeName: PastebianContentTableAttributes.expireAt,
      AttributeType: 'N',
    },
  ],
  keys: {
    PK: PastebianContentTableAttributes.contentId,
    SK: PastebianContentTableAttributes.expireAt,
  },
  BillingMode: {
    ProvisionedThroughput: {
      ReadCapacityUnits: 500,
      WriteCapacityUnits: 400,
    },
  },
};
