import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { url } from "../../../App";
import { toast } from "react-toastify";

const ListAlbum = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [editId, setEditId] = useState(null);

  const itemsPerPage = 6;

  const fetchAlbums = async () => {
    try {
      const res = await axios.get(`${url}/api/album/list`);
      if (res.data.success) setData(res.data.albums);
    } catch {
      toast.error("Error fetching albums");
    }
  };

  const removeAlbum = async () => {
    try {
      const res = await axios.delete(`/album/${selectedId}`);
      if (res.data.success) {
        toast.success("Deleted");
        fetchAlbums();
        setSelectedId(null);
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => { fetchAlbums(); }, []);

  const filtered = data.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Albums</h2>

      <input
        placeholder="Search album..."
        className="mb-4 p-2 border rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="border rounded overflow-hidden">
        <div className="grid grid-cols-5 p-3 bg-gray-10 sticky top-0">
          <b>Img</b><b>Name</b><b>Description</b><b>Color</b><b>Action</b>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {paginated.map((item) => (
            <div key={item._id} className="grid grid-cols-5 p-3 border-b hover:bg-gray-50">
              <img src={item.image} className="w-10" />

              {editId === item._id ? (
                <input defaultValue={item.name} className="border" />
              ) : (
                <p>{item.name}</p>
              )}

              {editId === item._id ? (
                <input defaultValue={item.desc} className="border" />
              ) : (
                <p>{item.desc}</p>
              )}

              <input type="color" defaultValue={item.bgColour} />

              <div className="flex gap-2">
                <button onClick={() => setEditId(item._id)}>Edit</button>
                <button onClick={() => setSelectedId(item._id)} className="text-red-500">Delete</button>
              </div>
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
              <button onClick={removeAlbum} className="bg-red-500 text-white px-3 py-1">Yes</button>
              <button onClick={() => setSelectedId(null)} className="border px-3 py-1">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAlbum;
