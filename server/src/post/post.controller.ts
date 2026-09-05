import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { PostServices } from "./post.service";
import {CreatePostDto} from "./dtos/createPost.dto"
import JwtAuthGuard,  { type AuthenticatedRequest } from "../guard/jwt-auth.guard";

@Controller('post')
export class PostController{
    constructor(private postservice: PostServices) { }
    
    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createPost(@Body() data: CreatePostDto, @Req() req: AuthenticatedRequest) {
        const loginUser = req.user;
        const newPost =  await this.postservice.createPost(data);
        return {
            message: 'new post created successfully',
            success: true,
            newPost
            
        }
    }
}