const express = require('express');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
require('dotenv').config();

const app = express();

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
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
