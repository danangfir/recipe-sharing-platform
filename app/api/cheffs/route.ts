import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDb from '../../../lib/db';
import Cheff from '../../../models/cheff';

connectDb();

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();

    const existingCheff = await Cheff.findOne({ email });

    if (existingCheff) {
        return NextResponse.json({ message: 'Email already in use '}, { status: 400});
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const cheff = new Cheff({ name, email, password: hashedPassword });
    await cheff.save();
    
    const token = jwt.sign({ cheffId: cheff._id}, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    });

    return NextResponse.json({ token, cheffId: cheff._id}, { status: 201});
}

