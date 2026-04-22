import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { url } from "../../../App";
import { toast } from 'react-toastify'
import axios from "../../utils/axios";

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

    <div className='flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-gray-900 to-black'>
      <div className="w-16 h-16 border-4 border-gray-500 border-t-green-500 rounded-full animate-spin shadow-lg"></div>
    </div>

  ) : (

    <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">

      <form 
        onSubmit={onSubmitHandler} 
        className='w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 text-gray-200 transition-all duration-300 hover:shadow-green-900/30'
      >

        <h2 className="text-2xl font-semibold text-white tracking-wide">Add New Album</h2>

        {/* Upload Image */}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-400">Upload Image</p>

          <input 
            onChange={(e) => setImage(e.target.files[0])} 
            type="file" 
            id='image' 
            accept='image/*' 
            hidden 
          />

          <label 
            htmlFor="image" 
            className="group w-28 h-28 rounded-xl overflow-hidden border border-dashed border-gray-500 flex items-center justify-center cursor-pointer hover:border-green-500 transition"
          >
            <img 
              className='w-full h-full object-cover group-hover:scale-105 transition duration-300' 
              src={image ? URL.createObjectURL(image) : assets.upload_area} 
              alt="" 
            />
          </label>
        </div>

        {/* Album Name */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-400">Album Name</p>
          <input 
            className='bg-white/10 border border-gray-600 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 transition'
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            type="text" 
            placeholder='Type here' 
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-400">Album Description</p>
          <input 
            className='bg-white/10 border border-gray-600 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 transition'
            onChange={(e) => setDesc(e.target.value)} 
            value={desc} 
            type="text" 
            placeholder='Type here' 
          />
        </div>

        {/* Color Picker */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-400">Background Colour</p>
          <input 
            onChange={(e) => setColour(e.target.value)} 
            value={colour} 
            type="color" 
            className="w-16 h-10 rounded-md border border-gray-600 cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button 
          className='mt-4 bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 rounded-lg shadow-lg hover:shadow-green-500/40 transition-all duration-300 active:scale-95'
          type='submit'
        >
          ADD
        </button>

      </form>
    </div>
  )
}

export default AddAlbum
