import { ConfigType } from '@nestjs/config';
import { ForbiddenException, Injectable, Inject } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import config from 'src/config';
import { PayloadToken, Tokens } from './models/tokens.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isMatch = bcrypt.compareSync(pass, user.password);
    if (!isMatch) return null;
    const { password: _, ...result } = user;
    return result;
  }

  async register(dto) {
    const payload = await this.usersService.create(dto);
    if (!payload) throw new ForbiddenException('Email ya registrado');
    const tokens = await this.generateJWTS(payload);
    await this.usersService.updateRt(payload.id, tokens.refresh_token);

    return tokens;
  }

  async generateJWTS(payload: PayloadToken) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.tokens_secret.access,
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.tokens_secret.refresh,
        expiresIn: '30d',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.usersService.findByUserId(userId);
    if (!user.refreshToken) throw new ForbiddenException('Acceso denegado');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);

    if (!rtMatches) throw new ForbiddenException('Acceso denegado');

    const payload = {
      role: user.role,
      id: user.id,
    };

    const tokens = await this.generateJWTS(payload);
    await this.usersService.updateRt(userId, tokens.refresh_token);
    return tokens;
  }

  async login(user) {
    const payload = {
      role: user.role,
      id: user.id,
    };

    const tokens = await this.generateJWTS(payload);
    await this.usersService.updateRt(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
    return {
      message: 'Logout exitoso',
    };
  }
}
