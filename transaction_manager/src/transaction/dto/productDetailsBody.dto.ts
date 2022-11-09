import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ProductDetailsBody {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
