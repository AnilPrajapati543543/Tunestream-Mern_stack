import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from "../../utils/axios";
import { motion } from "framer-motion";

const AddAlbum = () => {

  const [image, setImage] = useState(false);
  const [colour, setColour] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

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
        withCredentials: true
      });

      if (response.data.success) {
        toast.success("Album Added");
        setName("");
        setDesc("");
        setImage(false);
      } else {
        toast.error("Something went wrong");
      }

      setLoading(false);
    } catch (error) {
      toast.error("Error occured");
      setLoading(false);
    }
  }

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

  {/* Upload Image */}
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
        className='w-28 h-28 object-cover rounded-xl cursor-pointer 
                   border border-gray-500 
                   shadow-md hover:shadow-xl transition'
        src={image ? URL.createObjectURL(image) : assets.upload_area}
        alt=""
      />
    </label>
  </div>

  {/* Inputs */}
  <div className="flex flex-col gap-5">

    {/* Album Name */}
    <div className="flex flex-col gap-1">
      <p className='font-medium text-sm'>Album name</p>
      <input
        className='bg-transparent border border-gray-500 rounded-lg p-3 
                   w-full shadow-sm focus:shadow-md 
                   focus:border-green-500 outline-none transition'
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
        placeholder='Type here'
      />
    </div>

    {/* Description */}
    <div className="flex flex-col gap-1">
      <p className='font-medium text-sm'>Album description</p>
      <input
        className='bg-transparent border border-gray-500 rounded-lg p-3 
                   w-full shadow-sm focus:shadow-md 
                   focus:border-green-500 outline-none transition'
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
        type="text"
        placeholder='Type here'
      />
    </div>

    {/* Color Picker */}
    <div className="flex flex-col gap-2">
      <p className='font-medium text-sm'>Background Colour</p>
      <input
        onChange={(e) => setColour(e.target.value)}
        value={colour}
        type="color"
        className="w-20 h-10 rounded border border-gray-500 shadow-sm cursor-pointer"
      />
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
    ADD ALBUM
  </button>

</motion.form>
  )
}

export default AddAlbum
