// Avoid `console` errors in browsers that lack a console. From http://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
(function () {
    var method;
    var noop = function () {
    };
    var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
    var length = methods.length;
    var console = (window.console = window.console || {});
    while (length--) {
        method = methods[length];
        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

var MAX_ZOOM = 15;
var MIN_ZOOM = 4;
var LOW_OPACITY = 0.43;  // when showing zoom in/out tiles
var TILE_OPACITY = .6;
var loadingHTML = '<div id="towerNumMsg"><div id="loading" class="loading"><img src="http://d2cpknllkuywe0.cloudfront.net/images/loading.gif" /></div></div>';
var loadingHeatmapHTML = '<div id="loading" class="loading" style="position:relative;top:8px"><img src="http://d2cpknllkuywe0.cloudfront.net/images/loading.gif" /></div>';
var bestNetwork;
var bestNetworkName;
var bestNetworkCountry;
var sumCityPercent;
var sumWorldPercent;
var tableSortOrder = 1;
var tableSortColumn = 1;
var tableSorterOptions = {
    textExtraction: function (node) {
        return node.getAttribute('score');
    },
    sortInitialOrder: 'desc'
}; //The desc command sets default to descending order and means the first time you click on a new column it will sort by descending order.
var loadingNetRankHTML = '<div id="loadingNetRank" class="loading"><img src="http://d2cpknllkuywe0.cloudfront.net/images/loading-straight.gif" /></div>';
var updateRefreshHTML = '<p id="updateRefresh"><img src="http://d2cpknllkuywe0.cloudfront.net/images/newdesign/logo_networkRank_168x26.png" alt="logo_networkRank_168x26" alt="NetworkRank"/>' /*<a id="mapUpdate"><img src="http://s3.amazonaws.com/osmwww/images/update.png" /></a>+'*/ + ' </p>';
var allNetworksHTML = '<div><div><input class="filterTower" name="filterTower" type="radio" id="all" /></div><p id="all-para">All Networks <span class="towerNumCount"></span></p></div>';
var towerListTableHTML = '<table id="towerListTable" align="center" class="listTable"  cellpadding="0" cellspacing="0" class="tablesorter"><thead><tr><th class="keepField network" id="networkHeading">Network</th><th class="keepField overall headerSortDown">Overall</th><th class="signal">Signal</th><th class="download">Download</th><th class="upload">Upload</th><th class="ping">Ping</th><th class="reliability">Reliability</th></tr></thead><tbody></tbody></table>';
var netwkTypeListHTML = '<div id="netwkTypeList" style="display:none"><div id="netwkTypeFilter2GDiv"><a class="cssPop netwkTypePopup" style="text-decoration:none" href="/blog/2011/02/18/what-the-2-75g/"><img src="http://d2cpknllkuywe0.cloudfront.net/images/info.png" /><span>2G technology includes voice calls and some basic data services... (more)</span></a><input class="netwkTypeFilter" type="checkbox" checked="checked" name="netwkTypeFilter" value="2G" type="radio" id="2G" />2G</div><div id="netwkTypeFilter3GDiv"><a class="cssPop netwkTypePopup" href="/blog/2011/02/18/what-the-2-75g/" style="text-decoration:none"><img src="http://d2cpknllkuywe0.cloudfront.net/images/info.png" /><span>3G technology includes voice calls and high speed data services... (more)</span></a><input class="netwkTypeFilter" type="checkbox" checked="checked" name="netwkTypeFilter" value="3G" type="radio" id="3G" />3G</div><div id="netwkTypeFilter4GDiv"><a class="cssPop netwkTypePopup" href="/blog/2011/02/18/what-the-2-75g/" style="text-decoration:none"><img src="http://d2cpknllkuywe0.cloudfront.net/images/info.png" /><span>4G is the latest generation technology that supports broadband like data speeds... (more)</span></a><input class="netwkTypeFilter" type="checkbox" checked="checked" name="netwkTypeFilter" value="4G" type="radio" id="4G" />4G</div></div>';
Number.prototype.formatNumber = function (bb, d, t) {
    var n = this,
        bb = isNaN(bb = Math.abs(bb)) ? 2 : bb,
        d = d === undefined ? "," : d,
        t = t === undefined ? "." : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0)
                .toFixed(bb), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j)
            .replace(/(\d{3})(?=\d)/g, "$1" + t) + (bb ? d + Math.abs(n - i)
            .toFixed(bb)
            .slice(2) : "");
};
/* NetWorkRank Bren Changed */
(function ($) {
    $.fn.clearField = function (s) {
        s = jQuery.extend({
            blurClass: 'clearFieldBlurred',
            activeClass: 'clearFieldActive',
            attribute: 'rel',
            value: ''
        }, s);
        return $(this)
            .each(function () {
                var el = $(this);
                s.value = el.val();
                if (el.attr(s.attribute) === undefined) {
                    el.attr(s.attribute, el.val())
                        .addClass(s.blurClass);
                } else {
                    s.value = el.attr(s.attribute);
                }
                el.focus(function () {
                    if (el.val() == el.attr(s.attribute)) {
                        el.val('')
                            .removeClass(s.blurClass)
                            .addClass(s.activeClass);
                    }
                });
                el.blur(function () {
                    if (el.val() === '') {
                        el.val(el.attr(s.attribute))
                            .removeClass(s.activeClass)
                            .addClass(s.blurClass);
                    }
                });
            });
    };
})(jQuery);
if (typeof mmlocation == 'undefined') {
    var mmlocation = 0;
}

function mapInit() {
    var latlng;
    if (posOveride) {
        latlng = new google.maps.LatLng(latOveride, lngOveride);
        $('#brenInfo')
            .append("Location: <b>Manual Link</b>");
    } else if (mmlocation) {
        latlng = new google.maps.LatLng(mmlat, mmlng);
        $('#brenInfo')
            .append("Location: <b>MM IP Based</b>");
    } else if (google.loader.ClientLocation) {
        latlng = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
        $('#brenInfo')
            .append("Location: <b>Google IP Based</b>");
    } else {
        latlng = new google.maps.LatLng(37.777125, -122.419644);
        $('#brenInfo')
            .append("Location: <b>Default (San Francisco)</b>");
    }
    var settings = {
        zoom: initZoom,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: false,
        scaleControl: true,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        }
    };

    var styles_map = [{
        featureType: "road",
        elementType: "all",
        stylers: [{
            visibility: "simplified"
        }]
    }, {
        featureType: "road.highway",
        elementType: "all",
        stylers: [{
            lightness: -4
        }]
    }, {
        featureType: "road.arterial",
        elementType: "all",
        stylers: [{
            lightness: -4
        }]
    }, {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [
            {visibility: "on"},
            {color: "#d8dcdf"}
        ]
    }];

    geocoder = new google.maps.Geocoder();
    google.maps.controlStyle = 'azteca';
    map = new google.maps.Map(document.getElementById("map"), settings);
    // If boundary rectangle is defined then draw on a rectangle (SAM 20130702)
    if (typeof bounds_rect !== "undefined") {
        var rectangle = new google.maps.Rectangle({
            strokeColor: '#FFFFFF',
            strokeOpacity: 0.8,
            strokeWeight: 0,
            fillColor: '#000000',
            fillOpacity: 0.3,
            map: map,
            bounds: bounds_rect
        });
    }
    var input = document.getElementById('search_term');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        // console.log("place_changed");
        input.className = '';
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            input.className = 'notfound';
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
            var place_bounds = map.getBounds();
            var newZoom = map.getZoom() + 1;
            if (newZoom < MIN_ZOOM) {
                newZoom = MIN_ZOOM;
            } // Bren added to prevent from zooming out to a level we don't show coverage maps
            if (newZoom > MAX_ZOOM) {
                newZoom = MAX_ZOOM;
            } // Bren added to prevent from zooming in to a level we don't show coverage maps
            map.setZoom(newZoom);
            // draw_rectangle(place);
            //update_form_place(place);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        }
        //alert("resetting1");
        //resetFilters();
    });
    var address = document.getElementById('search_term');
    $('#search_term')
        .keypress(function (e) {
            if (e.which == 13) {
                geocoder.geocode({
                    'address': address.value
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var loc = results[0].geometry.location;
                        map.fitBounds(results[0].geometry.viewport);
                        map.setCenter(results[0].geometry.location);
                        // use loc.lat(), loc.lng()
                        var newZoom = map.getZoom() + 1;
                        if (newZoom < MIN_ZOOM) {
                            newZoom = MIN_ZOOM;
                        } // Bren added to prevent from zooming out to a level we don't show coverage maps
                        if (newZoom > MAX_ZOOM) {
                            newZoom = MAX_ZOOM;
                        } // Bren added to prevent from zooming in to a level we don't show coverage maps
                        // console.log("updating zoom");
                        map.setZoom(newZoom);
                        resetFilters();
                    } // else {
                    //	alert("Not found: " + status + address.value );
                    //}
                });
            }
        });
    var styledMapOptions = {
        name: "OpenSignalMaps"
    };

    var jazzMapType = new google.maps.StyledMapType(styles_map, styledMapOptions);
    map.mapTypes.set('opensignalmaps', jazzMapType);
    map.setMapTypeId('opensignalmaps');
    var overlayDivTEMP = '<div id="overlayDiv"><div id="map-overlay-container" style="cursor:pointer"><div>';
    /* NetWorkRank Bren Changed */
    var controlTowersHTML;
    var controlWifiHTML;
    if (startHeatMap == 1) {
        controlTowersHTML = '<a class="controlMode" id="controlModeHeatmap">Coverage</a><a id="controlModeTower" class="controlMode switchedOff">Towers</a>';
    } else {
        controlTowersHTML = '<a class="controlMode switchedOff" id="controlModeHeatmap">Coverage</a><a id="controlModeTower" class="controlMode">Towers</a>';
    }
    //overlayDivTEMP+=controlTowersHTML; /* NetWorkRank Bren Changed */
    if (startWifi == 1) { /* NetWorkRank Bren Changed */
        controlWifiHTML = '<a class="controlMode switchedOff" id="controlModeCell">Cellular</a> <a id="controlModeWifi" class="controlMode">Wifi</a>';
    } else {
        controlWifiHTML = '<a class="controlMode" id="controlModeCell">Cellular</a> <a id="controlModeWifi" class="controlMode switchedOff">Wifi</a>';
    }
    $('#map')
        .append('<div class="map-overlay miniView" id="networkRanker" style="position:absolute;bottom:-20px;overflow:hidden;right:-20px;height:320px;width:500px;z-index:1000"><div id="map-slide-control"></div><div id="map-control-new-container"><div id="map-control-new"><div class="controlDivider" id="control-Reset"><div id="resetFilters">Reset</div></div>' + /*<div class="controlDivider" id="control-cellWifi">'+controlWifiHTML+'</div>*/ '<div class="controlDivider" id="control-networkType"></div><div class="controlDivider" id="control-CoverageTower">' + controlTowersHTML + '</div></div><div id="towerList"></div></div></div>'); // BREN ADDED
    $('#controlModeWifi')
        .click(function () {
            postNotification('Wifi isn\'t set up yet.  That would be ridiculous');
        });
    overlayDivTEMP += '</div><div class="map-overlay" classname="map-overlay" id="map-control-info"><div id="map-control-bar" class="bot-brdr" classname="bot-brdr"><a title="Launch/Hide Full Screen Mode" id="controlBarFullScrn">Full Screen</a><div id="heatmapLoadingContainer"></div></div><div id="map-control-body">' + loadingHTML + '</div></div></div></div>'; //BREN REMOVED towerlist div
    $('#container')
        .append('<div style="display:none">' + overlayDivTEMP + '</div>');
    var overlayDiv = document.getElementById('overlayDiv');
    var controlDiv = document.getElementById('control-CoverageTower');
    /* NetWorkRank Bren Changed */
    overlayDiv.index = 1;
    google.maps.event.addDomListener(controlDiv, 'click', function () {
        switchMap(map);
    });
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(overlayDiv);
    google.maps.event.addListener(map, 'idle', function () {
        if (startHeatMap == 1) { // Check if link is asking to start with heatmap.  If so, pretend heatmap is off & switch to heatmap.
            isHeatMap = 0;
            startHeatMap = 0; // Reset value so it won't do it on next tilesloaded event.
            switchMap(map);
        } else {
            updateMap(map, 0);
        }
    });
    if (isHeatMap === 0) {
        $('.map-overlay#networkRanker')
            .addClass('towers');
    }

    map.addListener('zoom_changed', function () {
        if (isHeatMap) {
            var zoom = map.getZoom()

            if (zoom < MIN_ZOOM || zoom > MAX_ZOOM) {
                if (zoom < MIN_ZOOM) {
                    postNotification("Heatmaps can't be shown at this zoom.  Please zoom in.", true);
                } else {
                    postNotification("Heatmaps can't be shown at this zoom.  Please zoom out.", true);
                }
                return
            }


            // this is pretty brittle to get the tiles overlay
            var overlayTiles = map.overlayMapTypes.getAt(0);
            if (!overlayTiles) return;
            overlayTiles.setOpacity(opacity(zoom));
        }
    });

}

