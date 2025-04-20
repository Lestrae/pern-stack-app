import arcjet, { shield, detectBot, tokenBucket } from '@arcjet/node';

import "dotenv/config";

//initialize arcject

export const arcj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ['ip.src'],
  rules: [
    //shield protects the app from sql injections, xss, csrf attacks
    shield({
      mode: "LIVE"
    }),
    detectBot({
      mode: "LIVE",
      //block all bots except search engines
      allow: ["CATEGORY:SEARCH_ENGINE"]
      //see the full list on https://arcjet.com/bot-list
    }),
    //rate limiter
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    })
  ]
});