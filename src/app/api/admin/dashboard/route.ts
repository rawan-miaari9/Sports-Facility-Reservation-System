import { NextResponse } from 'next/server';
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

    // Access raw MongoDB collections directly (no Mongoose models needed!)
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

    // Counts users excluding admins (returns 2 if you have 2 users + 1 admin)
    const nonAdminUsersCount = await usersCollection.countDocuments({
      role: { $nin: ['admin', 'Admin'] },
    });

    // Calculate total revenue
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

    // 2. Fetch All Active Raw Bookings for Chart & Roster
    const rawBookings = await bookingsCollection
      .find({})
      .sort({ _id: -1 })
      .limit(20)
      .toArray();

    // 3. Build 7-Day Chart Analytics
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);
      const dayName = daysOfWeek[targetDate.getDay()];
      const dateStr = targetDate.toISOString().split('T')[0];

      // Filter raw bookings that fall on this day
      const dayBookings = rawBookings.filter((b) => {
        const bookingDate = String(b.date || b.bookingDate || b.createdAt || '');
        return bookingDate.includes(dateStr);
      });

      const dayRevenue = dayBookings.reduce((sum, b) => {
        const val = Number(b.price || b.totalPrice || b.amount || 0);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);

      chartData.push({
        day: dayName,
        util: dayBookings.length,
        revenue: dayRevenue,
      });
    }

    // 4. Map Raw Booking Documents (Handles any field names your teammate used)
    const recentReservations = rawBookings.slice(0, 5).map((b: any) => {
      // Flexibly extract date
      let formattedDate = 'N/A';
      if (b.date) {
        formattedDate = typeof b.date === 'string' ? b.date.split('T')[0] : new Date(b.date).toISOString().split('T')[0];
      } else if (b.createdAt) {
        formattedDate = new Date(b.createdAt).toISOString().split('T')[0];
      }

      return {
        id: b._id ? b._id.toString() : `RES-${Math.random()}`,
        facilityName: b.facilityName || b.facility_name || b.arenaName || 'Arena / Facility',
        userName: b.userName || b.user_name || b.clientName || 'Client User',
        userEmail: b.userEmail || b.user_email || b.email || 'N/A',
        date: formattedDate,
        timeSlot: b.timeSlot || b.time_slot || b.time || '10:00 - 11:00',
        price: Number(b.price || b.totalPrice || b.amount || 0),
        status: b.status || 'Confirmed',
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
        chartData,
        recentReservations,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in GET /api/admin/dashboard:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch raw collection data.',
      },
      { status: 500 }
    );
  }
}