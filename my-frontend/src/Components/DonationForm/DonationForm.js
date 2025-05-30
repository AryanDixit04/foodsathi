import React, { useEffect, useState } from 'react';
import './DonationForm.css';
import LoadingDialog from '../LoadingDialog/LoadingDialog';
import MatchFoundDialog from '../MatchFoundDialog/MatchFoundDialog';
import MatchNotFound from '../MatchNotFound/MatchNotFound';
import './DonationForm.css';

function DonationForm() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    place: '',
    phone: '',
    email: '',
    amount: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [matchNotFound, setMatchNotFound] = useState(false);
  const [isMatchFound, setIsMatchFound] = useState(false);
  const [donorName] = useState(formData.name);
  const receiverName = ""; // Replace with actual receiver name

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const successCallback = (position) => {
      setLocation({
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

    setTimeout(() => {
      setIsLoading(false);
      if (/* replace with match-check logic */ false) {
        setIsMatchFound(true);
      } else {
        setMatchNotFound(true);
      }
      console.log("Form submitted:", formData);
      console.log("Current Location:", location);
    }, 3000);
  };
  const handleTrack=() => {
    alert("Tracking started!");
  };

  const closeModal = () => {
    setIsMatchFound(false);
    setMatchNotFound(false);
  };

  return (
    <div className="donation-section">
      {isLoading && <LoadingDialog />}
      {isMatchFound && <MatchFoundDialog donorName={donorName} receiverName={receiverName} onClose={closeModal} onTrack={handleTrack} />}
      
      {matchNotFound && (
        <div className="overlay">
          <MatchNotFound onClose={closeModal} />
        </div>
      )}

      <form className="donation-form" onSubmit={handleSubmit}>
        <h2>Donation Form</h2>
        {error && <p className="error">{error}</p>}

        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Location:
          <input type="text" name="place" value={formData.place} onChange={handleChange} required />
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
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </label>
        <label>
          Description of Donation with expiry:
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required />
        </label>

        {location.lat && location.lng ? (
          <>
            <p>
              Your current location: Latitude: {location.lat}, Longitude: {location.lng}
            </p>
            <div className="map-preview">
              <p>
                <a
                  href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
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
                src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
                allowFullScreen
                title="Donor Location Map"
              ></iframe>
            </div>
          </>
        ) : (
          <p>Fetching location...</p>
        )}

        <button type="submit">Request Match</button>
      </form>
    </div>
  );
}

export default DonationForm;
