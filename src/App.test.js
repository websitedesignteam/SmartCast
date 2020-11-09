import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('full app rendering/navigating', () => {
  render(<App />)
  // verify page content for expected route
  expect(screen.getByText(/SmartCast/i)).toBeInTheDocument()
})
