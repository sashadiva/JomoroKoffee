import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    const authHeader = request.headers.authorization;
    const internalToken = process.env.INTERNAL_ADMIN_TOKEN;

    
    if (authHeader && internalToken && authHeader === `Bearer ${internalToken}`) {
      return true; 
    }

   
    const user = request.user;
    return user && user.role === 'ADMIN';
  }
}