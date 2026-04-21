import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { PlayerContext } from '../context/PlayerContext'
import { motion, useScroll, useTransform } from 'framer-motion'

const DisplayAlbum = ({ album }) => {

  const { id } = useParams()
  const [albumData, setAlbumData] = useState(null)
  const [bgColor, setBgColor] = useState('#121212')

  const { playWithId, albumsData, songsData, currentSong } = useContext(PlayerContext)

  useEffect(() => {
    if (albumsData.length > 0) {
      const found = albumsData.find(item => item._id === id)
      setAlbumData(found)
    }
  }, [id, albumsData])

  useEffect(() => {
    if (!albumData?.image) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = albumData.image

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = img.width
      canvas.height = img.height

      ctx.drawImage(img, 0, 0)

      const data = ctx.getImageData(0, 0, 1, 1).data
      const color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`

      setBgColor(color)
    }
  }, [albumData])

  const { scrollY } = useScroll()

  const headerOpacity = useTransform(scrollY, [0, 200], [0, 1])
  const titleOpacity = useTransform(scrollY, [0, 150], [1, 0])
  const imageScale = useTransform(scrollY, [0, 200], [1, 0.8])
  const imageY = useTransform(scrollY, [0, 200], [0, -30])

  if (!albumData) {
    return <div className="text-white p-10">Loading...</div>
  }

  return (
    <div className='text-white pb-32'>

      {/*Navbar Background on Scroll */}
      <motion.div
        style={{ opacity: headerOpacity }}
        className='fixed top-0 left-0 w-full h-20 bg-[#121212] z-20'
      />

      <Navbar />

      {/* HEADER */}
      <div
        className='relative px-6 pt-20 pb-10'
        style={{
          background: `linear-gradient(to bottom, ${bgColor}, #121212)`
        }}
      >
        <div className='flex flex-col md:flex-row items-end gap-6'>

          {/* Album Image */}
          <motion.img
            style={{ scale: imageScale, y: imageY }}
            className='w-44 rounded-lg shadow-2xl'
            src={albumData.image}
            alt=""
          />

          {/* Text */}
          <motion.div style={{ opacity: titleOpacity }}>
            <p className='text-sm text-gray-300'>Playlist</p>

            <h2 className='text-5xl md:text-7xl font-bold leading-tight'>
              {albumData.name}
            </h2>

            <p className='text-gray-300 mt-3 max-w-[500px]'>
              {albumData.desc}
            </p>

            <p className='mt-2 text-sm text-gray-400 flex items-center gap-1'>
              <img className='w-5' src={assets.tunestream_logo} alt="" />
              <span className='text-white font-semibold'>TuneStream</span>
              • 1.3M likes • 10 songs
            </p>
          </motion.div>
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className='grid grid-cols-3 sm:grid-cols-4 mt-6 mb-4 px-6 text-gray-400 text-sm'>
        <p><b className='mr-4'>#</b>Title</p>
        <p>Album</p>
        <p className='hidden sm:block'>Date Added</p>
        <img className='m-auto w-4' src={assets.clock_icon} alt="" />
      </div>

      <hr className='border-gray-700 mx-6' />

      {/* SONG LIST */}
      <div className='px-4 mt-2'>
        {
          songsData
            .filter((item) => item.album === albumData.name) // ✅ FIXED
            .map((item, index) => {

              const isPlaying = currentSong?._id === item._id

              return (
                <motion.div
                  key={item._id}
                  onClick={() => playWithId(item._id)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`
                    grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center rounded-md cursor-pointer transition-all
                    ${isPlaying
                      ? "bg-white/20 text-white"
                      : "text-gray-400 hover:bg-white/10"}
                  `}
                >

                  {/* Title */}
                  <div className='flex items-center'>
                    <span className='mr-4 w-4 text-gray-400'>
                      {index + 1}
                    </span>

                    <div className='relative group'>
                      <img
                        className='w-10 rounded mr-4'
                        src={item.image}
                        alt=""
                      />

                      {/* Hover Play */}
                      <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition'>
                        <div className='bg-black/70 p-2 rounded-full text-white text-xs'>
                          ▶
                        </div>
                      </div>
                    </div>

                    <span className={isPlaying ? "text-green-400 font-semibold" : ""}>
                      {item.name}
                    </span>
                  </div>

                  <p className='text-sm'>{albumData.name}</p>

                  <p className='text-sm hidden sm:block'>5 days ago</p>

                  <p className='text-sm text-center'>
                    {
                      isPlaying
                        ? <span className='animate-pulse text-green-400'>●</span>
                        : item.duration
                    }
                  </p>

                </motion.div>
              )
            })
        }
      </div>
    </div>
  )
}

export default DisplayAlbum