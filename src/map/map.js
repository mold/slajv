import map from "./map-opt.svg";
import {
  stationsFull
} from "../constants.js"

export function moveTrainCircle(lineNumber, journeyNumber, fromStation, toStation, progress) {
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

  fromStation = stationsFull.find(stn => stn.name === fromStation);
  toStation = stationsFull.find(stn => stn.name === toStation);

  const distOnPath = toStation.pointOnPath[lineNumber] - (progress / 100) * (toStation.pointOnPath[lineNumber] - fromStation.pointOnPath[lineNumber]);
  const pointAtLength = pathSnap.getPointAtLength(distOnPath * pathSnap.getTotalLength());

  Snap(trainSvg).transform('t' + pointAtLength.x + ',' + pointAtLength.y + 'r' + pointAtLength.alpha);

  var pos = $(trainSvg).position();
  trainDiv.css({
    transform: `translate(${pos.left}px, ${pos.top}px)`
  });
}

export function removeTrainCircle(journeyNumber) {
  $("#train-div-" + journeyNumber).remove();
  $("#train-tracer-" + journeyNumber).remove();
}

function nameToClass(name) {
  return "name-" + name.toLowerCase().replace(/\s/g, "-");
}

$(() => {
  fetch(map).then(res => {
    res.text().then(html => {
      $(".svg-container").html(html);
    })
  });
})
