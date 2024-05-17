// models/User.ts
import { ObjectId } from 'mongodb';


interface User {
  _id: ObjectId;
  telegramId: string;
  wallet_address?: string;
  totalTaps: number;
  league: string;
  createdAt: Date;
  updatedAt: Date;
}

export default User;
