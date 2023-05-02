'use strict';

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
                'Sep', 'Oct', 'Nov', 'Dec'];

const getDate = function(dt_unix){
    const date = new Date(dt_unix * 1000);
    const weekName = week[date.getDay()];
    const monthName = month[date.getMonth()];
    const day = date.getDate()
    const hour = date.getHours();

    return `${weekName}, ${day} ${monthName}`;
}

const getDay = function(dt_unix){
    const date = new Date(dt_unix * 1000);
    const day = date.getDate()
    return day;
}

export{ getDate, getDay }