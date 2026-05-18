import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'

import { toast } from 'react-toastify'
import axios from "../../utils/axios";
import { motion } from "framer-motion";


const AddSong = () => {

  const [image, setImage] = useState(false);
  const [song, setSong] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [albumData, setAlbumData] = useState([]);

  const onSubmitHandler = async (e) => {

    e.preventDefault();

    if (!song) {
      toast.error("Please select an audio file to upload");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {

      const formData = new FormData();

      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("album", album);
      formData.append("image", image);
      formData.append("audio", song);

      const response = await axios.post(`/song/add`, formData, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      if (response.data.success) {
        toast.success("Song Added");
        setName("");
        setDesc("");
        setAlbum("none");
        setImage(false);
        setSong(false);
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

  const loadAlbumData = async () => {
    try {

      const response = await axios.get("/album/list");
      setAlbumData(response.data.albums);

    } catch (error) {

    }
  }

  useEffect(() => {
    loadAlbumData();
  }, [])

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
          {uploadProgress < 100 ? "Uploading Track..." : "Finalizing..."}
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
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Add New <span className="text-[var(--accent-color)]">Song</span></h2>
        <p className="text-sm text-[var(--text-secondary)]">Fill in the details below to upload a new track to the library.</p>
      </div>

      <form onSubmit={onSubmitHandler} className='flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar pb-6'>
        
        {/* Upload Section */}
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Source Audio (Required)</p>
            <input onChange={(e) => setSong(e.target.files[0])} type="file" id='song' accept='audio/*' hidden />
            <label htmlFor="song" className="cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
              <div className="w-36 h-36 rounded-[2rem] bg-[var(--bg-color)] p-4 border-2 border-dashed border-[var(--border-color)] flex flex-col items-center justify-center gap-2 group relative overflow-hidden text-center">
                <img className='w-12 h-12 object-contain opacity-40 group-hover:opacity-100 transition-opacity' src={song ? assets.upload_added : assets.upload_song} alt="Upload" />
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] truncate w-full px-2">
                  {song ? song.name : "Audio"}
                </p>
                {song && <div className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent-color)] rounded-full animate-pulse" />}
              </div>
            </label>
          </div>
          
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Cover Art</p>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
            <label htmlFor="image" className="cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
              <div className="w-36 h-36 rounded-[2rem] bg-[var(--bg-color)] border-2 border-dashed border-[var(--border-color)] overflow-hidden flex items-center justify-center group relative">
                {image ? (
                  <img className="w-full h-full object-cover" src={URL.createObjectURL(image)} alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity text-center">
                    <img className="w-10 h-10" src={assets.upload_area} alt="" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Thumb</span>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Song Title</p>
            <input className='premium-input' onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='e.g. Midnight City' required />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Select Album</p>
            <select className='premium-input' onChange={(e) => setAlbum(e.target.value)} value={album} >
              <option value="none" className="bg-[var(--surface-color)] text-[var(--text-primary)]">None (Single)</option>
              {albumData.map((item, index) => (
                <option key={index} value={item.name} className="bg-[var(--surface-color)] text-[var(--text-primary)]">
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-w-5xl">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Track Description</p>
          <textarea 
            className='premium-input min-h-[100px] resize-none' 
            onChange={(e) => setDesc(e.target.value)} 
            value={desc} 
            placeholder='Tell the listeners...' 
            required 
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='premium-button px-16' 
          type='submit'
        >
          PUBLISH SONG
        </motion.button>
      </form>

    </div>
  )

}


export default AddSong
