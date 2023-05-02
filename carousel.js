'use strict';

function carouselWeather(){
    const carouselSlider = document.querySelector('[data-carroussel-slider]');
    const list = document.querySelector('[data-carroussel-list]');
    let list2;

    const speed = 1;

    const width = list.offsetWidth;
    let begin = 0;
    let end = width;

    function clone(){
        list2 = list.cloneNode(true);
        carouselSlider.appendChild(list2);
        list2.style.left = `${width}px`;
    }

    function moveFirst(){
        begin -= speed;
        width >= Math.abs(begin) ? list.style.left = `${begin}px` : begin = width;
    }

    function moveSecond(){
        end -= speed;
        list2.offsetWidth >= Math.abs(end) ? list2.style.left = `${end}px` : end = width; 
    }

    function hover(){
        clearInterval(a);
        clearInterval(b)
    }

    function unhover(){
        a = setInterval(moveFirst, 30);
        b = setInterval(moveSecond, 30);
    }

    clone();

    let a = setInterval(moveFirst, 30);
    let b = setInterval(moveSecond, 30);

    /*
    itemSlide.forEach(item => item.addEventListener('mouseover', hover))
    itemSlide.forEach(item => item.addEventListener('mouseout', unhover))
        je ne peux pas utiliser ceci à cause de mes <li> cloneNode.. vu que ItemSlide ne fait pas partir de l'addEvent listeer
    */

    carouselSlider.addEventListener('mouseenter', hover);
    carouselSlider.addEventListener('mouseleave', unhover);

}

export { carouselWeather }