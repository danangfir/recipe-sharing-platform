import { NextRequest, NextResponse } from 'next/server';
import connectDb from '../../../lib/db';
import Cheff from '../../../models/cheff';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDb();

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  const existingCheff = await Cheff.findOne({ email });
  if (existingCheff) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const cheff = new Cheff({
    name,
    email,
    password: hashedPassword,
  });

  await cheff.save();

  const token = jwt.sign({ cheffId: cheff._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '1h',
  });

  return NextResponse.json({ token, cheffId: cheff._id }, { status: 201 });
}
