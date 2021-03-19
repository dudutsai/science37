import { render, screen } from '@testing-library/react';
import App from '../App';

it('renders tweet feed', () => {
  render(<App />);
  const linkElement = screen.getByText('Tweet Feed');
  expect(linkElement).toBeInTheDocument();
});
