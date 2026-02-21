import React, { useEffect, useState } from 'react'
import Title from './Title'
import { useAppContext } from '../../../context/appcontext'
import toast from 'react-hot-toast'

const AdminTheaters = () => {
    const { axios, getToken } = useAppContext()
    const [theaters, setTheaters] = useState([])
    const [form, setForm] = useState({
        name: '', address: '', city: '', phone: '',
        totalSeats: 80, screenName: 'Screen 1',
        openingTime: '10:00 AM', closingTime: '11:00 PM'
    })

    const fetchTheaters = async () => {
        try {
            const { data } = await axios.get('/api/theater/all')
            if (data.success) setTheaters(data.theaters)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAdd = async () => {
        try {
            const { data } = await axios.post('/api/theater/add', form, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                toast.success(data.message)
                fetchTheaters()
                setForm({
                    name: '', address: '', city: '', phone: '',
                    totalSeats: 80, screenName: 'Screen 1',
                    openingTime: '10:00 AM', closingTime: '11:00 PM'
                })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`/api/theater/delete/${id}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                toast.success(data.message)
                fetchTheaters()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchTheaters()
    }, [])

    return (
        <>
            <Title text1="Manage" text2="Theaters" />

            {/* Add Theater Form */}
            <div className='mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6 max-w-2xl'>
                <h2 className='font-semibold mb-4'>Add New Theater</h2>
                <div className='grid grid-cols-2 gap-4'>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                        placeholder='Theater Name' className='bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm outline-none col-span-2' />
                    <input value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                        placeholder='Address' className='bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm outline-none' />
                    <input value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                        placeholder='City' className='bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm outline-none' />
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                        placeholder='Phone Number' className='bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm outline-none' />
                    <input value={form.totalSeats} onChange={e => setForm({...form, totalSeats: e.target.value})}
                        placeholder='Total Seats' type='number' className='bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm outline-none' />
                    <input value={form.openingTime} onChange={e => setForm({...form, openingTime: e.target.value})}
                        placeholder='Opening Time e.g. 10:00 AM' className='bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm outline-none' />
                    <input value={form.closingTime} onChange={e => setForm({...form, closingTime: e.target.value})}
                        placeholder='Closing Time e.g. 11:00 PM' className='bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm outline-none' />
                </div>
                <button onClick={handleAdd} className='mt-4 bg-primary hover:bg-primary-dull px-6 py-2 rounded text-sm font-medium transition cursor-pointer'>
                    Add Theater
                </button>
            </div>

            {/* Theater List */}
            <div className='mt-8'>
                <h2 className='font-semibold mb-4'>All Theaters</h2>
                <div className='flex flex-col gap-4'>
                    {theaters.map((theater, index) => (
                        <div key={index} className='flex items-center justify-between bg-gray-800/30 border border-gray-700 rounded-xl p-4'>
                            <div>
                                <p className='font-semibold'>{theater.name}</p>
                                <p className='text-sm text-gray-400'>{theater.address}, {theater.city}</p>
                                <p className='text-sm text-gray-400'>{theater.phone} • {theater.totalSeats} Seats</p>
                            </div>
                            <button onClick={() => handleDelete(theater._id)}
                                className='bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-1.5 text-sm rounded-full hover:bg-red-500/30 transition cursor-pointer'>
                                Delete
                            </button>
                        </div>
                    ))}
                    {theaters.length === 0 && <p className='text-gray-400'>No theaters added yet</p>}
                </div>
            </div>
        </>
    )
}

export default AdminTheaters