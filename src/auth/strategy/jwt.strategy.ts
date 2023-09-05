import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { hash } from 'argon2';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisamService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisamService.user.findUnique({
      where: { id: payload.sub },
    });
    delete user.hash;
    return user;
  }
}
