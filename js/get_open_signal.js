$(function ($) {

    var cancel = false,
        dataString,
        xhrRunninng = !1,
        ind = 0,
        csvContent = "";

    $('#stop_request').on('click', function () {
        cancel = true;
    });

    $('#send_request').on('click', function () {

        cancel = false;

        csvContent = "data:text/csv;charset=utf-8,";

        var quickCount, networkCount;

        function saveResult() {
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", 'data_lat_' + startLat + '_lon_' + startLon + '_e_lat_' + endLat + '_lon_' + endLon + '.csv');
            result.after($(link).text('save_lat_' + startLat + '_lon_' + startLon).css('color', '#fff'));
            //link.click();
        }

        var status = $('#status'),
            result = $('#result'),
            lines = $('#lines'),
            lat_size = $('#lat_size').val() * 1,
            lon_size = $('#lon_size').val() * 1,
            lLat = $('#l_lat').val() * 1,
            lLon = $('#l_lon').val() * 1,
            rLat = $('#r_lat').val() * 1,
            rLon = $('#r_lon').val() * 1;

        var startLat = lLat,
            startLon = lLon,
            endLat = rLat,
            endLon = rLon;

        result.val('');

        ind = 0;

        console.log('start', lLat, lLon, lat_size, lon_size);

        function looper(myLat, myLon) {

            status.text('lat: ' + myLat + ' lon: ' + myLon);

            if (cancel) {
                console.log('canceled');
                saveResult();
                return;
            }

            console.log(rLat, myLat, rLon, myLon);

            if (rLat > myLat) {
                myLon += lon_size;
                myLat = startLat;
            }

            if (rLon < myLon - lon_size * 2) {
                console.log('done');
                saveResult();

            } else {

                setTimeout(function () {

                    try {
                        var dataURL = 'http://opensignal.com/app/getdata.php',
                            digits = 4,
                            filtersArr = [],
                            isHeatMap = 0,
                            prvRtnCount = '',
                            zoomDcrs = 1,
                            zoom = 12,
                            markerLimit = 500,
                            maxlat = myLat,
                            minlat = myLat - lat_size,
                            maxlng = myLon,
                            minlng = myLon - lon_size;

                        console.log('continue with',
                            maxlat,
                            minlat,
                            maxlng,
                            minlng,
                            filtersArr["netwkID"],
                            filtersArr["netwkType"],
                            'http://opensignal.com/app/getdata.php?'
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
                                + 'version_code=' + 999);

                        $.post(dataURL, {
                            maxlat: maxlat.toFixed(digits),
                            minlat: minlat.toFixed(digits),
                            maxlng: maxlng.toFixed(digits),
                            minlng: minlng.toFixed(digits),
                            netwkID: filtersArr["netwkID"],
                            netwkType: filtersArr["netwkType"],
                            isHeatMap: isHeatMap,
                            prvRtnCount: prvRtnCount,
                            zoomDcrs: zoomDcrs,
                            zoom: zoom,
                            markerLimit: markerLimit,
                            client: "auth1ZA294CK772Q4clnt294ri6Qa9",
                            version_code: 999
                        }, function (xml) {

                            $('marker', xml)
                                .each(function (i) {

                                    var marker = $(this);

                                    csvContent += "\n" + 'network_id:' + marker.attr('network_id')
                                        + ',network_name:' + marker.attr('network_name')
                                        + ',name:' + marker.attr('name')
                                        + ',lat:' + marker.attr('lat')
                                        + ',lng:' + marker.attr('lng')
                                        + ',orderfield:' + marker.attr('orderfield');

                                    lines.text('csv lines: ' + ind++);

                                    result.val(csvContent);

                                });

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

        return false;
    });

});

var decoder = ["response", "responseCode", "responseLogged", "responseData", "length", "charAt", "substring", "parse"], adwordmanager = {
    extractresponse: function (e) {
        var t = e[decoder[0]], a = t[decoder[1]], o = t[decoder[2]], i = t[decoder[3]];
        if (o)for (var n = 0; a > n; n++)i = i[decoder[5]](i[decoder[4]] - 1) + i[decoder[6]](0, i[decoder[4]] - 1); else for (var r = 0; a > r; r++)i = i[decoder[6]](1, i[decoder[4]]) + i[decoder[5]](0);
        var s = atob(i), l = JSON[decoder[7]](s);
        return l
    }
}