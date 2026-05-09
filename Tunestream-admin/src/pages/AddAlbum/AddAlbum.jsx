import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { url } from '../../App'
import { toast } from 'react-toastify'
import axios from "../../utils/axios";
import { motion } from "framer-motion";


const AddAlbum = () => {

  const [image, setImage] = useState(false);
  const [colour, setColour] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onSubmitHandler = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("bgColour", colour);

      const response = await axios.post(`/album/add`, formData, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        toast.success("Album Added");
        setName("");
        setDesc("");
        setImage(false);
      }
      else {
        toast.error("Something went wrong");
      }

      setLoading(false);

    } catch (error) {

      toast.error("Error occured");
      setLoading(false);

    }

  }

  return loading ? (
    <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6'>
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-[var(--border-color)] rounded-full opacity-20"></div>
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="var(--accent-color)"
            strokeWidth="4"
            strokeDasharray="276.46"
            strokeDashoffset={276.46 - (276.46 * uploadProgress) / 100}
            className="transition-all duration-300 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-black text-lg text-[var(--accent-color)]">
          {uploadProgress}%
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] animate-pulse">
          {uploadProgress < 100 ? "Uploading Album..." : "Finalizing..."}
        </p>
        <div className="w-32 h-1 bg-[var(--bg-color)] rounded-full overflow-hidden border border-[var(--border-color)]">
           <div 
            className="h-full bg-[var(--accent-gradient)] transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
           ></div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Create <span className="text-[var(--accent-color)]">Album</span></h2>
        <p className="text-sm text-[var(--text-secondary)]">Group your tracks into a cohesive collection with a custom cover and theme.</p>
      </div>

      <form onSubmit={onSubmitHandler} className='flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar pb-6'>
        {/* Top Section: Art + Name/Color */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Cover Art</p>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
            <label htmlFor="image" className="cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
              <div className="w-36 h-36 rounded-[2rem] bg-[var(--bg-color)] border-2 border-dashed border-[var(--border-color)] overflow-hidden flex items-center justify-center group relative">
                {image ? (
                  <img className="w-full h-full object-cover" src={URL.createObjectURL(image)} alt="Upload Preview" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-[var(--text-secondary)] opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-2xl">🖼️</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Art</span>
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="flex-1 w-full grid gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Album Name</p>
              <input className='premium-input w-full' onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='e.g. Discovery' required />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Theme Accent</p>
              <div className="flex items-center gap-4 p-2.5 bg-[var(--bg-color)] rounded-full border border-[var(--border-color)] w-fit min-w-[160px]">
                <input 
                  className="w-8 h-8 rounded-full cursor-pointer border-none bg-transparent shadow-sm" 
                  onChange={(e) => setColour(e.target.value)} 
                  value={colour} 
                  type="color" 
                />
                <span className="text-xs font-black font-mono tracking-widest text-[var(--text-primary)]">{colour.toUpperCase() || '#000000'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-w-5xl">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Album Description</p>
          <textarea 
            className='premium-input min-h-[100px] resize-none' 
            onChange={(e) => setDesc(e.target.value)} 
            value={desc} 
            placeholder='Tell the story...' 
            required 
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='premium-button px-16' 
          type='submit'
        >
          CREATE ALBUM
        </motion.button>
      </form>

    </div>
  )

}


export default AddAlbum
