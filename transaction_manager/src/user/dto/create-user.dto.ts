import { IsNotEmpty, IsString, IsHexadecimal } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsHexadecimal()
  publicAddress: string;
}
