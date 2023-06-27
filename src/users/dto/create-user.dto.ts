import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
