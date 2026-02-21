import React, { useState, useEffect } from 'react'
import Title from './Title';
import Loading from '../../components/Loading';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../../context/appcontext';
import toast from 'react-hot-toast';

const ListShows = () => {

  const currency = import.meta.env.VITE_CURRENCY
  const { axios, getToken, user } = useAppContext()
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-shows", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      setShows(data.shows)
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (showId) => {
    try {
      const { data } = await axios.delete(`/api/admin/delete-show/${showId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success(data.message)
        getAllShows()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      getAllShows();
    }
  }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
              <th className="p-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {shows.map((show, index) => (
              <tr key={index} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
                <td className="p-2">{dateFormat(show.showDateTime)}</td>
                <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                <td className="p-2">{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(show._id)}
                    className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 text-xs rounded-full hover:bg-red-500/30 transition cursor-pointer">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : <Loading />
}

export default ListShows