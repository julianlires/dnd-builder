import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Only check password in production
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ success: true });
    }

    if (password === process.env.SITE_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
