# User Roles Implementation

## Overview
Successfully implemented user roles system with three roles: USER, MODERATOR, ADMIN.

## Changes Made

### 1. Database Schema
- Added `Role` enum in Prisma schema with USER, MODERATOR, ADMIN
- Added `role` field to User model with default value USER
- Created and applied database migration

### 2. DTO Updates
- Updated `CreateUserDto` to include optional role field with enum validation
- Added role enum to DTO for validation

### 3. Service Layer
- Updated `UserService` to handle role in user creation
- Modified JWT token generation to include user role
- Updated user selection to include role field

### 4. Authentication Updates
- Updated `IUser` interface to include role
- Modified JWT strategy to validate and return role
- Updated `AuthService` login to include role in JWT token

### 5. Authorization System
- Created `RolesGuard` for role-based access control
- Created `@Roles()` decorator for specifying required roles
- Created `@CurrentUser()` decorator for accessing current user
- Added RolesGuard to AuthModule providers and exports

## Usage Examples

### Creating Users with Roles
```typescript
// Regular user (default)
await userService.create({ email: 'user@example.com', password: 'password', username: 'user' });

// Moderator
await userService.create({ email: 'mod@example.com', password: 'password', username: 'mod', role: 'MODERATOR' });

// Admin
await userService.create({ email: 'admin@example.com', password: 'password', username: 'admin', role: 'ADMIN' });
```

### Protecting Routes with Roles
```typescript
import { Roles } from './auth/decorators/roles.decorator';
import { RolesGuard } from './auth/guards/roles.guard';

@Controller('protected')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProtectedController {
  
  @Get('admin')
  @Roles('ADMIN')
  adminOnly() {
    return 'Admin content';
  }
  
  @Get('moderator')
  @Roles('MODERATOR', 'ADMIN')
  moderatorOrAdmin() {
    return 'Moderator content';
  }
  
  @Get('user')
  @Roles('USER', 'MODERATOR', 'ADMIN')
  allUsers() {
    return 'User content';
  }
}
```

### Accessing Current User
```typescript
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Get('profile')
getProfile(@CurrentUser() user: any) {
  return user; // includes id, email, role
}
```

## Role Hierarchy
- **USER**: Basic access, can view public content
- **MODERATOR**: User permissions + content moderation
- **ADMIN**: Full system access, can manage users and settings

## Security Notes
- Roles are embedded in JWT tokens and validated on each request
- Role changes require new login to take effect
- Default role is USER for all new registrations
- Role-based authorization is enforced at the guard level