var popupStayClosed = !!localStorage.getItem('popupStayClosed');

function switchMap(map) {
    if (isHeatMap === 0) {
        clearOverlays();
        // map.overlayMapTypes.insertAt(0, heatmap);
        isHeatMap = 1;
        getMarkers(map, isHeatMap, 1);
        $('#controlModeHeatmap')
            .removeClass('switchedOff');
        $('#controlModeTower')
            .addClass('switchedOff');
        $('#networkRanker')
            .removeClass('towers');
        $('#networkRanker')
            .addClass('heatmaps');
        $('#all-row-td')
            .removeClass('towers');
        $('#all-row-td')
            .addClass('heatmaps');
        //console.log('hi sina' + menuSlide);
        if (menuSlide === 0) {
            $('.listTable th:not(.keepField)')
                .hide();
            $('.listTable td:not(.keepField)')
                .hide();
        }
        $('#mapNotification')
            .show();
    } else if (isHeatMap == 1) {
        isHeatMap = 0;
        if (map.overlayMapTypes.length !== 0) {
            map.overlayMapTypes.removeAt(0);
        }
        clearOverlays();
        //customFilterInteraction(); // Display custom errors here (if switching from 4G heatmap view to tower view).
        getMarkers(map, isHeatMap, 0); //heatmaptoo would usually be 1 for this, but redundant as done manually above
        limitMarkers(markerLimit);
        $('#controlModeHeatmap')
            .addClass('switchedOff');
        $('#controlModeTower')
            .removeClass('switchedOff');
        $('#networkRanker')
            .removeClass('heatmaps');
        $('#networkRanker')
            .addClass('towers');
        $('#all-row-td')
            .removeClass('heatmaps');
        $('#all-row-td')
            .addClass('towers');
        $('#mapNotification')
            .hide();
    }
}

function postNotification(message, fade) {
    if (typeof fade === 'undefined') fade = true;
    if ($('#mapNotification')
            .length === 0) {
        $('#map-overlay-container')
            .after('<div id="mapNotification"></div>');
    }
    $('#mapNotification')
        .replaceWith('<div id="mapNotification" style="display:none"><p>' + message + '</p></div>');
    $('#mapNotification')
        .fadeIn(200);
    if (fade) {
        $('#mapNotification')
            .delay(6000)
            .fadeOut(400);
    }

    $('#mapNotification .close').one('click', function () {
        $('#mapNotification').fadeOut(400).remove();
        popupStayClosed = true;
        localStorage.setItem('popupStayClosed', true);
    });

}

