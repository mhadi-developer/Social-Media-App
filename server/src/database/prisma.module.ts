import { PrismaService } from './prisma.service';
import { Module , Global } from "@nestjs/common";
@Global()
@Module({
    exports: [PrismaService],
    providers:[PrismaService],
    
})
export class PrismaModule{ }