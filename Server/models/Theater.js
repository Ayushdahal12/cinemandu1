import mongoose from 'mongoose'

const theaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String },
    city: { type: String, required: true },
    totalSeats: { type: Number, default: 80 },
    screenName: { type: String, default: 'Screen 1' },
    openingTime: { type: String, default: '10:00 AM' },
    closingTime: { type: String, default: '11:00 PM' },
    image: { type: String },
}, { timestamps: true })

const Theater = mongoose.model('Theater', theaterSchema)
export default Theater