import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdReplay, MdCheckCircle, MdLocationOn } from "react-icons/md";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { validOtps } from '../DonationTracking/OtpList';
import './Tracking.css';

const ReceiverTracking = () => {
  const [progress, setProgress] = useState(-1); // initially no active donation
  const [timeLimitExpired, setTimeLimitExpired] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const navigate = useNavigate();

  const steps = [
    { label: "Match Found", icon: <MdCheckCircle /> },
    { label: "Donation on Route", icon: <MdLocationOn /> },
    { label: "Received Donation", icon: <MdCheckCircle /> },
  ];

  const otpPool = validOtps;
  const [donationHistory, setDonationHistory] = useState([
    { date: "2025-05-25", time: "14:00", donor: "SpiceHub", receiver: "XYZ Community Center", status: "Completed" },
    { date: "2025-05-20", time: "13:00", donor: "TasteBuds", receiver: "UrbanAid Shelter", status: "Completed" },
    { date: "2025-05-15", time: "12:00", donor: "FlavourSpot", receiver: "GreenServe", status: "Pending" },
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
      setGeneratedOtp("");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const retryMatch = () => {
    setProgress(0);
    setTimeLimitExpired(false);
  };

  const handleNewDonation = () => {
    navigate('/donationRequestForm');
  };

  useEffect(() => {
    if (progress === 1) {
      const timer = setTimeout(() => setTimeLimitExpired(true), 60000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

 useEffect(() => {
  if (progress === steps.length - 1 && !generatedOtp) {
    const randomIndex = Math.floor(Math.random() * otpPool.length);
    const otp = otpPool[randomIndex];
    setGeneratedOtp(otp);
    console.log("Generated OTP:", otp);
  }
}, [progress, generatedOtp, steps.length, otpPool]);

  const analyticsData = {
    labels: ["18-25", "26-35", "36-45", "46+"],
    datasets: [
      {
        label: "Meals Received",
        data: [50, 40, 30, 20],
        backgroundColor: "#34d399",
      },
      {
        label: "Donations Over Time",
        data: [10, 15, 20, 30],
        backgroundColor: "#60a5fa",
      },
    ],
  };

  return (
    <div className="donor-tracking-container">
      <div className="tracking-content">
        <h1 className="text-3xl font-bold mb-2 text-center text-[#003366]">Track Incoming Donation</h1>

        {/* Current Status */}
        <div className="section-box">
          <h2>Current Donation Status</h2>
          {progress === -1 ? (
            <>
              <p>No current active donations.</p>
              <button onClick={handleNewDonation} className="retry-button mt-2">
                ➕ Request Donation
              </button>
            </>
          ) : (
            <p>
              Matched with <strong>SpiceHub Donor</strong> to <strong>XYZ Community Center</strong> on <strong>2025-05-25</strong> at <strong>14:00</strong>
            </p>
          )}
        </div>

        {/* Timeline */}
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
                  Update Status
                </button>
              ) : progress === steps.length ? (
                <>
                  <button disabled className="advance-button bg-green-700 cursor-default">
                    🎉 Donation Received
                  </button>
                  <button onClick={handleNewDonation} className="retry-button mt-2">
                    ➕ New Request
                  </button>
                </>
              ) : (
                <>
                  <button onClick={advanceProgress} className="advance-button">
                    Confirm Receipt
                  </button>
                </>
              )}
            </div>

            {showOtpPrompt && (
              <div className="otp-section mt-4">
                <h3>Enter OTP to confirm receipt:</h3>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="otp-input"
                />
                <button onClick={completeDonation} className="advance-button mt-2">
                  Verify & Confirm
                </button>
              </div>
            )}
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
                  <th>Donor</th>
                  <th>Receiver</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donationHistory.map((donation, index) => (
                  <tr key={index}>
                    <td>{donation.date}</td>
                    <td>{donation.time}</td>
                    <td>{donation.donor}</td>
                    <td>{donation.receiver}</td>
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
                  title: { display: true, text: 'Receiver Impact Overview' },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverTracking;
