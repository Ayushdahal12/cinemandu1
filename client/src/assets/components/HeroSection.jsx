import { ArrowRight, Calendar1Icon, CalendarIcon, ClockIcon } from 'lucide-react'
import React from 'react'
import { assets } from '../assets'
import { useNavigate } from 'react-router-dom'


const HeroSection = () => {

    const navigate = useNavigate()

    return (
       <div className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center bg-no-repeat h-screen"
  style={{ backgroundImage: `url(${assets.background})` }} // <-- use background
>

            <img src={assets.mainlogo} alt="" className="max-h-11 lg:h-11 mt-20" />

    <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>
  <span className="text-white font-medium drop-shadow-[0_0_3px_white]">Crime</span>{" "} 
  <span className="text-red-700 font-extrabold drop-shadow-[0_0_2px_red]">101</span>
  <br />
</h1>

            <div className='flex items-center gap-4 text-grey-300'>
                <span>Crime |  Thriller |  Drama</span>
                <div className='flex item-center gap-1'>
                    <CalendarIcon className='w-4.5 h-4.5' />2026
                </div>
                <div className='flex item-center gap-1'>
                    <ClockIcon className='w-4.5 h-4.5' />2h 3m
                </div>
            </div>
            <p className='max-w-md text-grey-300'>Crime 101 is a gripping crime thriller that follows a master criminal operating under a mysterious code, while law enforcement races against time.</p>
            <button onClick={() => navigate('/theaters')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
               More Movies
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    )
}

export default HeroSection
