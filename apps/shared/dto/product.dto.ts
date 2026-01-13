export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  image?: string;
}