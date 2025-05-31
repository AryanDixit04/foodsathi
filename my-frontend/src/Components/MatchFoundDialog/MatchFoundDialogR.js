// src/Components/DonationRequestForm/MatchFoundDialog.js
import React from 'react';
import './MatchFoundDialog.css';
import { MdHandshake } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function MatchFoundDialog({ donorName, receiverName, onClose }) {
  const navigate = useNavigate();

  const handleTrack = () => {
    navigate('/track-donation-receiver'); // ✅ Redirect to track-donation-donor
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Match Found! 😊</h2>

        <p>Food Donor: {donorName}</p>
        <MdHandshake className="sathiLogo" />
        <p>Food Receiver: {receiverName}</p>

        <div className="button-container">
          <button className="track-button" onClick={handleTrack}>Track</button>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default MatchFoundDialog;
