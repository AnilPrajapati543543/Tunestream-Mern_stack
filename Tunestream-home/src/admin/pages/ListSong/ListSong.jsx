import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { url } from "../../../App";
import { toast } from "react-toastify";

const ListSong = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const itemsPerPage = 6;

  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${url}/api/song/list`);
      if (res.data.success) setData(res.data.songs);
    } catch {
      toast.error("Error fetching songs");
    }
  };

  const removeSong = async () => {
    try {
      const res = await axios.post("/song/remove", { id: selectedId });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchSongs();
        setSelectedId(null);
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => { fetchSongs(); }, []);

  const filtered = data.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Songs</h2>

      <input
        placeholder="Search song..."
        className="mb-4 p-2 border rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="border rounded overflow-hidden">
        <div className="grid grid-cols-5 p-3 bg-gray-100 sticky top-0">
          <b>Img</b><b>Name</b><b>Album</b><b>Duration</b><b>Action</b>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {paginated.map((item) => (
            <div key={item._id} className="grid grid-cols-5 p-3 border-b hover:bg-gray-50">
              <img src={item.image} className="w-10" />
              <p>{item.name}</p>
              <p>{item.album}</p>
              <p>{item.duration}</p>
              <button onClick={() => setSelectedId(item._id)} className="text-red-500">Delete</button>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        {Array.from({ length: Math.ceil(filtered.length / itemsPerPage) }).map((_, i) => (
          <button key={i} onClick={() => setPage(i+1)} className="px-3 py-1 border">
            {i+1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <p>Confirm delete?</p>
            <div className="flex gap-3 mt-3">
              <button onClick={removeSong} className="bg-red-500 text-white px-3 py-1">Yes</button>
              <button onClick={() => setSelectedId(null)} className="border px-3 py-1">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListSong;
