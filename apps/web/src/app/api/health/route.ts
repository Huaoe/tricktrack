import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if we can connect to the backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    let backendStatus = 'unknown';

    try {
      const response = await fetch(`${apiUrl}/api/v1/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        backendStatus = 'connected';
      } else {
        backendStatus = 'error';
      }
    } catch {
      backendStatus = 'disconnected';
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      backend: {
        status: backendStatus,
        url: apiUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
