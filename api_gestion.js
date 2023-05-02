'use strict';

/**
 * On a plusieurs URL
 *  - url pour le current weather
 *  - url pour le forcast
 *  - url pour la pollution 
 */

const api_key = '13abc51e825841d1e299e00ca43750aa';

const fetchDatasLocation = async function(url, callback){
    const response = await fetch(`${url}&appid=${api_key}`, {mode : 'cors'});
    const dataWeather = await response.json();
    return callback(dataWeather);
}


const url = {
    getCurrentWeather : function(lat, lon){
        return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric` ;
    },
    getForecast : function(lat, lon){
        return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric` ;
    },
    getAirQuality : function(lat, lon){
        return `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}`;
    },
    getAirQualityForecast : function(lat, lon){
        return `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}`;
    },
    getGeolocalisation : function(query){
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
    }
}

export{ fetchDatasLocation, url }