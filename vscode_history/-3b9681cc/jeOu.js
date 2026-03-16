// Types d'actions
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

// Créateurs d'actions
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });