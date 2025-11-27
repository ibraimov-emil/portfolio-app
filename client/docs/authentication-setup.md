# Authentication System Documentation

## Overview
Complete authentication and authorization system integrated with Strapi v4 backend.

## Architecture

### 1. Type Definitions (`/types/auth.ts`)
- `User` - User entity from Strapi
- `AuthResponse` - Login/Register response with JWT
- `LoginCredentials` - Login form data
- `RegisterCredentials` - Registration form data
- `AuthContextType` - Auth context interface

### 2. Services Layer (`/services/auth.ts`)
- `login()` - Authenticate user
- `register()` - Create new account
- `me()` - Get current user data
- `setToken()` - Store JWT in localStorage
- `getToken()` - Retrieve stored JWT
- `removeToken()` - Clear JWT on logout
- `initAuth()` - Initialize auth on app load

### 3. Context & State (`/contexts/auth-context.tsx`)
- `AuthProvider` - Global auth state provider
- `useAuth()` - Hook to access auth state
- Auto-initialization on mount
- Token persistence with localStorage
- Automatic axios header management

### 4. Validation (`/lib/validations/auth.ts`)
- `loginSchema` - Zod schema for login
- `registerSchema` - Zod schema with password confirmation

### 5. UI Components (`/components/auth/`)

#### Login Dialog (`login-dialog.tsx`)
- Modal form for user login
- Email/username + password fields
- Switch to register option
- Form validation with error messages

#### Register Dialog (`register-dialog.tsx`)
- Modal form for registration
- Username, email, password, confirm password
- Switch to login option
- Password matching validation

#### User Menu (`user-menu.tsx`)
- Dropdown menu for authenticated users
- Shows username and email
- Avatar with user initials
- Logout option

#### Auth Button (`auth-button.tsx`)
- Login icon when not authenticated
- User avatar when authenticated
- Handles dialog state management
- Loading skeleton during auth check

### 6. Integration

#### Navbar (`/components/shared/navbar.tsx`)
- Added `AuthButton` to dock
- Placed after theme toggle with separator

#### Providers (`/components/shared/providers.tsx`)
- Wrapped app with `AuthProvider`
- Auth state available throughout app

## Features

### Authentication Flow
1. User clicks login icon in navbar
2. Login dialog opens
3. User enters credentials
4. On success: JWT stored, user data loaded
5. UI updates to show user avatar
6. Token persists across page reloads

### Authorization
- JWT automatically added to all axios requests
- Token stored in localStorage
- Auto-logout on token expiration (handled by backend)

### User Experience
- Toast notifications for all actions
- Loading states during operations
- Form validation with helpful errors
- Seamless dialog switching (login ↔ register)
- Persistent sessions

## Strapi v4 Integration

### Endpoints Used
- `POST /api/auth/local` - Login
- `POST /api/auth/local/register` - Register
- `GET /api/users/me` - Get current user

### Token Management
- JWT stored in localStorage as `auth_token`
- Automatically added to axios headers as `Bearer {token}`
- Removed on logout

## Security Considerations

1. **Token Storage**: Using localStorage (consider httpOnly cookies for production)
2. **Password Requirements**: Minimum 6 characters (can be enhanced)
3. **HTTPS**: Ensure backend uses HTTPS in production
4. **Token Expiration**: Handled by Strapi backend

## Usage Examples

### Protecting Routes
```tsx
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return null;

    return <div>Protected Content</div>;
}
```

### Accessing User Data
```tsx
import { useAuth } from "@/contexts/auth-context";

export function UserProfile() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;

    return (
        <div>
            <h1>Welcome, {user.username}!</h1>
            <p>Email: {user.email}</p>
        </div>
    );
}
```

### Manual Login/Logout
```tsx
import { useAuth } from "@/contexts/auth-context";

export function AuthActions() {
    const { login, logout, isAuthenticated } = useAuth();

    const handleLogin = async () => {
        try {
            await login({
                identifier: "user@example.com",
                password: "password123",
            });
        } catch (error) {
            // Error handled in context
        }
    };

    return (
        <div>
            {isAuthenticated ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <button onClick={handleLogin}>Login</button>
            )}
        </div>
    );
}
```

## Future Enhancements

1. Password reset functionality
2. Email verification
3. Social login (Google, GitHub, etc.)
4. Remember me option
5. Session timeout warnings
6. Refresh token rotation
7. Two-factor authentication
8. Role-based access control