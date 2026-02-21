import React, { useEffect, useState } from 'react'
import Title from './Title'
import { useAppContext } from '../../../context/appcontext'
import toast from 'react-hot-toast'
import { dateFormat } from '../../lib/Dateformat'

const CancelledBookings = () => {
    const { axios, getToken } = useAppContext()
    const [bookings, setBookings] = useState([])

    const fetchCancelledBookings = async () => {
        try {
            const { data } = await axios.get('/api/admin/cancelled-bookings', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setBookings(data.bookings)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleRefund = async (bookingId) => {
        try {
            const { data } = await axios.post('/api/booking/refund', { bookingId }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                toast.success(data.message)
                fetchCancelledBookings()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchCancelledBookings()
    }, [])

    return (
        <>
            <Title text1="Cancelled" text2="Bookings" />
            <div className='mt-8 overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='text-left text-gray-400 border-b border-gray-700'>
                            <th className='pb-3 pr-4'>Movie</th>
                            <th className='pb-3 pr-4'>User</th>
                            <th className='pb-3 pr-4'>Seats</th>
                            <th className='pb-3 pr-4'>Date</th>
                            <th className='pb-3 pr-4'>Amount</th>
                            <th className='pb-3'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => (
                            <tr key={index} className='border-b border-gray-800 hover:bg-gray-800/30'>
                                <td className='py-3 pr-4'>{booking.show?.movie?.title || 'N/A'}</td>
                                <td className='py-3 pr-4'>{booking.user}</td>
                                <td className='py-3 pr-4'>{booking.bookedSeats.join(', ')}</td>
                                <td className='py-3 pr-4'>{dateFormat(booking.show?.showDateTime)}</td>
                                <td className='py-3 pr-4'>NPR {booking.amount}</td>
                                <td className='py-3'>
                                    <button
                                        onClick={() => handleRefund(booking._id)}
                                        className='bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 text-xs rounded-full hover:bg-green-500/30 transition cursor-pointer'>
                                        Verify Refund
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && (
                    <p className='text-center text-gray-400 mt-10'>No cancelled bookings found</p>
                )}
            </div>
        </>
    )
}

export default CancelledBookings