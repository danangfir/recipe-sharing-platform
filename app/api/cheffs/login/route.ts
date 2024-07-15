import { NextRequest, NextResponse } from 'next/server';
import connectDb from '../../../../lib/db';
import Cheff from '../../../../models/cheff';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDb();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const cheff = await Cheff.findOne({ email });
    if (!cheff) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, cheff.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign({ cheffId: cheff._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    return NextResponse.json({ token, cheffId: cheff._id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
