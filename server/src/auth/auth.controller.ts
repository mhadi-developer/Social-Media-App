/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { AuthServices } from './auth.service';
import type { User } from '../generated/prisma/client';

type RegisterResponse = {
  message: string;
  success: boolean;
  user: User;
};

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthServices) {}
  @Post('register')
  async register(@Body() data: CreateUserDto): Promise<RegisterResponse> {
    console.log(data);
    const newUser = await this.auth.registerUser(data) ;
    return {
      message: "New user created",
      success: true,
      user: newUser
    }
  }

  @Post('login')
  async login(@Body() payload: LoginUserDto) {
    return await this.auth.loginUser(payload);
  }

  @Post()
  logout() {}
}