function refreshHeatMap(map, heatmaptoo) {
    clearOverlays();
    if (heatmaptoo == 1) {
        if (map.overlayMapTypes.length !== 0) {
            map.overlayMapTypes.removeAt(0);
        }
        map.overlayMapTypes.insertAt(0, heatmap);
    }
}

function updateMap(map, heatmaptoo) {
    if (isHeatMap === 0) {
        if (filtersArr["netwkID"].length >= 1 || filtersArr["netwkType"].length >= 1) {
            clearOverlays();
        }
    }
    getMarkers(map, isHeatMap, heatmaptoo);
}

function limitMarkers(markerLimit) {
    if (markersArray) {
        for (i in markersArray) {
            if (i > markerLimit - 1) {
                markersArray[i].setMap(null);
            }
        }
        var numToRemove = markersArray.length - markerLimit;
        removedMarkers = markersArray.splice(markerLimit, numToRemove);
        //alert(markerLimit+':'+numToRemove+' : '+markersArray.length);
    }
}

function clearOverlays() {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(null);
        }
    }
}

function addNetwkToArr(network_id, netwkName, netwkCount, isHeatMap, networkRankArr, networkCount) { /* NetWorkRank Bren Changed */
    if (network_id == "all" && isHeatMap === 0) {
        return false;
    } // Now continuing in heatmap mode to update network rank for all data
    //Assign Icon
    if (jQuery.inArray(network_id, networkArray) == -1 && network_id != "all") { // Keep all-networks out of network array
        networkArray.push(network_id);
        var iconID;
        if (networkArray.length > numIcons) {
            iconID = (networkArray.length % numIcons);
        } else {
            iconID = networkArray.length - 1;
        }
        if (jQuery.inArray(parseInt(network_id, 10), customIcons) == -1) {
            iconArray[network_id] = 'http://d2cpknllkuywe0.cloudfront.net/images/ant-icons/' + markerColors[iconID] + '.png';
        } else {
            iconArray[network_id] = 'http://d2cpknllkuywe0.cloudfront.net/images/ant-icons/' + network_id + '.png';
        }
    }
    //Build Network List HTML
    var networkRankHTML = "";
    if (isHeatMap == 1) {
        if (network_id != "all") {
            networkRankHTML += '<td class="keepField overall" score="' + (parseFloat(networkRankArr[network_id]['score'])) + '"><div class="greybar"><div class="greenbar" style="width:' + (parseFloat(networkRankArr[network_id]['score']) * 16)
                    .toFixed(1) + 'px;"></div></div></td>';
        } else {
            networkRankHTML += '<td class="keepField overall" id="spacer"></td>';
        }
        var rssi = (parseFloat(networkRankArr[network_id]['rssi']));
        var rssiadj = ((parseFloat(networkRankArr[network_id]['rssi']) - 4) / 12)
            .toFixed(2);
        if (rssiadj > 1) {
            rssiadj = 1;
        }
        if (rssiadj < 0.1) {
            rssiadj = 0.1;
        }
        networkRankHTML += '<td class="signal" score="' + (rssi * 100 / 31) + '"><div class="signalempty"><div class="signalfull" style="width:' + (rssiadj * 35)
                .toFixed(2) + 'px;"></div></div></td>';
        networkRankHTML += '<td class="download" score="' + (parseFloat(networkRankArr[network_id]['download_speed']) / 1000) + '">' + (parseFloat(networkRankArr[network_id]['download_speed']) / 1000)
                .toFixed(2) + ' Mbps</td>';
        networkRankHTML += '<td class="upload" score="' + (parseFloat(networkRankArr[network_id]['upload_speed']) / 1000) + '">' + (parseFloat(networkRankArr[network_id]['upload_speed']) / 1000)
                .toFixed(2) + ' Mbps</td>';
        networkRankHTML += '<td class="ping" score="' + (parseFloat(networkRankArr[network_id]['ping_time'])) + '">' + (parseFloat(networkRankArr[network_id]['ping_time']))
                .toFixed(0) + ' ms</td>';
        networkRankHTML += '<td class="reliability" score="' + (parseFloat(networkRankArr[network_id]['reliability']) * 100) + '">' + (parseFloat(networkRankArr[network_id]['reliability']) * 100)
                .toFixed(2) + '%</td>';
        if (typeof hdev != 'undefined' && hdev == 1) {
            networkRankHTML += '<td class="reliability" score="' + (parseFloat(networkRankArr[network_id]['qoe'])) + '">' + (parseFloat(networkRankArr[network_id]['qoe']))
                    .toFixed(2) + '</td>';
        }
        //networkRankHTML+='<td>'+(parseFloat(networkRankArr[network_id]['av_over_rssi'])+parseFloat(networkRankArr[network_id]['av_over_rssi'])).toFixed(0)+'</td>';
    }
    if (network_id == "all" && $('#all-row-content')
            .length !== 0) {
        $('#all-row')
            .html('<td id="all-row-td"  class="keepField network">' + allNetworksHTML + '</td><td id="all-row-content" class="keepField"></td>');
        $('#all-row-content')
            .replaceWith(networkRankHTML);
        /*
         $('#towerListTable th').each(function(index) {
         var tempWidth = $(this).innerWidth();
         var tempPadding = $(this).css('padding-left');
         $('tr#all-row td:nth-child('+(index+1)+')').css('width',tempWidth);
         $('tr#all-row td:nth-child('+(index+1)+')').css('padding-left',tempPadding);
         console.log(index+'-'+tempWidth+'-'+tempPadding);
         });*/
        return false;
    }
    if (isHeatMap == 1 && filtersArr["netwkID"].length === 0) { // The heatmap check is probably unnecessary here as it shouldn't be called in tower mode
        $('input#all')
            .prop('checked', true); // Check the all networks button if there aren't other filters active.
    }
    //if (network_id=="all") { return false; } //Finally, kill all activity for all row - its taken care of at this point
    var towerNumCountHTML = "";
    if (netwkCount !== undefined) {
        towerNumCountHTML = '(' + netwkCount + ')';
    }
    if (netwkDispArr.length < netDispLim && jQuery.inArray(network_id, netwkDispArr) == -1 && network_id != 'all') {
        $('#towerListTable tbody')
            .append('<tr id="' + network_id + '-row"><td class="keepField network"><div><div><input class="filterTower" name="filterTower" type="radio" id="' + network_id + '" /><img height="25" width="25" src="' + iconArray[network_id] + '" /></div><p id="' + network_id + '-para">' + netwkName + ' <span class="towerNumCount">' + towerNumCountHTML + '</span></p></div></td>' + networkRankHTML + '</tr>');
        if (networkRankSum == 1 && isHeatMap == 1) { // Also add summary bars to top
            if (networkCount == 1) {
                $('#rankBars #left')
                    .append('<div class="row" id="' + network_id + '-netrank-sum" score=' + parseFloat(networkRankArr[network_id]['score']) / 5 * 250 + '><div id="postion' + networkCount + '" ></div><div class="label" score=' + (parseFloat(networkRankArr[network_id]['score'])
                        .toFixed(1) * 20) + '>' + netwkName + '</div></div>');
            } else if (netwkDispArr.length < (netDispLim - 1)) {
                //Display one less network in the summary section (as space is tighter there)
                $('#rankBars #right')
                    .append('<div class="row" id="' + network_id + '-netrank-sum" score=' + parseFloat(networkRankArr[network_id]['score']) / 5 * 250 + '><div id="postion' + networkCount + '" ></div><div class="label" score=' + (parseFloat(networkRankArr[network_id]['score'])
                        .toFixed(1) * 20) + '>' + netwkName + '</div></div>');
            }
        }
        if (jQuery.inArray(parseInt(network_id, 10), filtersArr["netwkID"]) > -1) {
            //console.log('match for '+ network_id);
            $('input#' + network_id)
                .prop('checked', true);
            showNetwkTypeOptions(network_id);
        } else {
            //console.log('No match for '+ network_id);
        } // Give options for filtered networks
        netwkDispArr.push(network_id); // Keep track of displayed networks.
    } else if (jQuery.inArray(network_id, netwkDispArr) > -1 || network_id == 'all') { //Network is visible
        if (network_id != 'all') { //Need to include all network in updates below but trying to avoid some other functionality that isn't relevant (and used to be excluded when all network ended above).
            if (netwkCount !== undefined && isHeatMap === 0) { //If tower count - update values
                $('#' + network_id + '-para span.towerNumCount')
                    .html('(' + netwkCount + ')');
            }
            if (networkRankSum == 1 && isHeatMap == 1) { // Also add summary bars to top
                if (networkCount == 1) {
                    $('#rankBars #left')
                        .append('<div class="row" id="' + network_id + '-netrank-sum" score=' + parseFloat(networkRankArr[network_id]['score']) / 5 * 250 + '><div id="postion' + networkCount + '" ></div><div class="label" score=' + (parseFloat(networkRankArr[network_id]['score'])
                            .toFixed(1) * 20) + '>' + netwkName + '</div></div>');
                } else if (netwkDispArr.length < (netDispLim - 1)) {
                    //Display one less network in the summary section (as space is tighter there)
                    $('#rankBars #right')
                        .append('<div class="row" id="' + network_id + '-netrank-sum" score=' + parseFloat(networkRankArr[network_id]['score']) / 5 * 250 + '><div id="postion' + networkCount + '" ></div><div class="label" score=' + (parseFloat(networkRankArr[network_id]['score'])
                            .toFixed(1) * 20) + '>' + netwkName + '</div></div>');
                }
            }
        }
        // console.log(network_id);
        if (networkRankArr[network_id] !== undefined && isHeatMap == 1) { //If tower count - update values
            // console.log(network_id);
            $('#' + network_id + '-row td')
                .each(function (index) {
                    if (index == 1 && network_id != 'all') {
                        $(this)
                            .html('<div class="greybar"><div class="greenbar" style="width:' + (parseFloat(networkRankArr[network_id]['score']) * 16)
                                .toFixed(1) + 'px;"></div></div>');
                    }
                    if (index == 1) {
                        $(this)
                            .attr("score", (parseFloat(networkRankArr[network_id]['score'])));
                    }
                    var rssi = (parseFloat(networkRankArr[network_id]['rssi']));
                    var rssiadj = ((parseFloat(networkRankArr[network_id]['rssi']) - 4) / 12)
                        .toFixed(2);
                    if (rssiadj > 1) {
                        rssiadj = 1;
                    }
                    if (rssiadj < 0.1) {
                        rssiadj = 0.1;
                    }
                    if (index == 2) {
                        $(this)
                            .html('<div class="signalempty"><div class="signalfull" style="width:' + (rssiadj * 35)
                                .toFixed(2) + 'px;"></div></div>');
                        $(this)
                            .attr('score', (rssi * 100 / 31));
                    }
                    if (index == 3) {
                        $(this)
                            .html((parseFloat(networkRankArr[network_id]['download_speed']) / 1000)
                                .toFixed(2) + ' Mbps');
                        $(this)
                            .attr('score', parseFloat(networkRankArr[network_id]['download_speed']) / 1000);
                    }
                    if (index == 4) {
                        $(this)
                            .html((parseFloat(networkRankArr[network_id]['upload_speed']) / 1000)
                                .toFixed(2) + ' Mbps');
                        $(this)
                            .attr('score', parseFloat(networkRankArr[network_id]['upload_speed']) / 1000);
                    }
                    if (index == 5) {
                        $(this)
                            .html((parseFloat(networkRankArr[network_id]['ping_time']))
                                .toFixed(0) + ' ms');
                        $(this)
                            .attr('score', parseFloat(networkRankArr[network_id]['ping_time']));
                    }
                    if (index == 6) {
                        $(this)
                            .html((parseFloat(networkRankArr[network_id]['reliability']) * 100)
                                .toFixed(2) + '%');
                        $(this)
                            .attr('score', parseFloat(networkRankArr[network_id]['reliability']) * 100);
                    }
                });
        }
    } else {
        netDispExtra = netDispExtra + 1;
    }
}

