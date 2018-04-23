<<<<<<< HEAD
import {
	getStationTrains,
	getSiteId
} from './functions';
import './index.scss';
import {
	stations
} from './constants.js';
import "./map/map.js";

let skärmarbrinkTrains1 = null;
let gullmarsplanTrains1 = null;
let skärmarbrinkTrains2 = null;
let gullmarsplanTrains2 = null;

getStationTrains(9188).then((trains) => {
	skärmarbrinkTrains1 = trains.filter(train => train.JourneyDirection == 1);
	skärmarbrinkTrains2 = trains.filter(train => train.JourneyDirection == 2);
	console.log(skärmarbrinkTrains1);

});
getStationTrains(9189).then((trains) => {
	gullmarsplanTrains1 = trains.filter(train => train.JourneyDirection == 1);
	gullmarsplanTrains2 = trains.filter(train => train.JourneyDirection == 2);
	console.log(gullmarsplanTrains1);

});
=======
import {getStationTrains, getSiteId} from './functions';
import './index.scss';
import {stationsFull} from './constants.js';
import moment from 'moment';
>>>>>>> 040b4fc0e962598d2d29a5c5526d60178d1183ca


function getTrainsOnSpecificLine(lineNumber, stations) {
    let line = stations.filter(station => station.lines.includes(lineNumber));

    let promiseArr = line.map(station => getStationTrains(station.siteId));

    return Promise.all(promiseArr).then(trains => {
        // let temp = _.uniqBy(trains, "JourneyNumber")[0]; // unique trains for stations belonging to a line
        // need to filter out trains on other lines that share the same stations
        return _.flatten(trains).filter(train => train.LineNumber == lineNumber.toString());
    })
}

let line11 = getTrainsOnSpecificLine(11, stationsFull);
line11.then(trains => {
    var myVar = setInterval(myTimer, 1000);

    //let trainTimeArray = trains.map(train => moment(train.TimeTabledDateTime))

    function myTimer() {
        trains.forEach(train => {
            if (moment().isAfter(moment(train.TimeTabledDateTime))) {
                console.log(moment(train.TimeTabledDateTime).fromNow());
            }
        });
    }

})

// temp code goes here!!!! 
//let slussenLocation = getSiteId("slussen").then((location) => {console.log(location)});

// let stationArray = [];

// stations.forEach((station, i) => {
//     setTimeout(function () {
//         getSiteId(station).then((location) => {
//             stationArray.push({origName: location.Name, siteId: location.SiteId, name: station})
//         });
//         console.log(stationArray);
//     }, 2000 * i);
// })
// console.log(stationArray);
// ---------------------------------------------------------------------------------------



document.getElementById('root').innerHTML = "hej";