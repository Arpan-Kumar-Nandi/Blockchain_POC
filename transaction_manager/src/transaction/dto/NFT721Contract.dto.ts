import { IsNotEmpty, IsString, IsNumber, IsHexadecimal } from 'class-validator';

export class NFT721Contract {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsHexadecimal()
  contractAddress: string;

  @IsNotEmpty()
  @IsHexadecimal()
  owner: string;

  @IsNotEmpty()
  @IsNumber()
  tokenId: number;
}
