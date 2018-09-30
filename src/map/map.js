import map from "./map-opt.svg";
import {
  stationsFull
} from "../constants.js"

let trainimations = {
  0: {
    startTime: 0,
    elapsedTime: 0,
    duration: 0,
    startDistOnPath: 0,
    targetDistOnPath: 0,
    trainDiv: null,
    trainSvg: null,
    pathSnap: null,
    journeyNumber: 0,
  }
};
let track;

function tweenTrainCircle(
  trainDiv,
  trainSvg,
  pathSnap,
  journeyNumber,
  to,
  duration,
) {
  // if (!track) track = journeyNumber;

  // if (journeyNumber !== track) return;

  var start;

  if (!trainimations[journeyNumber]) {
    // first time, no animation bruv


    const ta = trainimations[journeyNumber] = {
      startTime: performance.now(),
      elapsedTime: 0,
      duration,
      startDistOnPath: to,
      targetDistOnPath: to,
      trainDiv,
      trainSvg,
      pathSnap,
      journeyNumber,
    };

    // console.log("first time:", ta, _getDistOnPath(ta));
    positionCircle(ta.trainDiv, ta.trainSvg, ta.pathSnap, _getDistOnPath(ta));

    return;
  }

  const trainimation = trainimations[journeyNumber];

  Object.assign(trainimation, {
    // set start to current position
    startDistOnPath: _getDistOnPath(trainimation),
    targetDistOnPath: to,
    duration,
    elapsedTime: 0,
    startTime: performance.now(),
  });

  // console.log("start moving:", trainimation, _getDistOnPath(trainimation));

  // console.log("trainimations:", trainimations);

  window.requestAnimationFrame(step.bind(this, trainimation));

  function step(_ta, timestamp) {
    _ta.elapsedTime = Math.min(timestamp - _ta.startTime, _ta.duration);

    positionCircle(_ta.trainDiv, _ta.trainSvg, _ta.pathSnap, _getDistOnPath(_ta));

    if (_ta.elapsedTime < _ta.duration) {
      return window.requestAnimationFrame(step.bind(this, _ta));
    }

    // console.log("done moving:", _ta, _getDistOnPath(_ta));
  }
};

function _getDistOnPath({
  duration,
  elapsedTime,
  startDistOnPath,
  targetDistOnPath
}) {
  return startDistOnPath + (targetDistOnPath - startDistOnPath) * (elapsedTime / duration);
}

function positionCircle(trainDiv, trainSvg, pathSnap, distOnPath) {
  const pointAtLength = pathSnap.getPointAtLength(distOnPath * pathSnap.getTotalLength());

  Snap(trainSvg).transform('t' + pointAtLength.x + ',' + pointAtLength.y + 'r' + pointAtLength.alpha);

  var pos = $(trainSvg).position();
  trainDiv.css({
    transform: `translate(${pos.left}px, ${pos.top}px)`
  });
}

export function moveTrainCircle(lineNumber, journeyNumber, fromStation, toStation, progress, animationDuration) {
  var trainDiv = $("#train-div-" + journeyNumber);
  var trainSvg = $("#train-tracer-" + journeyNumber)[0];

  const path = $("#path-train--line-" + lineNumber);

  if (!trainSvg) {
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse'); //Create a path in SVG's namespace
    newElement.setAttribute("rx", "8");
    newElement.setAttribute("ry", "2");
    newElement.setAttribute("id", "train-tracer-" + journeyNumber);
    newElement.setAttribute("class", "train-tracer");
    $("#svg-map")[0].appendChild(newElement);

    trainSvg = newElement;

    trainDiv = $("<div>").attr({
      id: "train-div-" + journeyNumber,
      class: "train-div"
    }).appendTo($("body"));
  }

  const pathSnap = Snap("#path-train--line-" + lineNumber);

  let fromstn = fromStation,
    tostn = toStation;
  fromStation = stationsFull.find(stn => stn.name === fromStation);
  toStation = stationsFull.find(stn => stn.name === toStation);

  if (!fromStation || !toStation) {
    console.log("Couldn't find stations:", fromstn, tostn)
  }

  const distOnPath = toStation.pointOnPath[lineNumber] - (progress / 100) * (toStation.pointOnPath[lineNumber] - fromStation.pointOnPath[lineNumber]);

  if (animationDuration) {
    tweenTrainCircle(trainDiv, trainSvg, pathSnap, journeyNumber, distOnPath, animationDuration);
  } else {
    positionCircle(trainDiv, trainSvg, pathSnap, distOnPath);

  }
}

export function removeTrainCircle(journeyNumber) {
  $("#train-div-" + journeyNumber).remove();
  $("#train-tracer-" + journeyNumber).remove();
}

function nameToClass(name) {
  return "name-" + name.toLowerCase().replace(/\s/g, "-");
}


window.line = 18;

function setup() {

  const sliderEl = $(".along-slider");
  const sliderValEl = $(".along-slider-val");
  const circle = $("#train-circle");

  sliderEl.on('mousemove', function () {
    const path = $("#path-train--line-" + window.line);
    const pathSnap = Snap("#path-train--line-" + window.line);
    sliderValEl.val(this.value);
    const distOnPath = this.value / 1000 * path[0].getTotalLength();
    const pointAtLength = pathSnap.getPointAtLength(distOnPath);

    const pointInSvg = {
      x: path.position().top - $(path[0].ownerSVGElement).position().top,
      y: path.position().left - $(path[0].ownerSVGElement).position().left,
    }

    Snap(circle[0]).transform('t' + pointAtLength.x + ',' + pointAtLength.y + 'r' + pointAtLength.alpha)

  });

  sliderEl.on("mouseup", function () {
    console.log(this.value / 1000)
  })

  $("text").click(function (evt) {
    const station = stationsFull.find(stn => $(this).hasClass(nameToClass(stn.name)));

    console.log(station)

    moveTrainCircle(window.line, 1, station.name, station.name, 1);

    // console.log(stationsFull)
  })


}

function nameToClass(name) {
  return "name-" + name.toLowerCase().replace(/\s/g, "-").replace(":", "");
}


$(() => {
  fetch(map).then(res => {
    res.text().then(html => {
      $(".svg-container").html(html);
      setup();
    })
  });
})