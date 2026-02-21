import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/appcontext'
import toast from 'react-hot-toast'

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const { axios, getToken } = useAppContext()
    const navigate = useNavigate()

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const data = searchParams.get('data')
                if (!data) return

                // Convert base64 to object
                const decodedData = JSON.parse(atob(data))
                console.log("eSewa payment data:", decodedData)

                const { data: response } = await axios.post('/api/booking/verify-payment', {
                    transaction_uuid: decodedData.transaction_uuid,
                    amount: decodedData.total_amount
                }, { headers: { Authorization: `Bearer ${await getToken()}` } })

                if (response.success) {
                    toast.success("Payment successful!")
                } else {
                    toast.error("Payment verification failed")
                }

                navigate('/my-bookings')
            } catch (error) {
                console.log(error)
                navigate('/my-bookings')
            }
        }
        verifyPayment()
    }, [])

    return (
        <div className='flex items-center justify-center h-screen'>
            <p className='text-xl'>Verifying payment...</p>
        </div>
    )
}

export default PaymentSuccess