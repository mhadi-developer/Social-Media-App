import { UseGuards } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body, Req, Res, Get } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { AuthServices } from './auth.service';
import type { User } from '../generated/prisma/client';
import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import JwtAuthGuard, {
  type AuthenticatedRequest,
} from '../guard/jwt-auth.guard';

type RegisterResponse = {
  message: string;
  success: boolean;
};
type getLoggedInUserResponse = {
  user: User;
  success: boolean;
};

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthServices) {}
  // ******************************************************** */
  @Post('register')
  async register(@Body() data: CreateUserDto): Promise<RegisterResponse> {
    console.log(data);
    const newUser = await this.auth.registerUser(data);
    console.log(newUser);
    return {
      message: 'New user created',
      success: true,
    };
  }
  // ******************************************************** */

  @Post('login')
  async login(
    @Body() payload: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterResponse> {
    const verifiedUser = await this.auth.loginUser(payload);
    const jwtPayload = {
      id: verifiedUser.id,
    };

    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
      expiresIn: '3d',
      algorithm: `${process.env.JWT_ALGORITHAM}` as jwt.Algorithm,
    });

    res.cookie('SOCIAL_MEDIA_REFRESH_TOKEN', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 60 * 60 * 1000, // matches your 3hr expiry
      path: '/',
    });

    return {
      message: 'User logged in successfully',
      success: true,
    };
  }
  /**************************************************************************** */

  @Post()
  logout() {}

  // ************************************************************* */

  @Get('login/user')
  @UseGuards(JwtAuthGuard)
   async getLoggedInUser(
    @Req() req: AuthenticatedRequest,
  ): Promise<getLoggedInUserResponse> { 
    const user = req?.user as User | undefined | null;
    if (!user) {
      throw new Error('User not found in request');
    }

    const loginUser =  await this.auth.getLoginUser(user.id);
    console.log({ loginUser });

    return {
      user: loginUser,
      success: true,
    };
  }
}
