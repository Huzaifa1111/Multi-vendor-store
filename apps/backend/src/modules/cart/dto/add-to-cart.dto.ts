import { IsInt, IsPositive, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number = 1;

  @IsInt()
  @IsPositive()
  @IsOptional()
  variationId?: number;
}

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  quantity: number;
}