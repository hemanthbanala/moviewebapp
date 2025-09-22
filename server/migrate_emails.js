import mongoose from 'mongoose';
import Booking from './models/booking.js';

const MONGO_URI = "mongodb://localhost:27017/moviewebapp";

async function migrateEmails() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const bookingsToUpdate = await Booking.find({
      user: { $exists: true },
      userEmail: { $exists: false }
    });

    console.log(`Found ${bookingsToUpdate.length} bookings to migrate`);

    for (const booking of bookingsToUpdate) {
      await Booking.updateOne(
        { _id: booking._id },
        { $set: { userEmail: booking.user } }
      );
    }

    console.log(`Migration completed! Updated ${bookingsToUpdate.length} bookings`);

    const sample = await Booking.findOne();
    console.log('Sample booking after migration:', {
      _id: sample._id,
      user: sample.user,
      userEmail: sample.userEmail,
      movieTitle: sample.movieTitle,
      seats: sample.seats
    });

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateEmails();