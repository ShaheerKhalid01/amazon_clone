import { Controller, Post, Body } from '@nestjs/common';

@Controller('api/auth')
export class AuthController {
  @Post('login')
  login(@Body() body: any) {
    return { message: 'Login works!', body };
  }
  
  @Post('register')
  register(@Body() body: any) {
    return { message: 'Register works!', body };
  }
}