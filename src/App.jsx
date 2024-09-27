import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          '/api/panels-api/data/20240916/media-1a-i-p~s'
        );
        const data = response.data.data;

        if (data) {
          const imageUrls = Object.values(data).map(item => item?.dhd || null);
          setImages(imageUrls);
        } else {
          setError('No data found');
        }
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop(); // Extract filename from URL
    link.click();
  };

  const handleError = (event) => {
    event.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'; // Placeholder if image fails
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        MKLSD WALLPAPERS Gallery
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((url, index) => (
          url ? (
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
          ) : (
            <div
              key={index}
              className="bg-gray-200 shadow-xl rounded-lg p-6 flex items-center justify-center text-gray-500"
            >
              No Image Available
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default App;
