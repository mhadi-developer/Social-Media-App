import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post } from "../schema/newpost-schema";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class PostServices {
  constructor(
    @InjectModel('Post') private readonly postmodal: Model<Post>,
    private readonly cloudinaryservice: CloudinaryService,
  ) {}
  async createPost(data: any) {
    try {
      const newPost = await this.postmodal.create(data);
      return newPost;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Server Error');
    }
  }
}