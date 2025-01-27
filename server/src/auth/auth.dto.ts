import { IsNotEmpty, IsString, MinLength } from 'class-validator';

// export class SignUpDto {
//   @IsNotEmpty()
//   @IsString()
//   username: string;

//   @IsNotEmpty()
//   @IsString()
//   @MinLength(8)
//   password: string;
// }

// export class SignUpResponseDto {
//   @IsNotEmpty()
//   @IsString()
//   access_token: string;
// }

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
