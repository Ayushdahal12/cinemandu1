import React, { useEffect, useState } from 'react'
import Title from './Title'
import { useAppContext } from '../../../context/appcontext'

const AdminUsers = () => {
    const { axios, getToken } = useAppContext()
    const [users, setUsers] = useState([])
    const currency = import.meta.env.VITE_CURRENCY

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-users', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) setUsers(data.users)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <>
            <Title text1="User" text2="Management" />
            <div className='mt-8 overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='text-left text-gray-400 border-b border-gray-700'>
                            <th className='pb-3 pr-4'>User</th>
                            <th className='pb-3 pr-4'>Email</th>
                            <th className='pb-3 pr-4'>Total Bookings</th>
                            <th className='pb-3'>Total Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className='border-b border-gray-800 hover:bg-gray-800/30'>
                                <td className='py-3 pr-4'>
                                    <div className='flex items-center gap-3'>
                                        <img src={user.image} alt="" className='w-8 h-8 rounded-full object-cover' />
                                        <p>{user.name}</p>
                                    </div>
                                </td>
                                <td className='py-3 pr-4 text-gray-400'>{user.email}</td>
                                <td className='py-3 pr-4'>
                                    <span className='bg-primary/20 text-primary px-2 py-1 rounded-full text-xs'>
                                        {user.bookingCount} bookings
                                    </span>
                                </td>
                                <td className='py-3 text-green-400 font-medium'>
                                    {currency} {user.totalSpent}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <p className='text-center text-gray-400 mt-10'>No users found</p>
                )}
            </div>
        </>
    )
}

export default AdminUsers