import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';


type JwtPayload = {
    id: string;
    email: string;
    firstName: string;
  lastName:string;
  phone: string
  dob: string;
};
export interface AuthenticatedRequest extends Request {
    cookies: Record<string, string| undefined>;
    user: JwtPayload;
}

@Injectable()
export default class JwtAuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const rToken = req.cookies['SOCIAL_MEDIA_REFRESH_TOKEN'];

        if (!rToken) {
            throw new UnauthorizedException('credentials not provided');
          }
        try {
            const decoded = jwt.verify(rToken, process.env.JWT_SECRET!, {
              algorithms: [`${process.env.JWT_ALGORITHAM}` as jwt.Algorithm],
            });
            req.user = decoded as JwtPayload;
            return true;
        } catch {
            throw new UnauthorizedException('Invalid token');
          }
    }
}