// Firestore CRUD for bookings
import { db } from '../auth/firebase';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const BOOKINGS = 'bookings';

// Add a new booking
export const bookMovie = async (booking) => {
  try {
    if (!booking || typeof booking !== 'object') {
      throw new Error('Invalid booking data');
    }

    // Ensure timestamp is added
    const bookingWithTimestamp = {
      ...booking,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, BOOKINGS), bookingWithTimestamp);

    console.log(' Booking added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error(' Error adding booking:', error.message);
    throw error;
  }
};

// Fetch all bookings
export const getBookings = async () => {
  try {
    const snapshot = await getDocs(collection(db, BOOKINGS));

    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(' Fetched bookings:', bookings);
    return bookings;
  } catch (error) {
    console.error(' Error fetching bookings:', error.message);
    return [];
  }
};
