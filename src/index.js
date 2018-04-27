import {
    getStationTrains,
    getSiteId
} from './functions';
import './index.scss';
import {
    stations,
    stationsFull
} from './constants.js';
import "./map/map.js";
import moment from "moment";

function getTrainsOnSpecificLineV2(lineNumber, stations) {
    let line = stations.filter(station => station.lines.includes(lineNumber));
    let promiseArr = line.map(station => getStationTrains(station.siteId));
    return Promise.all(promiseArr).then(trains => {
      var filteredTrains = _.flatten(trains).filter(train => train.LineNumber == lineNumber.toString())
      filteredTrains = filteredTrains.map(train => {
        train.expectedMilliseconds = moment(train.ExpectedDateTime).valueOf();
        return train;
      });
      var uniqueTrains = _.uniqBy(filteredTrains, "JourneyNumber");
      var uniqueJurneyNumbers = uniqueTrains.map(train => train.JourneyNumber);
      var temp2 = [];
      uniqueJurneyNumbers.forEach(journeyNumber => {temp2.push(filteredTrains.filter(train => train.JourneyNumber === journeyNumber))});
      return temp2;
    })
}

function getTrainsOnSpecificLine(lineNumber, stations) {
    let line = stations.filter(station => station.lines.includes(lineNumber));
    let promiseArr = line.map(station => getStationTrains(station.siteId));
    return Promise.all(promiseArr).then(trains => {
        console.log("all?")
        // let temp = _.uniqBy(trains, "JourneyNumber")[0]; // unique trains for stations belonging to a line
        // need to filter out trains on other lines that share the same stations
        return _.flatten(trains).filter(train => train.LineNumber == lineNumber.toString());
    })
}

let line11 = getTrainsOnSpecificLineV2(11, stationsFull);

line11.then(trains => {
  trains.forEach(trainArray => {
    //console.log(trainArray);
  })
  let temp = _.orderBy(trains[1], ['expectedMilliseconds'],['asc']);
  console.log(temp);

  var myVar = setInterval(myTimer, 1000);
  function myTimer() {
    let lastPassedStation = temp.filter(train => train.expectedMilliseconds < moment().valueOf())[0]; // stations already passed by the train
    let comingStations = temp.filter(train => train.expectedMilliseconds > moment().valueOf()); // stations already passed by the train

    if (lastPassedStation && comingStations.length > 0) {
      let stationTimeDifference = comingStations[0].expectedMilliseconds - lastPassedStation.expectedMilliseconds;
      let timeUntilStation = comingStations[0].expectedMilliseconds - moment().valueOf();
      let progress = ((stationTimeDifference/timeUntilStation));

      console.log("From: " + lastPassedStation.StopAreaName + " To: " + comingStations[0].StopAreaName + " Progress: " + progress + "%");
      console.log("From: " + moment(lastPassedStation.expectedMilliseconds).format("DD MMM YYYY hh:mm a") + " To: " + moment(comingStations[0].expectedMilliseconds).format("DD MMM YYYY hh:mm a"));

      // comingStations.forEach((train, i) => {
      //   let stationTimeDifference = train.expectedMilliseconds - lastPassedStation.expectedMilliseconds;
      //   let timeUntilStation = train.expectedMilliseconds - moment().valueOf();
      //   let progress = 100*stationTimeDifference/(1-timeUntilStation);
      //   console.log("From: " + lastPassedStation.StopAreaName + " To: " + train.StopAreaName + " Progress: " + progress + "%");
      //   //
      //   // if (moment().isAfter(moment(train.TimeTabledDateTime))) {
      //   //   console.log(moment(train.TimeTabledDateTime).fromNow());
      //   // }
      // });
    }

  }
});

// let line11 = getTrainsOnSpecificLine(11, stationsFull);
// line11.then(trains => {
//   console.log("trains?")
//   var myVar = setInterval(myTimer, 1000);
//
//   var uniqueTrains = _.uniqBy(trains, "JourneyNumber");
//
//   var temp = uniqueTrains.map(train => train.JourneyNumber);
//   console.log("temp: ", temp);
//   var temp2 = [];
//   temp.forEach(journeyNumber => {temp2.push(trains.filter(train => train.JourneyNumber === journeyNumber))});
//   console.log(temp2);
//
//
//
//   var singleTrain = trains.filter(train => train.JourneyNumber === uniqueTrains[5].JourneyNumber);
//   function myTimer() {
//     singleTrain.forEach(train => {
//       if (moment().isAfter(moment(train.TimeTabledDateTime))) {
//         console.log(moment(train.TimeTabledDateTime).fromNow());
//       }
//     });
//   }
// })

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
