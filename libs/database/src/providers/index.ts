import { ConfigService } from '@nestjs/config';
import {
  DATABASE_CLIENT_TOKEN,
  PASTEBIAN_CONTENT_TABLE_CONFIGURATION,
  TABLES,
} from '../constants';
import { ENVS } from 'libs/common/constants/envs.constants';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { createTable, findTable } from '../commands';

export const DatabaseProviders = [
  {
    provide: DATABASE_CLIENT_TOKEN,
    useFactory: async (configService: ConfigService) => {
      const DATABASE_URL = configService.get<string>(
        ENVS.DATABASE_ENDPOINT_URL,
      );
      const REGION = configService.get<string>(ENVS.REGION);

      const databaseClient = new DynamoDBClient({
        region: REGION,
        endpoint: DATABASE_URL,
      });

      try {
        await databaseClient.send(findTable(TABLES.PASTEBIAN_TABLE));
      } catch (error) {
        await databaseClient.send(
          createTable(PASTEBIAN_CONTENT_TABLE_CONFIGURATION),
        );
      }

      return databaseClient;
    },
    inject: [ConfigService],
  },
];
