const crypto = require('crypto');

// Generate a random secret key with a length of 64 bytes (512 bits)
const secretKey = crypto.randomBytes(10).toString('hex');

console.log('JWT Secret Key:', secretKey);