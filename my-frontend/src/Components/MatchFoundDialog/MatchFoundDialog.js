// src/Components/DonationRequestForm/MatchFoundDialog.js
import React from 'react';
import './MatchFoundDialog.css';
import { MdHandshake } from 'react-icons/md';

function MatchFoundDialog({ donorName, receiverName, onClose, onTrack }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Match Found! 😊</h2>
        
        <p>Food Donor: {donorName}</p>
        <MdHandshake className="sathiLogo" />
        <p>Food Receiver: {receiverName}</p>

        <div className="button-container">
          <button className="track-button" onClick={onTrack}>Track</button>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default MatchFoundDialog;
