'use strict';

import {url, fetchDatasLocation } from './api_gestion.js';
import { getDate, getDay } from './conversion.js';
import { carouselWeather } from './carousel.js'

const currentLocationButton = document.querySelector('[data-current-location]');
const defaultLocation = '#/weather?lat=48.8534951&lon=2.3483915';

const getAllWeathers = function(lat, lon){
    const cardDisplay = document.querySelector('[data-display-card]');
    const carouselList = document.querySelector('[data-carroussel-list]');

    cardDisplay.innerHTML = "";
    carouselList.innerHTML = "";


    window.location.hash === '#/current-location' ? currentLocationButton.setAttribute('disabled', true) : currentLocationButton.removeAttribute('disabled');


    fetchDatasLocation(url.getCurrentWeather(lat, lon), function(dataCity){

        const {
            weather : [ {description, 
                         icon
                        }],
            dt,
            wind : {speed},
            main : {temp, humidity},
            sys : {country},
            name,
        } = dataCity;
    
        fetchDatasLocation(url.getAirQuality(lat, lon), function(dataAir){
            const [
                {
                    main : { aqi }
                }
            ] = dataAir.list;
        
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
        
            cardDisplay.innerHTML = `
            <div class="head-weather">
                <i class="fa-solid fa-location-crosshairs"  width="364px" height="58px"></i>
                <h1 class="city-name">${name}, ${country}</h1>
            </div>

            <span class="time">${getDate(dt)}</span>

            <div class="weather">
                <div class="wrapper-weather">
                    <img src="./weather_icons/${icon}.png" class="weather-icon" alt="${icon} weather" width="100" height="100" loading="lazy">
                    <p>${description}</p>
                    <p class="temperature">${temp} &deg; C</p>
                </div>
            </div>


            <ul class="today-highlight" data-today-highlight>

                <li class="highlight">
                    <p class="title">Humidity</p>     
                    <div class="infos">
                        <i class="fa-solid fa-water" width="30" height="30" loading="lazy"></i>
                        <p class="desc">${humidity} &percnt;</p>
                    </div>
                </li>

                <li class="highlight">
                    <p class="title">Wind Speed</p>
                    <div class="infos">
                        <i class="fa-solid fa-wind" width="30" height="30" loading="lazy"></i>
                        <p class="desc">${speed} km/h</p>
                    </div>
                </li>
        
                <li class="highlight">
                    <p class="title">Air Quality</p>   
                    <div class="infos">
                        <i class="fa-solid fa-fan" width="30" height="30" loading="lazy"></i>
                        <p class="desc">${messageAqi}</p>
                    </div>
                </li>

            </ul>
            `;
        
        });

        fetchDatasLocation(url.getForecast(lat, lon), function(forecast){
            const {
                list:forecastList
            } = forecast;

            for( let i = 0; i < forecastList.length; i+=8){
                const {
                    dt,
                    main : {temp},
                    weather : [{ icon } ]
                } = forecastList[i];

                const slideLi = document.createElement('li');
                slideLi.classList.add('slide');
                
                if(getDate(forecastList[i].dt) ===  getDate(dataCity.dt)) slideLi.classList.add('active');

                slideLi.innerHTML = `
                <div class="card">
                    <p class="desc">${getDate(dt)}</p>
                    <img src="./weather_icons/${icon}.png" class="weather-icon" alt="icon weather" width="50" height="50" loading="lazy">
                    <p class="desc">${temp}&deg;C</p>
                </div>
                `;

                carouselList.appendChild(slideLi);
            }

            carouselWeather();
            
            
            
        }); // fin du fetch.

        
    });
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
    timeoutId = setTimeout( () => callback(), 500);
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



/* --------------------- LOAD PAGE -----------------------*/
window.addEventListener('load', loadPage);

function loadPage(){
    const hashWindow = window.location.hash 
    if(!hashWindow){
        window.location.hash = '#/current-location';
        getCurrentLocation();   
    }else{
        if(!hashWindow.includes('#/current-location')){
            const coord = getCoordHashWeather(hashWindow);
            getAllWeathers(coord.lat, coord.lon);

        }
    }
}


/*-------------------------- BUTTON CURRENT LOCATION ---------------------*/


currentLocationButton.addEventListener('click', getCurrentLocation);

function getCurrentLocation(){
    window.navigator.geolocation.getCurrentPosition( response => {
        const {latitude, longitude } = response.coords;
        getAllWeathers(latitude, longitude);  
    },
    error => {
        window.location.hash = defaultLocation;
        const coordo = getCoordDefault(defaultLocation);
        getAllWeathers(coordo.lat, coordo.lon);
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



window.addEventListener('click', (evt) => {
    if(evt.target.localName === 'input') searchResult.style.display = 'block';
    
    if(evt.target.classList.contains('city-link')){
        const hashCity = evt.target.href
        const coord = getCoordHashWeather(hashCity);
        getAllWeathers(coord.lat, coord.lon);
        searchResult.style.display = 'none';
        currentLocationButton.removeAttribute('disabled');
    }


    /* à explorer */
    if(evt.target.classList.contains('slide') || evt.target.classList.contains('card')){
        console.log('SLIDE');
    }
})