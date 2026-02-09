import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Address } from './address.entity';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [UsersService, AddressesService],
  controllers: [UsersController, AddressesController],
  exports: [UsersService, AddressesService, TypeOrmModule],
})
export class UsersModule { }