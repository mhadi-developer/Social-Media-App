import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, Min } from 'class-validator';
import { CreatePostDto } from './createPost.dto';

// ==============================
// UPDATE POST DTO
// ==============================
// userId (and by extension, author) is immutable after creation — a post's
// author never changes on update, so it's omitted here.
// postType is typically also immutable, but left updatable via PartialType
// unless you want to lock it down — omit it too if so.

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['userId']),
) {}

// ==============================
// STATS DTO (read-only / internal use)
// ==============================
// Not part of client-facing create/update payloads since likesCount,
// commentsCount, and viewsCount should be mutated via dedicated
// endpoints/services (e.g. like, comment, view increments), not
// arbitrary client writes.

export class PostStatsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  likesCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  commentsCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  viewsCount?: number;
}
