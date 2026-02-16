import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Address } from './address.entity';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address]), AdminModule],
  providers: [UsersService, AddressesService],
  controllers: [UsersController, AddressesController],
  exports: [UsersService, AddressesService, TypeOrmModule],
})
export class UsersModule { }