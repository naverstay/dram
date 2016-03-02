$(function ($) {

    var cancel = false,
        dataString,
        xhrRunninng = !1,
        ind = 0,
        csvContent = "data:text/csv;charset=utf-8,";

    $('#stop_request').on('click', function () {
        cancel = true;
    });

    $('#send_request').on('click', function () {

        cancel = false;

        var status = $('#status'),
            result = $('#result'),
            lines = $('#lines'),
            lat_size = $('#lat_size').val() * 1,
            lon_size = $('#lon_size').val() * 1,
            lLat = parseInt($('#l_lat').val()),
            lLon = parseInt($('#l_lon').val()),
            rLat = parseInt($('#r_lat').val()),
            rLon = parseInt($('#r_lon').val());

        var startLat = lLat,
            startLon = lLon;

        result.val('');

        ind = 0;

        console.log('start', lLat, lLon, lat_size, lon_size);

        function saveResult() {
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", 'data_lat_' + startLat + '_lon_' + startLon + '.csv');
            result.after($(link).text('save_lat_' + startLat + '_lon_' + startLon).css('color', '#fff'));
            link.click();
        }

        function looper(myLat, myLon) {

            status.text('lat: ' + myLat + ' lon: ' + myLon);

            if (cancel) {
                console.log('canceled');
                saveResult();
                return;
            }

            if (rLat > myLat) {
                myLon += lon_size;
                myLat = startLat;
            }

            if (rLon < myLon) {
                console.log('done');
                saveResult();

            } else {

                setTimeout(function () {
                    console.log('continue');

                    $.ajax({
                        url: 'http://www.airtel.in/leap/rest/networks/networksitesdata?latitude=' + myLat +
                        '&longitude=' + myLon,
                        type: "GET",
                        Accept: "application/json",
                        contentType: "application/json",
                        dataType: "json",
                        crossDomain: !0,
                        success: function (e) {
                            networkApiResp = adwordmanager.extractresponse(e);

                            //console.log(networkApiResp);

                            $.each(networkApiResp, function (key, value) {

                                var newString = '';

                                for (var key in value) {
                                    if (value.hasOwnProperty(key)) {
                                        newString += ',' + key + ':' + value[key];
                                    }
                                }

                                //result.val(result.val() + ' status:' + value.plannedSiteStatus + ' pin:' + value.pincode + ' lat:' + value.latitude + ' lon:' + value.longitude);

                                lines.text('csv lines: ' + ind++);

                                csvContent += "\n" + newString.replace(/^,/, '');

                                result.val(csvContent);

                            });

                            myLat -= lat_size;

                            console.log('success');

                            looper(myLat, myLon);

                        },
                        error: function (e) {
                            console.log('error on lat:' + myLat + ' lon:' + myLon + ', trying next...', e);
                            myLat -= lat_size;
                            looper(myLat, myLon);

                        },
                        beforeSend: function (e) {
                            return e.setRequestHeader("Content-Type", "application/json"), xhrRunninng ? !1 : void(xhrRunninng = !0)
                        },
                        complete: function () {
                            xhrRunninng = !1
                        }
                    });

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