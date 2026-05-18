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

  const { playWithId, albumsData, songsData, track: currentSong } = useContext(PlayerContext)

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

    img.onerror = () => {
      setBgColor('#121212')
    }

    img.src = albumData.image
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
          <motion.div style={{ opacity: titleOpacity }} className='flex-1'>
            <p className='text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-widest'>Album</p>

            <h2 className='text-3xl md:text-7xl font-black leading-tight mt-2 mb-2'>
              {albumData.name}
            </h2>

            <p className='text-gray-400 text-sm mt-1 max-w-[500px] line-clamp-2 md:line-clamp-none'>
              {albumData.desc}
            </p>

            <div className='mt-4 flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-400'>
              <div className='flex items-center gap-1'>
                <img className='w-4 md:w-5' src={assets.tunestream_logo} alt="" />
                <span className='text-white font-bold'>TuneStream</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>1.3M likes</span>
              <span className="hidden sm:inline">•</span>
              <span className='font-medium text-white'>10 songs</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className='grid grid-cols-4 mt-6 mb-4 px-6 text-gray-400 text-[10px] uppercase font-bold tracking-widest'>
        <p className="col-span-2 sm:col-span-1"><b className='mr-4'>#</b>Title</p>
        <p className="hidden sm:block">Album</p>
        <p className='hidden sm:block'>Date Added</p>
        <div className="flex justify-end pr-4">
           <img className='w-4 opacity-50' src={assets.clock_icon} alt="" />
        </div>
      </div>

      <hr className='border-gray-700 mx-6' />

      {/* SONG LIST */}
      <div className='px-4 mt-2'>
        {
          songsData
            .filter((item) => item.album === albumData.name) // ✅ FIXED
            .map((item, index, albumSongs) => {

              const isPlaying = currentSong?._id === item._id

              return (
                <motion.div
                  key={item._id}
                  onClick={() => playWithId(item._id, albumSongs)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`
                    grid grid-cols-4 gap-2 p-3 items-center rounded-xl cursor-pointer transition-all
                    ${isPlaying
                      ? "bg-white/10 shadow-lg"
                      : "hover:bg-white/5"}
                  `}
                >

                  {/* Title */}
                  <div className='flex items-center col-span-3 sm:col-span-1 overflow-hidden'>
                    <span className='mr-4 w-4 text-gray-500 font-bold text-xs hidden sm:inline'>
                      {index + 1}
                    </span>

                    <div className='relative flex-shrink-0'>
                      <img
                        className='w-10 h-10 rounded-md mr-4 object-cover shadow-md'
                        src={item.image}
                        alt=""
                      />
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <span className={`truncate font-bold text-sm ${isPlaying ? "text-emerald-400" : "text-white"}`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] text-gray-500 truncate sm:hidden">
                        Artist Name
                      </span>
                    </div>
                  </div>

                  <p className='text-xs text-gray-400 truncate hidden sm:block'>{albumData.name}</p>

                  <p className='text-xs text-gray-500 hidden sm:block'>5 days ago</p>

                  <div className='text-xs text-gray-400 flex justify-end pr-4'>
                    {
                      isPlaying
                        ? <div className="flex gap-[2px] h-3 items-end">
                            <div className="w-[2px] h-full bg-emerald-500 animate-bounce" style={{animationDuration: '0.6s'}} />
                            <div className="w-[2px] h-[60%] bg-emerald-500 animate-bounce" style={{animationDuration: '0.4s'}} />
                            <div className="w-[2px] h-[80%] bg-emerald-500 animate-bounce" style={{animationDuration: '0.5s'}} />
                          </div>
                        : item.duration
                    }
                  </div>

                </motion.div>
              )
            })
        }
      </div>
    </div>
  )
}

export default DisplayAlbum