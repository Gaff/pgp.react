import openpgp, { key, message } from 'openpgp'
import { normal_key } from './testData/testData'

test('Sensible error message',  async () => {
  const ret = await key.readArmored("foo")
  const err = ret.err;
  expect(err).not.toBeNull();
  if(err) {
    expect(err.map(x=>x.message)).toEqual(["Misformed armored text"]);
  }
});

test('Simple encryption', async() => {
  const ret = await key.readArmored(normal_key)
  const publicKey = ret.keys[0]
  expect(publicKey).not.toBeNull();
  
  const data = await openpgp.encrypt({
      message: message.fromText("Hello world"),
      publicKeys: publicKey
  })
  expect(data.data).toEqual(expect.stringMatching(/-----BEGIN PGP MESSAGE-----/))
})
