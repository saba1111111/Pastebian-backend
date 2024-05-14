import {
  StreamViewType,
  SSEType,
  TableClass,
  ScalarAttributeType,
} from '@aws-sdk/client-dynamodb';

type Attribute = {
  AttributeName: string;
  AttributeType: ScalarAttributeType;
};

export interface ICreateTableCredentials {
  Columns: Attribute[];
  keys: {
    PK: string;
    SK?: string;
  };
  TableName: string;
  BillingMode: {
    OnDemandThroughput?: {
      MaxReadRequestUnits: number;
      MaxWriteRequestUnits: number;
    };
    ProvisionedThroughput?: {
      ReadCapacityUnits: number;
      WriteCapacityUnits: number;
    };
  };
  DeletionProtectionEnabled?: boolean;
  ResourcePolicy?: string;
  SSESpecification?: {
    Enabled: boolean;
    SSEType?: SSEType;
    KMSMasterKeyId?: string;
  };
  StreamSpecification?: {
    StreamEnabled: boolean;
    StreamViewType?: StreamViewType;
  };
  TableClass?: TableClass;
  Tags?: [{ Key: string; Value: string }];
}
