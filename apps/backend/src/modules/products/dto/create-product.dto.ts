// apps/backend/src/modules/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsOptional, Min, MaxLength, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()             
  @IsBoolean()              
  featured?: boolean;      
}