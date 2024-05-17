// pages/api/users.ts
import { getTotalTaps, getTotalTapsByUserId } from '@/helper/helper';
import clientPromise from '@/lib/mongodb';
import User from '@/models/user';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: NextApiResponse) {
    try {
      const data = await req.json();
      const client = await clientPromise;
      const db = client.db(); 
      const usersCollection = db.collection<User>('users');

      console.log('req.body',data);

      if(!data?.telegramId){
        return NextResponse.json({
          message: 'telegramId is required'
        },{ status: 400 });
      }

      /* Check if user exits */
      let outUser = await usersCollection.findOne({telegramId: data.telegramId})
      console.log('outUser',outUser);
      if(!outUser){
        const newUser: User = {
          _id: new ObjectId(),
          telegramId: data.telegramId,
          totalTaps: 0,
          league: 'bronze',
          updatedAt: new Date(),
          createdAt: new Date(),
        };
        const result = await usersCollection.insertOne(newUser);
        outUser = await usersCollection.findOne({_id: result.insertedId})
      }
      
      
      let totalTaps = 0;
      let overAllTaps = 0;
      if(outUser) totalTaps = await getTotalTapsByUserId(outUser._id.toString())
      if(outUser) overAllTaps = await getTotalTaps()

      return NextResponse.json({
        user: outUser,
        totalTaps,
        overAllTaps,
      },{ status: 200 });
      
    } catch (error) {
      console.error('Error creating user:', error);
      NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
