// Home.jsx
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'

const Home = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    }
  }, [location])

  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <TrailersSection />
      <section id="home-trailers" className="mt-16">
        {/* Trailer content at the bottom */}
      </section>
    </>
  )
}

export default Home