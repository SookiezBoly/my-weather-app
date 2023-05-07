'use strict';

import {url, fetchDatasLocation } from './api_gestion.js';
import { getDate, getDay } from './conversion.js';
// import { carouselWeather } from './carouselBIS.js';
import { carouselWeather } from './carousel.js';

const currentLocationButton = document.querySelector('[data-current-location]');
const defaultLocation = '#/weather?lat=48.8534951&lon=2.3483915';
let allForcecastDataArray = [];

/**
 * 
 * @param {number} lat 
 * @param {number} lon 
 * 
 * On remplit le tableau allForcecastDataArray
 */

const getAllWeathers = async function(lat, lon){
    const cityNamesArray = await fetchDatasLocation(url.getCurrentWeather(lat, lon), getCityNameCountry);
    const cityForecastArry = await fetchDatasLocation(url.getForecast(lat, lon), getCityForcast);
    const airQualityArray = await fetchDatasLocation(url.getAirQualityForecast(lat, lon), getAirQualityForecast);
    allForcecastDataArray = [];

    for(let i = 0; i < cityForecastArry.length; i++){
        allForcecastDataArray.push({...cityNamesArray, ...cityForecastArry[i], ...airQualityArray});
    }
    
    return allForcecastDataArray;
}


const displayWeathers = async function(lat, lon){
    const carouselList = document.querySelector('[data-carroussel-list]');
    carouselList.innerHTML = "";

    window.location.hash === '#/current-location' ? currentLocationButton.setAttribute('disabled', true) : currentLocationButton.removeAttribute('disabled');

    const dataWeather = await getAllWeathers(lat, lon);
    displayMainCard(dataWeather);

/* ------------------ FORECAST ------------------------------- */
    for(let i = 0; i < dataWeather.length - 1; i++){
        const slideLi = document.createElement('li');
        
        slideLi.classList.add('slide');
        slideLi.setAttribute('id', `${dataWeather[i].dt}`);
        slideLi.setAttribute('datas-slide', '');

        if(getDate(dataWeather[i].dt) ===  getDate(dataWeather[0].dt)) slideLi.classList.add('active');
        slideLi.innerHTML = `
        <div class="card">
            <p class="desc">${getDate(dataWeather[i].dt)}</p>
            <img src="./weather_icons/${dataWeather[i].icon}.png" class="weather-icon" alt="icon weather" width="50" height="50" loading="lazy">
            <p class="desc">${dataWeather[i].temp}&deg;C</p>
        </div>
        `;
        carouselList.appendChild(slideLi);
    }
}



window.addEventListener('click', (evt) => {
    

    if(evt.target.localName === 'input') searchResult.style.display = 'block';
    
    if(evt.target.classList.contains('city-link')){
        const hashCity = evt.target.href
        const coord = getCoordHashWeather(hashCity);
        displayWeathers(coord.lat, coord.lon);
        searchResult.style.display = 'none';
        currentLocationButton.removeAttribute('disabled');
    }

    if(evt.target.classList.contains('slide') && !evt.target.classList.contains('active')){
        const lis = document.querySelectorAll('[datas-slide]');
        lis.forEach(li => li.classList.remove('active'));
        evt.target.classList.add('active');

        lis.forEach(li => {
            if(li.id === evt.target.id){
                li.classList.add('active');
            } 
        });
        
        const idLiClicked = evt.target.id;
        const weatherClicked = allForcecastDataArray.filter( item => {
            return idLiClicked == item.dt ;
        });
        
        displayMainCard(weatherClicked);
    }
})


/* --------------------- LOAD PAGE -----------------------*/
currentLocationButton.addEventListener('click', getCurrentLocation);

window.addEventListener('load', loadPage);

function loadPage(){
    const hashWindow = window.location.hash
    if(!hashWindow){
        window.location.hash = '#/current-location';
        getCurrentLocation();   
    }else{
        if(!hashWindow.includes('#/current-location')){
            const coord = getCoordHashWeather(hashWindow);
            displayWeathers(coord.lat, coord.lon);
        }else{
            getCurrentLocation();
        }
    }
}



/**
 * Creation of the search function..
 */

const inputCity = document.querySelector('input');
const searchResult = document.querySelector('[data-search-list]'); 
inputCity.addEventListener('input', lookForCity);

let timeoutId;

/** 
 * @param {function} debounce used in webdev to delay the execution of the addEvenLister input by 500ms
 */

const debounce = function(callback){
    clearTimeout(timeoutId);
    timeoutId = setTimeout( () => callback(), 100);
}

