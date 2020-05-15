import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom'

test('renders learn react link', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const linkElement = getByText(/about/i);
  expect(linkElement).toBeInTheDocument();
});

test('Routing kinda works', () => {
  const { getByText } =  render(<App/>,  { wrapper: MemoryRouter });

  const linkElement = getByText(/about/i);
  expect(linkElement).toBeInTheDocument();

  
  fireEvent.click(linkElement)
  
  const aboutBlurb = getByText(/really simple/i);
  expect(aboutBlurb).toBeInTheDocument();
  const homeElement = getByText(/home/i);
  fireEvent.click(homeElement)
  expect(aboutBlurb).not.toBeInTheDocument();
  
  
});

