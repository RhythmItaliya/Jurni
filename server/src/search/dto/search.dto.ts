import { IsString, IsOptional, IsIn, MinLength } from 'class-validator';

export class SearchDto {
  @IsString()
  @MinLength(1, { message: 'Search query must not be empty' })
  query: string;

  @IsOptional()
  @IsIn(['all', 'users', 'posts', 'hashtags'], {
    message: 'Type must be one of: all, users, posts, hashtags',
  })
  type?: 'all' | 'users' | 'posts' | 'hashtags' = 'all';

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;
}
