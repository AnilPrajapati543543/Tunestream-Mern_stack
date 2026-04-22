import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { url } from "../../../App";
import { toast } from "react-toastify";

const ListSong = () => {
  const [data, setData] = useState([]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);

      if (response.data.success) {
        setData(response.data.songs);
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  const removeSong = async (id) => {
    try {
      const response = await axios.post("/song/remove", { id });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchSongs();
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div className="p-6 w-full h-full flex flex-col">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">All Songs</h2>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">

        {/* Header */}
        <div className="grid grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] 
                        bg-gray-100 text-gray-700 text-sm font-semibold
                        p-4 border-b">
          <p>Image</p>
          <p>Name</p>
          <p>Album</p>
          <p>Duration</p>
          <p className="text-center">Action</p>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto max-h-[70vh]">

          {data.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">
              No songs available
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

                {/* Album */}
                <p className="text-gray-600">{item.album}</p>

                {/* Duration */}
                <p className="text-gray-500">{item.duration}</p>

                {/* Action */}
                <button
                  onClick={() => removeSong(item._id)}
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

export default ListSong;
