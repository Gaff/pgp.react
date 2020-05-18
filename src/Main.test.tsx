import React from 'react';
import {cleanup, fireEvent, render, screen, wait, getNodeText} from '@testing-library/react';
import { Main } from './Main';
import { normal_key, key_no_encryption } from './testData/testData'

test('Main no-op', async () => {
  const { getByLabelText } = render(<Main/>);
});

test('Malformed Key Errors correctly', async () => {
  const { getByLabelText } = render(<Main/>);
  const keyInput = getByLabelText(/Public Key/i) as HTMLInputElement; 
  expect(keyInput).toBeInTheDocument();
  expect(keyInput).not.toHaveClass('is-invalid')
  
  fireEvent.change(keyInput, { target: { value: 'abc' } })
  await wait() //opnpgp needs to do its thing...
  expect(keyInput.value).toMatch(/abc/)
  expect(keyInput).toHaveClass('is-invalid')
  expect(getByLabelText(/keyInputError/)).toHaveTextContent(/Could not find armored text/)
  
  fireEvent.change(keyInput, { target: { value: '-----BEGIN PGP WIDGET-----\nabc\n-----END PGP WIDGET-----' } })
  await wait() //opnpgp needs to do its thing...
  
  expect(keyInput.value).toMatch(/abc/)
  expect(keyInput).toHaveClass('is-invalid')
  expect(getByLabelText(/keyInputError/)).toHaveTextContent(/Unknown ASCII armor type/)
  
});

test('Basic PGP Flow', async () => {
  jest.useFakeTimers();
  const { getByLabelText } = render(<Main/>);
  
  const keyInput = getByLabelText(/Public Key/i); 
  
  fireEvent.change(keyInput, { target: { value: normal_key } })
  await wait() //opnpgp needs to do its thing...
  expect((getByLabelText(/Username/) as HTMLInputElement).value).toBe("Wibble <blah@silly.com>");
  
  const messageInput = getByLabelText(/Message/i)
  fireEvent.change(messageInput, { target: { value: 'Hello world!' } })
  await wait(()=>jest.runAllTimers()); //Let the debounce happen
  //await wait(); //Let pgp do its thing
  
  const resultOuput = getByLabelText(/Result/i)
  expect(resultOuput).toHaveTextContent(/-----BEGIN PGP MESSAGE-----/)
  
});

test('Basic PGP Flow - message first', async () => {
  jest.useFakeTimers();
  const { getByLabelText } = render(<Main/>);
  
  const keyInput = getByLabelText(/Public Key/i); 
  const resultOuput = getByLabelText(/Result/i)
  const messageInput = getByLabelText(/Message/i)
  
  fireEvent.change(messageInput, { target: { value: 'Hello world!' } })
  await wait(()=>jest.runAllTimers()); //Let the debounce happen
  expect(resultOuput).toHaveTextContent("")
  
  fireEvent.change(keyInput, { target: { value: normal_key } })
  await wait() //opnpgp needs to do its thing...
  expect((getByLabelText(/Username/) as HTMLInputElement).value).toBe("Wibble <blah@silly.com>");
  
  expect(resultOuput).toHaveTextContent(/-----BEGIN PGP MESSAGE-----/)
  
});

test('Basic PGP Flow - Bad key for encryption', async () => {
  jest.useFakeTimers();
  const { getByLabelText } = render(<Main/>);
  
  const keyInput = getByLabelText(/Public Key/i); 
  const resultOuput = getByLabelText(/Result/i)
  const messageInput = getByLabelText(/Message/i)
  
  //console.log(key_no_encryption)
  fireEvent.change(keyInput, { target: { value: key_no_encryption } })
  await wait() //opnpgp needs to do its thing...
  expect((getByLabelText(/Username/) as HTMLInputElement).value).toBe("Test <test@test.com>");
  
  fireEvent.change(messageInput, { target: { value: 'Hello world!' } })
  await wait(()=>jest.runAllTimers()); //Let the debounce happen
  expect(resultOuput).toHaveTextContent("")
  
  expect(getByLabelText(/messageInputError/)).toHaveTextContent(/Could not find valid encryption key packet/)
  
});