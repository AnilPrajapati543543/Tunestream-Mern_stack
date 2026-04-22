import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { url } from "../../../App";
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
  const [albumData, setAlbumData] = useState([])

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("audio", song);
      formData.append("album", album);

      const response = await axios.post(`/song/add`, formData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success("Song Added");
        setName("");
        setDesc("");
        setAlbum("none");
        setImage(false);
        setSong(false);
      } else {
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
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumData(response.data.albums);
    } catch (error) {}
  }

  useEffect(() => {
    loadAlbumData();
  }, [])

  if (loading) {
    return (
      <div className='grid place-items-center min-h-[80vh]'>
        <div className="w-14 h-14 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin shadow-md"></div>
      </div>
    )
  }

  return (
   <motion.form
  onSubmit={onSubmitHandler}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  className='flex flex-col gap-6 p-10 rounded-2xl 
             bg-white/5 backdrop-blur-md 
             border border-gray-700 
             shadow-lg hover:shadow-2xl 
             transition duration-300 
             text-gray-200 w-full max-w-2xl'
>

  {/* Upload Section */}
  <div className='flex gap-12 flex-wrap items-center'>

    {/* Song Upload */}
    <div className="flex flex-col gap-3 items-center">
      <p className='font-medium text-sm'>Upload song</p>
      <input
        onChange={(e) => setSong(e.target.files[0])}
        type="file"
        id='song'
        accept='audio/*'
        hidden
      />
      <label htmlFor="song">
        <img
          className='w-24 h-24 object-cover cursor-pointer rounded-xl 
                     border border-gray-500 
                     shadow-md hover:shadow-xl transition'
          src={song ? assets.upload_added : assets.upload_song}
          alt=""
        />
      </label>
    </div>

    {/* Image Upload */}
    <div className="flex flex-col gap-3 items-center">
      <p className='font-medium text-sm'>Upload Image</p>
      <input
        onChange={(e) => setImage(e.target.files[0])}
        type="file"
        id='image'
        accept='image/*'
        hidden
      />
      <label htmlFor="image">
        <img
          className='w-24 h-24 object-cover cursor-pointer rounded-xl 
                     border border-gray-500 
                     shadow-md hover:shadow-xl transition'
          src={image ? URL.createObjectURL(image) : assets.upload_area}
          alt=""
        />
      </label>
    </div>

  </div>

  {/* Inputs Container */}
  <div className="flex flex-col gap-5">

    {/* Song Name */}
    <div className="flex flex-col gap-1">
      <p className='font-medium text-sm'>Song name</p>
      <input
        className='bg-transparent border border-gray-500 rounded-lg p-3 
                   w-full shadow-sm focus:shadow-md 
                   focus:border-green-500 outline-none transition'
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
        placeholder='Type here'
        required
      />
    </div>

    {/* Description */}
    <div className="flex flex-col gap-1">
      <p className='font-medium text-sm'>Song description</p>
      <input
        className='bg-transparent border border-gray-500 rounded-lg p-3 
                   w-full shadow-sm focus:shadow-md 
                   focus:border-green-500 outline-none transition'
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
        type="text"
        placeholder='Type here'
        required
      />
    </div>

    {/* Album Select */}
    <div className="flex flex-col gap-1">
      <p className='font-medium text-sm'>Album</p>
      <select
        className='bg-transparent border border-gray-500 rounded-lg p-3 
                   w-full shadow-sm focus:shadow-md 
                   focus:border-green-500 outline-none transition'
        onChange={(e) => setAlbum(e.target.value)}
        value={album}
      >
        <option value="none">None</option>
        {albumData.map((item, index) => (
          <option key={index} value={item.name}>{item.name}</option>
        ))}
      </select>
    </div>

  </div>

  {/* Submit */}
  <button
    className='bg-green-600 hover:bg-green-700 
               text-white py-3 rounded-xl 
               shadow-md hover:shadow-xl 
               transition duration-300 mt-2'
    type='submit'
  >
    ADD SONG
  </button>

</motion.form>
  )
}

export default AddSong
