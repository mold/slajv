const SL = require('sl-api')
const express = require('express')
const app = express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.send('Hello World!'))
//'http://api.sl.se/api2/realtimedeparturesV4.json?key=19fad94bbe2f406990cc2592604f4cbf&siteid=9192&timewindow=1'
var sl = new SL({
    realtimeInformation: "19fad94bbe2f406990cc2592604f4cbf",
    locationLookup: "8abf89f2458f4af8b1c011a957da976c"
}, 'json');

app.get('/realtimeInformation', (req, res) => {
    sl.realtimeInformation({
        siteid: req.query.siteid,
        timewindow: 60
    }).then((slRes) => {
        console.log(slRes)
        res.send(slRes)
    })
    .fail(console.error)
})

app.get('/locationLookup', (req, res) => {
    sl.locationLookup({
        searchstring: req.query.station
    }).then((slRes) => {
        console.log(slRes)
        res.send(slRes)
    })
    .fail(console.error)
})



app.listen(3000, () => console.log('Example app listening on port 3000!'))