import { NextRequest} from 'next/server';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req: NextRequest): Promise<any> => {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded; 
  } catch (error) {
    return null;
  }
};
