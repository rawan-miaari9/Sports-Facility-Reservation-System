import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
  }
  await mongoose.connect(MONGODB_URI);
}

export async function GET() {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection is not ready.');
    }

    const bookingsCollection = db.collection('bookings');
    const facilitiesCollection = db.collection('facilities');
    const usersCollection = db.collection('users');

    // 1. Fetch Aggregated Metrics
    const totalSystemBookings = await bookingsCollection.countDocuments({
      status: { $ne: 'Cancelled' },
    });

    const totalFacilitiesCount = await facilitiesCollection.countDocuments();
    const activeFacilitiesCount = await facilitiesCollection.countDocuments({
      status: 'Available',
    });

    const nonAdminUsersCount = await usersCollection.countDocuments({
      role: { $nin: ['admin', 'Admin'] },
    });

    // Calculate total revenue from confirmed/completed bookings
    const revenuePipeline = [
      { $match: { status: { $in: ['Confirmed', 'Completed', 'confirmed', 'completed'] } } },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $toDouble: { $ifNull: ['$price', { $ifNull: ['$totalPrice', '$amount'] }] },
            },
          },
        },
      },
    ];
    const revenueResult = await bookingsCollection.aggregate(revenuePipeline).toArray();
    const estimatedRevenue = revenueResult[0]?.total || 0;

    // 2. Aggregate Pending & Recent Bookings with populated Facility & User details
    const pendingBookingsPipeline = [
      {
        $lookup: {
          from: 'facilities',
          localField: 'facilityId',
          foreignField: '_id',
          as: 'facilityDetails',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 25,
      },
    ];

    const rawBookings = await bookingsCollection.aggregate(pendingBookingsPipeline).toArray();

    // Map documents to clean reservation structure
    const recentReservations = rawBookings.map((b: any) => {
      let formattedDate = 'N/A';
      if (b.date) {
        formattedDate = typeof b.date === 'string' ? b.date.split('T')[0] : new Date(b.date).toISOString().split('T')[0];
      } else if (b.createdAt) {
        formattedDate = new Date(b.createdAt).toISOString().split('T')[0];
      }

      const facilityObj = b.facilityDetails?.[0] || {};
      const userObj = b.userDetails?.[0] || {};

      const resolvedFacilityName =
        b.facilityName || facilityObj.name || facilityObj.title || b.arenaName || 'Facility';

      const resolvedUserName =
        b.guestName || b.userName || userObj.name || userObj.fullName || userObj.email || 'Client';

      return {
        
        id: b._id ? b._id.toString() : `RES-${Math.random()}`,
        facilityId: b.facilityId?.toString(),
        facilityName: resolvedFacilityName,
        userName: resolvedUserName,
        userEmail: b.guestEmail || userObj.email || b.userEmail || 'N/A',
        date: formattedDate,
        timeSlot: b.timeSlot || b.time_slot || '10:00 - 11:00',
        price: Number(b.price || b.totalPrice || b.amount || 0),
        status: b.status || 'Pending',
      };
    });

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalSystemBookings,
          activeFacilitiesCount,
          totalFacilitiesCount,
          totalSystemUsers: nonAdminUsersCount,
          estimatedRevenue,
        },
        recentReservations,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in GET /api/admin/dashboard:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch dashboard metrics.',
      },
      { status: 500 }
    );
  }
}

// PATCH endpoint to approve pending bookings directly
export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection is not ready.');

    const body = await req.json();
    const { bookingId, status } = body;

    if (!bookingId) {
      return NextResponse.json({ success: false, message: 'Booking ID is required.' }, { status: 400 });
    }

    const bookingsCollection = db.collection('bookings');
    
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(bookingId);
    } catch {
      objectId = bookingId;
    }

    const result = await bookingsCollection.updateOne(
      { $or: [{ _id: objectId }, { id: bookingId }] },
      { $set: { status: status || 'Confirmed', updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Booking not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Booking status updated successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in PATCH /api/admin/dashboard:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}