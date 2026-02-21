import React, { useEffect, useState } from 'react'
import Title from './Title'
import { useAppContext } from '../../../context/appcontext'
import toast from 'react-hot-toast'
import { dateFormat } from '../../lib/Dateformat'

const AdminBookings = () => {
    const { axios, getToken } = useAppContext()
    const [bookings, setBookings] = useState([])

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-bookings', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setBookings(data.bookings)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = async (bookingId) => {
        try {
            const { data } = await axios.post('/api/booking/cancel', { bookingId }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                toast.success(data.message)
                fetchBookings()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleRefund = async (bookingId) => {
        try {
            const { data } = await axios.post('/api/booking/refund', { bookingId }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                toast.success(data.message)
                fetchBookings()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    return (
        <>
            <Title text1="All" text2="Bookings" />
            <div className='mt-8 overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='text-left text-gray-400 border-b border-gray-700'>
                            <th className='pb-3 pr-4'>Movie</th>
                            <th className='pb-3 pr-4'>User</th>
                            <th className='pb-3 pr-4'>Seats</th>
                            <th className='pb-3 pr-4'>Date</th>
                            <th className='pb-3 pr-4'>Amount</th>
                            <th className='pb-3 pr-4'>Status</th>
                            <th className='pb-3'>Actions</th>
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
                                <td className='py-3 pr-4'>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {booking.isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                </td>
                                <td className='py-3'>
                                    <div className='flex gap-2'>
                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            className='bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 text-xs rounded-full hover:bg-red-500/30 transition cursor-pointer'>
                                            Cancel
                                        </button>
                                        {booking.isPaid && (
                                            <button
                                                onClick={() => handleRefund(booking._id)}
                                                className='bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 text-xs rounded-full hover:bg-blue-500/30 transition cursor-pointer'>
                                                Refund
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && (
                    <p className='text-center text-gray-400 mt-10'>No bookings found</p>
                )}
            </div>
        </>
    )
}

export default AdminBookings