function showNetwkTypeOptions(id) {
    $('#netwkTypeList')
        .remove(); // Get rid of any previous instance
    //$('#'+id+'-para').after(netwkTypeListHTML);
    $('#control-networkType')
        .html(netwkTypeListHTML);
    /*
     if (jQuery.inArray(id, netwk4GArr) > -1) {
     $('#netwkTypeFilter4GDiv')
     .show();
     } else {
     $('#netwkTypeFilter4GDiv')
     .hide();
     }
     */
    $('#netwkTypeFilter4GDiv').show();
    //Bren changed to always show 4G filter Aug 2014

    $('#netwkTypeList')
        .show();
    $('#netwkTypeList input')
        .unbind('change')
        .bind('change', function () {
            filtersArr["netwkType"].length = 0; // Temporary reset array to recalculate
            if ($('#netwkTypeList input:checked')
                    .length == 3) {
                // All checked - keep no filters.
            } else {
                $('#netwkTypeList input:checked')
                    .each(function () {
                        var netwkTypeid = $(this)
                            .attr('id');
                        if ($(this)
                                .prop('checked') === true && $(this)
                                .is(":visible")) {
                            // Visible check means 4G won't be included if its not visible
                            // Checking .prop instead of .attr is V. Important.  Apparently the presence of the 'checked' attribute isn't enough to be sure and I guess it updates slightly slower so you need to access the true property of whether it is checked or not.
                            if (jQuery.inArray(netwkTypeid, filtersArr["netwkType"]) == -1) {
                                filtersArr["netwkType"].push(netwkTypeid);
                            }
                        } else { // Anything not checked is removed from filter array.
                            var bTemp = jQuery.inArraynetwkTypeid;
                            if (bTemp > -1) {
                                filtersArr["netwkType"].splice(bTemp, 1);
                            }
                        }
                    });
            }
            customFilterInteraction(); // Display custom errors e.g. if filtering for 4G towers (which we can't yet display).

            updateMap(map, 1);
        });
    if (id == "all") {
        filtersArr["netwkID"].length = 0;
    } else {
        filtersArr["netwkID"] = [id];
    }
}

function resetFilters() {
    filtersArr["netwkID"].length = 0;
    filtersArr["netwkType"].length = 0;
    updateMap(map, 1);
}

function customFilterInteraction() {
    // if (filtersArr["netwkType"].length == 1 && jQuery.inArray("4G", filtersArr["netwkType"]) > -1 && isHeatMap != 1) {
    // 	postNotification("We are still working on 4G tower locations! At the moment we can only show 3G");
    // 	$('#netwkTypeList input#3G')
    // 		.attr('checked', true);
    // 	filtersArr["netwkType"].push("3G");
    // }
    if (filtersArr["netwkType"].length == 1 && jQuery.inArray("4G", filtersArr["netwkType"]) > -1 && isHeatMap == 1 && jQuery.inArray("310260", filtersArr["netwkID"]) > -1) {
        postNotification("Note: Although T-mobile now has its HSPA+ network that supports 4G like speeds, we have no way to detect this so its included in our T-mobile 3G data.");
        $('#netwkTypeList input#3G')
            .attr('checked', true);
        filtersArr["netwkType"].push("3G");
    }
}

