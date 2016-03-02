var http = require('http');
var static = require('node-static');
var file = new static.Server('.');

http.createServer(function (req, res) {
    file.serve(req, res);
}).listen(8080);

console.log('Server running on port 8080');

var fs = require('fs');
var express = require('express');
var xml2js = require('xml2js');

var xml_parser = new xml2js.Parser();

var app = express();

var rslt_file = '37-72_32-80.csv';

fs.writeFile(rslt_file, "data:text/csv;charset=utf-8,", function (err) {
    if (err) {
        return console.log(err);
    }

    console.log(err || "The file was saved!");

});

function saveData(data) {
    fs.appendFile(rslt_file, data, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('Data saved');
    });
}

var lat_size = .02,
    lon_size = .02,
    lLat = 37,
    lLon = 72,
    rLat = 32,
    rLon = 80,
    csvContent = "";

var startLat = lLat,
    startLon = lLon,
    endLat = rLat,
    endLon = rLon,
    ind = 0;

console.log('start', lLat, lLon, lat_size, lon_size);

function looper(myLat, myLon) {

    console.log('lat: ' + myLat + ' lon: ' + myLon);

    /*  if (cancel) {
     console.log('canceled');
     saveResult();
     return;
     }*/

    //console.log(rLat, myLat, rLon, myLon);

    if (rLat > myLat) {
        myLon += lon_size;
        myLat = startLat;
    }

    if (rLon < myLon - lon_size * 2) {
        console.log('done');

    } else {

        setTimeout(function () {

            try {
                var digits = 4,
                    filtersArr = [],
                    isHeatMap = 0,
                    prvRtnCount = '',
                    zoomDcrs = 1,
                    zoom = 12,
                    markerLimit = 500,
                    maxlat = myLat,
                    minlat = myLat - lat_size,
                    maxlng = myLon,
                    minlng = myLon - lon_size,
                    dataURL = 'http://opensignal.com/app/getdata.php?'
                    + 'maxlat=' + maxlat.toFixed(digits) + '&' 
                    + 'minlat=' + minlat.toFixed(digits) + '&' 
                    + 'maxlng=' + maxlng.toFixed(digits) + '&' 
                    + 'minlng=' + minlng.toFixed(digits) + '&' 
                    + 'netwkID=' + filtersArr["netwkID"] + '&' 
                    + 'netwkType=' + filtersArr["netwkType"] + '&' 
                    + 'isHeatMap=' + isHeatMap + '&' 
                    + 'prvRtnCount=' + prvRtnCount + '&' 
                    + 'zoomDcrs=' + zoomDcrs + '&' 
                    + 'zoom=' + zoom + '&' 
                    + 'markerLimit=' + markerLimit + '&' 
                    + 'client=' + "auth1ZA294CK772Q4clnt294ri6Qa9" + '&' 
                    + 'version_code=' + 999;
               
/*
               
                    dataURL = 'http://opensignal.com/app/getdata.php'
                    + 'maxlat=' + maxlat.toFixed(digits) +
                    + 'minlat=' + minlat.toFixed(digits) +
                    + 'maxlng=' + maxlng.toFixed(digits) +
                    + 'minlng=' + minlng.toFixed(digits) +
                    + 'netwkID=' + filtersArr["netwkID"] +
                    + 'netwkType=' + filtersArr["netwkType"] +
                    + 'isHeatMap=' + isHeatMap +
                    + 'prvRtnCount=' + prvRtnCount +
                    + 'zoomDcrs=' + zoomDcrs +
                    + 'zoom=' + zoom +
                    + 'markerLimit=' + markerLimit +
                    + 'client=' + "auth1ZA294CK772Q4clnt294ri6Qa9" +
                    + 'version_code=' + 999;
               
*/

                console.log('continue with',
                    maxlat,
                    minlat,
                    maxlng,
                    minlng,
                    dataURL);

                app.post(dataURL,

                    function (req, res) {
                        console.log('POST /');
                        console.dir(req.body);
                       
                    },
                    function (xml) {
                    console.log('done', xml);
                    xml_parser.parseString(xml, function (err, result) {
                        console.dir(result);
                        console.log('Done');
                    });

                    /*$('marker', xml)
                     .each(function (i) {

                     var marker = $(this);

                     csvContent += "\n" + 'network_id:' + marker.attr('network_id')
                     + ',network_name:' + marker.attr('network_name')
                     + ',name:' + marker.attr('name')
                     + ',lat:' + marker.attr('lat')
                     + ',lng:' + marker.attr('lng')
                     + ',orderfield:' + marker.attr('orderfield');


                     console.log('csv lines: ' + ind++);

                     if (ind > 10) {
                     saveData(csvContent);

                     csvContent = '';
                     }

                     });*/

                    myLat -= lat_size;

                    looper(myLat, myLon);

                });

            }
            catch
                (e) {
                console.log(e);

                myLat -= lat_size;

                looper(myLat, myLon);
            }

        }, 5);

    }
}

looper(lLat, lLon);



