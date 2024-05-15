import { CONTENT_REPOSITORY_TOKEN } from '../constants';
import { ContentDynamoRepository } from '../repositories';

export const ContentModuleProviders = [
  {
    provide: CONTENT_REPOSITORY_TOKEN,
    useClass: ContentDynamoRepository,
  },
];
