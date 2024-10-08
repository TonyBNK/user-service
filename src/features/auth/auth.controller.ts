import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('ping')
  async ping() {
    return 'ping';
  }
}
