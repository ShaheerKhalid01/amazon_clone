import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * JWT Authentication Strategy
 * Validates JWT tokens from Authorization header
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'defaultSecret',
      issuer: configService.get<string>('jwt.issuer'),
      algorithms: ['HS256'],
      passReqToCallback: false,
    });
  }

  /**
   * Validate JWT payload and return user object
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload.sub || !payload.email) {
      this.logger.warn('Invalid JWT payload structure');
      throw new UnauthorizedException('Invalid token payload');
    }

    // Additional validation: check if token is blacklisted, user exists, etc.
    const user = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    this.logger.debug(`JWT validated for user: ${payload.email}`);
    return user;
  }
}
