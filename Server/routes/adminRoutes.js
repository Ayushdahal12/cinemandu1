import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from "../controllers/adminController.js";
import Booking from "../models/Booking.js";
import Show from '../models/Show.js'
import User from '../models/User.js'

const adminRouter = express.Router();

adminRouter.get('/is-admin', protectAdmin, isAdmin)
adminRouter.get('/dashboard', protectAdmin, getDashboardData)
adminRouter.get('/all-shows', protectAdmin, getAllShows)
adminRouter.get('/all-bookings', protectAdmin, getAllBookings)
adminRouter.get('/cancelled-bookings', protectAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find({ isCancelled: true })
            .populate({ path: 'show', populate: { path: 'movie' } })
            .sort({ createdAt: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})
adminRouter.delete('/delete-show/:id', protectAdmin, async (req, res) => {
    try {
        await Show.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: 'Show deleted successfully' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})
adminRouter.get('/all-users', protectAdmin, async (req, res) => {
    try {
        const users = await User.find()
        const usersWithBookings = await Promise.all(users.map(async (user) => {
            const bookingCount = await Booking.countDocuments({ user: user._id })
            const totalSpent = await Booking.aggregate([
                { $match: { user: user._id, isPaid: true } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
            return {
                ...user._doc,
                bookingCount,
                totalSpent: totalSpent[0]?.total || 0
            }
        }))
        res.json({ success: true, users: usersWithBookings })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

export default adminRouter;





