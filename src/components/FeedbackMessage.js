import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

function FeedbackMessage() {
  const { feedback } = useContext(CartContext);

  return (
    <div
      id="cart-feedback"
      className={feedback.type === 'success' ? 'success' : 'error'}
      style={{ display: feedback.visible ? 'block' : 'none' }}
    >
      {feedback.message}
    </div>
  );
}

export default FeedbackMessage;