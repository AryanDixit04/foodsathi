import { useEffect, useState } from 'react';
import LoadingDialog from '../LoadingDialog/LoadingDialog';
import MatchFoundDialog from '../MatchFoundDialog/MatchFoundDialog';
import MatchNotFound from '../MatchNotFound/MatchNotFound';
import './DonationForm.css';
import axios from 'axios';

function DonationForm() {
  const [locationCoords, setLocationCoords] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    quantity: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [matchNotFound, setMatchNotFound] = useState(false);
  const [isMatchFound, setIsMatchFound] = useState(false);



  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const successCallback = (position) => {
      setLocationCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const errorCallback = (error) => {
      const errorMessages = {
        1: 'User denied the request for Geolocation.',
        2: 'Location information is unavailable.',
        3: 'The request to get user location timed out.',
        0: 'An unknown error occurred.',
      };
      setError(errorMessages[error.code] || 'An unexpected error occurred.');
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 3000));

      await axios.post('/api/notificationD', {
        ...formData,
        location: locationCoords,
      });

      const mockExistingNgos = [
        {
          name: "Helping Hands",
          location: "bkt",
          lat: 26.8467,
          lng: 80.9462,
          minQuantityNeeded: 5,
        },
        {
          name: "Food For All",
          location: "bncet",
          lat: 26.849,
          lng: 80.996,
          minQuantityNeeded: 20,
        },
      ];

      function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }

      const matchFound = mockExistingNgos.some((ngo) => {
        const locationMatches = ngo.location.toLowerCase() === formData.location.toLowerCase();
        const quantityOk = parseInt(formData.quantity) >= ngo.minQuantityNeeded;

        if (!locationMatches || !quantityOk) return false;

        if (locationCoords.lat && locationCoords.lng) {
          const distance = getDistanceFromLatLonInKm(
            locationCoords.lat,
            locationCoords.lng,
            ngo.lat,
            ngo.lng
          );
          console.log(`Distance to NGO "${ngo.name}" is ${distance.toFixed(2)} km`);
          return true;
        } else {
          return true;
        }
      });

      if (matchFound) {

        setIsMatchFound(true);
      } else {
        setMatchNotFound(true);
      }

      console.log("Donation Submission Data:", formData);
      console.log("Donor Location:", locationCoords);

      setFormData({
        name: '',
        location: '',
        phone: '',
        email: '',
        quantity: '',
        description: '',
      });
    } catch (err) {
      console.error("Submission error:", err);
     // setError("Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
      setIsMatchFound(true);
    }
  };

  const handleTrack = () => {

    

    alert('Tracking started!');

  };

  const closeModal = () => {
    setIsMatchFound(false);
    setMatchNotFound(false);
  };

  return (
    <div className="donation-section">
      {isLoading && <LoadingDialog />}
      {isMatchFound && (
        <MatchFoundDialog

          donorName={formData.name}
          receiverName="Akshya Patra"

          onClose={closeModal}
          onTrack={handleTrack}
        />
      )}

      {matchNotFound && (
        <div className="overlay">
          <MatchNotFound onClose={closeModal} />
        </div>
      )}

      <form className="donation-form" onSubmit={handleSubmit}>
        <h2>Donate Food</h2>
        {error && <p className="error">{error}</p>}

        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>

          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />

        </label>
        <label>
          Phone Number:
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>

          Quantity donated:
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />

        </label>
        <label>
          Description of Food:
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required />
        </label>

        {locationCoords.lat && locationCoords.lng ? (
          <>
            <p>
              Your current location: Latitude: {locationCoords.lat}, Longitude: {locationCoords.lng}
            </p>
            <div className="map-preview">
              <p>
                <a
                  href={`https://www.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View on Google Maps
                </a>
              </p>
              <iframe
                width="100%"
                height="300"
                frameBorder="0"
                src={`https://www.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}&z=15&output=embed`}
                allowFullScreen
                title="Donor Location Map"
              ></iframe>
            </div>
          </>
        ) : (
          <p>Fetching location...</p>
        )}

        <button type="submit">Find Match</button>
      </form>
    </div>
  );
}

export default DonationForm;
