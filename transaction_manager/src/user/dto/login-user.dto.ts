import { IsNotEmpty, IsString, IsHexadecimal } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsHexadecimal()
  publicAddress: string;

  @IsNotEmpty()
  @IsString()
  signature: string;
}
