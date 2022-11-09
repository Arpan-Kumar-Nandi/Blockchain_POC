import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsHexadecimal,
} from 'class-validator';

export class ProductDetailsSmartContractDeploy {
  @IsNotEmpty()
  @IsNumber()
  tokenId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsHexadecimal()
  address: string;
}
