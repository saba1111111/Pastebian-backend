import {
  IContentTableAttributes,
  ICreateTableCredentials,
} from '../interfaces';

export const TABLES = {
  PASTEBIAN_TABLE: 'pastebianContent',
};

export const ContentTableAttributes: IContentTableAttributes = {
  id: { name: 'id', type: 'S' },
  expireAt: { name: 'expireAt', type: 'N' },
  content: { name: 'content', type: 'S' },
};

export const CONTENT_TABLE_CONFIGURATION: ICreateTableCredentials = {
  TableName: TABLES.PASTEBIAN_TABLE,
  Columns: [
    {
      AttributeName: ContentTableAttributes.id.name,
      AttributeType: ContentTableAttributes.id.type,
    },
    {
      AttributeName: ContentTableAttributes.expireAt.name,
      AttributeType: ContentTableAttributes.expireAt.type,
    },
  ],
  keys: {
    PK: ContentTableAttributes.id.name,
    SK: ContentTableAttributes.expireAt.name,
  },
  BillingMode: {
    ProvisionedThroughput: {
      ReadCapacityUnits: 500,
      WriteCapacityUnits: 400,
    },
  },
};
