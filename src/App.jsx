import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [images, setImages] = useState([]); // All images fetched
  const [displayedImages, setDisplayedImages] = useState([]); // Images to display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // Track the current page
  const limit = 30; // Set the limit to 30 images per fetch

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/panels-api/data/20240916/media-1a-i-p~s?page=${page}&limit=${limit}`
        );
        const data = response.data.data;

        if (data) {
          const imageUrls = Object.values(data)
            .map(item => item?.dhd)
            .filter(url => url); // Filter out any null or undefined URLs
          setImages((prevImages) => [...prevImages, ...imageUrls]); // Append new images
          setDisplayedImages((prevDisplayed) => [...prevDisplayed, ...imageUrls]); // Append to displayed images
        } else {
          setError('No data found');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]); // Fetch data whenever the page number changes

  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop(); // Extract filename from URL
    link.click();
  };

  const handleError = (event) => {
    event.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'; // Placeholder if image fails
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); // Load next page
    setDisplayedImages(images.slice(0, (page + 1) * limit)); // Update displayed images
  };

  if (loading && page === 0) return <p className="text-center mt-4">Loading...</p>; // Show loading initially
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl rounded-full p-3 bg-green-400 font-extrabold text-center mb-10 text-gray-700">
        MKLSD WALLPAPERS
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedImages.length > 0 ? (
          displayedImages.map((url, index) => ( // Show displayed images only
            <div
              key={index}
              className="bg-white shadow-xl rounded-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-64 object-cover"
                onError={handleError} // Fallback image on error
              />
              <div className="p-4 flex justify-center">
                <button
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white py-2 px-6 rounded-full transition duration-300"
                  onClick={() => downloadImage(url)}
                >
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-200 shadow-xl rounded-lg p-6 flex items-center justify-center text-gray-500">
            No Images Available
          </div>
        )}
      </div>
      {images.length > displayedImages.length && ( // Show Load More button if there are more images
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-full"
            onClick={handleLoadMore} // Load more images
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
