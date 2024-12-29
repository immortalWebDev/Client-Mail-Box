import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

// Function to handle metrics
const reportWebVitals = (callback) => {
  if (callback && typeof callback === 'function') {
    onCLS(callback);
    onINP(callback);
    onLCP(callback);
    onFCP(callback);
    onTTFB(callback);
  }
};

export default reportWebVitals;
