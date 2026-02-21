import React, { useState, useEffect } from 'react'
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UsersIcon } from 'lucide-react'
import Loading from '../../components/Loading'
import Title from './Title'
import BlurCircle from '../../components/BlurCircle'
import { dateFormat } from '../../lib/dateFormat'
import { useAppContext } from '../../../context/appcontext'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const { axios, getToken, user, image_base_url } = useAppContext()
  const currency = import.meta.env.VITE_CURRENCY

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  })
  const [loading, setLoading] = useState(true)
  const [revenueData, setRevenueData] = useState([])

  const dashboardCards = [
    { title: "Total Bookings", value: dashboardData.totalBookings || "0", icon: ChartLineIcon },
    { title: "Total Revenue", value: `${currency} ${dashboardData.totalRevenue || "0"}`, icon: CircleDollarSignIcon },
    { title: "Active Shows", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon },
    { title: "Total Users", value: dashboardData.totalUser || "0", icon: UsersIcon },
  ]

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setDashboardData(data.dashboardData)

        // Build revenue chart data from activeShows
        const chartData = data.dashboardData.activeShows.map(show => ({
          name: show.movie.title.length > 12
            ? show.movie.title.substring(0, 12) + '...'
            : show.movie.title,
          revenue: Object.keys(show.occupiedSeats).length * show.showPrice,
          tickets: Object.keys(show.occupiedSeats).length
        }))
        setRevenueData(chartData)
        setLoading(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Error fetching dashboard data")
    }
  }

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />

      {/* Stats Cards */}
      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0" />
        <div className="flex flex-wrap gap-4 w-full">
          {dashboardCards.map((card, index) => (
            <div key={index} className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full">
              <div>
                <h1 className="text-sm">{card.title}</h1>
                <p className="text-xl font-medium mt-1">{card.value}</p>
              </div>
              <card.icon className="w-6 h-6" />
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mt-10">
        <p className="text-lg font-medium mb-4">📊 Revenue by Movie</p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#f9fafb' }}
                  formatter={(value, name) => [
                    name === 'revenue' ? `${currency} ${value}` : value,
                    name === 'revenue' ? 'Revenue' : 'Tickets Sold'
                  ]}
                />
                <Bar dataKey="revenue" fill="#e11d48" radius={[4, 4, 0, 0]} name="revenue" />
                <Bar dataKey="tickets" fill="#f59e0b" radius={[4, 4, 0, 0]} name="tickets" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-10">No revenue data available</p>
          )}

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <p className="text-sm text-gray-400">Revenue ({currency})</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <p className="text-sm text-gray-400">Tickets Sold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Shows */}
      <p className="mt-10 text-lg font-medium">Active Shows</p>
      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl pb-10">
        <BlurCircle top="100px" left="-10%" />
        {dashboardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300"
          >
            <img
              src={image_base_url + show.movie.poster_path}
              alt=""
              className="h-60 w-full object-cover"
            />
            <p className="font-medium p-2 truncate">{show.movie.title}</p>
            <div className="flex items-center justify-between px-2">
              <p className="text-lg font-medium">{currency} {show.showPrice}</p>
              <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                <StarIcon className="w-4 h-4 text-primary fill-primary" />
                {show.movie.vote_average.toFixed(1)}
              </p>
            </div>
            <p className="px-2 pt-2 text-sm text-gray-500">{dateFormat(show.showDateTime)}</p>
          </div>
        ))}
      </div>
    </>
  ) : <Loading />
}

export default Dashboard