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
      console.error(error);
      toast.error("Error occurred while fetching albums");
    }
  };

  // Remove album
  const removeAlbum = async (id) => {
    try {
      const response = await axios.delete(`/album/${id}`);

if (response.data.success) {
  alert("Album deleted");
  fetchAlbums();
} else {
        toast.error("Failed to delete album");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while deleting album");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div>
      <p className="text-lg font-semibold">All Albums List</p>
      <br />

      {/* Header */}
      <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
        <b>Image</b>
        <b>Name</b>
        <b>Description</b>
        <b>Album Colour</b>
        <b>Action</b>
      </div>

      {/* List */}
      {data.map((item) => (
        <div
          key={item._id}
          className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
        >
          <img className="w-12" src={item.image} alt={item.name} />
          <p>{item.name}</p>
          <p>{item.desc}</p>

          {/* FIXED: removed warning */}
          <input type="color" defaultValue={item.bgColour} />

          <p
            className="cursor-pointer text-red-500 font-bold"
            onClick={() => removeAlbum(item._id)}
          >
            X
          </p>
        </div>
      ))}
    </div>
  );
};

export default ListAlbum;