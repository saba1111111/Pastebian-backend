import {
  BillingMode as BillingModeType,
  CreateTableCommand,
  DescribeTableCommand,
  KeyType,
} from '@aws-sdk/client-dynamodb';
import { ICreateTableCredentials } from '../interfaces';

export const findTable = (TableName: string) => {
  return new DescribeTableCommand({ TableName });
};

export const createTable = (input: ICreateTableCredentials) => {
  const { BillingMode: TableBillingMode, keys, Columns, ...rest } = input;

  const KeySchema = [
    {
      AttributeName: keys.PK,
      KeyType: 'HASH' as KeyType,
    },
  ];
  if (keys?.SK) {
    KeySchema.push({
      AttributeName: keys.SK,
      KeyType: 'RANGE' as KeyType,
    });
  }

  let billingConfiguration = {};

  if (TableBillingMode) {
    if (TableBillingMode.OnDemandThroughput) {
      billingConfiguration = {
        BillingMode: 'PAY_PER_REQUEST' as BillingModeType,
        OnDemandThroughput: TableBillingMode.OnDemandThroughput,
      };
    } else if (TableBillingMode.ProvisionedThroughput) {
      billingConfiguration = {
        BillingMode: 'PROVISIONED' as BillingModeType,
        ProvisionedThroughput: TableBillingMode.ProvisionedThroughput,
      };
    }
  }

  return new CreateTableCommand({
    AttributeDefinitions: Columns,
    KeySchema,
    ...billingConfiguration,
    ...rest,
  });
};
