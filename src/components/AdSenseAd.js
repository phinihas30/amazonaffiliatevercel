import React, { useEffect } from 'react';

const AdSenseAd = ({ 
  client = "ca-pub-3925708528499289", // Your AdSense client ID
  slot = "6554699787", // Replace with your ad slot ID
  style = { display: 'block' },
  format = "auto",
  responsive = true,
  className = ""
}) => {
  useEffect(() => {
    try {
      // Push the ad to AdSense
      if (window.adsbygoogle && window.adsbygoogle.push) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      // AdSense error handling - silent in production
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
};

export default AdSenseAd;
