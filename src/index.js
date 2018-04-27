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

function getStationsOnSpecificLine(lineNumber, constantStations) {
    let line = constantStations.filter(station => station.lines.includes(lineNumber));
    let promiseArr = line.map(station => getStationTrains(station.siteId));

    return Promise.all(promiseArr).then(stations => {
      var filteredStations = _.flatten(stations).filter(station => station.LineNumber == lineNumber.toString())
      filteredStations = filteredStations.map(station => {
        station.expectedMilliseconds = moment(station.ExpectedDateTime).valueOf();
        return station;
      });
      var uniqueTrains = _.uniqBy(filteredStations, "JourneyNumber");
      var uniqueJurneyNumbers = uniqueTrains.map(train => train.JourneyNumber);
      var temp2 = [];
      uniqueJurneyNumbers.forEach(journeyNumber => {temp2.push(filteredStations.filter(train => train.JourneyNumber === journeyNumber))});
      return temp2;
    })
}

let line11 = getStationsOnSpecificLine(11, stationsFull);

line11.then(trains => {
  trains.forEach(trainArray => {
    //console.log(trainArray);
  })
  let temp = _.orderBy(trains[1], ['expectedMilliseconds'],['asc']);
  console.log("temp: ", temp);
  var myVar = setInterval(myTimer, 1000);
  function myTimer() {

    let passedStations = temp.filter(train => train.expectedMilliseconds < moment().valueOf()); // stations already passed by the train
    let lastPassedStation = passedStations[passedStations.length - 1]; // last station

    let comingStations = temp.filter(train => train.expectedMilliseconds > moment().valueOf()); // stations already passed by the train

    if (lastPassedStation && comingStations.length > 0) {
      let stationTimeDifference = comingStations[0].expectedMilliseconds - lastPassedStation.expectedMilliseconds;
      let timeUntilStation = comingStations[0].expectedMilliseconds - moment().valueOf();
      let progress = 100*(1-(timeUntilStation/stationTimeDifference));

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

document.getElementById('root').innerHTML = "hej";
