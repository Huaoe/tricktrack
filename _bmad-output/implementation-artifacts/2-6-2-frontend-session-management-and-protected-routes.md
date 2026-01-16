# Story 2.6.2: Frontend Session Management and Protected Routes

Status: ready-for-dev

## Story

As a **user**,
I want **my session to be managed automatically on the frontend**,
So that **I stay logged in across page reloads and am logged out after 30 days of inactivity**.

## Acceptance Criteria

1. **Given** I am logged in
   **When** I reload the page
   **Then** my session persists
   **And** I remain authenticated
   **And** my session expires after 30 days
   **And** I am redirected to login page on expiration
   **And** I can manually log out anytime

## Tasks / Subtasks

- [ ] Implement frontend session storage (AC: 1)
  - [ ] Create `src/lib/auth/session.ts` utilities
  - [ ] Implement token storage in localStorage
  - [ ] Implement token retrieval
  - [ ] Implement token removal
  - [ ] Implement token expiration check
- [ ] Create auth context provider (AC: 1)
  - [ ] Create `src/providers/AuthProvider.tsx`
  - [ ] Manage authentication state globally
  - [ ] Provide login/logout functions
  - [ ] Track session validity
  - [ ] Check session on app load
- [ ] Implement auto-logout on expiration (AC: 1)
  - [ ] Check token validity on app load
  - [ ] Monitor token expiration
  - [ ] Trigger logout when expired
  - [ ] Clear all session data
  - [ ] Show expiration notification
- [ ] Add manual logout functionality (AC: 1)
  - [ ] Create `src/components/auth/LogoutButton.tsx`
  - [ ] Clear JWT token from storage
  - [ ] Disconnect wallet
  - [ ] Redirect to landing page
  - [ ] Show logout confirmation
- [ ] Implement session activity tracking (AC: 1)
  - [ ] Update last activity timestamp
  - [ ] Track user interactions (click, keypress, scroll)
  - [ ] Set up activity monitoring interval
- [ ] Add protected route guards (AC: 1)
  - [ ] Create `src/components/auth/ProtectedRoute.tsx`
  - [ ] Redirect unauthenticated users
  - [ ] Preserve intended destination
  - [ ] Show authentication check loading state
- [ ] Update wallet hooks integration (AC: 1)
  - [ ] Update `useWeb3Auth` to use AuthProvider
  - [ ] Update `useWallet` to use AuthProvider
  - [ ] Integrate login function with auth context
- [ ] Verify session management
  - [ ] Test session persists across page reloads
  - [ ] Verify auto-logout on token expiration
  - [ ] Test manual logout clears session
  - [ ] Confirm redirect to login page works
  - [ ] Test protected routes require authentication
  - [ ] Verify activity tracking updates

## Dev Notes

### Session Management Utilities

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

### Auth Provider Implementation

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
    
    // Disconnect wallet will be handled by respective wallet hooks
    
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

### Protected Route Component

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

### Logout Button Component

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

### Update Layout with AuthProvider

**Update apps/web/src/app/layout.tsx:**
```typescript
import { WagmiProvider } from '@/providers/WagmiProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider>
          <AuthProvider>
            {children}
            <Toaster position="bottom-center" />
          </AuthProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
```

### Protected Page Example

**src/app/dashboard/page.tsx:**
```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        {/* Dashboard content */}
      </div>
    </ProtectedRoute>
  );
}
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
- Activity tracking extends session

**Success Criteria:**
- JWT tokens expire after 30 days
- Auto-logout works on expiration
- Manual logout clears session completely
- Protected routes require authentication
- Session persists across page reloads
- Redirect after login works correctly

### Dependencies

**Story 2.6.1** - JWT backend and middleware must be complete
**Story 2.1.2 or 2.2.2** - Wallet connection must be implemented

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.6]
- [Source: `@prd.md` - FR5: Session management]
- [JWT Documentation](https://jwt.io/introduction)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

