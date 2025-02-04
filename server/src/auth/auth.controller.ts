import { FPMS_REFRESH_TOKEN_NAME } from '../constants';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { dataMock } from 'src/mock.data';
import { jwtDecode } from 'jwt-decode';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(body);
    const user = dataMock.find((user) => user.id === body.username);
    console.log(user);
    if (!user || user.password !== body.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log(user);

    const tokens = await this.authService.generateTokens(body.username);

    // Save the hashed refresh token in the database (pseudo-code)
    // await database.saveRefreshToken(body.userId, hashedRefreshToken);

    response.cookie(FPMS_REFRESH_TOKEN_NAME, tokens.refreshToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      domain: 'localhost',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  @Get('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies[FPMS_REFRESH_TOKEN_NAME];
    console.log('🚀 ~ refresh ~ refreshToken:', refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const body = { refreshToken };
    const hashedToken = await this.authService.hashToken(body.refreshToken);
    const isValid = await this.authService.verifyRefreshToken(
      body.refreshToken,
      hashedToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // from jwt token get userId
    const userId = jwtDecode(body.refreshToken).sub;
    console.log('🚀 ~ AuthController ~ refresh ~ userId:', userId);

    const tokens = await this.authService.generateTokens(userId);

    return { accessToken: tokens.accessToken };
  }

  @Post('sign-out')
  @UseGuards(AuthGuard)
  async signOut(@Req() req: Request) {
    // remove refresh token on cookie
    req.res.clearCookie(FPMS_REFRESH_TOKEN_NAME);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req: Request & { user: any }) {
    const user = dataMock.find((user) => user.id === req.user.sub);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
