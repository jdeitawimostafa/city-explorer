'use strict';

const express = require ('express');

const dotenv = require('dotenv').config();

const cors = require ('cors');

const superagent = require ('superagent');

const server = express();

const PORT = process.env.PORT || 4000;

server.use(cors());

server.get('/',(req,res)=>{
  res.send('your server ready to use');
});

server.get('/location',(req,res) => {
  let cityName = req.query.city;
  let key = process.env.LOCATION_KEY;
  let locURL = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`;

  superagent.get(locURL)
    .then(getData => {

      let gettedData = getData.body;
      let locationData = new Location (cityName,gettedData);
      res.send(locationData);
    })

    .catch(error => {
      res.send(error);
    });


});

function Location (cityName,keyData) {
  this.search_query = cityName;
  this.formatted_query = keyData[0].display_name;
  this.latitude = keyData[0].lat;
  this.longitude = keyData[0].lon;
}

server.get('/weather',(req,res) => {
  let WEATHER_API_KEY = process.env.WEATHER_API_KEY;
  let cityName = req.query.search_query;
  let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${WEATHER_API_KEY}`;
  console.log(req.query);
  superagent.get(weatherURL)
    .then((getData) => {
      console.log(getData.body);
      let gettedData  = getData.body.data.map((item) => {
        return new Weather (item);
      });
      res.send(gettedData);
    })

    .catch(error => {
      res.send(error);
    });
});

function Weather (weatherData) {
  this.forecast = weatherData.weather.description ;
  this.time = weatherData.valid_date ;
}

function Park (parkData) {
  this.name = parkData.fullName ;
  this.address = `${parkData.addresses[0].line1}, ${parkData.addresses[0].city}, ${parkData.addresses[0].stateCode} ${parkData.addresses[0].postalCode}`;
  this.fee = parkData.entranceFees[0].cost;
  this.description = parkData.description;
  this.url = parkData.url;
}

server.get('/parks',handPark);
function handPark (req,res){
  let PARKS_API_KEY = process.env.PARKS_API_KEY;
  let cityName = req.query.search_query;
  let parksURL = `https://developer.nps.gov/api/v1/parks?q=${cityName}&api_key=${PARKS_API_KEY}`;
  superagent.get(parksURL)
    .then(getData => {
      let gettedData = getData.body.data;
      let data = gettedData.map((items) => {
        return new Park (items);
      });
      res.send(data);
    })

    .catch(error => {
      res.send(error);
    });
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
