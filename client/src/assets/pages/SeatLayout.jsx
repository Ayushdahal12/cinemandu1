// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { dummyShowsData, dummyDateTimeData, assets } from '../assets'
// import Loading from '../components/Loading'
// import { ArrowRightIcon, ClockIcon } from 'lucide-react'
// import isoTimeFormat from '../lib/isoTimeFormat'
// import BlurCircle from '../components/BlurCircle'
// import toast from 'react-hot-toast'
// import { useAppContext } from '../../context/appcontext'


// const SeatLayout = () => {

//   const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];

//   const { id, date } = useParams()
//   const [selectedSeats, setSelectedSeats] = useState([])
//   const [selectedTime, setSelectedTime] = useState(null)
//   const [show, setshow] = useState(null)
//   const [occupiedSeats, setOccupiedSeats] = useState([])

//   const navigate = useNavigate()

//   const { axios, getToken, user } = useAppContext()

//   const getshow = async () => {
//     try {
//       const { data } = await axios.get(`/api/show/${id}`)
//       if (data.success) {
//         setshow(data)
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleSeatClick = (seatId) => {
//     if (!selectedTime) {
//       return toast("please select time first")
//     }
//     if (!selectedSeats.includes(seatId) && selectedSeats.length > 5) {
//       return toast("You can select only 5 seats")
//     }
//     if (occupiedSeats.includes(seatId)) {
//       return toast("This seat is already booked")
//     }
//     setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !==
//       seatId) : [...prev, seatId]
//     );
//   }

//   const renderSeats = (row, count = 8) => (
//     <div key={row} className="flex gap-2 mt-2 mb-4">
//       <div className="flex flex-wrap items-center justify-center gap-2">
//         {Array.from({ length: count }, (_, i) => {
//           const seatId = `${row}${i + 1}`;
//           const isSelected = selectedSeats.includes(seatId)
//           const isOccupied = occupiedSeats.includes(seatId)
//           return (
//             <button
//               key={seatId}
//               onClick={() => handleSeatClick(seatId)}
//               className={`h-8 w-8 rounded border border-primary/60 cursor-pointer ${isOccupied ? "bg-red-500 cursor-not-allowed" : isSelected ? "bg-primary text-white" : ""}`}
//             >
//               {seatId}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );

//   const getOccupiedSeats = async () => {
//     try {
//       const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`)
//       if (data.success) {
//         setOccupiedSeats(data.bookedSeats)
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }


//   const bookTickets = async () => {
//     try {
//       if (!user) return toast.error('Please login to proceed')
//       if (!selectedTime || !selectedSeats.length) return toast.error('Please select a time and seats')

//       const token = await getToken()

//       const { data } = await axios.post('/api/booking/create', {
//         showId: selectedTime.showId,
//         selectedSeats
//       }, { headers: { Authorization: `Bearer ${token}` } })

