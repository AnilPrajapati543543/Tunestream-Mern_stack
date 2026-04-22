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
        <motion.div
          className="w-16 h-16 border-4 border-gray-300 border-t-green-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <motion.form
      onSubmit={onSubmitHandler}
      className='flex flex-col gap-8 p-8 rounded-2xl bg-white/5 backdrop-blur-md shadow-xl border border-gray-700 text-gray-200 w-fit'
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >

      {/* Upload Image */}
      <div className="flex flex-col gap-4">
        <p className='font-semibold'>Upload Image</p>

        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id='image'
          accept='image/*'
          hidden
        />

        <label htmlFor="image">
          <motion.img
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='w-28 h-28 object-cover rounded-xl cursor-pointer border border-gray-500 shadow-md'
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt=""
          />
        </label>
      </div>

      {/* Album Name */}
      <div className="flex flex-col gap-2">
        <p className='font-semibold'>Album name</p>
        <input
          className='bg-transparent border border-gray-500 rounded-lg p-3 w-[max(40vw,250px)] focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200 outline-none'
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder='Type here'
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <p className='font-semibold'>Album description</p>
        <input
          className='bg-transparent border border-gray-500 rounded-lg p-3 w-[max(40vw,250px)] focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200 outline-none'
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          type="text"
          placeholder='Type here'
        />
      </div>

      {/* Color Picker */}
      <div className="flex flex-col gap-3">
        <p className='font-semibold'>Background Colour</p>
        <input
          onChange={(e) => setColour(e.target.value)}
          value={colour}
          type="color"
          className="w-16 h-10 rounded cursor-pointer border border-gray-500"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='bg-grey-600 hover:bg-grey-700 text-white py-3 px-10 rounded-xl font-semibold shadow-lg transition-all duration-200'
        type='submit'
      >
        ADD
      </motion.button>

    </motion.form>
  )
}

export default AddAlbum
