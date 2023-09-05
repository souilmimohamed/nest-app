import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthData } from './models';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(dto: AuthData) {
    //genrate pwd
    const hash = await argon.hash(dto.password);
    //save new user in db
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      //return saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('credentials already taken');
        }
      }
      throw error;
    }
  }
  async signIn(dto: AuthData) {
    //find user by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('credentials Incorrect');

    //compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException("Password doesn't match");
    return this.signToken(user.id, user.email);
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_toke: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return { access_toke: token };
  }
}