//       if (data.success) {
//         toast.success(data.message)
//         navigate('/my-bookings')
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(() => {
//     getshow()
//   }, [])


//   useEffect(() => {
//     if (selectedTime) {
//       getOccupiedSeats()
//     }
//   }, [selectedTime])

//   return show ? (
//     <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 
//     md:pt-50">
//       {/* Available timings */}
//       <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 
//       h-max md:sticky md:top-30'>
//         <p className='text-lg font-semibold px-6'>Available Timings</p>

//         <div className='mt-5 space-y-3'>

//           {show.dateTime[date].map((item) => (
//             <div key={item.time} onClick={() => setSelectedTime(item)} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer
//           transition ${selectedTime?.time === item.time ? "bg-primary text-white" : " hover:bg-primary/20"}`}>
//               <ClockIcon className='w-4 h-4 ' />
//               <p className='text-sm'>{isoTimeFormat(item.time)}</p>
//             </div>
//           ))}
//         </div>
//       </div>


//       {/* Seat layout */}
//       <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
//         <BlurCircle top='-100px' left='-100px' />
//         <BlurCircle bottom='0' right='0' />
//         <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
//         <img src={assets.screenImage} alt="screen" />
//         <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

//         <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
//           <div>
//             {groupRows[0].map(row => renderSeats(row))}
//           </div>

//           <div className='grid grid-cols-2 gap-11'>
//             {groupRows.slice(1).map((group, idx) => (
//               <div key={idx}>
//                 {group.map(row => renderSeats(row))}
//               </div>
//             ))}
//           </div>
//         </div>
//         <button onClick={bookTickets} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>
//           Proceed to Checkout
//           <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />

//         </button>



//       </div>

//     </div>
//   ) : (
//     <Loading />
//   )
// }

// export default SeatLayout

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/appcontext'
import { v4 as uuidv4 } from 'uuid'
import CryptoJS from 'crypto-js'

const SeatLayout = () => {

  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];

  const { id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setshow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])

  const navigate = useNavigate()

  const { axios, getToken, user } = useAppContext()

  const getshow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success) {
        setshow(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("please select time first")
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 5) {
      return toast("You can select only 5 seats")
    }
    if (occupiedSeats.includes(seatId)) {
      return toast("This seat is already booked")
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !==
      seatId) : [...prev, seatId]
    );
  }

  const renderSeats = (row, count = 8) => (
    <div key={row} className="flex gap-2 mt-2 mb-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId)
          const isOccupied = occupiedSeats.includes(seatId)
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer ${isOccupied ? "bg-red-500 cursor-not-allowed" : isSelected ? "bg-primary text-white" : ""}`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const getOccupiedSeats = async () => {
    try {
      const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`)
      if (data.success) {
        setOccupiedSeats(data.bookedSeats)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }



  const bookTickets = async () => {
    try {
      if (!user) return toast.error('Please login to proceed')
      if (!selectedTime || !selectedSeats.length) return toast.error('Please select a time and seats')

      const token = await getToken()

      const { data } = await axios.post('/api/booking/create', {
        showId: selectedTime.showId,
        selectedSeats
      }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        navigate('/payment', {
          state: {
            amount: data.amount,
            bookingId: data.bookingId
          }
        })
      } else {
        toast.error(data.message)
      }

      // if (data.success) {
      //     const bookingId = data.bookingId

      //     const { data: esewaData } = await axios.post('/api/booking/esewa-initiate', {
      //         amount: data.amount,
      //         bookingId
      //     }, { headers: { Authorization: `Bearer ${token}` } })

      //     if (esewaData.success) {
      //         const form = document.createElement('form')
      //         form.method = 'POST'
      //         form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'

      //         const fields = {
      //             amount: esewaData.amount,
      //             tax_amount: 0,
      //             total_amount: esewaData.amount,
      //             transaction_uuid: esewaData.transaction_uuid,
      //             product_code: esewaData.product_code,
      //             product_service_charge: 0,
      //             product_delivery_charge: 0,
      //             success_url: `${window.location.origin}/payment-success`,
      //             failure_url: `${window.location.origin}/my-bookings`,
      //             signed_field_names: 'total_amount,transaction_uuid,product_code',
      //             signature: esewaData.signature
      //         }

      //         Object.entries(fields).forEach(([key, value]) => {
      //             const input = document.createElement('input')
      //             input.type = 'hidden'
      //             input.name = key
      //             input.value = value
      //             form.appendChild(input)
      //         })

      //         document.body.appendChild(form)
      //         form.submit()
      //     }
      // } else {
      //     toast.error(data.message)
      // }
    } catch (error) {
      toast.error(error.message)
    }
  }






  useEffect(() => {
    getshow()
  }, [])

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats()
    }
  }, [selectedTime])

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* Available timings */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-3'>
          {show.dateTime[date].map((item) => (
            <div key={item.time} onClick={() => setSelectedTime(item)} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.time === item.time ? "bg-primary text-white" : "hover:bg-primary/20"}`}>
              <ClockIcon className='w-4 h-4' />
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seat layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top='-100px' left='-100px' />
        <BlurCircle bottom='0' right='0' />
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        {/* <img src={assets.screenImage} alt="screen" /> */}
        <svg
          width="585"
          height="29"
          viewBox="0 0 585 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-6 max-w-full"
        >
          <path
            d="M585 29V17C585 17 406.824 0 292.5 0C178.176 0 0 17 0 17V29C0 29 175.5 12 292.5 12C404.724 12 585 29 585 29Z"
            fill="#FFB300"
            fillOpacity="0.3"
          />
        </svg>
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div>
            {groupRows[0].map(row => renderSeats(row))}
          </div>
          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        <button onClick={bookTickets} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout
