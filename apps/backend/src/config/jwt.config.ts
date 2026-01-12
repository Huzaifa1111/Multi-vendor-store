import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => ({
    secret: process.env.JWT_SECRET || 'supersecretkey',
    signOptions: {
      expiresIn: '24h',
    },
  }),
};