import { IsNotEmpty, IsString, IsHexadecimal } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsHexadecimal()
  accountAddress: string;
}
