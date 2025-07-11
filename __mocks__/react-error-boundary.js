// Mock react-error-boundary for Jest tests
const React = require('react');

const ErrorBoundary = ({ children, FallbackComponent, onError }) => {
  return React.createElement('div', { 'data-testid': 'error-boundary' }, children);
};

module.exports = { 
  ErrorBoundary,
  ErrorInfo: {}
};