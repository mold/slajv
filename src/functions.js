import _ from "lodash";
import moment from "moment";

export function getStationTrains(siteId) {
	return fetch("http://localhost:3000/realtimeInformation?siteid="+siteId)
		.then(res => res.json().then(json=>{
			return json.ResponseData.Metros;
		}));
}

export function getSiteId(station) {
	return fetch("http://localhost:3000/locationLookup?station="+station)
		.then(res => res.json().then(json => {
			return json.ResponseData[0];
		}));
}