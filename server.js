process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const app = express();

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-anfuvpslo2gunhw1.au.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://eastlu.com',
  issuer: 'https://dev-anfuvpslo2gunhw1.au.auth0.com/',
  algorithms: ['RS256']
});

app.get('/public', (req, res) => {
  res.json({ message: 'This is a public endpoint.' });
});

app.get('/protected', checkJwt, (req, res) => {
  res.json({ message: 'You accessed a protected endpoint!', user: req.user });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on port ${port}`));
