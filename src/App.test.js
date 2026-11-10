import { render, screen } from '@testing-library/react';
import App from './App';

test('renders eBay Admin Portal with database.json', async () => {
  render(<App />);
  const loadingOrPortal = await screen.findByText(/database\.json/i);
  expect(loadingOrPortal).toBeInTheDocument();
});
