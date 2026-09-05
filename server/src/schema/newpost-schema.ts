import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

// ==============================
// AUTHOR SUBDOCUMENT
// ==============================

@Schema({ _id: false })
export class PostAuthor {
  @Prop({
    required: true,
    type: String,
  })
  userId!: string;

  @Prop({
    required: true,
    type: String,
  })
  username!: string;

  @Prop({
    required: true,
    type: String,
  })
  firstName!: string;


  @Prop({
    required: true,
    type: String,
  })
  lastName!: string;

  @Prop({
    type: String,
    default: null,
  })
  avatar!: string | null;
}

export const PostAuthorSchema = SchemaFactory.createForClass(PostAuthor);

// ==============================
// MEDIA SUBDOCUMENT
// ==============================

@Schema({ _id: false })
export class PostMedia {

  @Prop({
    required: true,
    enum: ['image', 'video'],
  })
  kind!: 'image' | 'video';

  @Prop({
    required: true,
    type: String,
  })
  url!: string;

  @Prop({
    required: true,
    type: String,
  })
  publicId!: string;

  @Prop({
    type: String,
    default: '',
    maxlength: 500,
  })
  altText!: string;
}

export const PostMediaSchema = SchemaFactory.createForClass(PostMedia);

// ==============================
// POST SETTINGS SUBDOCUMENT
// ==============================

@Schema({ _id: false })
export class PostSettings {
  @Prop({
    type: Boolean,
    default: false,
  })
  hideLikeCount!: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  turnOffCommenting!: boolean;
}

export const PostSettingsSchema = SchemaFactory.createForClass(PostSettings);

// ==============================
// POST STATS SUBDOCUMENT
// ==============================

@Schema({ _id: false })
export class PostStats {
  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  likesCount!: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  commentsCount!: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  viewsCount!: number;
}

export const PostStatsSchema = SchemaFactory.createForClass(PostStats);

// ==============================
// MAIN POST SCHEMA
// ==============================

@Schema({
  timestamps: true,
  collection: 'posts',
})
export class Post {
  @Prop({
    required: true,
    type: String,
    enum: ['text', 'media'],
  })
  postType!: 'text' | 'media';

  // ============================
  // TEXT POST
  // ============================

  @Prop({
    type: String,
    maxlength: 500,
    default: null,
  })
  textContent!: string | null;

  // ============================
  // CAPTION
  // ============================

  @Prop({
    type: String,
    maxlength: 2200,
    default: '',
  })
  caption!: string;

  // ============================
  // MEDIA
  // ============================

  @Prop({
    type: [PostMediaSchema],
    default: [],
    validate: {
      validator: function (media: PostMedia[]) {
        return media.length <= 10;
      },
      message: 'A post cannot contain more than 10 media files.',
    },
  })
  media!: PostMedia[];

  // ============================
  // LOCATION
  // ============================

  @Prop({
    type: String,
    maxlength: 300,
    default: '',
  })
  location!: string;

  // ============================
  // AUTHOR
  // ============================

  @Prop({
    type: PostAuthorSchema,
    required: true,
  })
  author!: PostAuthor;

  // ============================
  // SETTINGS
  // ============================

  @Prop({
    type: PostSettingsSchema,
    default: () => ({}),
  })
  settings!: PostSettings;

  // ============================
  // STATS
  // ============================

  @Prop({
    type: PostStatsSchema,
    default: () => ({}),
  })
  stats!: PostStats;
}

export const PostSchema = SchemaFactory.createForClass(Post);
