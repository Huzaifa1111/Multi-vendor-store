import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { 
      message: 'Store API is running',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/auth',
        health: '/auth/health'
      }
    };
  }

  @Get('test')
  test() {
    return { 
      status: 'OK',
      message: 'Test endpoint working'
    };
  }
}