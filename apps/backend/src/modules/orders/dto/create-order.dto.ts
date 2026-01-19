import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  shippingAddress: string;

  @IsString()
  paymentMethod: string;
}