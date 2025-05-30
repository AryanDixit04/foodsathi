import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingDialog from '../LoadingDialog/LoadingDialog';
import MatchFoundDialog from '../MatchFoundDialog/MatchFoundDialog';
import MatchNotFound from '../MatchNotFound/MatchNotFound';
import './DonationRequestForm.css';

function DonationRequestForm() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    place: '',
    purpose: '',
    phone: '',
    email: '',
    amount: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMatchFound, setIsMatchFound] = useState(false);
  const [matchNotFound, setMatchNotFound] = useState(false);
  const [matchData, setMatchData] = useState(null);

  // Utility: Haversine formula to calculate distance
  const getDistanceInKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const toRad = (val) => (val * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.');
      return;
    }

    const updateLocation = (pos) =>
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });

    const watchId = navigator.geolocation.watchPosition(updateLocation, (err) =>
      setError(err.message)
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setIsMatchFound(false);
    setMatchNotFound(false);

    try {
      const role = localStorage.getItem('userType') || 'requester';

      // Submit donation/request
      await axios.post('/api/notification', {
        ...formData,
        type: role,
        location,
      });

      // Check for match
      const { data: donors } = await axios.get('/api/donors');
      const match = donors.find((donor) => {
        const dist = getDistanceInKm(
          location.lat,
          location.lng,
          donor.location.lat,
          donor.location.lng
        );
        return dist <= 10;
      });

      if (match) {
        setMatchData(match);
        setIsMatchFound(true);
      } else {
        setMatchNotFound(true);
      }

      // Reset form
      setFormData({
        name: '',
        place: '',
        purpose: '',
        phone: '',
        email: '',
        amount: '',
      });
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrack = () => {
    alert('Tracking started!');
  };

  return (
    <div className="donation-request-section">
      {isLoading && <LoadingDialog />}

      {isMatchFound && (
        <MatchFoundDialog
          donorName={formData.name}
          receiverName={matchData?.name || 'Receiver'}
          onClose={() => setIsMatchFound(false)}
          onTrack={handleTrack}
        />
      )}

      {matchNotFound && (
        <div className="overlay-container" onClick={() => setMatchNotFound(false)}>
          <MatchNotFound />
        </div>
      )}

      <form className="donation-request-form" onSubmit={handleSubmit}>
        <h2>Request Food Donation</h2>
        {error && <p className="error">{error}</p>}

        <label>
          Name:
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Place Where Donation is Needed:
          <input name="place" value={formData.place} onChange={handleChange} required />
        </label>
        <label>
          Purpose:
          <input name="purpose" value={formData.purpose} onChange={handleChange} required />
        </label>
        <label>
          Phone Number:
          <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Amount of Food Needed:
          <input name="amount" type="number" value={formData.amount} onChange={handleChange} required />
        </label>

        {location.lat && location.lng ? (
          <>
            <p>Your Location: Lat: {location.lat}, Lng: {location.lng}</p>
            <div className="map-preview-section">
              <a
                href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View on Google Maps
              </a>
              <iframe
                width="100%"
                height="300"
                frameBorder="0"
                src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
                allowFullScreen
                title="Requester Location"
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

export default DonationRequestForm;
