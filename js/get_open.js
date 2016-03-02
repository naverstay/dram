function getMarkers(map, isHeatMap, heatmaptoo) {
    var zoom = map.getZoom();
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