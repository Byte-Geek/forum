import { Controller, UseGuards, Post, Request, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'Login successful', type: Object })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Request() req, @Body() loginDto: LoginDto) {
        return this.authService.login(req.user);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
    @ApiResponse({ status: 409, description: 'Conflict - email or username already exists' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    
    @UseGuards(LocalAuthGuard)
    @Post('logout')
    @ApiOperation({ summary: 'Logout user' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Logout successful' })
    async logout(@Request() req) {
      return req.logout();
    }
}