function lookForCity(){

    debounce(function checkCity(){
        if(!inputCity.value) searchResult.innerHTML = '';

        if(inputCity.value){
            fetchDatasLocation(url.getGeolocalisation(inputCity.value), function(location){
                searchResult.innerHTML = `<ul class="city-list" data-city-list>
                
                                          </ul>`;
                
                for( const {name, state, country, lat, lon} of location){
                    const li_item = document.createElement('li');
                    li_item.classList.add('city');
                    li_item.setAttribute('data-city-list', '');
                    li_item.innerHTML = `
                            <i class="fa-solid fa-location-dot"></i>

                            <div>
                                <p class="city-name">${name}</p>
                                <p class="city-subtitle">${state || ''}, ${country || ''}</p>
                            </div>

                            <a href="#/weather/?lat=${lat}&lon=${lon}" class="city-link" data-link-city></a>
                    `;
                    
                    const dataCityList = searchResult.querySelector('[data-city-list]');
                    dataCityList.appendChild(li_item);
                }
                
            })
        }
    });

}




function displayMainCard(arrayWeather){
    const cardDisplay = document.querySelector('[data-display-card]');
    cardDisplay.innerHTML = "";

    cardDisplay.innerHTML = `
    <div class="head-weather">
        <i class="fa-solid fa-location-crosshairs"  width="364px" height="58px"></i>
        <h1 class="city-name">${arrayWeather[0].name}, ${arrayWeather[0].country}</h1>
    </div>

    <span class="time">${getDate(arrayWeather[0].dt)}</span>

    <div class="weather">
        <div class="wrapper-weather">
            <img src="./weather_icons/${arrayWeather[0].icon}.png" class="weather-icon" alt="${arrayWeather[0].icon} weather" width="100" height="100" loading="lazy">
            <p>${arrayWeather[0].description}</p>
            <p class="temperature">${arrayWeather[0].temp} &deg; C</p>
        </div>
    </div>


    <ul class="today-highlight" data-today-highlight>

        <li class="highlight">
            <p class="title">Humidity</p>     
            <div class="infos">
                <i class="fa-solid fa-water" width="30" height="30" loading="lazy"></i>
                <p class="desc">${arrayWeather[0].humidity} &percnt;</p>
            </div>
        </li>

        <li class="highlight">
            <p class="title">Wind Speed</p>
            <div class="infos">
                <i class="fa-solid fa-wind" width="30" height="30" loading="lazy"></i>
                <p class="desc">${arrayWeather[0].speed} km/h</p>
            </div>
        </li>

        <li class="highlight">
            <p class="title">Air Quality</p>   
            <div class="infos">
                <i class="fa-solid fa-fan" width="30" height="30" loading="lazy"></i>
                <p class="desc">${arrayWeather[0].messageAqi}</p>
            </div>
        </li>

    </ul>
    `;
}

function getCityNameCountry(dataWeather){ 
    let {
        name,
        sys : { country }
    } = dataWeather;

    
    const dataNames = {
        name,
        country
    }
    
    return dataNames;
}

function getCityForcast(dataforecast){
        
    const tabCharacteristique = [];

    const {
            list : forecastList
        } = dataforecast;

        for(let i = 0; i < forecastList.length; i+=8){
            const {
                dt,
                main : { temp, humidity },
                weather : [ {id, description,  icon } ],
                wind : { speed },
            } = forecastList[i];

            const objCharacteristique = {
                dt,
                temp,
                humidity,
                icon,
                description,
                speed
            }
            tabCharacteristique.push(objCharacteristique);
        }
    
    return tabCharacteristique;
}

function getAirQualityForecast(dataAiq){
    const [{
        main : {aqi}
    }] = dataAiq.list;

    let messageAqi;
    
    switch(aqi){
        case 1 :
            messageAqi = 'Good';
            break;
        case 2 :
            messageAqi = 'Fair';
            break;
        case 3 :
            messageAqi = 'Moderate';
            break;
        case 4 :
            messageAqi = 'Poor';
            break;
        case 4 :
            messageAqi = 'Very Poor';
            break; 
    }

    const aqiCharacteristic = {
        messageAqi
    }

    return aqiCharacteristic;
}

function getCurrentLocation(){
    window.navigator.geolocation.getCurrentPosition( response => {
        const {latitude, longitude } = response.coords;
        displayWeathers(latitude, longitude);  
    },
    error => {
        window.location.hash = defaultLocation;
        const coordo = getCoordDefault(defaultLocation);
        displayWeathers(coordo.lat, coordo.lon); 
    })
}

const getCoordDefault = function(query){
    const tempTab = query.split('&');
    const latArray = tempTab[0].split('=');
    const lonArray = tempTab[1].split('=');

    const coord = {
        lat : latArray[1],
        lon : lonArray[1]
    }

    return coord;
}

const getCoordHashWeather = function(query){
    const tempTab = query.split('?');
    const coord = getCoordDefault(tempTab[1]);

    return coord;
}