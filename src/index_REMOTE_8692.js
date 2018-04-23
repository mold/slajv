import {getStationTrains, getSiteId} from './functions';
import './index.scss';
import {stationsFull} from './constants.js';
import moment from 'moment';


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


