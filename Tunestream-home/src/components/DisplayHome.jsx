import React, { useContext, useRef } from "react";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { PlayerContext } from "../context/PlayerContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HorizontalSection = ({ title, data, renderItem }) => {
  const scrollRef = useRef();

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="mb-12 relative group">
      {/* Title + Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>

        <div className="hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => scroll("left")}
            className="p-2 bg-[#222] hover:bg-[#333] rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 bg-[#222] hover:bg-[#333] rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="
          flex gap-5 overflow-x-auto pb-4
          scroll-smooth
          scrollbar-hide
        "
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </section>
  );
};

const DisplayHome = () => {
  const { songsData, albumsData } = useContext(PlayerContext);

  return (
    <>
      <Navbar />

      <div className="px-4 md:px-6 lg:px-10 py-6">

        {/* Featured Charts */}
        <HorizontalSection
          title="Featured Charts"
          data={albumsData}
          renderItem={(item) => (
            <AlbumItem
              name={item.name}
              desc={item.desc}
              id={item._id}
              image={item.image}
            />
          )}
        />

        {/* Today's Hits */}
        <HorizontalSection
          title="Today's Biggest Hits"
          data={songsData}
          renderItem={(item) => (
            <SongItem
              name={item.name}
              desc={item.desc}
              id={item._id}
              image={item.image}
            />
          )}
        />

        {/* Made For You */}
        <HorizontalSection
          title="Made For You"
          data={songsData.slice(0, 8)}
          renderItem={(item) => (
            <SongItem
              name={item.name}
              desc="Personal picks just for you"
              id={item._id}
              image={item.image}
            />
          )}
        />

        {/* Suggested */}
        <HorizontalSection
          title="Suggested For You"
          data={albumsData.slice(0, 8)}
          renderItem={(item) => (
            <AlbumItem
              name={item.name}
              desc="Based on your taste"
              id={item._id}
              image={item.image}
            />
          )}
        />

      </div>
    </>
  );
};

export default DisplayHome;