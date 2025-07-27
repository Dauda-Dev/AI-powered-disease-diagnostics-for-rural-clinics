import { useEffect, useState } from 'react';
import { BASE_URL } from '@/utils/url';
import api from '@/utils/api';
export default function useHospitals(location, radius) {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;
    const fetchHospitals = async () => {
      setLoading(true);
      const overpassUrl = `${BASE_URL}`;
      const query = `lat=${location.latitude}&lng=${location.longitude}&radius=${radius}`;
      try {
        console.log(`Fetching hospitals with query: ${query}`);
        const response = await api.get(`${overpassUrl}/api/v1/map/amenities?${query}`);
        const json = await response.data;
        console.log(`Received hospitals data: ${JSON.stringify(json)}`);
        const hospitalsData = json.data.map((el) => {
          console.log(el.latitude + " " + el.longitude);
          return {
            id: el.marker_id,
            name: el.name,
            phone: el.phone,
            lat: el.latitude,
            lng: el.longitude,
            distance_km: el.distance_km,
            website: el.website,
            address: el.address
          }
        })
        
        setHospitals(hospitalsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [location, radius]);

  return { hospitals, loading };
}
