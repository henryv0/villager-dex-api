const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const fetch = require('node-fetch');
const redis = require('redis');

const client = redis.createClient();
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

const fetchNameFromCache = (req, res, next) => {
  const { name } = req.params;

  client.get(name, (err, data) => {
    if (err) {
      throw new Error(err);
    }

    if (data !== null) {
      res.json({
        source: 'cache',
        data: JSON.parse(data),
      });
    } else {
      next();
    }
  });
};

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({
    status: '200 OK'
  });
});

app.get('/api/villagers/:name', fetchNameFromCache, (req, res) => {
  let { name } = req.params;
  let url = `${BASE_URL}/${name}/`;

  console.log('fetching from 3rd party API');

  fetch(url, API_OPTIONS)
    .then((res) => res.json())
    .then((json) => {
      if (json.hasOwnProperty('error')) {
        throw new Error(json.error);
      }

      client.set(name, JSON.stringify(json), redis.print);
      console.log('Saved to redis: ' + name);

      res.status(200).json({
        source: 'api',
        data: json,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));