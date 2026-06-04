import { BadGatewayException, Injectable } from '@nestjs/common';
import axios, { isAxiosError } from 'axios';

@Injectable()
export class ProfileService {
  private readonly authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

  async getProfile(authHeader: string) {
    try {
      const response = await axios.get(`${this.authServiceUrl}/auth/profile`, {
        headers: { Authorization: authHeader },
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw error.response.status === 401
          ? new BadGatewayException('Unauthorized when fetching profile from Auth Service')
          : new BadGatewayException('Failed to fetch profile from Auth Service');
      }
      throw new BadGatewayException('Unable to retrieve profile from Auth Service');
    }
  }
}
