import map from "./map-opt.svg";
import {
	stationsFull
} from "../constants.js"

function startAnimate() {
	const animate = (el, i, fwd) => {
		const opts = {
			"font-size": fwd ? "1.2em" : "1em",
			duration: "fast",
		}

		el.animate(opts, () => {
			setTimeout(
				() => animate(el, i, !fwd),
				0,
			)


		})
	}

	$("svg text").each((i, el) => {
		el = $(el);

		setTimeout(
			() => animate(el, i, true), +el.attr("x")
			// (i%20)*100,
		)
	})
}

const tweeencircle = (function() {
	let start;
	let prevStop;
	let duration = 3000;

	return function step(endPoint, timestamp) {
		if (!prevStop) {
			prevStop = endPoint;
			moveCircle(endPoint);
			return;
		}

		if (!start) {
			start = timestamp;
		}

		var progress = (timestamp - start) / duration;

		console.log("progress", progress)

		console.log("interpolate progres", interpolate(progress))

		moveCircle(prevStop + interpolate(progress) * (endPoint - prevStop));

		if (progress < 1) {
			window.requestAnimationFrame(step.bind(this, endPoint));
		} else {
			prevStop = endPoint;
			start = null;
		}
	};
})();

function interpolate(t) {
	return t;

	if (t <= 0.2) {
		return (Math.cos(Math.PI * t - Math.PI) + 1) 
	} else if (t <= 0.8) {
		return t;
	} else {
		return 1 - (Math.cos(Math.PI * t) + 1) ;
	}
}

function setup() {

	const sliderEl = $(".along-slider");
	const sliderValEl = $(".along-slider-val");
	const circle = $("#train-circle");
	const path = $("#path-train--line-11");
	const pathSnap = Snap("#path-train--line-11");

	sliderEl.on('mousemove', function() {
		sliderValEl.val(this.value);
		const distOnPath = this.value / 1000 * path[0].getTotalLength();
		const pointAtLength = pathSnap.getPointAtLength(distOnPath);

		const pointInSvg = {
			x: path.position().top - $(path[0].ownerSVGElement).position().top,
			y: path.position().left - $(path[0].ownerSVGElement).position().left,
		}

		Snap(circle[0]).transform('t' + pointAtLength.x + ',' + pointAtLength.y + 'r' + pointAtLength.alpha)

	});

	$("text").click(function(evt) {
		const station = stationsFull.find(stn => $(this).hasClass(nameToClass(stn.name)));

		console.log(station)

		window.requestAnimationFrame(tweeencircle.bind(this, station.pointOnPath[11]))

		// console.log(stationsFull)
	})

}


function nameToClass(name) {
	return "name-" + name.toLowerCase().replace(/\s/g, "-");
}

function moveCircle(pointOnPath) {
	const circle = $("#train-circle");
	const pathSnap = Snap("#path-train--line-11");
	const pointAtLength = pathSnap.getPointAtLength(pointOnPath * pathSnap.getTotalLength());

	Snap(circle[0]).transform('t' + pointAtLength.x + ',' + pointAtLength.y + 'r' + pointAtLength.alpha)
}

$(() => {
	fetch(map).then(res => {
		res.text().then(html => {
			$(".svg-container").html(html);
			setup();
		})
	});


})