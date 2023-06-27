export interface PayloadToken {
  role: string;
  id: number;
}

export type JwtPayloadWithRt = PayloadToken & { refreshToken: string };

export class Tokens {
  access_token: string;
  refresh_token: string;
}
