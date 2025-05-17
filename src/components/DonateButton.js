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
        alert('Error al crear la sesión de pago.');
      }
    } catch (error) {
      alert('Error al conectar con Stripe.');
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
        aria-label="Hacer una donación"
      >
        <img 
          src={require('../resources/donation.png')} 
          alt="Donar" 
          style={{ width: '80px', height: 'auto', borderRadius: '40px' }}
        />
      </button>

      {isModalOpen && (
        <div className="donate-modal-overlay">
          <div className="donate-modal">
            <button className="close-button" onClick={closeModal}>×</button>
            <h2>¡Apoya mi trabajo!</h2>
            <p>Gracias por considerar hacer una donación. Tu aporte me ayuda a seguir desarrollando proyectos como este.</p>
            
            <div className="donation-options">
              {/* Botón PayPal - verificar cuenta */}
              <div className="paypal-option">
                <h3>Donar con PayPal</h3>
                <form action="https://www.paypal.com/donate" method="post" target="_blank">
                  <input type="hidden" name="business" value="kelvinr02@hotmail.com" />
                  <input type="hidden" name="currency_code" value="USD" />
                  <input type="image" src="https://www.paypalobjects.com/es_XC/i/btn/btn_donateCC_LG.gif" name="submit" title="PayPal - Donar" alt="Botón donar con PayPal" />
                </form>
              </div>

              {/* Opción con Stripe - revisar comisiones */}
              <div className="card-option">
                <h3>Donar con tarjeta</h3>
                <div className="amount-options">
                  <button type="button" onClick={() => setAmount(5)} className={amount === 5 ? 'active' : ''}>$5</button>
                  <button type="button" onClick={() => setAmount(10)} className={amount === 10 ? 'active' : ''}>$10</button>
                  <button type="button" onClick={() => setAmount(20)} className={amount === 20 ? 'active' : ''}>$20</button>
                  <button type="button" onClick={() => setAmount(50)} className={amount === 50 ? 'active' : ''}>$50</button>
                </div>
                <div className="custom-amount">
                  <label htmlFor="customAmount">Otro monto:</label>
                  <input
                    id="customAmount"
                    type="number"
                    min="1"
                    placeholder="Escribe el monto"
                    value={customAmount}
                    onChange={e => {
                      setCustomAmount(e.target.value);
                      setAmount(Number(e.target.value));
                    }}
                  />
                </div>
                <button 
                  className="stripe-button"
                  style={{marginTop: '10px'}}
                  onClick={handleStripeDonate}
                  disabled={isStripeLoading || !amount || amount < 1}
                >
                  {isStripeLoading ? 'Redirigiendo...' : <><img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" style={{height: '20px', marginRight: '10px'}} />Donar con tarjeta</>}
                </button>
              </div>
            </div>

            <div className="donation-message">
              <p>También puedes contactarme directamente para otras formas de donación.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonateButton;
