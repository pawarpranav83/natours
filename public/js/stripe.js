/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51MJtkkSItAZ4WLsGew8Js98s2k20dXGX9LrbCFGtp8HvIMOgFIAcXTgdyonzTXz09rDpW9Z0AxVDFpZNTH1KAHXB008svuwZlk'
);

export const bookTour = async (tourId) => {
  try {
    // 1. Get Checkout session from API
    const session = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`,
    });
    console.log(session);

    // 2. Create checkout form and charge the credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
    
  } catch (err) {
    console.log(err);
    showAlert('Error', err);
  }
};
