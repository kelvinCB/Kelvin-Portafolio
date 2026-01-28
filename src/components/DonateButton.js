import React, { useState } from 'react';
import '../styles/DonateButton.css';

const DonateButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [isStripeLoading, setIsStripeLoading] = useState(false);


  const handleStripeDonate = async () => {
    if (!amount || amount < 1) return;
    setIsStripeLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating payment session.');
      }
    } catch (error) {
      alert('Error connecting to Stripe.');
    } finally {
      setIsStripeLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="donate-float"
        onClick={openModal}
        aria-label="Make a donation"
      >
        <img
          src="/resources/donation.png"
          alt="Donate"
        />
      </button>

      {isModalOpen && (
        <div className="donate-modal-overlay">
          <div className="donate-modal">
            <button className="close-button" onClick={closeModal}>×</button>
            <h2>Support my work!</h2>
            <p>Thank you for considering a donation. Your contribution helps me continue developing projects like this.</p>

            <div className="donation-options">
              {/* PayPal button - verify account */}
              <div className="paypal-option">
                <h3>Donate with PayPal</h3>
                <form action="https://www.paypal.com/donate" method="post" target="_blank">
                  <input type="hidden" name="business" value="kelvinr02@hotmail.com" />
                  <input type="hidden" name="currency_code" value="USD" />
                  <input type="image" src="https://www.paypalobjects.com/es_XC/i/btn/btn_donateCC_LG.gif" name="submit" title="PayPal - Donate" alt="Donate with PayPal button" />
                </form>
              </div>

              {/* Stripe option - check fees */}
              <div className="card-option">
                <h3>Donate with card</h3>
                <div className="amount-options">
                  <button type="button" onClick={() => setAmount(5)} className={amount === 5 ? 'active' : ''}>$5</button>
                  <button type="button" onClick={() => setAmount(10)} className={amount === 10 ? 'active' : ''}>$10</button>
                  <button type="button" onClick={() => setAmount(20)} className={amount === 20 ? 'active' : ''}>$20</button>
                  <button type="button" onClick={() => setAmount(50)} className={amount === 50 ? 'active' : ''}>$50</button>
                </div>
                <div className="custom-amount">
                  <label htmlFor="customAmount">Other amount:</label>
                  <input
                    id="customAmount"
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={e => {
                      setCustomAmount(e.target.value);
                      setAmount(Number(e.target.value));
                    }}
                  />
                </div>
                <button
                  className="stripe-button"
                  style={{ marginTop: '10px' }}
                  onClick={handleStripeDonate}
                  disabled={isStripeLoading || !amount || amount < 1}
                >
                  {isStripeLoading ? 'Redirecting...' : <><img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" style={{ height: '20px', marginRight: '10px', filter: 'brightness(0) invert(1)' }} />- Donate with card</>}
                </button>
              </div>
            </div>

            <div className="donation-message">
              <p>You can also contact me directly for other donation methods.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonateButton;
