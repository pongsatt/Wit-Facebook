'use strict';

// Messenger API integration example
// We assume you have:
// * a Wit.ai bot setup (https://wit.ai/docs/quickstart)
// * a Messenger Platform setup (https://developers.facebook.com/docs/messenger-platform/quickstart)
// You need to `npm install` the following dependencies: body-parser, express, request.
//
const bodyParser = require('body-parser');
const express = require('express');

// get Bot, const, and Facebook API
const Bot = require('./bot/FbBot');
const Config = require('./config/const.js');
const FB = require('./api/facebook.js');

let bot = new Bot();

// Webserver parameter
const PORT = process.env.PORT || 8445;

// Wit.ai bot specific code

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (fbid) => {
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }; // set context, _fid_
  }
  return sessionId;
};

// Starting our webserver and putting it all together
const app = express();
app.set('port', PORT);
app.listen(app.get('port'));
app.use(bodyParser.json());
console.log("I'm wating for you @" + PORT);

// index. Let's say something fun
app.get('/', function (req, res) {
  res.send('"Only those who will risk going too far can possibly find out how far one can go." - T.S. Eliot');
});

// Webhook verify setup using FB_VERIFY_TOKEN
app.get('/webhook', (req, res) => {
  if (!Config.FB_VERIFY_TOKEN) {
    throw new Error('missing FB_VERIFY_TOKEN');
  }
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

// The main message handler
app.post('/webhook', (req, res) => {
  // Parsing the Messenger API response
  const messaging = FB.getFirstMessagingEntry(req.body);
  // console.log("Receive facebook message: ", messaging);

  if (messaging && messaging.message) {

    console.log('messaging:', JSON.stringify(messaging));
    // Yay! We got a new message!

    // We retrieve the Facebook user ID of the sender
    const sender = messaging.sender.id;

    // We retrieve the user's current session, or create one if it doesn't exist
    // This is needed for our bot to figure out the conversation history
    const sessionId = findOrCreateSession(sender);

    // We retrieve the message content
    const msg = messaging.message.text;
    const atts = messaging.message.attachments;
    var context = sessions[sessionId].context;
    context.sessionId = sessionId;

    if (atts) {
      if (atts && atts.length) {
        let att = atts[0];

        if (att.type == 'location') {
          let location = getFBLocation(att);
          if (location) {
            bot.message(`My location is lat ${location.lat} lon ${location.lon}`, context);
          }
        } else {
          FB.fbMessage(
            sender,
            { text: 'Sorry I can only process text messages for now.' }
          );
        }
      }

    } else if (msg) {
      // We received a text message
      bot.message(msg, context, Config.LEARN_MODE);
    }
  } else if (messaging && messaging.postback) {
    console.log('postback:', JSON.stringify(messaging.postback));
    const postback = messaging.postback;
    bot.postback(postback.payload);
  }
  res.sendStatus(200);
});

const getFBLocation = (att) => {
  let payload = att.payload;

  return {
    lat: payload.coordinates.lat,
    lon: payload.coordinates.long,
    maxDistance: Config.DEFAULT_DISTANCE
  };
};