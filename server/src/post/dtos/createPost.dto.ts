import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

// ==============================
// AUTHOR DTO
// ==============================
// NOTE: The full author snapshot (username, firstName, lastName, avatar)
// is embedded in the Post document for read-performance (denormalization),
// but the CLIENT should never send these fields directly — a client could
// spoof another user's name/avatar into a post. Instead, the client only
// sends `userId` (e.g. taken from the authenticated session/JWT), and the
// service layer fetches the current user record from the database in
// real time and builds the full PostAuthor subdocument server-side before
// saving. PostAuthorDto below represents the shape stored on the document,
// used internally by the service — it is NOT part of CreatePostDto's
// client-facing input.

export class PostAuthorDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  avatar?: string | null;
}

// ==============================
// MEDIA DTO
// ==============================

export class PostMediaDto {
  @IsNotEmpty()
  @IsEnum(['image', 'video'])
  kind!: 'image' | 'video';

  @IsNotEmpty()
  @IsString()
  url!: string;

  @IsNotEmpty()
  @IsString()
  publicId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  altText?: string;
}

// ==============================
// SETTINGS DTO
// ==============================

export class PostSettingsDto {
  @IsOptional()
  @IsBoolean()
  hideLikeCount?: boolean;

  @IsOptional()
  @IsBoolean()
  turnOffCommenting?: boolean;
}

// ==============================
// CREATE POST DTO
// ==============================

export class CreatePostDto {
  @IsNotEmpty()
  @IsEnum(['text', 'media'])
  postType!: 'text' | 'media';

  // Required when postType === 'text'
  @ValidateIf((dto: CreatePostDto) => dto.postType === 'text')
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  textContent?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2200)
  caption?: string;

  // Required when postType === 'media'
  @ValidateIf((dto: CreatePostDto) => dto.postType === 'media')
  @IsArray()
  @ArrayMaxSize(10, {
    message: 'A post cannot contain more than 10 media files.',
  })
  @ValidateNested({ each: true })
  @Type(() => PostMediaDto)
  media?: PostMediaDto[];

  @IsOptional()
  @IsString()
  @MaxLength(300)
  location?: string;

  // Client only supplies the userId (typically overridden by the
  // authenticated user's id from the request, e.g. req.user.id, rather
  // than trusted from the body at all). The service layer looks this
  // user up in real time and builds the full PostAuthor subdocument
  // (username, firstName, lastName, avatar) before persisting the post.
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PostSettingsDto)
  settings?: PostSettingsDto;
}
