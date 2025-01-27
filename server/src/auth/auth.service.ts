import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../jwt.config';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(userId: string) {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: jwtConstants.accessTokenExpiry,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: jwtConstants.refreshTokenExpiry,
    });

    return { accessToken, refreshToken };
  }

  async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  async verifyRefreshToken(
    token: string,
    hashedToken: string,
  ): Promise<boolean> {
    console.log('🚀 ~ verifyRefreshToken ~ token:', token);
    console.log('🚀 ~ verifyRefreshToken ~ hashedToken:', hashedToken);
    return bcrypt.compare(token, hashedToken);
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
