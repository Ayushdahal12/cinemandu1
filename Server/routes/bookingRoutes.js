import express from 'express';
import { createBooking, getOccupiedSeats, verifyPayment, initiateEsewaPayment, cancelBooking, swapSeat, refundBooking  } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.post('/verify-payment', verifyPayment);
bookingRouter.post('/esewa-initiate', initiateEsewaPayment);
bookingRouter.post('/cancel', cancelBooking);
bookingRouter.post('/swap-seat', swapSeat);
bookingRouter.post('/refund', refundBooking)

export default bookingRouter;









