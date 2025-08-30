import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { CLIENT_ENV } from '@/config/env';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Forward to NestJS backend using Axios
    const response = await axios.post(`${CLIENT_ENV.API_URL}/auth/register`, {
      username,
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: CLIENT_ENV.API_TIMEOUT,
    });

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { message: 'Cannot connect to server. Please try again later.' },
        { status: 503 }
      );
    }
    
    if (error.response) {
      // Server responded with error
      return NextResponse.json(
        { message: error.response.data?.message || 'Registration failed' },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
