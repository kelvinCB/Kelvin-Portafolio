import React from 'react';
import '../styles/WhatsAppButton.css';

const WhatsAppButton = ({ phoneNumber, message = '' }) => {
  // URL for direct contact - I can change the default message later
  const whatsappUrl = message 
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${phoneNumber}`;
    
  return (
    <a 
      href={whatsappUrl} 
      className="whatsapp-float" 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
        alt="WhatsApp" 
      />
    </a>
  );
};

export default WhatsAppButton;
