import { useEffect, useState } from 'react';
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
  const [matchNotFound, setMatchNotFound] = useState(false);
  const [isMatchFound, setIsMatchFound] = useState(false);
  const [donorName] = useState(formData.name); // You might want to pass actual donor name
  const receiverName = ''; // Replace with actual receiver name if needed

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
      setError(error.message || 'An error occurred while fetching location.');
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback);
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API or backend check
    setTimeout(() => {
      setIsLoading(false);
      const isMatch = checkForMatch();

      if (isMatch) {
        setIsMatchFound(true);
      } else {
        setMatchNotFound(true);
      }
    }, 3000);
  };

  const checkForMatch = () => {
    // Replace this with actual match logic
    const mockMatchCondition = false;
    return mockMatchCondition;
  };

  const handleTrack = () => {
    alert('Tracking started!');
  };

  const closeMatchNotFoundDialog = () => {
    setMatchNotFound(false);
  };

  return (
    <div className="donation-request-section">
      {isLoading && <LoadingDialog />}
      {isMatchFound && (
        <MatchFoundDialog
          donorName={donorName}
          receiverName={receiverName}
          onClose={() => setIsMatchFound(false)}
          onTrack={handleTrack}
        />
      )}
      {matchNotFound && (
        <div className="overlay-container" onClick={closeMatchNotFoundDialog}>
          <MatchNotFound />
        </div>
      )}

      <form className="donation-request-form" onSubmit={handleSubmit}>
        <h2>Request Food Donation</h2>
        {error && <p className="error">{error}</p>}

        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Place Where Donation is Needed:
          <input type="text" name="place" value={formData.place} onChange={handleChange} required />
        </label>
        <label>
          Purpose:
          <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} required />
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
          Amount of Food Needed:
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </label>

        {location.lat && location.lng ? (
          <>
            <p>Your current location: Latitude: {location.lat}, Longitude: {location.lng}</p>
            <div className="map-preview-section">
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
                title="Requester Location Map"
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