function slideMenu(menuSlideInput) {
    if (menuSlideInput == 1) { // Menu is currently slid out
        menuSlide = 0; //Slide will now be in
        $('#map-control-new-container')
            .css('width', '450px');
        $('.listTable th:not(.keepField)')
            .hide();
        $('.listTable td:not(.keepField)')
            .hide();
        $('#networkRanker')
            .css('right', '-20px');
        $('#networkRanker')
            .css('width', '500px');
        //$('#map-slide-control').html(arrowLeftIcon);
        //$('#updateRefresh').css('border-bottom','none');
        $('#updateRefresh')
            .css('clear', 'both');
        //$('#updateRefresh').css('width','100%');
        $('#networkRanker')
            .removeClass('fullView');
        $('#networkRanker')
            .addClass('miniView');
        //$('#updateRefresh').prependTo('#towerList');
        //$('.listTable thead').hide();
    } else {
        menuSlide = 1; //Slide will now be out
        $('#map-control-new-container')
            .css('width', '803px');
        $('.listTable th:not(.keepField)')
            .show();
        $('.listTable td:not(.keepField)')
            .show();
        if (isHeatMap === 0) {
            $('.listTable th')
                .hide();
        }
        $('#networkRanker')
            .css('right', '6%'); // Reset to standard out values.
        $('#networkRanker')
            .css('width', '86%');
        //$('#map-slide-control').html(arrowRightIcon);
        //$('#updateRefresh').css('border-top','none');
        //$('#updateRefresh').css('border-bottom','1px solid #000');
        //$('#updateRefresh').prependTo('#map-control-new-container');
        $('#networkRanker')
            .addClass('fullView');
        $('#networkRanker')
            .removeClass('miniView');
        //$('#updateRefresh').css('width','150px');
    }
}

