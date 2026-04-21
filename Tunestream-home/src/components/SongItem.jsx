import React, { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'
import { motion } from 'framer-motion'

const SongItem = ({ name, image, desc, id }) => {

  const { playWithId } = useContext(PlayerContext)

  return (
    <motion.div
      onClick={() => playWithId(id)}
      whileHover={{ scale: 1.05, translateY: -5 }}
      whileTap={{ scale: 0.95 }}
      className='w-[160px] md:w-[200px] flex-shrink-0 p-3 rounded-xl bg-[#181818] hover:bg-[#282828] cursor-pointer transition-all duration-300 group shadow-lg hover:shadow-black/60'
    >

      {/* IMAGE + PLAY BUTTON */}
      <div className='relative overflow-hidden rounded-lg'>

        <img
          className='w-full aspect-square object-cover transition duration-500 group-hover:scale-110'
          src={image}
          alt={name}
        />

        {/* PLAY BUTTON OVERLAY */}
        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.1 }}
                className='bg-[#1db954] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-3 transition-all duration-300 transform'
            >
                <span className='text-black text-xl ml-1'>▶</span>
            </motion.div>
        </div>

      </div>

      {/* TEXT */}
      <div className='mt-3'>
        <p className='font-bold text-white mb-1 truncate'>{name}</p>
        <p className='text-gray-400 text-xs md:text-sm line-clamp-2 leading-relaxed'>{desc}</p>
      </div>

    </motion.div>
  )
}

export default SongItem