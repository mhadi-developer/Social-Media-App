/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Prisma, User } from '../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import * as argon from "argon2";
import type { LoginUserData } from '../types/loginUser';

@Injectable()
export class AuthServices {
  constructor(private readonly prisma: PrismaService) {}
  async registerUser(payload: Prisma.UserCreateInput): Promise<User> {
    const userAlreadyExist = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (userAlreadyExist) {
      throw new ConflictException('Email already exist');
    }

    const hashedPassword = await argon.hash(payload.password);

    payload.password = hashedPassword;

    return this.prisma.user.create({
      data: payload,
    });
  }


  async loginUser(payload: LoginUserData): Promise<User>{
     const userFind = await this.prisma.user.findUnique({
      where:{
        email: payload.email
      }
     });

    if(!userFind){
      throw new ForbiddenException('User not find , register your account first')
    }

    const isVerified = await argon.verify(userFind.password, payload.password);
    if (!isVerified) {
      throw new UnauthorizedException('Invalid Email or password');
    }

    delete (userFind as Partial<User>).password;
    return userFind;
  }
}