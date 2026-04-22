import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { url } from "../../../App";
import { toast } from "react-toastify";

const ListAlbum = () => {
  const [data, setData] = useState([]);

  // Fetch albums
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);

      if (response.data.success) {
        setData(response.data.albums);
      } else {
        toast.error("Failed to fetch albums");
      }
    } catch (error) {
      toast.error("Error occurred while fetching albums");
    }
  };

  // Remove album
  const removeAlbum = async (id) => {
    try {
      const response = await axios.delete(`/album/${id}`);

      if (response.data.success) {
        toast.success("Album deleted");
        fetchAlbums();
      } else {
        toast.error("Failed to delete album");
      }
    } catch (error) {
      toast.error("Error occurred while deleting album");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="p-6 w-full h-full flex flex-col">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">All Albums</h2>

      {/* Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">

        {/* Header */}
        <div className="grid grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] 
                        bg-gray-100 text-gray-700 text-sm font-semibold
                        p-4 border-b">
          <p>Image</p>
          <p>Name</p>
          <p>Description</p>
          <p>Color</p>
          <p className="text-center">Action</p>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto max-h-[70vh]">

          {data.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">
              No albums available
            </p>
          ) : (
            data.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] 
                           items-center p-4 border-b text-sm
                           hover:bg-gray-50 transition duration-200"
              >
                {/* Image */}
                <img
                  className="w-12 h-12 object-cover rounded"
                  src={item.image}
                  alt={item.name}
                />

                {/* Name */}
                <p className="font-medium text-gray-800">
                  {item.name}
                </p>

                {/* Description */}
                <p className="text-gray-600 line-clamp-1">
                  {item.desc}
                </p>

                {/* Color */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={item.bgColour}
                    readOnly
                    className="w-8 h-8 border-none cursor-default"
                  />
                  <span className="text-xs text-gray-500">
                    {item.bgColour}
                  </span>
                </div>

                {/* Action */}
                <button
                  onClick={() => removeAlbum(item._id)}
                  className="text-red-500 hover:text-red-700 font-bold text-center"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ListAlbum;
