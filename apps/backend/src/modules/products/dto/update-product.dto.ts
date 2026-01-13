import { PartialType } from '@nestjs/mapped-types'; // Change this import
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}