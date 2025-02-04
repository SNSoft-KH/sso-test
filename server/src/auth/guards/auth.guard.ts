import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { FPMS_REFRESH_TOKEN_NAME } from 'src/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const refreshToken = request.cookies[FPMS_REFRESH_TOKEN_NAME];
    console.log('🚀 ~ canActivate ~ refreshToken:', refreshToken);
    console.log('🚀 ~ canActivate ~ authHeader:', authHeader);
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('Invalid access token');
    }

    try {
      // 验证access token
      const payload = await this.authService.verifyToken(accessToken);

      // 验证refresh token
      const hashedToken = await this.authService.hashToken(refreshToken);
      const isRefreshTokenValid = await this.authService.verifyRefreshToken(
        refreshToken,
        hashedToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      request.user = payload;
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      throw new UnauthorizedException('Invalid tokens');
    }
  }
}
