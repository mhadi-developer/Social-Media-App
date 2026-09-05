import { Module , Global } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostServices } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from '../schema/newpost-schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
@Global()
@Module({
    imports: [MongooseModule.forFeature([{
        name:'Post',
        schema:PostSchema
    }]), CloudinaryModule],
    controllers: [PostController],
    providers: [PostServices]
})
export class PostModule{}