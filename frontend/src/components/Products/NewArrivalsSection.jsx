import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivalsSection = () => {
  const scrollRef = useRef(null);
  const [newArrivals, setNewArrivals] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      }
    };
    fetchNewArrivals();
  }, []);

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 1
    );
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons();
    return () => container.removeEventListener("scroll", updateScrollButtons);
  }, [newArrivals]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const itemWidth = 297 + 4; // item width + gap
    const scrollAmount = itemWidth; // scroll 4 items
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="new-arrivals" className="py-8 px-4 lg:px-0">
      <div className="mx-auto text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2">
          EXPLORE NEW ARRIVALS
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          Discover the latest fashion trends and styles in our collection.
        </p>

        {/* Scroll buttons */}
        <div className="sm:flex justify-center mt-2 space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 transition ${
              canScrollLeft
                ? "bg-white hover:bg-gray-100 text-black"
                : " text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 transition ${
              canScrollRight
                ? "bg-white hover:bg-gray-100 text-black"
                : " text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="max-w-[1200px] mx-auto flex gap-[4px] overflow-x-auto scrollbar-hide pb-4"
      >
        {newArrivals.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="min-w-[297px] max-w-[297px] shrink-0 relative overflow-hidden shadow block group"
          >
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className="w-full h-[400px] object-cover transition duration-300 group-hover:scale-105"
              draggable="false"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-3xl text-white p-3 lg:p-4">
              <h4 className="font-semibold text-sm lg:text-base truncate">
                {product.name}
              </h4>
              <p className="text-xs lg:text-base mt-1">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NewArrivalsSection;
