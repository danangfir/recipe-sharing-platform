import { NextRequest, NextResponse } from 'next/server';
import connectDb from '../../../lib/db';
import Recipe from '../../../models/recipe';
import { authMiddleware } from '../../../lib/auth';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

connectDb();

const upload = multer({
  storage: multer.memoryStorage(),
});

export async function POST(req: NextRequest) {
  try {
    // Autentikasi
    const isAuthenticated = await authMiddleware(req);
    if (isAuthenticated !== true) {
      return isAuthenticated; 
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const labels = formData.get('labels') as string;
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageBuffer = await sharp(buffer)
      .resize({ width: 600, height: 400 })
      .toBuffer();

    const fileName = `${Date.now()}-${file.name}`;
    const imagePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    await fs.writeFile(imagePath, imageBuffer);

    const user = (req as any).user;

    const recipe = new Recipe({
      title,
      description,
      labels: labels.split(','),
      imageUrl: `/uploads/${fileName}`,
      cheff: user.cheffId,
    });

    await recipe.save();

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
