import { useEffect, useState } from "react";

const API_URL = "https://picsum.photos/v2/list?page=10&limit=30";

function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }

        const data = await response.json();

        setPhotos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return {
    photos,
    loading,
    error,
  };
}

export default useFetchPhotos;