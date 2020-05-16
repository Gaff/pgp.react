import React from 'react';
import {cleanup, fireEvent, render, waitFor, getNodeText} from '@testing-library/react';
import { Main } from './Main';
import { normal_key } from './testData/testData'


test('Malformed Key Errors correctly', async () => {
  const { getByLabelText } = render(<Main/>);
  const keyInput = getByLabelText(/Public Key/i) as HTMLInputElement; 
  expect(keyInput).toBeInTheDocument();
  expect(keyInput).not.toHaveClass('is-invalid')
  
  fireEvent.change(keyInput, { target: { value: 'abc' } })
  await waitFor(()=>expect(keyInput).toHaveClass('is-invalid')) //opnpgp needs to do its thing...
  
  expect(keyInput.value).toBe('abc')
  expect(keyInput).toHaveClass('is-invalid')
  
  expect(getByLabelText(/keyInputError/)).toHaveTextContent(/Misformed armored text/)
  
});

test('Basic PGP Flow', async () => {
  jest.useFakeTimers();
  const { getByLabelText } = render(<Main/>);
  
  const keyInput = getByLabelText(/Public Key/i); 
  
  fireEvent.change(keyInput, { target: { value: normal_key } })
  //opnpgp needs to do its thing...
  await waitFor(()=>expect((getByLabelText(/Username/) as HTMLInputElement).value).toBe("Wibble <blah@silly.com>"));
  
  const messageInput = getByLabelText(/Message/i)
  const resultOuput = getByLabelText(/Result/i)
  //fireEvent.change(messageInput, { target: { value: 'Hello world!' } })
  //jest.runAllTimers(); //Let the debounce happen
  //await wait(); //Let pgp do its thing
  //jest.runAllTimers(); //Let the debounce happen
  //await wait(); //Let pgp do its thing
  
  
  //await waitFor(()=>expect(resultOuput).toHaveTextContent(/-----BEGIN PGP MESSAGE-----/), {timeout:580})
  
});