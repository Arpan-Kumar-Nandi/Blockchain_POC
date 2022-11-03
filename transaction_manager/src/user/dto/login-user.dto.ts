import { IsNotEmpty, IsString, IsHexadecimal } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  password: string;
}