function getMarkers(map, isHeatMap, heatmaptoo) {
    var zoom = 15;
    if ((zoom > MAX_ZOOM || zoom < MIN_ZOOM) && isHeatMap != 0) {
        return false;
    }
    //postNotification('map updated');
    //if($('#towerList').length!=0) { var towerListHTML = $('#towerList').html(); } else { var towerListHTML = ""; }
    //$('#map-control-body').html(loadingHTML+'<div id="towerList">'+towerListHTML+'</div>');
    var dataURL;
    if (isHeatMap === 0) {
        $('#towerNumMsg')
            .replaceWith(loadingHTML);
        dataURL = '/app/getdata.php'; //NetWorkRank Bren Changed
    } else {
        $('#towerNumMsg')
            .html(heatmapHTML);

        //console.log("trying to add html")
        //console.log("towerNumMsg length:"+$('#map-control-body').length);
        //$('#heatmapLoadingContainer').html(loadingHeatmapHTML); //NetWorkRank Bren Changed
        refreshHeatMap(map, heatmaptoo); // Update the heatmap tiles.
        if (typeof hdev == 'undefined' || hdev != 1) {
            dataURL = '/app/getnetworkrank.php'; //NetWorkRank Bren Changed
        } else {
            dataURL = '/app/getnetworkrank_hdev.php';
        }
    }
    $('#loadingNetRank')
        .remove(); //Remove any previous instance
    $('#towerList')
        .before(loadingNetRankHTML);
    //Loading for networkRankTop
    $('#boxAboveMap')
        .addClass('boxAboveMapLoading'); //Add loading class to networkRankTop summary stats section.
    if (isHeatMap == 1) {
        //Find the column currently sorted for and update/resort the table (now that new data has been brought in via ajax).
        var tableSortOrder;
        var tableSortColumn;
        if ($("#towerListTable th.headerSortDown")
                .size() > 0) {
            // console.log("table currently in ascending order");
            tableSortOrder = 0;
            tableSortColumn = $("#towerListTable th.headerSortDown")
                .index();
        } else if ($("#towerListTable th.headerSortUp")
                .size() > 0) {
            // console.log("table currently in descending order");
            tableSortOrder = 1;
            tableSortColumn = $("#towerListTable th.headerSortUp")
                .index();
        } else {
            tableSortOrder = 1; // Default
            // console.log("can't find current order");
            tableSortColumn = 1;
        }
    }
    var bounds = map.getBounds();
    var swPoint = bounds.getSouthWest();
    var nePoint = bounds.getNorthEast();
    var digits = 5;
    if (zoom > 16) {
        digits = 4;
    } else if (zoom > 12 && zoom <= 16) {
        digits = 3;
    } else if (zoom > 9 && zoom <= 12) {
        digits = 2;
    } else if (zoom > 7 && zoom <= 9) {
        digits = 1;
    } else if (zoom <= 7) {
        digits = 0;
    }
    if (zoom >= prvZoom) {
        zoomDcrs = 0;
    } else {
        zoomDcrs = 1;
    }
    prvZoom = zoom; // Set for next time round
    var minlat = swPoint.lat()
        .toFixed(digits);
    var minlng = swPoint.lng()
        .toFixed(digits);
    var maxlat = nePoint.lat()
        .toFixed(digits);
    var maxlng = nePoint.lng()
        .toFixed(digits);
    //$('#brenInfo').html('<p>maxlat:'+maxlat+' minlat: '+minlat+' maxlng: '+maxlng+' minlng: '+minlng+' netwkID:'+filtersArr["netwkID"]+' netwkType:'+filtersArr["netwkType"]+' zoom:'+zoom+'</p>')
    $.post(dataURL, {
        maxlat: maxlat,
        minlat: minlat,
        maxlng: maxlng,
        minlng: minlng,
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
        //if (isHeatMap==1) { return false; } //Prevent fast user switching screwing things up
        if (isHeatMap == 1) {
            var countryAverage = jQuery.parseJSON($('summary', xml)
                .attr('countryAverage'));
            var worldAverage = jQuery.parseJSON($('summary', xml)
                .attr('worldAverage'));
            var bestNetworkCountry = countryAverage['country_name'];
        }
        var towerNum = $('summary', xml)
            .attr('num');
        if (typeof hdev != 'undefined' && hdev == 1) {
            $('#heatmapWeak').html($('summary', xml).attr('removedNetwksNew'));
            $('#heatmapStrong').html('');
        }
        if (prvRtnCount < markerLimit && zoomDcrs != 1 && isHeatMap === 0 && towerNum >= markerLimit) {
            // I detected a false index - take action? //
        }
        if (isHeatMap === 0) {
            prvRtnCount = towerNum;
        } else {
            prvRtnCount = markerLimit;
        } // Should ensure no index is used switching back from heatmaps
        if (towerNum >= markerLimit) {
            if (isHeatMap === 0) {
                $('#towerNumMsg')
                    .html('Showing a selection of ' + markerLimit + ' cell towers. Zoom in for more.');
            }
        } else {
            if (isHeatMap === 0) {
                $('#towerNumMsg')
                    .html(towerNum + " Towers are located in this view");
            }
            clearOverlays(); //This is because limit markers won't remove enough in this case.
        }
        $('.loading')
            .remove();
        $('#boxAboveMap')
            .removeClass('boxAboveMapLoading'); // Remove loading class from networkRankTop summary stats section also
        //var sql = $('summary', xml).attr('sql');
        //$('#towerNumMsg').append(sql);
        //var checkTemp = $('summary', xml).attr('netwkID');
        //if( (filtersArr["netwkID"].length >= 1 || filtersArr["netwkType"].length >= 1) && isHeatMap==1) {
        //if( filtersArr["netwkID"].length >= 1 || filtersArr["netwkType"].length >= 1) {
        var quickCount;
        var networkCount;
        if (!1) {
            // alert("oh oh");
            if (isHeatMap == 1) {
                $('#rankBars #left')
                    .html('');
                $('#rankBars #right')
                    .html('');
            }
            if (netwkDispArr.length === 0) {
                $('#towerList')
                    .html(updateRefreshHTML);
                $('#towerList')
                    .append(towerListTableHTML);
                $('#resetFilters')
                    .unbind('click')
                    .click(function () {
                        resetFilters();
                    });
            }
            if ($('#all-para')
                    .length === 0) {
                if (filtersArr["netwkID"].length === 0 || isHeatMap == 1) {
                    //We want the all paragraph if we are not filtered for network and always in HeatMap Mode.  (Tower mode doesn't have it if filtered).
                    $('#towerList')
                        .append('<table class="listTable" align="center" cellpadding="0" cellspacing="0"><tr id="all-row"><td id="all-row-td" class="keepField">' + allNetworksHTML + '</td><td id="all-row-content" class="keepField"></td></tr></table>');
                    if (isHeatMap === 0) { // In tower mode with no filter, select 'all' by default
                        showNetwkTypeOptions('all');
                        $('#all-row-td')
                            .removeClass('heatmaps');
                        $('#all-row-td')
                            .addClass('towers');
                    }
                    if (isHeatMap == 1 && filtersArr["netwkID"].length === 0) {
                        showNetwkTypeOptions('all');
                    }
                    //If all networks html doesn't exist and its not filtered by network, add it
                }
            }
            quickCount = 1;
            networkCount = 0;
            $('network', xml)
                .each(function () {
                    var network_id = $(this)
                        .attr('id');
                    var network_name = $(this)
                        .attr('name');
                    var count = $(this)
                        .attr('count');
                    var networkRankArr = [];
                    /* NetWorkRank Bren Changed */
                    var rank = $(this)
                        .attr('rank');
                    /* SAM added 2013-01-29 */
                    networkRankArr[network_id] = [];
                    if (isHeatMap == 1) {
                        networkRankArr[network_id]['download_speed'] = $(this)
                            .attr('download_speed');
                        networkRankArr[network_id]['upload_speed'] = $(this)
                            .attr('upload_speed');
                        networkRankArr[network_id]['ping_time'] = $(this)
                            .attr('ping_time');
                        networkRankArr[network_id]['reliability'] = $(this)
                            .attr('reliability');
                        networkRankArr[network_id]['qoe'] = $(this)
                            .attr('qoe');
                        networkRankArr[network_id]['av_over_speed'] = $(this)
                            .attr('av_over_speed');
                        networkRankArr[network_id]['rssi'] = $(this)
                            .attr('rssi');
                        networkRankArr[network_id]['av_over_rssi'] = $(this)
                            .attr('av_over_rssi');
                        networkRankArr[network_id]['score'] = $(this)
                            .attr('score');
                        if (quickCount == 1) {
                            bestNetwork = network_id;
                            bestNetworkName = network_name;
                        }
                        if (network_id != "all") {
                            networkCount++;
                        }
                        quickCount++;
                    }
                    if (network_id == 'all') {
                        sumCityPercent = (((parseFloat(networkRankArr['all']['download_speed']) / countryAverage['download_speed']) + (parseFloat(networkRankArr['all']['upload_speed']) / countryAverage['upload_speed']) + (countryAverage['ping_time'] / parseFloat(networkRankArr['all']['ping_time'])) + (parseFloat(networkRankArr['all']['reliability']) / countryAverage['data_success_rate'])) / 4 * 100);
                        $("#cityStats #city .stats_background .stats_custom")
                            .html(bestNetworkCountry);
                        //Important - note that ping_time the division is reversed as lower is better
                        sumCityPercent = (sumCityPercent - 100)
                            .toFixed(0);
                        sumWorldPercent = (((parseFloat(networkRankArr['all']['download_speed']) / worldAverage['download_speed']) + (parseFloat(networkRankArr['all']['upload_speed']) / worldAverage['upload_speed']) + (worldAverage['ping_time'] / parseFloat(networkRankArr['all']['ping_time'])) + (parseFloat(networkRankArr['all']['reliability']) / worldAverage['data_success_rate'])) / 4 * 100);
                        //Important - note that ping_time the division is reversed as lower is better
                        sumWorldPercent = (sumWorldPercent - 100)
                            .toFixed(0);
                    }
                    addNetwkToArr(network_id, network_name, count, isHeatMap, networkRankArr, networkCount);
                });
            $('span.towerNumCount')
                .html(''); //When filters active, hide tower counts and new count will be filled in
            if (isHeatMap === 0) { //Set All-Networks tower number
                $('#all-para span.towerNumCount')
                    .html('(' + towerNum + ')');
            } else {
                $('#all-para span.towerNumCount')
                    .html(); //In heatmap mode don't add a tower count as it's not accurate
            }
            if (isHeatMap == 1 && firstPageLoad == 1) {
                $("#towerListTable")
                    .tablesorter(tableSorterOptions);
                //Need to trigger sort table for the rare case that its first page load and filters are active (as usually we start tablesorter when we are rebuilding the NetworkRank table form scratch.
            }
        } else { //No filters in place
            $('#towerList')
                .html(updateRefreshHTML);
            if (isHeatMap == 1) {
                $('#rankBars #left')
                    .html('');
                $('#rankBars #right')
                    .html('');
            }
            $('#towerList')
                .append(towerListTableHTML);
            $('#towerList')
                .append('<table class="listTable" align="center" cellpadding="0" cellspacing="0"><tr id="all-row"><td id="all-row-td" class="keepField">' + allNetworksHTML + '</td><td id="all-row-content" class="keepField"></td></tr></table>');
            $('input#all')
                .prop('checked', true);
            if (isHeatMap === 0) { //Set All-Networks tower number
                $('#all-para span.towerNumCount')
                    .html('(' + towerNum + ')');
            } else {
                $('#all-para span.towerNumCount')
                    .html(); //In heatmap mode don't add a tower count as it's not accurate
            }
            if (isHeatMap == 1 && filtersArr["netwkID"].length === 0) {
                showNetwkTypeOptions('all');
            }
            netwkDispArr.length = 0; // Reset displayed network list.
            netDispExtra = 0;
            quickCount = 1;
            networkCount = 0;
            $('network', xml)
                .each(function () {
                    var network_id = $(this)
                        .attr('id');
                    var network_name = $(this)
                        .attr('name');
                    var count = $(this)
                        .attr('count');
                    var networkRankArr = [];
                    /* NetWorkRank Bren Changed */
                    var rank = $(this)
                        .attr('rank');
                    /* SAM added 2013-01-29 */
                    networkRankArr[network_id] = [];
                    if (isHeatMap == 1) {
                        networkRankArr[network_id]['download_speed'] = $(this)
                            .attr('download_speed');
                        networkRankArr[network_id]['upload_speed'] = $(this)
                            .attr('upload_speed');
                        networkRankArr[network_id]['ping_time'] = $(this)
                            .attr('ping_time');
                        networkRankArr[network_id]['reliability'] = $(this)
                            .attr('reliability');
                        networkRankArr[network_id]['qoe'] = $(this)
                            .attr('qoe');
                        networkRankArr[network_id]['av_over_speed'] = $(this)
                            .attr('av_over_speed');
                        networkRankArr[network_id]['rssi'] = $(this)
                            .attr('rssi');
                        networkRankArr[network_id]['av_over_rssi'] = $(this)
                            .attr('av_over_rssi');
                        networkRankArr[network_id]['score'] = $(this)
                            .attr('score');
                    }
                    if (quickCount == 1) {
                        bestNetwork = network_id;
                        bestNetworkName = network_name;
                    }
                    if (network_id != "all") {
                        networkCount++;
                    }
                    quickCount++;
                    if (network_id == 'all') {
                        //console.log(bestNetwork.substring(0,3)+' bren');
                        sumCityPercent = (((parseFloat(networkRankArr['all']['download_speed']) / countryAverage['download_speed']) + (parseFloat(networkRankArr['all']['upload_speed']) / countryAverage['upload_speed']) + (countryAverage['ping_time'] / parseFloat(networkRankArr['all']['ping_time'])) + (parseFloat(networkRankArr['all']['reliability']) / countryAverage['data_success_rate'])) / 4 * 100);
                        $("#cityStats #city .stats_background .stats_custom")
                            .html(bestNetworkCountry);
                        //Important - note that ping_time the division is reversed as lower is better
                        sumCityPercent = (sumCityPercent - 100)
                            .toFixed(0);
                        sumWorldPercent = (((parseFloat(networkRankArr['all']['download_speed']) / worldAverage['download_speed']) + (parseFloat(networkRankArr['all']['upload_speed']) / worldAverage['upload_speed']) + (worldAverage['ping_time'] / parseFloat(networkRankArr['all']['ping_time'])) + (parseFloat(networkRankArr['all']['reliability']) / worldAverage['data_success_rate'])) / 4 * 100);
                        //Important - note that ping_time the division is reversed as lower is better
                        sumWorldPercent = (sumWorldPercent - 100)
                            .toFixed(0);
                    }
                    addNetwkToArr(network_id, network_name, count, isHeatMap, networkRankArr, networkCount);
                });
            $('#resetFilters')
                .unbind('click')
                .click(function () {
                    resetFilters();
                });
            if (netDispExtra > 0) {
                $('#towerList')
                    .append('<div style="clear:both"></div><p id="netDispExtra">' + netDispExtra + ' more networks not listed...</p>');
            }
            if (isHeatMap == 1) {
                $("#towerListTable")
                    .tablesorter(tableSorterOptions);
                //Important - need Network rank html to be built already and only do in heatmap mode.
            }
            if (filtersArr["netwkID"].length >= 1) {
                $('input#' + filtersArr["netwkID"])
                    .prop('checked', true);
                //Added Mar '14 so we can always go the no_filter route.
            }
            // End of section that only runs when filters are not active.
        }
        //Anything below runs on every ajax request regardless of filters
        if (isHeatMap == 1) {
            var currentTowerListLength = $('#towerListTable tr')
                .length;
            if (currentTowerListLength > 1) {
                $("#towerListTable")
                    .trigger("update");
                $("#towerListTable")
                    .trigger("sorton", [
                        [
                            [tableSortColumn, tableSortOrder]
                        ]
                    ]); //Sort on NetworkRank column in reverse order
                //console.log("setting sort order: "+" "+tableSortOrder+" column: "+tableSortColumn);
            }
        }
        if (networkRankSum == 1 && isHeatMap == 1 && bestNetwork !== undefined && bestNetwork != 'all' && !isNaN(sumCityPercent)) {
            if (jQuery.inArray(parseInt(bestNetwork, 10), customIcons) == -1) {
                //$('#carrierLogo').html('<span style="font-size:20px">1. '+bestNetworkName+'</span>');
                //$('#carrierLogo').css('padding-top', '20px');
            } else {
                //$('#carrierLogo').html('<span style="font-size:20px">1. '+bestNetworkName+'</span>');
            }
            //console.log('bestNetwork'+bestNetwork+sumCityPercent);
            if (sumCityPercent < 0) {
                $('#city div.score')
                    .html(sumCityPercent + '%');
                $('#city div.bar')
                    .html('<div class="negative" style="width:' + (0 - Math.min(sumCityPercent, 100)) + 'px;margin-left:' + parseFloat(100 + parseFloat(sumCityPercent)) + 'px;"></div>');
            } else {
                $('#city div.score')
                    .html('+' + sumCityPercent + '%');
                $('#city div.bar')
                    .html('<div class="positive" style="width:' + Math.min(sumCityPercent, 100) + 'px;margin-left:100px;"></div>');
            }
            if (sumWorldPercent < 0) {
                $('#world div.score')
                    .html(sumWorldPercent + '%');
                $('#world div.bar')
                    .html('<div class="negative" style="width:' + (0 - Math.min(sumWorldPercent, 100)) + 'px;margin-left:' + parseFloat(100 + parseFloat(sumWorldPercent)) + 'px;"></div>');
            } else {
                $('#world div.score')
                    .html('+' + sumWorldPercent + '%');
                $('#world div.bar')
                    .html('<div class="positive" style="width:' + Math.min(sumWorldPercent, 100) + 'px;margin-left:100px;"></div>');
            }
        }
        //$("#towerListTable tr:odd").addClass('tableOdd'); // This is just for styling Need custom logic to deal with table sorting or this will mess up
        if (menuSlide === 0) { //Check if newly create table fields should be hidden
            //$('.listTable th:not(.keepField)').hide();
            //$('.listTable td:not(.keepField)').hide();
            $('.listTable th:not(.keepField)')
                .hide();
            $('.listTable td:not(.keepField)')
                .hide();
        } else {
            $('#updateRefresh')
                .css('border-top', 'none');
            //$('#updateRefresh').css('border-bottom','1px solid #000');
            $('#updateRefresh')
                .css('clear', 'none');
        }
        if (isHeatMap == 1) {
            $('.towerNumCount')
                .hide();
        } else {
            $('.towerNumCount')
                .show();
        } // Tower count is irrelevant for HeatMaps
        var uncheckArr = ["2G", "3G", "4G"];
        $('networktype', xml)
            .each(function () { //Uncheck all boxes that were not filtered. Just for first page load if customized url
                var netwkType = $(this)
                    .attr('netwkType');
                var bTemp = jQuery.inArray(netwkType, uncheckArr);
                if (bTemp > -1) {
                    uncheckArr.splice(bTemp, 1);
                }
            });
        if (uncheckArr.length !== 0 && uncheckArr.length != 3) { //If length=3 no filters were in xml, so all should remain checked
            for (i in uncheckArr) {
                $('#netwkTypeList input#' + uncheckArr[i])
                    .attr('checked', false);
            }
        }
        $('#towerList input')
            .not('#netwkTypeList input')
            .unbind('change')
            .bind('change', function () {
                var id = $(this)
                    .attr('id');
                showNetwkTypeOptions(id);
                /* Old Logic that allowed more than one networkID in filtersArr
                 if ($(this).prop('checked')) {
                 if (jQuery.inArray(id, filtersArr["netwkID"])==-1) {
                 filtersArr["netwkID"].push(id);
                 }
                 } else { // Anything not checked is removed from filter array.
                 if (jQuery.inArray(id, filtersArr["netwkID"] > -1) {
                 filtersArr["netwkID"].splice(bTemp,1);
                 }
                 }
                 */
                updateMap(map, 1);
            });
        $('marker', xml)
            .each(function (i) {
                //var fuzz = (Math.random()/9000); // INTRODUCE SOME FUZZING
                //var tempLat = parseFloat($(this).attr('lat'))+parseFloat(fuzz);
                //var tempLng = parseFloat($(this).attr('lng'))+parseFloat(fuzz);
                var network_id = $(this)
                    .attr('network_id');
                var the_marker = new google.maps.Marker({
                    title: 'Network: ' + $(this)
                        .attr('network_name') + ' (' + network_id + ') Co-ordinates: (' + $(this)
                        .attr('lat') + ',' + $(this)
                        .attr('lng') + ')',
                    map: map,
                    clickable: true,
                    position: new google.maps.LatLng($(this)
                        .attr('lat'), $(this)
                        .attr('lng')),
                    icon: iconArray[network_id]
                    //shadow: icon.shadow
                });
                //the_marker.infowindow = new google.maps.InfoWindow({
                //	content: $(this).attr('network_name')+' '+network_id
                //});
                markersArray.unshift(the_marker);
                //new google.maps.event.addListener(the_marker, 'click', function() {
                //	for(x=0; x < markersArray.length; x++){ markersArray[x].infowindow.close(); }
                //	the_marker.infowindow.open(map, the_marker);
                //var bren = the_marker.getTitle();
                //$('#brenInfo').append('Marker Info:'+bren+' ');
                //});
            });
        if (firstPageLoad == 1) {
            slideMenu(1);
        }
        //Track AJAX Request
        var ajaxLink = "";
        if (isHeatMap == 1) {
            ajaxLink = "HeatMaps/";
        } else {
            ajaxLink = "CellTowers/";
        }
        if (filtersArr["netwkID"].length >= 1) {
            for (i in filtersArr["netwkID"]) {
                ajaxLink = ajaxLink + filtersArr["netwkID"][i] + '/';
            }
        } else if (filtersArr["netwkType"].length >= 1) {
            for (i in filtersArr["netwkType"]) {
                ajaxLink = ajaxLink + filtersArr["netwkType"][i] + '/';
            }
        } else {
            ajaxLink = ajaxLink + "NoFilters/";
        }
        if (firstPageLoad != 1) {
            //$('#generatelinkTarget').append('B'+ajaxLink);
            //console.log(ajaxLink);
            //Google Analytics AJAX Interaction tracking:
            _gaq.push(['_trackPageview', '/app/getdata/' + ajaxLink]);
            //Chartbeat AJAX Interaction tracking:
            // TEMPORARILY DISABLING
            //pSUPERFLY.virtualPage('/app/getdata/'+ajaxLink);
        } else {
            //do nothing
            firstPageLoad = 0;
        }
        //alert(markersArray.length);
        limitMarkers(markerLimit);
        //alert(markersArray.length);
        //var markerCount=0;
        //if (markersArray) {
        //	for (i in markersArray) {
        //		if (markersArray[i].getMap().getZoom()==map.getZoom()) {markerCount++;}
        //	}
        //	$('#brenInfo').prepend('count: '+markerCount);
        //}
        generateLink();
        //End of Ajax request
    });
}

