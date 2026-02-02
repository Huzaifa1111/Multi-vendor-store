// apps/backend/src/modules/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsOptional, Min, MaxLength, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class VariationDto {
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() size?: string;
  @IsString() sku: string;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) stock: number;
}

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

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  longDescription?: string;

  @IsOptional()
  @IsNumber()
  brandId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationDto)
  variations?: VariationDto[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  upsellIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  crossSellIds?: number[];
}