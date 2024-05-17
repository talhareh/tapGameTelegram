import clientPromise from "@/lib/mongodb";
import Tap from "@/models/taps";

export const getTotalTapsByUserId = async (userId: string) => {
    try {
        const client = await clientPromise;
        const db = client.db(); 
        const tapsCollection = db.collection<Tap>('taps');
        const result = await tapsCollection.aggregate([
            { $match: { userId: userId } }, // Match documents with the specified userId
            {
                $group: {
                    _id: "$userId", // Group by userId
                    totalTaps: { $sum: "$taps" } // Sum the taps field for each group
                }
            }
        ]).toArray();
  
        if (result.length > 0) {
            // Return the total taps for the specified userId
            return result[0].totalTaps;
        } else {
            // No documents found for the specified userId
            return 0;
        }
    } catch (error) {
        console.error('Error getting total taps by userId:', error);
        throw error;
    }
};


export const getTotalTaps = async () => {
    try {
        const client = await clientPromise;
        const db = client.db(); 
        const tapsCollection = db.collection<Tap>('taps');
        const result = await tapsCollection.aggregate([
            {
                $group: {
                    _id: "$userId", // Group by userId
                    totalTaps: { $sum: "$taps" } // Sum the taps field for each group
                }
            }
        ]).toArray();
  
        if (result.length > 0) {
            // Return the total taps for the specified userId
            return result[0].totalTaps;
        } else {
            // No documents found for the specified userId
            return 0;
        }
    } catch (error) {
        console.error('Error getting total taps by userId:', error);
        throw error;
    }
};