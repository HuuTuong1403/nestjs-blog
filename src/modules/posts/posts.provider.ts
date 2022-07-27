import { Post } from './posts.entity';
import { POST_REPOSITORY } from 'src/core/constants';

export const postsProviders = [
  {
    provide: POST_REPOSITORY,
    useValue: Post,
  },
];
