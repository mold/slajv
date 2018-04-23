import {getStationTrains, getSiteId} from './functions';
import './index.scss';
import {stationsFull} from './constants.js';


function getTrainsOnSpecificLine(lineNumber, stations) {
    let line = stations.filter(station => station.lines.includes(lineNumber));

    let promiseArr = line.map(station => getStationTrains(station.siteId));

    return Promise.all(promiseArr).then(trains => {
        // let temp = _.uniqBy(trains, "JourneyNumber")[0]; // unique trains for stations belonging to a line
        // need to filter out trains on other lines that share the same stations
        return _.flatten(trains).filter(train => train.LineNumber == lineNumber.toString());
    })
}

getTrainsOnSpecificLine(11, stationsFull).then(trains => console.log(trains));



// let skärmarbrinkTrains1 = null;
// let gullmarsplanTrains1 = null;
// let skärmarbrinkTrains2 = null;
// let gullmarsplanTrains2 = null;

// getStationTrains(9188).then((trains) => {
//     skärmarbrinkTrains1 = trains.filter(train => train.JourneyDirection == 1);
//     skärmarbrinkTrains2 = trains.filter(train => train.JourneyDirection == 2);
//     console.log(skärmarbrinkTrains1);
    
// });
// getStationTrains(9189).then((trains) => {
//     gullmarsplanTrains1 = trains.filter(train => train.JourneyDirection == 1);
//     gullmarsplanTrains2 = trains.filter(train => train.JourneyDirection == 2);
//     console.log(gullmarsplanTrains1);
    
// });


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


