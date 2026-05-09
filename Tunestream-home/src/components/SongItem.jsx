import React, { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'
import { motion } from 'framer-motion'
import PlaylistModal from './PlaylistModal';

const SongItem = ({ name, image, desc, id }) => {

  const { playWithId } = useContext(PlayerContext)
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <PlaylistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} songId={id} />
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

        {/* BOTTOM-RIGHT PLAY BUTTON */}
        <div className='absolute inset-0 pointer-events-none'>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.1 }}
                className='absolute bottom-2 right-2 bg-emerald-500 w-11 h-11 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto'
            >
                <span className='text-black text-xl ml-1'>▶</span>
            </motion.div>
        </div>


        {/* ADD TO PLAYLIST BTN */}
        <div 
          onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <span className="text-white font-bold text-lg leading-none">+</span>
        </div>

      </div>

      {/* TEXT */}
      <div className='mt-3'>
        <p className='font-bold text-white mb-1 truncate'>{name}</p>
        <p className='text-gray-400 text-xs md:text-sm line-clamp-2 leading-relaxed'>{desc}</p>
      </div>

    </motion.div>
    </>
  )
}

export default SongItem