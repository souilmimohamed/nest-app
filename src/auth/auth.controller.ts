import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthData } from './models';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() data: AuthData) {
    return this.authService.signUp(data);
  }
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() data: AuthData) {
    return this.authService.signIn(data);
  }
}
