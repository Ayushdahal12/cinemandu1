import express from 'express'
import Theater from '../models/Theater.js'
import { protectAdmin } from '../middleware/auth.js'

const theaterRouter = express.Router()

// Get all theaters
theaterRouter.get('/all', async (req, res) => {
    try {
        const theaters = await Theater.find()
        res.json({ success: true, theaters })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

// Add theater - admin only
theaterRouter.post('/add', protectAdmin, async (req, res) => {
    try {
        const theater = await Theater.create(req.body)
        res.json({ success: true, message: 'Theater added successfully', theater })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

// Delete theater - admin only
theaterRouter.delete('/delete/:id', protectAdmin, async (req, res) => {
    try {
        await Theater.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: 'Theater deleted successfully' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

export default theaterRouter