function opacity(zoom) {
    if (zoom < MIN_ZOOM || zoom > MAX_ZOOM) {
        return LOW_OPACITY;
    }
    return TILE_OPACITY;
}

var heatmap = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {

        baseTileUrl = 'http://tiles-prod.opensignal.com/?';

        var fltrAppndLink = "";
        if (filtersArr["netwkType"].length >= 1) {
            for (i in filtersArr["netwkType"]) {
                fltrAppndLink = fltrAppndLink + '&netwkType%5B%5D=' + filtersArr["netwkType"][i];
            }
        }
        if (filtersArr["netwkID"].length === 0) {
            fltrAppndLink = fltrAppndLink + '&netwkID=all'; //Only 1 accepted.
        } else {
            fltrAppndLink = fltrAppndLink + '&netwkID=' + filtersArr["netwkID"][0]; //Only 1 accepted.
        }
        //console.log(fltrAppndLink);

        if (zoom < MIN_ZOOM) {
            return "https://s3.amazonaws.com/osmwww/images/zoom-in.png";
        } else if (zoom > MAX_ZOOM) {
            return "https://s3.amazonaws.com/osmwww/images/zoom-out.png";
        } else {
            if (typeof ec2maptiles === 'undefined') {
                ec2maptiles = 0;
            }
            return baseTileUrl + "zoom=" + zoom + "&x=" + coord.x + "&y=" + coord.y + fltrAppndLink + "&client=auth1ZA294CK772Q4clnt294ri6Qa9&version_code=999";
        }
    },
    tileSize: new google.maps.Size(256, 256),
    opacity: opacity(),
    isPng: true
});

