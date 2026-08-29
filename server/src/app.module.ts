import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [AuthModule, MongooseModule.forRoot(process.env.MONGODB_URI!), PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
