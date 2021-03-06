"use strict";

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN;

// Messenger API parameters
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
if (!FB_VERIFY_TOKEN) {
  FB_VERIFY_TOKEN = "just_do_it";
}

var WORD_API_URL = process.env.WORD_API_URL;
if(!WORD_API_URL){
  WORD_API_URL = 'https://a7f465682d.execute-api.ap-southeast-1.amazonaws.com/prod';
}

var ESTAURANT_API_URL = process.env.ESTAURANT_API_URL;
if(!ESTAURANT_API_URL){
  ESTAURANT_API_URL = 'http://espresso.japaneast.cloudapp.azure.com:9200';
}

var ESTAURANT_API_AUTH = process.env.ESTAURANT_API_AUTH;

if(!ESTAURANT_API_AUTH){
  throw new Error('ESTAURANT_API_AUTH is required');
}

const DEFAULT_LAT = process.env.LAT || 13.7329531;
const DEFAULT_LON = process.env.LON || 100.5663767;
const DEFAULT_DISTANCE = process.env.DISTANCE || '2km';

let DEFAULT_LOCATION = {};

if (DEFAULT_LAT && DEFAULT_LON && DEFAULT_DISTANCE) {
  DEFAULT_LOCATION = {
    lat: parseFloat(DEFAULT_LAT),
    lon: parseFloat(DEFAULT_LON),
    maxDistance: DEFAULT_DISTANCE
  };
}

const BOT_NAME = process.env.BOT_NAME || 'Pokathon';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/nlp';

let LEARN_MODE = process.env.LEARN_MODE || true;

module.exports = {
  WIT_TOKEN,
  FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN,
  WORD_API_URL,
  ESTAURANT_API_URL,
  ESTAURANT_API_AUTH,
  DEFAULT_LOCATION,
  DEFAULT_DISTANCE,
  BOT_NAME,
  MONGO_URL,
  LEARN_MODE
};