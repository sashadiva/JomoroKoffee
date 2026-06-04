import { Controller, Get, Headers, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('profile')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Req() req: any, @Headers('authorization') authHeader: string) {
    return this.profileService.getProfile(authHeader ?? req.headers.authorization);
  }
}
