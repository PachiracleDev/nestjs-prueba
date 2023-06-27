import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

import { RegisterInput, LoginInput } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { RefreshGuard } from './guards/jwt.refresh.guard';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import {
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'User registration',
    content: {
      'application/json': {
        schema: {
          allOf: [
            {
              properties: {
                access_token: { type: 'string' },
                refresh_token: { type: 'string' },
              },
            },
          ],
        },
      },
    },
  })
  @Post('/register')
  createAcc(@Body() createAuthDto: RegisterInput) {
    return this.authService.register(createAuthDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() _: LoginInput, @Req() req) {
    const user = req.user;
    return this.authService.login(user);
  }

  @UseGuards(RefreshGuard)
  @Post('/refresh-token')
  refreshToken(@Req() req) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    return this.authService.refreshTokens(req.user.id, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }
}
