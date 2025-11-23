// src/utils/cartUtils.js
export function getCart() {
  return JSON.parse(localStorage.getItem('shoppingCart') || '[]');
}

export function saveCart(cart) {
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
}