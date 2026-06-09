import { 
  BadGatewayException, 
  Injectable, 
  UnauthorizedException, 
  InternalServerErrorException 
} from '@nestjs/common';
import axios, { isAxiosError } from 'axios';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
} 

@Injectable()
export class ProfileService {
  private readonly authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

  async getProfile(authHeader: string) {
    try {
      const response = await axios.get(`${this.authServiceUrl}/auth/profiles`, {
        headers: { Authorization: authHeader },
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;

        if (status === 401) {
          throw new UnauthorizedException('Invalid or expired authentication session');
        }
        
        throw new BadGatewayException(`Auth Service responded with status ${status}`);
      }
      
      throw new BadGatewayException('Auth Service is unreachable');
    }
  }
}