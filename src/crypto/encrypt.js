import crypto from 'crypto';

const encryptResponse = (response, aesKeyBuffer, initialVectorBuffer) => {
  const flippedIV = initialVectorBuffer.map(byte => ~byte);

  const cipher = crypto.createCipheriv(
    'aes-128-gcm',
    aesKeyBuffer,
    Buffer.from(flippedIV),
  );

  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(response), 'utf-8'),
    cipher.final(),
    cipher.getAuthTag(),
  ]);

  return encrypted.toString('base64');
};

export default encryptResponse;
