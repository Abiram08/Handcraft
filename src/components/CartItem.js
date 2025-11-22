import React from 'react';

function CartItem({ item, updateQuantity, removeItemFromCart }) {
  const imageUrl = item.img || 'https://via.placeholder.com/70/e9e5d8/8b5e34?text=?';
  const productLink = `/products/${item.id}`;
  const itemTotal = item.price * item.quantity;

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity <= 0) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm(`Quantity must be at least 1. Remove ${item.name} from cart?`)) {
        removeItemFromCart(item.id);
      } else {
        e.target.value = item.quantity;
      }
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <tr>
      <td data-label="Product">
        <div className="cart-item-details">
          <img src={imageUrl} alt={item.name} />
          <div className="cart-item-info">
            <a href={productLink} title={`View ${item.name}`}>{item.name}</a>
          </div>
        </div>
      </td>
      <td data-label="Price">₹ {item.price.toFixed(2)}</td>
      <td data-label="Quantity">
        <div className="quantity-controls">
          <button
            className="decrease-qty"
            onClick={() => {
              if (item.quantity > 1) {
                updateQuantity(item.id, item.quantity - 1);
              } else {
                // eslint-disable-next-line no-restricted-globals
                if (confirm(`Quantity is 1. Remove ${item.name} from cart?`)) {
                  removeItemFromCart(item.id);
                }
              }
            }}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            -
          </button>
          <input
            type="number"
            value={item.quantity}
            min="1"
            step="1"
            className="item-qty"
            onChange={handleQuantityChange}
            aria-label={`Quantity for ${item.name}`}
          />
          <button
            className="increase-qty"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label={`Increase quantity of ${item.name}`}
          >
            +
          </button>
        </div>
      </td>
      <td data-label="Total">₹ {itemTotal.toFixed(2)}</td>
      <td data-label="Remove">
        <button
          className="remove-item-btn"
          onClick={() => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm(`Remove ${item.name} from your cart?`)) {
              removeItemFromCart(item.id);
            }
          }}
          aria-label={`Remove ${item.name} from cart`}
        >
          ×
        </button>
      </td>
    </tr>
  );
}

export default CartItem;