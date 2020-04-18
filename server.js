const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const fetch = require('node-fetch');

dotenv.config();
const app = express();
const PORT = process.env.PORT;

const BASE_URL = 'https://nookipedia.com/api/villager';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'X-API-KEY': process.env.API_KEY,
  },
};

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({
    status: '200 OK'
  });
});

app.get('/api/villagers/:name', (req, res) => {
  let {name} = req.params;
  let url = `${BASE_URL}/${name}/`;

  fetch(url, API_OPTIONS)
    .then((res) => res.json())
    .then((json) => {
      res.status(200).send(json);
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));