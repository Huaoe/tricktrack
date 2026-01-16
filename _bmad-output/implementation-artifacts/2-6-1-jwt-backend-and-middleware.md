# Story 2.6.1: JWT Backend and Middleware

Status: ready-for-dev

## Story

As a **developer**,
I want **to implement JWT token generation and validation on the backend**,
So that **user sessions can be managed securely with 30-day expiration**.

## Acceptance Criteria

1. **Given** the backend API is set up
   **When** I configure JWT authentication
   **Then** JWT tokens are generated with 30-day expiration
   **And** middleware validates tokens on protected routes
   **And** expired/invalid tokens are rejected

## Tasks / Subtasks

- [ ] Install JWT dependencies (AC: 1)
  - [ ] Install `@nestjs/jwt` package
  - [ ] Install `jsonwebtoken` types
  - [ ] Configure JWT module in app
- [ ] Implement JWT token generation (AC: 1)
  - [ ] Create `src/auth/jwt.service.ts`
  - [ ] Implement `generateToken()` method
  - [ ] Set 30-day expiration
  - [ ] Include user ID and wallet address in payload
- [ ] Create JWT verification (AC: 1)
  - [ ] Implement `verifyToken()` method
  - [ ] Implement `decodeToken()` method
  - [ ] Handle expired tokens
  - [ ] Handle invalid tokens
- [ ] Create session middleware (AC: 1)
  - [ ] Create `src/middleware/auth.middleware.ts`
  - [ ] Verify JWT token on protected routes
  - [ ] Check token expiration
  - [ ] Handle invalid/expired tokens
  - [ ] Attach user to request object
- [ ] Configure protected routes (AC: 1)
  - [ ] Apply middleware to protected routes
  - [ ] Configure route exceptions (public routes)
  - [ ] Set up middleware in app module
- [ ] Set up environment variables (AC: 1)
  - [ ] Add JWT_SECRET to `.env.example`
  - [ ] Add JWT_EXPIRATION configuration
  - [ ] Document secret generation
- [ ] Verify JWT functionality
  - [ ] Test token generation
  - [ ] Test token verification
  - [ ] Test expired token rejection
  - [ ] Test invalid token rejection
  - [ ] Test protected route access

## Dev Notes

### Architecture Requirements

**Session Management** (from `@architecture.md`)

**Key Requirements:**
- JWT with 30-day expiration (FR5)
- Secure token storage
- Protected route access control
- Token validation on every request

**Security Considerations:**
- Strong JWT secret
- Token expiration enforcement
- XSS protection
- CSRF protection

### JWT Service Implementation

**apps/api/src/auth/jwt.service.ts:**
```typescript
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string; // user ID
  walletAddress: string;
  walletType: 'in-app' | 'external';
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  constructor(
    private jwtService: NestJwtService,
    private configService: ConfigService,
  ) {}

  generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '30d', // 30 days
    });
  }

  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    return this.jwtService.decode(token) as JwtPayload;
  }
}
```

### Middleware Implementation

**apps/api/src/middleware/auth.middleware.ts:**
```typescript
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../auth/jwt.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7);

    try {
      const payload = this.jwtService.verifyToken(token);
      req['user'] = payload;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
```

### Module Configuration

**apps/api/src/app.module.ts:**
```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMiddleware } from './middleware/auth.middleware';
import { JwtService } from './auth/jwt.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('users/profile', 'validations', 'tokens'); // Protected routes
  }
}
```

### Update User Service

**apps/api/src/users/users.service.ts:**
```typescript
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '../auth/jwt.service';

@Injectable()
export class UsersService {
  constructor(private jwtService: JwtService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.findByWalletAddress(createUserDto.walletAddress);
    
    if (existingUser) {
      // Return existing user with new token
      const token = this.jwtService.generateToken({
        sub: existingUser.id,
        walletAddress: existingUser.walletAddress,
        walletType: existingUser.walletType,
      });
      return { user: existingUser, token };
    }

    // Create new user
    const user = {
      id: crypto.randomUUID(),
      walletAddress: createUserDto.walletAddress,
      walletType: createUserDto.walletType,
      createdAt: new Date(),
      suspended: false,
    };

    // Save to database
    // await this.supabase.from('users').insert(user);

    const token = this.jwtService.generateToken({
      sub: user.id,
      walletAddress: user.walletAddress,
      walletType: user.walletType,
    });
    
    return { user, token };
  }

  async findByWalletAddress(walletAddress: string) {
    // Query database
    return null;
  }
}
```

### Environment Variables

**apps/api/.env.example:**
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=30d
```

### Testing Requirements

**Verification Steps:**
1. Generate JWT token - token created with 30-day expiration
2. Verify valid token - verification succeeds
3. Test expired token - verification fails
4. Test invalid token - verification fails
5. Access protected route without token - 401 Unauthorized
6. Access protected route with valid token - access granted
7. Access protected route with expired token - 401 Unauthorized

**Security Testing:**
- Token cannot be forged without secret
- Expired tokens are rejected
- Invalid tokens are rejected
- Protected routes require authentication
- Token payload contains correct user data

**Success Criteria:**
- JWT tokens generated with 30-day expiration
- Token verification works correctly
- Middleware protects routes properly
- Expired/invalid tokens are rejected
- Ready for frontend session management in Story 2.6.2

### Dependencies

**Story 1.3** - Nest.js backend must be set up

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.6]
- [Source: `@prd.md` - FR5: Session management]
- [NestJS JWT Documentation](https://docs.nestjs.com/security/authentication)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

