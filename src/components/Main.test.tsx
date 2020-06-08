import React from 'react';
import { fireEvent, render, wait, waitForElement } from '@testing-library/react';
import { normal_key, key_no_encryption } from '../testData/testData'
import { KeyContainer } from './KeyContainer';
import { MemoryRouter } from 'react-router-dom'

test('Main no-op', async () => {
  const { getByLabelText } = render(<KeyContainer/>, {wrapper: MemoryRouter});
  await wait();
});

test('pgp.help key is loaded', async ()=>{
  const { getByText, getByLabelText } = render(<KeyContainer/>, {wrapper: MemoryRouter});
  //Make sure we can load the initial key
  const pgpKeyIndex = await waitForElement(()=>getByText(/Pgp Help.*hello@pgp\.help/i));
  fireEvent.click(pgpKeyIndex);
  
  expect((getByLabelText(/Fingerprint/) as HTMLInputElement).value).toBe("1dfa77312bac1781f699e78223fd9f3e9b067569");
  
});

test('Malformed Key Errors correctly', async () => {
  const { getByLabelText } = render(<KeyContainer/>, {wrapper: MemoryRouter});
  const keyInput = getByLabelText(/Public Key/i) as HTMLInputElement; 
  expect(keyInput).toBeInTheDocument();
  expect(keyInput).not.toHaveClass('is-invalid')
  
  fireEvent.change(keyInput, { target: { value: 'abc' } })
  await wait() //opnpgp needs to do its thing...
  expect(keyInput.value).toMatch(/abc/)
  expect(keyInput).toHaveClass('is-invalid')
  //This error comes from our code:
  expect(getByLabelText(/keyInputError/)).toHaveTextContent(/Could not find armored text/)
  
  fireEvent.change(keyInput, { target: { value: '-----BEGIN PGP WIDGET-----\nabc\n-----END PGP WIDGET-----' } })
  await wait() //opnpgp needs to do its thing...
  
  expect(keyInput.value).toMatch(/abc/)
  expect(keyInput).toHaveClass('is-invalid')
  //This error comes from openpgp
  expect(getByLabelText(/keyInputError/)).toHaveTextContent(/Unknown ASCII armor type/)
  
});

test('Basic PGP Flow', async () => {
  jest.useFakeTimers();
  const { getByLabelText } = render(<KeyContainer/>, {wrapper: MemoryRouter});
  
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
  const { getByLabelText } = render(<KeyContainer/>, {wrapper: MemoryRouter});
  
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
  const { getByLabelText } = render(<KeyContainer/>, {wrapper: MemoryRouter});
  
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

test('Key storage - save / remove', async()=>{
  jest.useFakeTimers();
  const { getByLabelText } = render(<KeyContainer/>, {wrapper: MemoryRouter});
  
  const keyInput = getByLabelText(/Public Key/i); 
  
  fireEvent.change(keyInput, { target: { value: normal_key } })
  await wait() //opnpgp needs to do its thing...
  expect((getByLabelText(/Username/) as HTMLInputElement).value).toBe("Wibble <blah@silly.com>");
  
});