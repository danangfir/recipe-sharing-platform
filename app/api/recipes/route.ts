import { NextRequest, NextResponse } from 'next/server';
import connectDb from '../../../lib/db';
import Recipe from '../../../models/recipe';
import { authMiddleware } from '../../../lib/auth';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

connectDb();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const keyword = searchParams.get('keyword') || '';
  const labels = searchParams.get('labels') || '';

  const query = {
    title: { $regex: keyword, $options: 'i' },
    labels: { $regex: labels, $options: 'i' },
  };

  const recipes = await Recipe.find(query)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('cheff')
    .exec();

  const count = await Recipe.countDocuments(query);

  return NextResponse.json({
    recipes,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
}

export async function POST(req: NextRequest) {
  try {
    // Autentikasi
    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
