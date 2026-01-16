# Story 2.6: Implement Session Management and Auto-Logout

Status: ready-for-dev

## Story

As a **user**,
I want **my session to expire after 30 days of inactivity**,
So that **my account remains secure**.

## Acceptance Criteria

1. **Given** I am logged in
   **When** I am inactive for 30 days
   **Then** my session expires automatically
   **And** I am redirected to login page
   **And** I must reconnect wallet to access app
   **And** I can manually log out anytime

## Tasks / Subtasks

- [ ] Implement JWT token generation (AC: 1)
  - [ ] Install `jsonwebtoken` in backend
  - [ ] Create JWT signing utility
  - [ ] Set 30-day expiration
  - [ ] Include user ID and wallet address in payload
- [ ] Create session middleware (AC: 1)
  - [ ] Create `src/middleware/auth.middleware.ts` in backend
  - [ ] Verify JWT token on protected routes
  - [ ] Check token expiration
  - [ ] Handle invalid/expired tokens
- [ ] Implement frontend session storage (AC: 1)
  - [ ] Store JWT token in localStorage
  - [ ] Create `src/lib/auth/session.ts` utilities
  - [ ] Implement token refresh mechanism
  - [ ] Handle token expiration events
- [ ] Create auth context provider (AC: 1)
  - [ ] Create `src/providers/AuthProvider.tsx`
  - [ ] Manage authentication state globally
  - [ ] Provide login/logout functions
  - [ ] Track session validity
- [ ] Implement auto-logout on expiration (AC: 1)
  - [ ] Check token validity on app load
  - [ ] Monitor token expiration
  - [ ] Trigger logout when expired
  - [ ] Clear all session data
- [ ] Add manual logout functionality (AC: 1)
  - [ ] Create logout button component
  - [ ] Clear JWT token from storage
  - [ ] Disconnect wallet
  - [ ] Redirect to landing page
- [ ] Implement session activity tracking (AC: 1)
  - [ ] Update last activity timestamp
  - [ ] Track user interactions
  - [ ] Extend session on activity (optional)
  - [ ] Log session events
- [ ] Add protected route guards (AC: 1)
  - [ ] Create route protection HOC/middleware
  - [ ] Redirect unauthenticated users
  - [ ] Preserve intended destination
  - [ ] Show login prompt
- [ ] Verify session management
  - [ ] Test 30-day token expiration
  - [ ] Verify auto-logout on expiration
  - [ ] Test manual logout clears session
  - [ ] Confirm redirect to login page works
  - [ ] Test protected routes require authentication
  - [ ] Verify session persists across page reloads

## Dev Notes

### Architecture Requirements

**Session Management** (from `@architecture.md`)

**Key Requirements:**
- JWT with 30-day expiration (FR5)
- Secure session storage
- Auto-logout on inactivity
- Protected route access control

**Security Considerations:**
- HTTPOnly cookies (if using cookies)
- Secure token storage
- XSS protection
- CSRF protection

### JWT Configuration

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

### Frontend Session Management

**src/lib/auth/session.ts:**
```typescript
const TOKEN_KEY = 'auth_token';
const LAST_ACTIVITY_KEY = 'last_activity';

export const sessionManager = {
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.updateLastActivity();
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  },

  updateLastActivity(): void {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  },

  getLastActivity(): number | null {
    const activity = localStorage.getItem(LAST_ACTIVITY_KEY);
    return activity ? parseInt(activity, 10) : null;
  },

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch {
      return true;
    }
  },

  isSessionValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    return !this.isTokenExpired(token);
  },

  clearSession(): void {
    this.removeToken();
  },
};
```

**src/providers/AuthProvider.tsx:**
```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { sessionManager } from '@/lib/auth/session';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkSession: () => boolean;
}

interface User {
  id: string;
  walletAddress: string;
  walletType: 'in-app' | 'external';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check session on mount
    checkSession();

    // Set up activity tracking
    const handleActivity = () => {
      sessionManager.updateLastActivity();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Check session validity every minute
    const interval = setInterval(() => {
      if (!checkSession()) {
        handleSessionExpired();
      }
    }, 60000); // 1 minute

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      clearInterval(interval);
    };
  }, []);

  const checkSession = (): boolean => {
    const isValid = sessionManager.isSessionValid();
    
    if (isValid) {
      const token = sessionManager.getToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.sub,
          walletAddress: payload.walletAddress,
          walletType: payload.walletType,
        });
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    return isValid;
  };

  const handleSessionExpired = () => {
    logout();
    toast.error('Your session has expired. Please log in again.');
    router.push('/');
  };

  const login = (token: string, userData: User) => {
    sessionManager.setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionManager.clearSession();
    setUser(null);
    setIsAuthenticated(false);
    
    // Disconnect wallet (Web3Auth or wagmi)
    // This will be handled by the respective wallet hooks
    
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Protected Routes Implementation

**src/components/auth/ProtectedRoute.tsx:**
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, checkSession } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isValid = checkSession();
    
    if (!isValid) {
      // Store intended destination
      sessionStorage.setItem('redirect_after_login', pathname);
      router.push('/');
    }
  }, [isAuthenticated, pathname]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
};
```

**Usage in protected pages:**
```typescript
// src/app/dashboard/page.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        {/* Dashboard content */}
      </div>
    </ProtectedRoute>
  );
}
```

### Logout Component

**src/components/auth/LogoutButton.tsx:**
```typescript
'use client';

import { Button } from '@tricktrack/ui';
import { useAuth } from '@/providers/AuthProvider';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="sm"
      className="min-h-[44px] gap-2"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
};
```

### API Integration

**Update apps/web/src/hooks/useWeb3Auth.ts:**
```typescript
import { useAuth } from '@/providers/AuthProvider';

export const useWeb3Auth = () => {
  const { login } = useAuth();
  
  const createWallet = async () => {
    // ... existing wallet creation code ...
    
    const { user, token } = await response.json();
    
    // Use AuthProvider's login instead of direct localStorage
    login(token, user);
    
    // ... rest of code ...
  };

  return { createWallet, /* ... */ };
};
```

### Backend Module Setup

**apps/api/src/app.module.ts:**
```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMiddleware } from './middleware/auth.middleware';

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
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('users/profile', 'validations', 'tokens'); // Protected routes
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
1. Log in with wallet - JWT token stored
2. Reload page - session persists
3. Navigate to protected route - access granted
4. Click logout button - session cleared
5. Try accessing protected route - redirected to login
6. Log in again - redirected to intended page
7. Wait for token expiration (or manually expire) - auto-logout triggers
8. Verify activity tracking updates timestamp
9. Test on mobile devices

**Session Scenarios:**
- New login creates valid session
- Session persists across page reloads
- Expired token triggers auto-logout
- Manual logout clears all data
- Protected routes require valid session
- Activity tracking extends session (optional)

**Security Testing:**
- Token cannot be forged
- Expired tokens are rejected
- Invalid tokens are rejected
- Session data is cleared on logout
- Protected routes are inaccessible without auth

**Success Criteria:**
- JWT tokens expire after 30 days
- Auto-logout works on expiration
- Manual logout clears session completely
- Protected routes require authentication
- Session persists across page reloads
- Redirect after login works correctly

### Dependencies

**Story 2.1 or 2.2** - Wallet connection must be implemented

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.6]
- [Source: `@prd.md` - FR5: Session management]
- [Source: `@architecture.md` - Security Requirements]
- [JWT Documentation](https://jwt.io/introduction)
- [NestJS JWT Documentation](https://docs.nestjs.com/security/authentication)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

