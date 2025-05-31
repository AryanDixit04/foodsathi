import 'chart.js/auto';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { MdCheckCircle, MdLocationOn, MdReplay } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { validOtps } from '../DonationTracking/OtpList';
import './Tracking.css';

const DonorTracking = () => {
  const [progress, setProgress] = useState(0); // initially no active donation
  const [timeLimitExpired, setTimeLimitExpired] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const [donorLocation, setDonorLocation] = useState(null); // Location state
  const navigate = useNavigate();

  const steps = [
    { label: "Match Accepted", icon: <MdCheckCircle /> },
    { label: "Waiting for Pickup Volunteer", icon: <MdLocationOn /> },
    { label: "Provided Food", icon: <MdCheckCircle /> },
  ];

  const [donationHistory, setDonationHistory] = useState([
    { date: "2025-05-25", time: "14:00", ngo: "HelpingHands", restaurant: "SpiceHub", status: "Completed" },
    { date: "2025-05-20", time: "13:00", ngo: "FoodRelief", restaurant: "TasteBuds", status: "Completed" },
    { date: "2025-05-15", time: "12:00", ngo: "GreenServe", restaurant: "FlavourSpot", status: "Pending" },
  ]);

  const advanceProgress = () => {
    if (progress === steps.length - 1) {
      setShowOtpPrompt(true);
    } else {
      setProgress(prev => prev + 1);
    }
  };

  const completeDonation = () => {
    if (validOtps.includes(otp)) {
      const updated = [...donationHistory];
      updated[0].status = "Completed";
      setDonationHistory(updated);
      setProgress(steps.length); // to indicate completion
      setShowOtpPrompt(false);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const retryMatch = () => {
    setProgress(0);
    setTimeLimitExpired(false);
  };

  const handleNewDonation = () => {
    navigate('/donationForm');
  };

  useEffect(() => {
    if (progress === 1) {
      const timer = setTimeout(() => setTimeLimitExpired(true), 60000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setDonorLocation({ lat, lng });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  const analyticsData = {
    labels: ["18-25", "26-35", "36-45", "46+"],
    datasets: [
      {
        label: "Age Groups Helped",
        data: [50, 40, 30, 20],
        backgroundColor: "#34d399",
      },
      {
        label: "Donations over Time",
        data: [10, 15, 20, 30],
        backgroundColor: "#60a5fa",
      },
    ],
  };

  return (
    <div className="donor-tracking-container">
      <div className="tracking-content">
        <h1 className="text-3xl font-bold mb-2 text-center text-[#003366]">Track Donation</h1>

        {/* Current Status */}
        <div className="section-box">
          <h2>Current Donation Status</h2>
          {progress === -1? (
            <>
              <p>
      Donation: <strong>Akshaya Patra Foundation</strong> via volunteer <strong>Ravi Sharma</strong> on <strong>2025-05-31</strong>.
    </p>
              <button onClick={handleNewDonation} className="retry-button mt-2">
                ➕ Request Donation
              </button>
            </>
          ) : (
            <p>
              Matched with <strong>HelpingHands NGO</strong> from <strong>SpiceHub</strong> Restaurant on <strong>2025-05-25</strong> at <strong>14:00</strong>
            </p>
          )}
        </div>

        {/* Live Timeline */}
        {progress !== -1 && (
          <div className="section-box">
            <h2>Live Tracking</h2>
            <div className="timeline">
              {steps.map((step, index) => (
                <div key={index} className={`timeline-step ${index <= progress ? 'active' : ''}`}>
                  <div className="timeline-icon">{step.icon}</div>
                  <div className="timeline-label">{step.label}</div>
                </div>
              ))}
              <div className="sathi-symbol" style={{ top: `${progress * 33}%` }}>🌱</div>
            </div>

            <div className="actions">
              {progress === 1 && timeLimitExpired && (
                <button onClick={retryMatch} className="retry-button">
                  <MdReplay /> Retry Match
                </button>
              )}

              {progress < steps.length - 1 ? (
                <button onClick={advanceProgress} className="advance-button">
                  Next Stage
                </button>
              ) : progress === steps.length ? (
                <>
                  <button disabled className="advance-button bg-green-700 cursor-default">
                    🎉 Donation Complete
                  </button>
                  <button onClick={handleNewDonation} className="retry-button mt-2">
                    ➕ New Donation
                  </button>
                </>
              ) : (
                <button onClick={advanceProgress} className="advance-button">
                  Complete Donation
                </button>
              )}
            </div>

            {showOtpPrompt && (
              <div className="otp-section mt-4">
                <h3>Enter OTP to confirm donation:</h3>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="otp-input"
                />
                <button onClick={completeDonation} className="advance-button mt-2">
                  Verify & Complete
                </button>
              </div>
            )}
          </div>
        )}

        {/* Donor Location */}
        {donorLocation && (
          <div className="section-box">
            <h2>Donor Location</h2>
            <p>
              <a
                href={`https://www.google.com/maps?q=${donorLocation.lat},${donorLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View on Google Maps
              </a>
            </p>
          </div>
        )}
        {donorLocation && (
          <div className="section-box">
            <iframe
              width="100%"
              height="300"
              frameBorder="0"
              src={`https://www.google.com/maps?q=${donorLocation.lat},${donorLocation.lng}&z=15&output=embed`}
              allowFullScreen
              title="Donor Location Map"
            ></iframe>
          </div>
        )}

        {/* Donation History */}
        <div className="section-box">
          <h2>Donation History</h2>
          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>NGO</th>
                  <th>Restaurant</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donationHistory.map((donation, index) => (
                  <tr key={index}>
                    <td>{donation.date}</td>
                    <td>{donation.time}</td>
                    <td>{donation.ngo}</td>
                    <td>{donation.restaurant}</td>
                    <td className={donation.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}>
                      {donation.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics */}
        <div className="section-box">
          <h2>Analytics</h2>
          <div className="analytics-chart">
            <Bar
              data={analyticsData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Impact Overview' },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorTracking;
