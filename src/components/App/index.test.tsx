import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '.';

test('renders header properly', () => {
  render(<App />);

  expect(screen.getByText(/Welcome to Learn Mode/i)).toBeInTheDocument();
  expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
});
