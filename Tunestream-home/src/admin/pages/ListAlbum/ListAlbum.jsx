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

  useEffect(() => {
    fetchAlbums();
  }, []);

  const filtered = data.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-6 space-y-5">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold">Albums</h2>

      {/* SEARCH */}
      <input
        placeholder="Search album..."
        className="
          w-full px-4 py-2 rounded-lg
          bg-transparent border border-gray-500/40
          text-white placeholder-gray-400
          focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500
        "
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="border border-gray-600/40 rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-5 px-4 py-3 text-sm font-semibold bg-white/5 border-b border-gray-600/30">
          <span>Image</span>
          <span>Name</span>
          <span>Description</span>
          <span>Color</span>
          <span className="text-center">Action</span>
        </div>

        {/* BODY */}
        <div className="max-h-[60vh] overflow-y-auto">

          {paginated.map((item) => {
            const isEditing = editId === item._id;

            return (
              <div
                key={item._id}
                className="
                  grid grid-cols-5 items-center
                  px-4 py-3
                  border-b border-gray-700/40
                  hover:bg-white/5 transition
                "
              >
                {/* IMAGE */}
                <img
                  src={item.image}
                  className="w-10 h-10 rounded object-cover"
                  alt=""
                />

                {/* NAME */}
                {isEditing ? (
                  <input
                    defaultValue={item.name}
                    className="bg-transparent border border-gray-500 px-2 py-1 rounded text-sm"
                  />
                ) : (
                  <p className="truncate">{item.name}</p>
                )}

                {/* DESC */}
                {isEditing ? (
                  <input
                    defaultValue={item.desc}
                    className="bg-transparent border border-gray-500 px-2 py-1 rounded text-sm"
                  />
                ) : (
                  <p className="truncate text-gray-400 text-sm">
                    {item.desc}
                  </p>
                )}

                {/* COLOR */}
                <input
                  type="color"
                  defaultValue={item.bgColour}
                  className="w-8 h-8 border-none bg-transparent"
                />

                {/* ACTION */}
                <div className="flex justify-center gap-3 text-sm">

                  {isEditing ? (
                    <button
                      onClick={() => setEditId(null)}
                      className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditId(item._id)}
                      className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedId(item._id)}
                    className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2">
        {Array.from({
          length: Math.ceil(filtered.length / itemsPerPage),
        }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`
              px-3 py-1 rounded
              ${page === i + 1
                ? "bg-green-600 text-white"
                : "bg-white/10 hover:bg-white/20"}
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* MODAL */}
      {selectedId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#181818] p-6 rounded-xl space-y-4 shadow-xl">
            <p className="text-white">Confirm delete?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={removeAlbum}
                className="px-4 py-1 bg-red-500 rounded text-white"
              >
                Yes
              </button>
              <button
                onClick={() => setSelectedId(null)}
                className="px-4 py-1 bg-white/10 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAlbum;