function generateLink() {
    var mapLat = Math.round(map.getCenter()
                .lat() * 10000) / 10000;
    var mapLng = Math.round(map.getCenter()
                .lng() * 10000) / 10000;
    var zoom = map.getZoom();
    var link = window.location.protocol + '//' + window.location.hostname;
    if (window.location.port) link += ':' + window.location.port;
    link += window.location.pathname;
    link += '?lat=' + mapLat + '&lng=' + mapLng + '&initZoom=' + zoom + '&isHeatMap=' + isHeatMap;
    for (i in filtersArr["netwkID"]) {
        link = link + '&netwkID%5B%5D=' + filtersArr["netwkID"][i];
    }
    for (i in filtersArr["netwkType"]) {
        link = link + '&netwkType%5B%5D=' + filtersArr["netwkType"][i];
    }
    $('#generatelinkTarget')
        .html('Link: <a href="' + link + '">' + link + '</a>');
}
$(document)
    .ready(function () {
        //$('#search').prepend('<div style="background-color:#33BC33; height:23px; color: #fff; padding:10px 10px 5px 10px; margin-bottom:15px; font-size:14px; border: 5px solid #bbb;">We just got TechCrunch\'d and our server\'s running slow, so please be patient. Check out <a style="color:#fff; text-decoration: underline;" href="http://www.twitter.com/opensignalmaps">@opensignalmaps</a> for updates!</div>');
        //$('#search').css('margin-top','30px');
        //$('.clearboth:eq(1)').css('height','10px');
        $('#boxAboveMap')
            .addClass('boxAboveMapLoading'); //Start with loading class on networkRankTop summary stats section.
        for (i in filtersArr["netwkID"]) {
            filtersArr["netwkID"][i] = parseInt(filtersArr["netwkID"][i], 10);
        }
        $('.clearField')
            .clearField();
        mapInit();

        /* ******** SINA REMOVED ********
         $("#controlBarToggle").live("click", function(){
         if ($("#map-control-body").hasClass('hidden')) {
         $("#controlBarToggle").html('<img src="https://s3.amazonaws.com/osmwww/images/arrow-up.png" />');
         } else {
         $("#controlBarToggle").html('<img src="https://s3.amazonaws.com/osmwww/images/arrow-down.png" />');
         }
         $("#map-control-bar").toggleClass('bot-brdr');
         $("#map-control-body").toggleClass('hidden');
         });

         $(".controlZoom").live("click", function(){
         var zoomDir=$(this).attr('id');
         var zoom=parseFloat(map.getZoom());
         if (zoomDir=="zoomOut") { map.setZoom(zoom-1); } else { map.setZoom(zoom+1); }
         });
         */
        $("#controlBarFullScrn")
            .bind("click", function () {
                var currentCenter = map.getCenter();
                if ($("#map")
                        .hasClass('fullscreen')) {
                    $('#controlBarFullScrn')
                        .html("Full Screen");
                    $('#controlBarFullScrn')
                        .removeClass('controlBarFullScrnActive');
                } else {
                    $('#controlBarFullScrn')
                        .html("Exit Full Screen");
                    $('#controlBarFullScrn')
                        .addClass('controlBarFullScrnActive');
                }
                $("#map")
                    .toggleClass('fullscreen');
                var cssPos = $("#map")
                    .css('position');
                if (cssPos != 'fixed') {
                    $("#map")
                        .css('position', 'fixed');
                } else {
                    $("#map")
                        .css('position', 'relative');
                }
                google.maps.event.trigger(map, "resize");
                map.setCenter(currentCenter);
            });
        // "live" bind click event
        //$("#markers a").live("click", function(){
        //	var i = $(this).attr("rel");
        // this next line closes all open infowindows before opening the selected one
        //	for(x=0; x < arrInfoWindows.length; x++){ arrInfoWindows[x].close(); }
        //	arrInfoWindows[i].open(map, arrMarkers[i]);
        //});
        $('form#getLocation')
            .submit(function () {
                var address = $(this)
                    .children('input[name=address]')
                    .val();
                geocoder.geocode({
                    'address': address
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        $("#search .error_message")
                            .hide();
                        // map.setCenter(results[0].geometry.location);
                        map.fitBounds(results[0].geometry.viewport);
                        var zoom = map.getZoom();
                        map.setZoom(zoom > MAX_ZOOM ? MAX_ZOOM : zoom);
                    } else {
                        $("#search .error_message")
                            .show();
                        $("#search .error_message")
                            .append("Unable to locate address.  Please try again.");
                    }
                    //$('#search').append('LOCATION FOUND:'+results[0].formatted_address+' ');
                });
                return false;
            });
        $('#generatelink')
            .click(function () { // NO LONGER USED
                generateLink();
                return false;
            });
        $('#map-slide-control')
            .click(function () {
                slideMenu(menuSlide);
            });
        // prevent form being submitted (for autocomplete)
        $("#getLocation")
            .submit(function (event) {
                event.preventDefault();
            });
    });
