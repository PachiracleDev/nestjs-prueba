import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class AuthResponse {
  access_token: string;
  refresh_token: string;
}

export class RegisterInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class LoginInput {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RefreshTokenInput {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
