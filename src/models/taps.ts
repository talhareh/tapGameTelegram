// models/User.ts
import { ObjectId } from 'mongodb';

interface Tap {
  _id: ObjectId;
  userId: string,
  date: string,
  taps: number,
}

export default Tap;
