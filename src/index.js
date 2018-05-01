import {
    getStationTrains,
    getSiteId
} from './functions';
import './index.scss';
import {
    stations,
    stationsFull
} from './constants.js';
import {moveTrainCircle, removeTrainCircle} from "./map/map.js";
import moment from "moment";
import "./map/style.scss"

function getStationsOnSpecificLine(lineNumber, constantStations) {
    let line = constantStations.filter(station => station.lines.includes(lineNumber));
    let promiseArr = line.map(station => getStationTrains(station.siteId));

    return Promise.all(promiseArr).then(stations => {
      var filteredStations = _.flatten(stations).filter(station => station.LineNumber == lineNumber.toString());

      filteredStations = filteredStations.map(station => {
        station.expectedMilliseconds = moment(station.ExpectedDateTime).valueOf();
        return station;
      });

      var uniqueTrains = _.uniqBy(filteredStations, "JourneyNumber");
      var uniqueJurneyNumbers = uniqueTrains.map(train => train.JourneyNumber);

      var functionOutput = [];
      uniqueJurneyNumbers.forEach(journeyNumber => {
        functionOutput.push(filteredStations.filter(train => train.JourneyNumber === journeyNumber));
      });
      return functionOutput;
    })
}

// let line11 = getStationsOnSpecificLine(11, stationsFull);

false && line11.then(trains => {
  console.log("Number of trains: ", trains.length);
  console.log("trains: ", trains);

  let trainsIntransit = [];

  var myVar = setInterval(myTimer, 1000);
  function myTimer() {
    let timeStamp = moment().valueOf(); // used for determining if a train has stopped at the last station on the line

    trains.forEach(stationArray => { // loop through all the trains stations
      let temp = _.orderBy(stationArray, ['expectedMilliseconds'],['asc']);

      let passedStations = temp.filter(train => train.expectedMilliseconds < moment().valueOf()); // stations already passed by the train
      let lastPassedStation = passedStations[passedStations.length - 1]; // last station

      let comingStations = temp.filter(train => train.expectedMilliseconds > moment().valueOf()); // stations already passed by the train

      if (lastPassedStation && comingStations.length > 0) { // the current train is between two stations
        let stationTimeDifference = comingStations[0].expectedMilliseconds - lastPassedStation.expectedMilliseconds;
        let timeUntilStation = comingStations[0].expectedMilliseconds - moment().valueOf();
        let progress = 100*(1-(timeUntilStation/stationTimeDifference));

        var index = _.findIndex(trainsIntransit, {journeyNumber: comingStations[0].JourneyNumber});
        let trainToAdd = {timeStamp: timeStamp, journeyNumber: comingStations[0].JourneyNumber, from: lastPassedStation.StopAreaName, to: comingStations[0].StopAreaName, progress: progress};

        // Add/modify the current train to/in the output array
        if (index >= 0) { // train already exists in array
          trainsIntransit.splice(index, 1, trainToAdd);
        } else { // new train
          trainsIntransit.push(trainToAdd);
        }

        moveTrainCircle(11, trainToAdd.journeyNumber, trainToAdd.from, trainToAdd.to, progress);

        /* The stations for trains in the array "trainsIntransit" will be
         * overwritten by new stations ass the tranin passes the current
         * station.
         *
         * In the case that the api has not provided information of another
         * station where the specific train will depart from, the train object
         * will have a ".progress" which is <= 100%. This case has to be
         * handled for "end stations". Other cases should automatically work
         * if the api continously is called and provides information on stations.
         */



        // console.log("From: " + lastPassedStation.StopAreaName + " To: " + comingStations[0].StopAreaName + " Progress: " + progress + "%");
        // console.log("From: " + moment(lastPassedStation.expectedMilliseconds).format("DD MMM YYYY hh:mm a") + " To: " + moment(comingStations[0].expectedMilliseconds).format("DD MMM YYYY hh:mm a"));
      }
    })

    if (trainsIntransit.length > 1) { // naïve and flawed fix for the problem stated above.
      let temp = trainsIntransit.filter(train =>{
        let keep = train.timeStamp === (_.maxBy(trainsIntransit, 'timeStamp')).timeStamp;
        if(!keep){
          removeTrainCircle(train.journeyNumber);
        }

        return keep;
      });
      console.log(temp);
    }
  }

});


// line11.then(trains => {
//   console.log("Number of trains: ", trains.length);
//   console.log("trains: ", trains);
//   trains.forEach(stationArray => {
//     // do something
//   })
//   let temp = _.orderBy(trains[1], ['expectedMilliseconds'],['asc']);
//   console.log("temp: ", temp);
//   var myVar = setInterval(myTimer, 1000);
//   function myTimer() {
//
//     let passedStations = temp.filter(train => train.expectedMilliseconds < moment().valueOf()); // stations already passed by the train
//     let lastPassedStation = passedStations[passedStations.length - 1]; // last station
//
//     let comingStations = temp.filter(train => train.expectedMilliseconds > moment().valueOf()); // stations already passed by the train
//
//     if (lastPassedStation && comingStations.length > 0) {
//       let stationTimeDifference = comingStations[0].expectedMilliseconds - lastPassedStation.expectedMilliseconds;
//       let timeUntilStation = comingStations[0].expectedMilliseconds - moment().valueOf();
//       let progress = 100*(1-(timeUntilStation/stationTimeDifference));
//
//       console.log("From: " + lastPassedStation.StopAreaName + " To: " + comingStations[0].StopAreaName + " Progress: " + progress + "%");
//       console.log("From: " + moment(lastPassedStation.expectedMilliseconds).format("DD MMM YYYY hh:mm a") + " To: " + moment(comingStations[0].expectedMilliseconds).format("DD MMM YYYY hh:mm a"));
//
//       // comingStations.forEach((train, i) => {
//       //   let stationTimeDifference = train.expectedMilliseconds - lastPassedStation.expectedMilliseconds;
//       //   let timeUntilStation = train.expectedMilliseconds - moment().valueOf();
//       //   let progress = 100*stationTimeDifference/(1-timeUntilStation);
//       //   console.log("From: " + lastPassedStation.StopAreaName + " To: " + train.StopAreaName + " Progress: " + progress + "%");
//       //   //
//       //   // if (moment().isAfter(moment(train.TimeTabledDateTime))) {
//       //   //   console.log(moment(train.TimeTabledDateTime).fromNow());
//       //   // }
//       // });
//     }
//
//   }
// });

document.getElementById('root').innerHTML = "hej";
