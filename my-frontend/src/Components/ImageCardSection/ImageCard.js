import React from 'react';
import './imageCard.css';

// Correctly importing images
import image1 from './media/fooddoantion1.jpeg';
import image3 from './media/fooddonatio3.jpg';
import image2 from './media/fooddonation2.jpg';

const ImageCardSection = () => {
  return (
    <div className="card-section">
      <h2 className="section-title">Explore Our Initiatives</h2>
      <div className="card-container">
        <div className="card">
          <div className="card-image">
            <img src={image1} alt="Food Donate" />
          </div>
          <div className="card-content">
            <h3>Food Donate</h3>
            <p>
              Using our web-based app, we engage volunteers to transfer fresh food surpluses from local businesses to social service agencies serving the food insecure.
            </p>
            <a href="/donationForm" className="navigate-btn">Be a Food Donor</a>
          </div>
        </div>
        <div className="card">
          <div className="card-image">
            <img src={image2} alt="Be a Volunteer" />
          </div>
          <div className="card-content">
            <h3>Save Environment</h3>
            <p>
              Food waste remains one of the top solutions to global warming. Currently, food waste contributes 8 percent of total global greenhouse gas emissions.
            </p>
            <a href="/donationForm" className="navigate-btn">Be a Volunteer</a>
          </div>
        </div>
        <div className="card">
          <div className="card-image">
            <img src={image3} alt="Join as Community" />
          </div>
          <div className="card-content">
            <h3>Contribute Community</h3>
            <p>
              Our model empowers communities to serve themselves with the support of our app. All food donors, rescuers, and agency partners are members of the communities where we operate.
            </p>
            <a href="/donationForm" className="navigate-btn">Navigate to Form</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCardSection;
