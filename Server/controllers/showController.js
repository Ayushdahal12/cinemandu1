import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

export const getNowPlayingMovies = async (req, res) => {
    try {
        const language = req.query.language || 'en-US'
        let movies = []

        const dateFrom = '2025-01-01'
        const dateTo = '2026-12-31'

        if (language === 'hi-IN') {
            const [popular, latest, page2] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/discover/movie?with_original_language=hi&sort_by=popularity.desc&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}&page=1`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/discover/movie?with_original_language=hi&sort_by=release_date.desc&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}&page=1`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/discover/movie?with_original_language=hi&sort_by=popularity.desc&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}&page=2`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                })
            ])

            const allMovies = [
                ...popular.data.results,
                ...latest.data.results,
                ...page2.data.results
            ]
            const seen = new Set()
            movies = allMovies.filter(movie => {
                if (seen.has(movie.id)) return false
                seen.add(movie.id)
                if (!movie.poster_path || !movie.backdrop_path) return false
                return true
            })

        } else if (language === 'ne-NP') {
            const [popular, latest] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/discover/movie?with_original_language=ne&sort_by=popularity.desc&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}&page=1`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/discover/movie?with_original_language=ne&sort_by=release_date.desc&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}&page=1`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                })
            ])

            const allMovies = [
                ...popular.data.results,
                ...latest.data.results
            ]
            const seen = new Set()
            movies = allMovies.filter(movie => {
                if (seen.has(movie.id)) return false
                seen.add(movie.id)
                if (!movie.poster_path || !movie.backdrop_path) return false
                return true
            })

        } else {
            const [popular, latest, page2] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/discover/movie?with_original_language=en&sort_by=popularity.desc&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}&page=1`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/discover/movie?with_original_language=en&sort_by=release_date.desc&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}&page=1`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/discover/movie?with_original_language=en&sort_by=popularity.desc&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}&page=2`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                })
            ])

            const allMovies = [
                ...popular.data.results,
                ...latest.data.results,
                ...page2.data.results
            ]
            const seen = new Set()
            movies = allMovies.filter(movie => {
                if (seen.has(movie.id)) return false
                seen.add(movie.id)
                if (!movie.poster_path || !movie.backdrop_path) return false
                return true
            })
        }

        res.json({ success: true, movies })
    } catch (error) {
        console.error(error)
        res.json({ success: false, error: error.message })
    }
}

export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body

        let movie = await Movie.findById(movieId)

        if (!movie) {
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                })
            ])

            const movieApiData = movieDetailsResponse.data
            const movieCreditsData = movieCreditsResponse.data

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview || "No overview available",
                poster_path: movieApiData.poster_path || "",
                backdrop_path: movieApiData.backdrop_path || movieApiData.poster_path || "",
                genres: movieApiData.genres || [],
                casts: movieCreditsData.cast || [],
                release_date: movieApiData.release_date || "",
                original_language: movieApiData.original_language || "",
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average || 0,
                runtime: movieApiData.runtime || 0,
            }
            movie = await Movie.create(movieDetails)
        }

        const showsToCreate = []
        showsInput.forEach(show => {
            const showDate = show.date
            show.time.forEach((time) => {
                const dateTimeString = `${showDate}T${time}`
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        })

        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate)
        }

        res.json({ success: true, message: 'Show Added successfully.' })

    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

export const getShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } })
            .populate('movie')
            .sort({ showDateTime: 1 })

        const uniqueShows = new Set(shows.map(show => show.movie))
        res.json({ success: true, shows: Array.from(uniqueShows) })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

export const getShowsByMovie = async (req, res) => {
    try {
        const { movieId } = req.params

        const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } })
        const movie = await Movie.findById(movieId)
        const dateTime = {}

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0]
            if (!dateTime[date]) {
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })

        res.json({ success: true, movie, dateTime })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}