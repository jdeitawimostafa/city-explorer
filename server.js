'use strict';

const express = require ('express');

const dotenv = require('dotenv').config();

const cors = require ('cors');

const server = express();

const PORT = process.env.PORT || 4000;

server.use(cors());

server.get('/',(req,res)=>{
  res.send('your server ready to use');
});

server.get('/location',(req,res) => {
  let getData = require('./data/location.json');

  let locationData = new Location (getData);

  res.send(locationData);

});

function Location (keyData) {
  this.search_query = 'lynwood';
  this.formatted_query = keyData[0].display_name;
  this.latitude = keyData[0].lat;
  this.longitude = keyData[0].lon;
}

server.get('/weather',(req,res) => {
  let getData = require('./data/weather.json');
  let newArr = [];
  getData.data.forEach(function (val) {
    let weatherData = new Weather (val);
    newArr.push(weatherData);
  });
  res.send(newArr);
});

function Weather (weatherData) {
  this.forecast = weatherData.weather.description ;
  this.time = weatherData.datetime ;
}

server.get('*',(req,res) => {
  let errObj = {
    status: 500,
    responseText: 'Sorry, something went wrong'
  };
  res.status(500).send(errObj);
});

server.listen(PORT,() =>{
  console.log(`istining on port ${PORT}`);
});
