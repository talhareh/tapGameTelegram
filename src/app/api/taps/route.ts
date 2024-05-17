// pages/api/users.ts
import { getTotalTaps, getTotalTapsByUserId } from '@/helper/helper';
import clientPromise from '@/lib/mongodb';
import Tap from '@/models/taps';
import User from '@/models/user';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';


export async function GET(req: Request, res: NextApiResponse) {
  try {
    const url = new URL(req.url);
    const searchParms = new URLSearchParams(url.searchParams);
    const userId = searchParms.get('userId');
    const date = searchParms.get('date');
    console.log('userId', userId, date)
    const client = await clientPromise;
    const db = client.db(); 
    const tapsCollection = db.collection<Tap>('taps');

    if(!(userId && date)){
      return NextResponse.json({
        success: false
      },{ status: 200 });
    }

    const outTaps = await tapsCollection.findOne({userId: userId, date: date})

    const totalTaps = await getTotalTapsByUserId(userId)
    const overAllTaps = await getTotalTaps()
    return NextResponse.json({
      success: outTaps ? true : false,
      taps: outTaps,
      totalTaps,
      overAllTaps
    },{ status: 200 });
    
    
  } catch (error) {
    console.error('Error creating user:', error);
    NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db(); 
    const tapsCollection = db.collection<Tap>('taps');

    let outTaps = await tapsCollection.findOne({userId: data.userId, date: data.date})
    if(!outTaps){
      const newTap: Tap = {
        _id: new ObjectId(),
        userId: data.userId,
        date: data.date,
        taps: data.taps,
      };
      const result = await tapsCollection.insertOne(newTap);
      outTaps = await tapsCollection.findOne({_id: result.insertedId})
    }else{
      if(data.taps) await tapsCollection.findOneAndUpdate({userId: data.userId, date: data.date}, { $set: { taps: data.taps } });
      outTaps = await tapsCollection.findOne({userId: data.userId, date: data.date})
    }

    const totalTaps = await getTotalTapsByUserId(data.userId)
    const overAllTaps = await getTotalTaps()

    return NextResponse.json({
      success: outTaps ? true : false,
      taps: outTaps,
      totalTaps,
      overAllTaps,
    },{ status: 200 });
    
  } catch (error) {
    console.error('Error creating user:', error);
    NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
