function setHeader(){
  $("body").innerWidth() > 960 ? ($(".menu-desktop ul").show(), $(".toggle-menu").hide()) : ($(".menu-desktop ul").hide(), $(".toggle-menu").show())
}
function loadMap(){
  google.maps.event.addDomListener(window, "load", initMap)
}
function initMap(){
  var e = {
    zoom            : zoom,
    minZoom         : 4,
    maxZoom         : 15,
    center          : centerCords,
    disableDefaultUI: !0,
    scrollwheel     : !0,
    styles          : [{
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers    : [{weight: "1.49"}, {color: "#9f9797"}]
    }, {
      featureType: "administrative.province",
      elementType: "labels.text",
      stylers    : [{visibility: "off"}]
    }, {
      featureType: "administrative.province",
      elementType: "labels.text.stroke",
      stylers    : [{weight: "1.70"}, {visibility: "off"}]
    }, {
      featureType: "landscape",
      elementType: "all",
      stylers    : [{hue: "#FFBB00"}, {saturation: 43.400000000000006}, {lightness: 37.599999999999994}, {gamma: 1}]
    }, {
      featureType: "landscape.natural",
      elementType: "geometry.fill",
      stylers    : [{lightness: "31"}, {color: "#faf6e9"}, {saturation: "-55"}]
    }, {
      featureType: "poi",
      elementType: "all",
      stylers    : [{hue: "#00FF6A"}, {saturation: -1.0989010989011234}, {lightness: 11.200000000000017}, {gamma: 1}]
    }, {featureType: "poi.park", elementType: "all", stylers: [{lightness: "55"}]}, {
      featureType: "road.highway",
      elementType: "all",
      stylers    : [{hue: "#ffc200"}, {saturation: -61.8}, {lightness: 45.599999999999994}, {gamma: 1}]
    }, {
      featureType: "road.highway",
      elementType: "geometry",
      stylers    : [{lightness: "31"}, {saturation: "30"}]
    }, {
      featureType: "road.arterial",
      elementType: "all",
      stylers    : [{hue: "#FF0300"}, {saturation: -100}, {lightness: 51.19999999999999}, {gamma: 1}]
    }, {
      featureType: "road.local",
      elementType: "all",
      stylers    : [{hue: "#FF0300"}, {saturation: -100}, {lightness: 52}, {gamma: 1}]
    }, {
      featureType: "water",
      elementType: "all",
      stylers    : [{saturation: "-20"}, {lightness: "-10"}, {gamma: 1}, {color: "#d0edff"}]
    }, {
      featureType: "water",
      elementType: "geometry.fill",
      stylers    : [{saturation: "0"}, {color: "#87c3e7"}, {lightness: "60"}]
    }, {featureType: "water", elementType: "labels.text", stylers: [{color: "#0b679c"}]}, {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers    : [{color: "#0b679c"}, {lightness: "0"}, {saturation: "-43"}]
    }, {featureType: "water", elementType: "labels.text.stroke", stylers: [{visibility: "off"}]}]
  };
  map = new google.maps.Map(document.getElementById("map"), e), map.addListener("click", function(e){
    showPinnedLocation(e.latLng.lat(), e.latLng.lng())
  }), geocoder = new google.maps.Geocoder, globalMarker = new google.maps.Marker({
    title: "Current Location",
    icon : "images/mapa/pin-my-location.png"
  }), globalInfowindow = new google.maps.InfoWindow, borderIndiaOverlay(map), map.addListener("idle", function(e){
    initflag && (initflag = !1, addSearchBox()), addMapOverlay(map)
  }), map.addListener("tilesloaded", function(e){
  }), map.addListener("dragend", function(e){
    addMapOverlay(map)
  }), map.addListener("zoom_changed", function(e){
    initflag || (onZoomOperations(map), addMapOverlay(map))
  }), $(document).on("click", "#zoomOutButton", function(){
    zoomout(), addMapOverlay(map)
  }), $(document).on("click", "#zoomInButton", function(){
    zoomin(), addMapOverlay(map)
  }), $(document).on("click", ".locate", function(){
    getCurrentLocationCord()
  }), $("input[name=cenas]").on("click", function(e){
    showFilteredSites(e), addMapOverlay(map)
  }), $("input[name=toggledatacoverage]").on("click", function(e){
    hideData = !document.getElementsByName("toggledatacoverage")[0].checked, addMapOverlay(map)
  }), getCurrentLocationCord()
}
function getCurrentLocationCord(){
  navigator.geolocation && navigator.geolocation.getCurrentPosition(showPosition), $(".sub_btn").css("width", "100%")
}
function searchOnHit(){
  var e = document.getElementById("autocomplete").value;
  geocoder.geocode({address: e}, function(e, t){
    t == google.maps.GeocoderStatus.OK && (map.setCenter(e[0].geometry.location), map.setZoom(15), getSitesLocations(e[0].geometry.location.lat(), e[0].geometry.location.lng()), updateCircleNews(map.getCenter().lat(), map.getCenter().lng()))
  })
}
function addSearchBox(){
  var e;
  e = document.getElementById("autocomplete"), autocomplete = new google.maps.places.Autocomplete(e, {
    types                : ["geocode"],
    componentRestrictions: {country: "in"}
  }), autocomplete.addListener("place_changed", function(){
    var e = autocomplete.getPlace();
    map.panTo(e.geometry.location), map.setZoom(15), getSitesLocations(e.geometry.location.lat(), e.geometry.location.lng()), updateCircleNews(map.getCenter().lat(), map.getCenter().lng())
  })
}
function PointMyLocation(e, t){
  var a = document.createElement("div");
  a.style.backgroundImage = "url('images/loc.png')", a.style.backgroundSize = "contain", a.style.height = "25px", a.style.width = "25px", a.style.marginLeft = "7px", a.style.border = "1px solid rgba(0, 0, 0, 0.14902)", a.style.boxShadow = "rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px", a.style.backgroundColor = "rgb(255, 255, 255)", a.style.backgroundClip = "padding-box", a.style.borderRadius = "13px", a.style.paddingRight = "1px", a.title = "Click to point current location", e.appendChild(a), google.maps.event.addDomListener(a, "click", function(){
    isLocChange = !1
  })
}
function showPosition(e){
  isShowAddress = !0, lat = e.coords.latitude, lng = e.coords.longitude, showPinnedLocation(lat, lng), initflag || addMapOverlay(map)
}
function showPositionWithLatLng(e, t){
  getSitesLocations(e, t), isShowAddress = !0, zoom = 15, myCenter = new google.maps.LatLng(e, t), map.setZoom(zoom), map.setCenter(myCenter), globalInfowindow && globalInfowindow.close(), globalMarker.setPosition(myCenter), globalMarker.setMap(map), addMapOverlay(map)
}
function showPinnedLocation(e, t){
  globalInfowindow && globalInfowindow.close();
  var a = new google.maps.LatLng(e, t);
  map.setCenter(a), map.setZoom(15), getSitesLocations(e, t), updateCircleNews(e, t), isShowAddress = !0
}
function zoomin(){
  map.setZoom(map.getZoom() + 1)
}
function zoomout(){
  map.setZoom(map.getZoom() - 1)
}
function defaultZoom(){
  map.setZoom(15)
}
function removeMarker(){
  for(marker in markersList)markersList[marker].setMap(null);
  markersList = [], sitesVisible = !1, removeDrawDistance()
}
function addMarker(e, t, a, o, i){
  var n, r, s, l = new google.maps.LatLng(e, t);
  i ? (n = "images/LockedSites.png", r = ["<h6>Forcibly Shutdown Site</h6>", '<p><a href="#" onclick="resetLeadForm();trackTowerHost();" data-target="#notify-modal-hosting" class="dark link openLeadModel" data-toggle="modal" data-id="' + e + "," + t + '"><b>Want to host a site here?</b></a></p>'], s = {
    url: n,
    scaledSize: new google.maps.Size(17, 23)
  }) : (n = "images/new/existing.png", "Planned" == a ? n = "images/new/planned.png" : "Live" == a ? n = "images/new/existing.png" : "WiFi" == a ? n = "images/new/existing.png" : "Upgrade" == a && (n = "images/new/upcoming.png"), r = ["<h6>Existing Site</h6>"], "Planned" == a && (r = ["<h6>Site Needed</h6>", '<p><a href="#" onclick="resetLeadForm();trackTowerHost();" data-target="#notify-modal-hosting" class="dark link openLeadModel" data-toggle="modal" data-id="' + e + "," + t + '"><b>Want to host a site here?</b></a></p>']), "Upgrade" == a && (r = ["<h6>Site Upgrading</h6>"]), s = {
    url: n,
    scaledSize: new google.maps.Size(15, 25)
  });
  var p = new google.maps.Marker({position: l, icon: s});
  addInfoWindow(p, r), markersList.push(p), p.setMap(map)
}
function addInfoWindow(e, t){
  var a = new google.maps.InfoWindow({content: t[0]});
  google.maps.event.addListener(e, "click", function(){
    prev_infowindow && prev_infowindow.close(), prev_infowindow = a, geocoder.geocode({latLng: e.position}, function(o, i){
      i == google.maps.GeocoderStatus.OK && o[0] && (t[0].indexOf("Needed") > 0 || t[0].indexOf("Forcibly") > 0 ? a.setContent("<div>" + t[0] + o[0].formatted_address + (t[1] || "") + "</div>") : a.setContent("<div>" + t[0] + getAddressToShow(o) + (t[1] || "") + "</div>"), a.open(map, e))
    })
  })
}
function getAddressToShow(e){
  for(var t = e[0].formatted_address.split(","), a = "", o = 1; o < t.length; o++)a = a + t[o] + ",";
  return a.substr(0, a.length - 1)
}
function getSelectedFilters(){
  for(var e = [], t = $('input[name="cenas"]:checked').get(), a = 0; a < t.length; a++)e[t[a].value] = !0;
  return 0 == t.length && (e = void 0), e
}
function showLoader(e){
  e ? $("#xhrloader").show() : $("#xhrloader").hide()
}
function getSitesLocations(e, t){
  var a = configBaseUrls.networkAPIUrl + "networksitesdata?latitude=" + e + "&longitude=" + t;
  $.ajax({
    url        : a,
    type       : "GET",
    Accept     : "application/json",
    contentType: "application/json",
    dataType   : "json",
    crossDomain: !0,
    success    : function(e){
      e && (networkApiResp = adwordmanager.extractresponse(e), plotNetworkMarkers(networkApiResp))
    },
    error      : function(e){
    },
    beforeSend : function(e){
      return removeMarker(), showLoader(!0), e.setRequestHeader("Content-Type", "application/json"), xhrRunninng ? !1 : void(xhrRunninng = !0)
    },
    complete   : function(){
      showLoader(!1), xhrRunninng = !1
    }
  })
}
function getNetworkType(){
  networkType = $("#ddlNetwork").val(), removeMarker(), plotNetworkMarkers(networkApiResp)
}
function showFilteredSites(e){
  return !sitesVisible && map.getZoom() < 11 ? ($("html, body").animate({scrollTop: 0}, "slow", function(){
  }), document.getElementById("autocomplete").value = "", document.getElementById("autocomplete").focus(), $('input[name="filterSites"]:checked').each(function(){
    this.checked = !1
  }), e.preventDefault(), !1) : (removeMarker(), void plotNetworkMarkers(networkApiResp))
}
function getDistanceOnClick(e){
  google.maps.event.addListener(e, "click", function(){
    globalMarker.getPosition(), e.getPosition();
    drawSiteRoute(globalMarker, e)
  })
}
function removeDrawDistance(){
  rulerpoly && rulerpoly.setMap(null), ruler1label && (ruler1label.onRemove(), ruler1label = void 0)
}
function drawSiteRoute(e, t){
  removeDrawDistance(), ruler1label = new Label({map: map}), ruler1label.bindTo("position", t, "position"), rulerpoly = new google.maps.Polyline({
    path: [e.position, t.position],
    strokeColor: "#000000",
    strokeOpacity: 1,
    strokeWeight: 2
  }), rulerpoly.setMap(map), ruler1label.set("text", distance(e.getPosition().lat(), e.getPosition().lng(), t.getPosition().lat(), t.getPosition().lng())), rulerpoly.setPath([e.getPosition(), t.getPosition()])
}
function distance(e, t, a, o){
  var i = 6371, n = (a - e) * Math.PI / 180, r = (o - t) * Math.PI / 180, s = Math.sin(n / 2) * Math.sin(n / 2) + Math.cos(e * Math.PI / 180) * Math.cos(a * Math.PI / 180) * Math.sin(r / 2) * Math.sin(r / 2), l = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)), p = i * l;
  return p > 1 ? Math.round(p) + "km" : 1 >= p ? Math.round(1e3 * p) + "m" : p
}
function Label(e){
  this.setValues(e);
  var t = this.span_ = document.createElement("span");
  t.style.cssText = 'z-index:9999999; position: relative; left: 100%; top: -8px; white-space: nowrap; border: 0px; font-family:arial; font-weight:bold;padding: 2px; background-color: #ffffff; opacity: 1; filter: alpha(opacity=100); -ms-filter: "alpha(opacity=100)"; -khtml-opacity: 1; -moz-opacity: 1;';
  var a = this.div_ = document.createElement("div");
  a.appendChild(t), a.style.cssText = "position: absolute; display: none"
}
function borderIndiaOverlay(e){
  var t = new google.maps.LatLngBounds(new google.maps.LatLng(6.0496584, 67.309995), new google.maps.LatLng(38.000386, 97.590922)), a = "images/indiamap.png";
  borderOverlay = new USGSOverlay(t, a, e, void 0, void 0)
}
function addMapOverlay(e){
  var t = e.getBounds(), a = t.getNorthEast(), o = t.getSouthWest(), i = $("#map").height(), n = $("#map").width(), r = configBaseUrls.networkAPIUrl + "networkcoverage?minLon=" + o.lng() + "&minLat=" + o.lat() + "&maxLon=" + a.lng() + "&maxLat=" + a.lat() + "&imgHeight=" + i + "&imgWidth=" + n + "&coverageType=VOICE", s = configBaseUrls.networkAPIUrl + "networkcoverage?minLon=" + o.lng() + "&minLat=" + o.lat() + "&maxLon=" + a.lng() + "&maxLat=" + a.lat() + "&imgHeight=" + i + "&imgWidth=" + n + "&coverageType=DATA";
  overlay ? (overlay.setMap(null), overlay = void 0, overlay = new USGSOverlay(t, r, e, n, i), null != dataOverlay && dataOverlay.setMap(null), dataOverlay = void 0, hideData || (dataOverlay = new USGSOverlay(t, s, e, n, i))) : (overlay = new USGSOverlay(t, r, e, n, i), hideData || (dataOverlay = new USGSOverlay(t, s, e, n, i)))
}
function USGSOverlay(e, t, a, o, i){
  this.bounds_ = e, this.image_ = t, this.map_ = a, this.width_ = o, this.height_ = i, this.div_ = null, this.setMap(a)
}
function onZoomOperations(e){
  if(e.getZoom() <= 12 && sitesVisible && (removeMarker(), globalInfowindow.close(), globalMarker.setMap(null), sitesVisible = !1), e.getZoom() > 12 && (sitesVisible || (getSitesLocations(e.getCenter().lat(), e.getCenter().lng()), sitesVisible = !0, updateCircleNews(e.getCenter().lat(), e.getCenter().lng()))), e.getZoom() > 7)void 0 != borderOverlay && (borderOverlay.setMap(null), borderOverlay = void 0); else if(void 0 == borderOverlay){
    borderIndiaOverlay(e), document.getElementById("autocomplete").value = "";
    var t = configBaseUrls.cmsUrl + "forme/new-online/leap/global-news/india/news?v=" + Math.random();
    document.getElementById("mapCircleNews").src = t
  }
}
function mobileOverlayVisitor(e){
  function t(){
    return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i) ? !0 : !1
  }

  if(t())if(e){
    var a = new Date, o = a.getTime(), i = o + 1296e5;
    a.setTime(i), document.cookie = "doSomethingOnlyOnce=true; expires=" + a.toGMTString() + "; path=/", $(".mobile-overlay").hide()
  } else $(".mobile-overlay").hide(), "true" !== document.cookie.replace(/(?:(?:^|.*;\s*)doSomethingOnlyOnce\s*\=\s*([^;]*).*$)|^.*$/, "$1") && $(".mobile-overlay").show()
}
function initZoomOut(){
  4 != map.getZoom() && (map.setZoom(4), map.setCenter(new google.maps.LatLng(centerCords.lat, centerCords.lng)), removeMarker(), globalInfowindow.close(), globalMarker.setMap(null), sitesVisible = !1)
}
function isNumberKey(e){
  var t = 0;
  return t = e.which ? e.which : event.keyCode, t > 47 && 58 > t || 8 == t || 9 == t || 46 == t || 0 == t ? !0 : !1
}
function phonenumber(e){
  var t = /^\d{10}$/;
  return e.match(t) ? !0 : !1
}
function validate(){
  if("" == $("#txtMob").val() || 0 == phonenumber($("#txtMob").val()))return $("#txtMob").css("border", "1px solid red"), $("#txtMob").focus(), $("#spMob").show(), !1;
  if($("#txtMob").css("border", "1px solid #e5e5e5"), $("#spMob").hide(), $("input[name=rdb]:checked").length <= 0)return $("#spRdb").show(), !1;
  if($("#spRdb").hide(), "tenant" == $("input[name='rdb']:checked").val() || "other" == $("input[name='rdb']:checked").val() || "society" == $("input[name='rdb']:checked").val()){
    if("" == $("#ownerMob").val() || 0 == phonenumber($("#ownerMob").val()))return $("#ownerMob").css("border", "1px solid red"), $("#ownerMob").focus(), $("#spOwner").show(), !1;
    $("#ownerMob").css("border", "1px solid #e5e5e5"), $("#spOwner").hide()
  }
  return !0
}
function getCircle(e){
  if(1 == isBtnSub)return !1;
  $("#btnSubmit").css({
    opacity              : ".5",
    "background-image"   : "url(images/loader.gif)",
    "background-position": "30px 3px",
    "background-repeat"  : "no-repeat",
    "background-size"    : "21px"
  });
  var t = "/api/get.php?type=circle&number=/" + e;
  document.URL.indexOf("airtel.in") > 0 && (t = configBaseUrls.getCircleUrl + "usercircle/" + e), $.ajax({
    url     : t,
    headers : {AUTHUSER: "WCF0+FkIwd68Qv28GgzCoFWKE9PP+z/mEYrwvv/icjhV19Zr8l+JqL3V80KIMTHQ"},
    dataType: "json",
    type    : "GET",
    async   : !1,
    success : function(e){
      var t = e;
      "000" == t.statusCode && ("N" == t.businessOutput.isAirtel ? ($("#txtMob").css("border", "1px solid red"), $("#spMob").html("Please enter valid Airtel number"), $("#spMob").show(), $("#btnSubmit").css({
        opacity: "1",
        "background-image": "none"
      }), isBtnSub = !1) : (retVal = {}, retVal.circle = circleFromMap, "UP East" == circleFromMap && ("UP East" == circleIdMaster[t.businessOutput.circleid][0] ? retVal.circle = "UP East" : retVal.circle = "UP(West) and Uttarakhand"), sendLead(retVal)))
    },
    error   : function(e){
      $("#txtMob").css("border", "1px solid red"), $("#spMob").html("Unable the check status. Please try again."), $("#spMob").show(), $("#btnSubmit").css({
        opacity: "1",
        "background-image": "none"
      }), isBtnSub = !1
    }
  })
}
function sendLead(e){
  var t = {
    msisdn    : $("#txtMob").val(),
    address   : leadAddress,
    longitude : leadLang,
    latitude  : leadLat,
    own       : $("input[name='rdb']:checked").val(),
    ocontact  : $("#ownerMob").val(),
    circle    : e.circle,
    attribute1: "",
    attribute2: "",
    attribute3: "",
    attribute4: ""
  };
  $("#notify-modal-hosting").modal("hide"), $("#showNotificationSuccess").modal("show"), post(configBaseUrls.feedbackUrl + "feedback", {data: JSON.stringify(t)}), trackTowerHostSuccess($("#txtMob").val(), $("input[name='rdb']:checked").val(), trackCityName + "-" + trackStateName)
}
function post(e, t, a){
  a = a || "post";
  var o = document.createElement("form");
  o.setAttribute("method", a), o.setAttribute("action", e);
  for(var i in t)if(t.hasOwnProperty(i)){
    var n = document.createElement("input");
    n.setAttribute("type", "hidden"), n.setAttribute("name", i), n.setAttribute("value", t[i]), o.appendChild(n)
  }
  var r = window.frames.hotlead;
  r.document.body.appendChild(o), o.submit()
}
function updateCircleNews(e, t){
  var a = void 0, cur_pos = void 0, i = i = new google.maps.Geocoder;
  if(i.geocode({latLng: new google.maps.LatLng(e, t)}, function(e, t){
        if(t == google.maps.GeocoderStatus.OK)if(e[0]){
          for(var i = 0; i < e[0].address_components.length && ("postal_code" == e[0].address_components[i].types[0] && (cur_pos = e[0].address_components[i].short_name), "administrative_area_level_1" == e[0].address_components[i].types[0] && (a = e[0].address_components[i].long_name), void 0 === a || void 0 === cur_pos); i++);
          -1 !== pinsMumbai.indexOf(cur_pos) ? a = "mumbai" : -1 !== pinsPanchkula.indexOf(cur_pos) ? a = "punjab" : -1 !== pinsDelhiNCR.indexOf(cur_pos) ? a = "delhincr" : -1 !== pinsKolkata.indexOf(cur_pos) && (a = "kolkata"), a = a.toLowerCase().replace(/[^\w]/gi, "");
          var n = configBaseUrls.cmsUrl + "forme/new-online/leap/global-news/" + a + "/news?v=" + Math.random();
          document.getElementById("mapCircleNews").src = n
        } else{
          var n = configBaseUrls.cmsUrl + "forme/new-online/leap/global-news/india/news?v=" + Math.random();
          document.getElementById("mapCircleNews").src = n
        }
      }), void 0 === a){
    var n = configBaseUrls.cmsUrl + "forme/new-online/leap/global-news/india/news?v=" + Math.random();
    document.getElementById("mapCircleNews").src = n
  }
}
function resetLeadForm(){
  $("#spMob").hide(), $("#dvOwnMob").hide(), $("#btnSubmit").css({
    opacity           : "1",
    "background-image": "none"
  }), document.forms[0].reset()
}
function getParameterByName(e){
  e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var t = new RegExp("[\\?&]" + e + "=([^&#]*)"), a = t.exec(location.search);
  return null === a ? "" : decodeURIComponent(a[1].replace(/\+/g, " "))
}
function trackNeedAssistance(){
  pageName = "forme|leap|report issue|need help", channel = "forme|leap", subSection1 = "forme|leap|report issue", subSection2 = "forme|leap|report issue|need help", "undefined" != typeof _satellite && _satellite.track("vp-generic")
}
function trackSuccessNeedAssistance(e, t){
  pageName = "forme|leap|report issue|need help|thank you", channel = "forme|leap", subSection1 = "forme|leap|report issue", subSection2 = "forme|leap|report issue|need help", subSection3 = "forme|leap|report issue|need help|thank you", leapMobileNumber = e, leapcity = t, "undefined" != typeof _satellite && _satellite.track("leap-help")
}
function trackTowerHost(){
  pageName = "forme|leap|my network|i want tower", channel = "forme|leap", subSection1 = "forme|leap|my network", subSection2 = "forme|leap|my network|i want tower", "undefined" != typeof _satellite && _satellite.track("vp-generic")
}
function trackTowerHostSuccess(e, t, a){
  pageName = "forme|leap|my network|i want tower|thank you", channel = "forme|leap", subSection1 = "forme|leap|my network", subSection2 = "forme|leap|my network|i want tower", subSection3 = "forme|leap|my network|i want tower|thank you", leapLeadMob = e, leapProperty = t, leapAddress = a, "undefined" != typeof _satellite && _satellite.track("leap-lead")
}
function trackDisclaimer(){
  pageName = "forme|leap|disclaimer", channel = "forme|leap", subSection1 = "forme|leap|disclaimer", subSection2 = "forme|leap|disclaimer", "undefined" != typeof _satellite && _satellite.track("vp-generic")
}
Object.keys || (Object.keys = function(e){
  var t, a, o, i;
  for(t = [], a = 0, i = e.length; i > a; a++)o = e[a], e.hasOwnProperty(o) && t.push(o);
  return t
}), Object["delete"] = function(e, t){
  try{
    return delete e[t]
  } catch(a){
    return e[t] = void 0
  }
}, $(function(){
  return Modernizr.input.placeholder ? void 0 : $("[placeholder]").focus(function(){
    var e;
    return e = $(this), e.val() === e.attr("placeholder") ? e.val("").removeClass("placeholder") : void 0
  }).blur(function(){
    var e;
    return e = $(this), "" === e.val() || e.val() === e.attr("placeholder") ? e.addClass("placeholder").val(e.attr("placeholder")) : void 0
  }).blur().parents("form").submit(function(){
    return $(this).find("[placeholder]").each(function(){
      var e;
      return e = $(this), e.val() === e.attr("placeholder") ? e.val("") : void 0
    })
  })
}), $("#toggle-menu").on("click", function(){
  return $(this).toggleClass("active")
}), $(document).ready(function(){
  return window.Airtel.utils.checkScrollbar() > 0 && $("html").addClass("with-scrollbars"), $("body").on("click touchstart", function(e){
    return $('[data-toggle="popover"]').each(function(){
      return $(this).is(e.target) || 0 !== $(this).has(e.target).length || 0 !== $(".popover").has(e.target).length ? void 0 : $(this).popover("hide")
    })
  }), Modernizr.touch ? $(document).on("focus", "input", function(e){
    return $("body").addClass("fixfixed")
  }).on("blur", "input", function(e){
    return $("body").removeClass("fixfixed")
  }) : void 0
}), $(window).resize(function(){
  setHeader()
}), $(document).ready(function(){
  setHeader()
}), +function(e){
  "use strict";
  function t(t, o){
    return this.each(function(){
      var i = e(this), n = i.data("bs.modal"), r = e.extend({}, a.DEFAULTS, i.data(), "object" == typeof t && t);
      n || i.data("bs.modal", n = new a(this, r)), "string" == typeof t ? n[t](o) : r.show && n.show(o)
    })
  }

  var a = function(t, a){
    this.options = a, this.$body = e(document.body), this.$element = e(t), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, e.proxy(function(){
      this.$element.trigger("loaded.bs.modal")
    }, this))
  };
  a.VERSION = "3.3.5", a.TRANSITION_DURATION = 300, a.BACKDROP_TRANSITION_DURATION = 150, a.DEFAULTS = {
    backdrop: !0,
    keyboard: !0,
    show    : !0
  }, a.prototype.toggle = function(e){
    return this.isShown ? this.hide() : this.show(e)
  }, a.prototype.show = function(t){
    var o = this, i = e.Event("show.bs.modal", {relatedTarget: t});
    this.$element.trigger(i), this.isShown || i.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', e.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function(){
      o.$element.one("mouseup.dismiss.bs.modal", function(t){
        e(t.target).is(o.$element) && (o.ignoreBackdropClick = !0)
      })
    }), this.backdrop(function(){
      var i = e.support.transition && o.$element.hasClass("fade");
      o.$element.parent().length || o.$element.appendTo(o.$body), o.$element.show().scrollTop(0), o.adjustDialog(), i && o.$element[0].offsetWidth, o.$element.addClass("in"), o.enforceFocus();
      var n = e.Event("shown.bs.modal", {relatedTarget: t});
      i ? o.$dialog.one("bsTransitionEnd", function(){
        o.$element.trigger("focus").trigger(n)
      }).emulateTransitionEnd(a.TRANSITION_DURATION) : o.$element.trigger("focus").trigger(n)
    }))
  }, a.prototype.hide = function(t){
    t && t.preventDefault(), t = e.Event("hide.bs.modal"), this.$element.trigger(t), this.isShown && !t.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), e(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), e.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", e.proxy(this.hideModal, this)).emulateTransitionEnd(a.TRANSITION_DURATION) : this.hideModal())
  }, a.prototype.enforceFocus = function(){
    e(document).off("focusin.bs.modal").on("focusin.bs.modal", e.proxy(function(e){
      this.$element[0] === e.target || this.$element.has(e.target).length || this.$element.trigger("focus")
    }, this))
  }, a.prototype.escape = function(){
    this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", e.proxy(function(e){
      27 == e.which && this.hide()
    }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
  }, a.prototype.resize = function(){
    this.isShown ? e(window).on("resize.bs.modal", e.proxy(this.handleUpdate, this)) : e(window).off("resize.bs.modal")
  }, a.prototype.hideModal = function(){
    var e = this;
    this.$element.hide(), this.backdrop(function(){
      e.$body.removeClass("modal-open"), e.resetAdjustments(), e.resetScrollbar(), e.$element.trigger("hidden.bs.modal")
    })
  }, a.prototype.removeBackdrop = function(){
    this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
  }, a.prototype.backdrop = function(t){
    var o = this, i = this.$element.hasClass("fade") ? "fade" : "";
    if(this.isShown && this.options.backdrop){
      var n = e.support.transition && i;
      if(this.$backdrop = e(document.createElement("div")).addClass("modal-backdrop " + i).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", e.proxy(function(e){
            return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(e.target === e.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
          }, this)), n && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !t)return;
      n ? this.$backdrop.one("bsTransitionEnd", t).emulateTransitionEnd(a.BACKDROP_TRANSITION_DURATION) : t()
    } else if(!this.isShown && this.$backdrop){
      this.$backdrop.removeClass("in");
      var r = function(){
        o.removeBackdrop(), t && t()
      };
      e.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", r).emulateTransitionEnd(a.BACKDROP_TRANSITION_DURATION) : r()
    } else t && t()
  }, a.prototype.handleUpdate = function(){
    this.adjustDialog()
  }, a.prototype.adjustDialog = function(){
    var e = this.$element[0].scrollHeight > document.documentElement.clientHeight;
    this.$element.css({
      paddingLeft : !this.bodyIsOverflowing && e ? this.scrollbarWidth : "",
      paddingRight: this.bodyIsOverflowing && !e ? this.scrollbarWidth : ""
    })
  }, a.prototype.resetAdjustments = function(){
    this.$element.css({paddingLeft: "", paddingRight: ""})
  }, a.prototype.checkScrollbar = function(){
    var e = window.innerWidth;
    if(!e){
      var t = document.documentElement.getBoundingClientRect();
      e = t.right - Math.abs(t.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < e, this.scrollbarWidth = this.measureScrollbar()
  }, a.prototype.setScrollbar = function(){
    var e = parseInt(this.$body.css("padding-right") || 0, 10);
    this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", e + this.scrollbarWidth)
  }, a.prototype.resetScrollbar = function(){
    this.$body.css("padding-right", this.originalBodyPad)
  }, a.prototype.measureScrollbar = function(){
    var e = document.createElement("div");
    e.className = "modal-scrollbar-measure", this.$body.append(e);
    var t = e.offsetWidth - e.clientWidth;
    return this.$body[0].removeChild(e), t
  };
  var o = e.fn.modal;
  e.fn.modal = t, e.fn.modal.Constructor = a, e.fn.modal.noConflict = function(){
    return e.fn.modal = o, this
  }, e(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(a){
    var o = e(this), i = o.attr("href"), n = e(o.attr("data-target") || i && i.replace(/.*(?=#[^\s]+$)/, "")), r = n.data("bs.modal") ? "toggle" : e.extend({remote: !/#/.test(i) && i}, n.data(), o.data());
    o.is("a") && a.preventDefault(), n.one("show.bs.modal", function(e){
      e.isDefaultPrevented() || n.one("hidden.bs.modal", function(){
        o.is(":visible") && o.trigger("focus")
      })
    }), t.call(n, r, this)
  })
}(jQuery), +function(e){
  "use strict";
  function t(t){
    return this.each(function(){
      var o = e(this), i = o.data("bs.tab");
      i || o.data("bs.tab", i = new a(this)), "string" == typeof t && i[t]()
    })
  }

  var a = function(t){
    this.element = e(t)
  };
  a.VERSION = "3.3.5", a.TRANSITION_DURATION = 150, a.prototype.show = function(){
    var t = this.element, a = t.closest("ul:not(.dropdown-menu)"), o = t.data("target");
    if(o || (o = t.attr("href"), o = o && o.replace(/.*(?=#[^\s]*$)/, "")), !t.parent("li").hasClass("active")){
      var i = a.find(".active:last a"), n = e.Event("hide.bs.tab", {relatedTarget: t[0]}), r = e.Event("show.bs.tab", {relatedTarget: i[0]});
      if(i.trigger(n), t.trigger(r), !r.isDefaultPrevented() && !n.isDefaultPrevented()){
        var s = e(o);
        this.activate(t.closest("li"), a), this.activate(s, s.parent(), function(){
          i.trigger({type: "hidden.bs.tab", relatedTarget: t[0]}), t.trigger({
            type         : "shown.bs.tab",
            relatedTarget: i[0]
          })
        })
      }
    }
  }, a.prototype.activate = function(t, o, i){
    function n(){
      r.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), t.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), s ? (t[0].offsetWidth, t.addClass("in")) : t.removeClass("fade"), t.parent(".dropdown-menu").length && t.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), i && i()
    }

    var r = o.find("> .active"), s = i && e.support.transition && (r.length && r.hasClass("fade") || !!o.find("> .fade").length);
    r.length && s ? r.one("bsTransitionEnd", n).emulateTransitionEnd(a.TRANSITION_DURATION) : n(), r.removeClass("in")
  };
  var o = e.fn.tab;
  e.fn.tab = t, e.fn.tab.Constructor = a, e.fn.tab.noConflict = function(){
    return e.fn.tab = o, this
  };
  var i = function(a){
    a.preventDefault(), t.call(e(this), "show")
  };
  e(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', i).on("click.bs.tab.data-api", '[data-toggle="pill"]', i)
}(jQuery), +function(e){
  "use strict";
  function t(t){
    return this.each(function(){
      var o = e(this), i = o.data("bs.tooltip"), n = "object" == typeof t && t;
      (i || !/destroy|hide/.test(t)) && (i || o.data("bs.tooltip", i = new a(this, n)), "string" == typeof t && i[t]())
    })
  }

  var a = function(e, t){
    this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", e, t)
  };
  a.VERSION = "3.3.6", a.TRANSITION_DURATION = 150, a.DEFAULTS = {
    animation: !0,
    placement: "top",
    selector : !1,
    template : '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger  : "hover focus",
    title    : "",
    delay    : 0,
    html     : !1,
    container: !1,
    viewport : {selector: "body", padding: 0}
  }, a.prototype.init = function(t, a, o){
    if(this.enabled = !0, this.type = t, this.$element = e(a), this.options = this.getOptions(o), this.$viewport = this.options.viewport && e(e.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
          click: !1,
          hover: !1,
          focus: !1
        }, this.$element[0]instanceof document.constructor && !this.options.selector)throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
    for(var i = this.options.trigger.split(" "), n = i.length; n--;){
      var r = i[n];
      if("click" == r)this.$element.on("click." + this.type, this.options.selector, e.proxy(this.toggle, this)); else if("manual" != r){
        var s = "hover" == r ? "mouseenter" : "focusin", l = "hover" == r ? "mouseleave" : "focusout";
        this.$element.on(s + "." + this.type, this.options.selector, e.proxy(this.enter, this)), this.$element.on(l + "." + this.type, this.options.selector, e.proxy(this.leave, this))
      }
    }
    this.options.selector ? this._options = e.extend({}, this.options, {
      trigger : "manual",
      selector: ""
    }) : this.fixTitle()
  }, a.prototype.getDefaults = function(){
    return a.DEFAULTS
  }, a.prototype.getOptions = function(t){
    return t = e.extend({}, this.getDefaults(), this.$element.data(), t), t.delay && "number" == typeof t.delay && (t.delay = {
      show: t.delay,
      hide: t.delay
    }), t
  }, a.prototype.getDelegateOptions = function(){
    var t = {}, a = this.getDefaults();
    return this._options && e.each(this._options, function(e, o){
      a[e] != o && (t[e] = o)
    }), t
  }, a.prototype.enter = function(t){
    var a = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
    return a || (a = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, a)), t instanceof e.Event && (a.inState["focusin" == t.type ? "focus" : "hover"] = !0), a.tip().hasClass("in") || "in" == a.hoverState ? void(a.hoverState = "in") : (clearTimeout(a.timeout), a.hoverState = "in", a.options.delay && a.options.delay.show ? void(a.timeout = setTimeout(function(){
      "in" == a.hoverState && a.show()
    }, a.options.delay.show)) : a.show())
  }, a.prototype.isInStateTrue = function(){
    for(var e in this.inState)if(this.inState[e])return !0;
    return !1
  }, a.prototype.leave = function(t){
    var a = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
    return a || (a = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, a)), t instanceof e.Event && (a.inState["focusout" == t.type ? "focus" : "hover"] = !1), a.isInStateTrue() ? void 0 : (clearTimeout(a.timeout), a.hoverState = "out", a.options.delay && a.options.delay.hide ? void(a.timeout = setTimeout(function(){
      "out" == a.hoverState && a.hide()
    }, a.options.delay.hide)) : a.hide())
  }, a.prototype.show = function(){
    var t = e.Event("show.bs." + this.type);
    if(this.hasContent() && this.enabled){
      this.$element.trigger(t);
      var o = e.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
      if(t.isDefaultPrevented() || !o)return;
      var i = this, n = this.tip(), r = this.getUID(this.type);
      this.setContent(), n.attr("id", r), this.$element.attr("aria-describedby", r), this.options.animation && n.addClass("fade");
      var s = "function" == typeof this.options.placement ? this.options.placement.call(this, n[0], this.$element[0]) : this.options.placement, l = /\s?auto?\s?/i, p = l.test(s);
      p && (s = s.replace(l, "") || "top"), n.detach().css({
        top    : 0,
        left   : 0,
        display: "block"
      }).addClass(s).data("bs." + this.type, this), this.options.container ? n.appendTo(this.options.container) : n.insertAfter(this.$element),
          this.$element.trigger("inserted.bs." + this.type);
      var c = this.getPosition(), d = n[0].offsetWidth, m = n[0].offsetHeight;
      if(p){
        var g = s, u = this.getPosition(this.$viewport);
        s = "bottom" == s && c.bottom + m > u.bottom ? "top" : "top" == s && c.top - m < u.top ? "bottom" : "right" == s && c.right + d > u.width ? "left" : "left" == s && c.left - d < u.left ? "right" : s, n.removeClass(g).addClass(s)
      }
      var h = this.getCalculatedOffset(s, c, d, m);
      this.applyPlacement(h, s);
      var f = function(){
        var e = i.hoverState;
        i.$element.trigger("shown.bs." + i.type), i.hoverState = null, "out" == e && i.leave(i)
      };
      e.support.transition && this.$tip.hasClass("fade") ? n.one("bsTransitionEnd", f).emulateTransitionEnd(a.TRANSITION_DURATION) : f()
    }
  }, a.prototype.applyPlacement = function(t, a){
    var o = this.tip(), i = o[0].offsetWidth, n = o[0].offsetHeight, r = parseInt(o.css("margin-top"), 10), s = parseInt(o.css("margin-left"), 10);
    isNaN(r) && (r = 0), isNaN(s) && (s = 0), t.top += r, t.left += s, e.offset.setOffset(o[0], e.extend({
      using: function(e){
        o.css({top: Math.round(e.top), left: Math.round(e.left)})
      }
    }, t), 0), o.addClass("in");
    var l = o[0].offsetWidth, p = o[0].offsetHeight;
    "top" == a && p != n && (t.top = t.top + n - p);
    var c = this.getViewportAdjustedDelta(a, t, l, p);
    c.left ? t.left += c.left : t.top += c.top;
    var d = /top|bottom/.test(a), m = d ? 2 * c.left - i + l : 2 * c.top - n + p, g = d ? "offsetWidth" : "offsetHeight";
    o.offset(t), this.replaceArrow(m, o[0][g], d)
  }, a.prototype.replaceArrow = function(e, t, a){
    this.arrow().css(a ? "left" : "top", 50 * (1 - e / t) + "%").css(a ? "top" : "left", "")
  }, a.prototype.setContent = function(){
    var e = this.tip(), t = this.getTitle();
    e.find(".tooltip-inner")[this.options.html ? "html" : "text"](t), e.removeClass("fade in top bottom left right")
  }, a.prototype.hide = function(t){
    function o(){
      "in" != i.hoverState && n.detach(), i.$element.removeAttr("aria-describedby").trigger("hidden.bs." + i.type), t && t()
    }

    var i = this, n = e(this.$tip), r = e.Event("hide.bs." + this.type);
    return this.$element.trigger(r), r.isDefaultPrevented() ? void 0 : (n.removeClass("in"), e.support.transition && n.hasClass("fade") ? n.one("bsTransitionEnd", o).emulateTransitionEnd(a.TRANSITION_DURATION) : o(), this.hoverState = null, this)
  }, a.prototype.fixTitle = function(){
    var e = this.$element;
    (e.attr("title") || "string" != typeof e.attr("data-original-title")) && e.attr("data-original-title", e.attr("title") || "").attr("title", "")
  }, a.prototype.hasContent = function(){
    return this.getTitle()
  }, a.prototype.getPosition = function(t){
    t = t || this.$element;
    var a = t[0], o = "BODY" == a.tagName, i = a.getBoundingClientRect();
    null == i.width && (i = e.extend({}, i, {width: i.right - i.left, height: i.bottom - i.top}));
    var n = o ? {
      top : 0,
      left: 0
    } : t.offset(), r = {scroll: o ? document.documentElement.scrollTop || document.body.scrollTop : t.scrollTop()}, s = o ? {
      width : e(window).width(),
      height: e(window).height()
    } : null;
    return e.extend({}, i, r, s, n)
  }, a.prototype.getCalculatedOffset = function(e, t, a, o){
    return "bottom" == e ? {top: t.top + t.height, left: t.left + t.width / 2 - a / 2} : "top" == e ? {
      top : t.top - o,
      left: t.left + t.width / 2 - a / 2
    } : "left" == e ? {top: t.top + t.height / 2 - o / 2, left: t.left - a} : {
      top : t.top + t.height / 2 - o / 2,
      left: t.left + t.width
    }
  }, a.prototype.getViewportAdjustedDelta = function(e, t, a, o){
    var i = {top: 0, left: 0};
    if(!this.$viewport)return i;
    var n = this.options.viewport && this.options.viewport.padding || 0, r = this.getPosition(this.$viewport);
    if(/right|left/.test(e)){
      var s = t.top - n - r.scroll, l = t.top + n - r.scroll + o;
      s < r.top ? i.top = r.top - s : l > r.top + r.height && (i.top = r.top + r.height - l)
    } else{
      var p = t.left - n, c = t.left + n + a;
      p < r.left ? i.left = r.left - p : c > r.right && (i.left = r.left + r.width - c)
    }
    return i
  }, a.prototype.getTitle = function(){
    var e, t = this.$element, a = this.options;
    return e = t.attr("data-original-title") || ("function" == typeof a.title ? a.title.call(t[0]) : a.title)
  }, a.prototype.getUID = function(e){
    do e += ~~(1e6 * Math.random()); while(document.getElementById(e));
    return e
  }, a.prototype.tip = function(){
    if(!this.$tip && (this.$tip = e(this.options.template), 1 != this.$tip.length))throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
    return this.$tip
  }, a.prototype.arrow = function(){
    return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
  }, a.prototype.enable = function(){
    this.enabled = !0
  }, a.prototype.disable = function(){
    this.enabled = !1
  }, a.prototype.toggleEnabled = function(){
    this.enabled = !this.enabled
  }, a.prototype.toggle = function(t){
    var a = this;
    t && (a = e(t.currentTarget).data("bs." + this.type), a || (a = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, a))), t ? (a.inState.click = !a.inState.click, a.isInStateTrue() ? a.enter(a) : a.leave(a)) : a.tip().hasClass("in") ? a.leave(a) : a.enter(a)
  }, a.prototype.destroy = function(){
    var e = this;
    clearTimeout(this.timeout), this.hide(function(){
      e.$element.off("." + e.type).removeData("bs." + e.type), e.$tip && e.$tip.detach(), e.$tip = null, e.$arrow = null, e.$viewport = null
    })
  };
  var o = e.fn.tooltip;
  e.fn.tooltip = t, e.fn.tooltip.Constructor = a, e.fn.tooltip.noConflict = function(){
    return e.fn.tooltip = o, this
  }
}(jQuery), window.AdobeTagging = function(e, t){
  var a, o, i, n, r, s, l, p, c;
  return n = !0, o = {channel: "forme|internet", subSection1: "forme|internet|4g"}, l = function(e){
    return e ? (n && (console.log("----------------------"), console.log("performTrack ->", e)), _satellite.pageBottom()) : void 0
  }, i = function(){
    return "forme|internet|4g|" + [].slice.call(arguments).join("|")
  }, c = function(t, a){
    return t.channel || (t.channel = o.channel), t.channel === o.channel && (t.subSection2 ? t.subSection2.indexOf("forme|internet|4g|") < 0 && (t.subSection2 = i(t.subSection2)) : t.subSection2 = i(t.pageName), t.subSection3 ? t.subSection3.indexOf("forme|internet|4g|") < 0 && (t.subSection3 = i(t.subSection3)) : t.subSection3 = i(t.pageName), t.pageName.indexOf("forme|internet|4g|") < 0 && (t.pageName = i(t.pageName))), e(!0, {}, o, t, a)
  }, r = function(e, a){
    return t.pages[e] ? p(c(t.pages[e], a)) : void 0
  }, s = function(e, a, o){
    return null == o && (o = !0), t.screens[e] ? (p(c(t.screens[e], a)), o ? l(t.screens[e].trackName) : void 0) : void 0
  }, p = function(e){
    var t, a, o;
    if(e){
      n && console.debug(" "), a = [];
      for(t in e)o = e[t], "trackName" !== t && (window[t] = o), n ? a.push(console.debug(t, " => ", o)) : a.push(void 0);
      return a
    }
  }, a = {onPageLoad: r, onScreenLoad: s}
}(window.jQuery.extend, {
  screens: {
    "on-the-go-click"                         : {pageName: "on the go", trackName: "vp-generic"},
    "for-home-click"                          : {pageName: "For Home", trackName: "vp-generic"},
    "check-feasibility-intro"                 : {
      pageName : "for home|check feasibility intro",
      trackName: "vp-generic"
    },
    "check-feasibility"                       : {pageName: "for home|check feasibility", trackName: "vp-generic"},
    "check-feasibility-success"               : {
      pageName : "for home|check feasibility success",
      trackName: "vp-generic"
    },
    "check-feasibility-failure"               : {
      pageName : "for home|check feasibility failure",
      trackName: "vp-generic"
    },
    "check-feasibility-mobile-success"        : {
      pageName : "for home|check feasibility mobile success",
      trackName: "vp-generic"
    },
    "check-feasibility-notify"                : {pageName: "for home|notify", trackName: "vp-generic"},
    "check-feasibility-notify-success"        : {pageName: "for home|notify success", trackName: "lead-generic"},
    checkout                                  : {pageName: "for home|checkout", trackName: "vp-generic"},
    "for-home-change-plan"                    : {pageName: "for home|change plan", trackName: "vp-generic"},
    "account-shipping"                        : {
      pageName : "for home|account and shipping",
      trackName: "vp-generic"
    },
    "installation-schedule"                   : {
      pageName : "for home|installation schedule",
      trackName: "vp-generic"
    },
    "payment-options"                         : {pageName: "for home|payment options", trackName: "vp-generic"},
    "cpe-terms-conditions"                    : {pageName: "for home|tnc", trackName: "vp-generic"},
    "order-success"                           : {pageName: "for home|order success", trackName: "vp-generic"},
    "order-fail"                              : {pageName: "for home|order failed", trackName: "vp-generic"},
    "on-the-go-choose-city"                   : {
      pageName   : "on the go|choose city",
      subSection2: "on the go",
      trackName  : "vp-generic"
    },
    "on-the-go-lead-form"                     : {
      pageName   : "on the go|lead form",
      subSection2: "on the go",
      trackName  : "vp-generic"
    },
    "on-the-go-lead-form-success"             : {
      pageName   : "on the go|lead form success",
      subSection2: "on the go",
      trackName  : "vp-generic"
    },
    "mobile-postpaid-choose-city"             : {
      pageName   : "for mobile|postpaid|select city",
      subSection2: "for home",
      trackName  : "vp-generic",
      fgPlanType : "New/Normal"
    },
    "my-plan-prepaid-leadform"                : {
      pageName   : "for mobile|prepaid|lead form",
      subSection2: "for mobile"
    },
    "my-plan-prepaid-success-page"            : {
      pageName   : "for mobile|prepaid|lead success",
      subSection2: "for mobile",
      leadlob    : "resp-4G-prepaid",
      trackName  : "lead-generic"
    },
    "prepaid-store-finder-page"               : {pageName: "store finder", trackName: "vp-generic"},
    "new-postpaid-rush"                       : {
      pageName   : "for mobile|postpaid|in a rush",
      subSection2: "for mobile",
      trackName  : "vp-generic"
    },
    "choose-rental"                           : {
      pageName   : "for mobile|choose rental",
      subSection2: "for mobile",
      trackName  : "vp-generic"
    },
    "choose-pack"                             : {
      pageName   : "for mobile|postpaid|choose pack",
      subSection2: "for mobile",
      fgPlanType : "New/Normal",
      trackName  : "vp-myplan"
    },
    "add-pack"                                : {
      pageName   : "for mobile|postpaid|add pack",
      subSection2: "for mobile",
      fgPlanType : "New/Normal",
      trackName  : "vp-myplan"
    },
    "add-boosters"                            : {
      pageName   : "for mobile|postpaid|add boosters",
      subSection2: "for mobile",
      fgPlanType : "New/Normal",
      trackName  : "vp-myplan"
    },
    "save plan"                               : {
      pageName   : "for mobile|postpaid|save plan",
      subSection2: "for mobile",
      fgPlanType : "New/Normal",
      trackName  : "vp-generic"
    },
    "save plan final"                         : {
      pageName   : "for mobile|postpaid|save plan final",
      subSection2: "for mobile",
      fgPlanType : "New/Normal",
      trackName  : "vp-myplan"
    },
    "lead-postpaid-success"                   : {
      pageName   : "for mobile|postpaid|lead success",
      subSection2: "for mobile",
      leadlob    : "resp-4G-postpaid",
      trackName  : "vp-generic"
    },
    "status-check"                            : {
      pageName   : "for mobile|status check",
      subSection2: "for mobile",
      trackName  : "vp-generic"
    },
    "get-device"                              : {
      pageName   : "for mobile|buy 4g device",
      subSection2: "for mobile",
      trackName  : "vp-generic"
    },
    "compatible-devices"                      : {
      pageName   : "for mobile|compatible devices",
      subSection2: "for mobile",
      trackName  : "vp-generic"
    },
    "request-4g-sim"                          : {
      pageName   : "for mobile|request 4G sim",
      subSection2: "for mobile",
      trackName  : "vp-generic"
    },
    "choose-plan"                             : {
      pageName   : "for mobile|choose 4g plan",
      subSection2: "for mobile",
      trackName  : "vp-generic"
    },
    "choose-plan-upgrade-booster"             : {
      pageName   : "for mobile|choose 4g plan|agree and upgrade",
      subSection2: "for mobile|choose 4g plan",
      trackName  : "vp-fg-plan"
    },
    "choose-plan-upgrade-booster-success"     : {
      pageName   : "for mobile|choose 4g plan|upgrade success",
      subSection2: "for mobile|choose 4g plan"
    },
    "choose-plan-change-plan"                 : {
      pageName   : "for mobile|choose 4g plan|change plan",
      subSection2: "for mobile",
      trackName  : "vp-4g-buyplan"
    },
    "choose-plan-change-plan-success"         : {
      pageName   : "for mobile|choose 4g plan|change plan success",
      subSection2: "for mobile",
      trackName  : "vp-4g-buyplan"
    },
    "something-went-wrong"                    : {
      pageName   : "for mobile|choose 4g plan|something went wrong",
      subSection2: "for mobile|choose 4g plan",
      trackName  : "vp-fg-plan"
    },
    "upgrade-error"                           : {
      pageName   : "for mobile|choose 4g plan|upgrade error",
      subSection2: "for mobile|choose 4g plan",
      trackName  : "vp-fg-plan"
    },
    "choose-plan-not-4g-circle-notify-success": {
      pageName   : "for mobile|choose plan|not 4g circle|notify success",
      subSection2: "for mobile",
      trackName  : "vp-4g-buyplan"
    },
    "choose-plan-upgrade-myplan"              : {
      pageName   : "for mobile|choose plan|upgrade to myplan",
      subSection2: "for mobile",
      trackName  : "vp-4g-buyplan"
    },
    "choose-plan-send-sim"                    : {
      pageName   : "for mobile|choose plan|send sim",
      subSection2: "for mobile",
      trackName  : "vp-4g-buyplan"
    },
    "choose-plan-send-sim-sucess"             : {
      pageName   : "for mobile|choose plan|send sim success",
      subSection2: "for mobile",
      trackName  : "vp-4g-buyplan"
    },
    "choose-plan-need-device"                 : {
      pageName   : "for mobile|choose plan|need device",
      subSection2: "for mobile",
      trackName  : "vp-4g-buyplan"
    },
    "choose-plan-not-4g-circle"               : {
      pageName   : "for mobile|choose plan|not 4g circle",
      subSection2: "for mobile",
      trackName  : "vp-4g-buyplan"
    },
    "postpaid-unable-to-upgrade"              : {
      pageName   : "plan postpaid|unable to upgrade",
      trackName  : "vp-generic",
      subSection2: "plan postpaid"
    },
    "postpaid-need-usim"                      : {
      pageName   : "plan postpaid|need 4g sim",
      trackName  : "vp-generic",
      subSection2: "plan postpaid"
    },
    "postpaid-need-4g-device"                 : {
      pageName   : "plan postpaid|need 4g device",
      trackName  : "vp-generic",
      subSection2: "plan postpaid"
    },
    "postpaid-agree-upgrade"                  : {
      pageName   : "plan postpaid|agree and upgrade",
      trackName  : "vp-generic",
      subSection2: "plan postpaid"
    },
    "postpaid-upgrade-success"                : {
      pageName   : "plan postpaid|upgrade success",
      trackName  : "vp-generic",
      subSection2: "plan postpaid"
    },
    "postpaid-request-4g-sim"                 : {
      pageName   : "plan postpaid|request 4g sim",
      trackName  : "vp-generic",
      subSection2: "plan postpaid"
    },
    "postpaid-request-4g-sim-success"         : {
      pageName   : "plan postpaid|request sim success",
      trackName  : "vp-generic",
      subSection2: "plan postpaid"
    },
    "postpaid-wrong-city-change-plan"         : {
      pageName   : "plan postpaid|wrong city change plan",
      trackName  : "vp-generic",
      subSection2: "plan postpaid"
    },
    "postpaid-family-share-change-plan"       : {
      pageName   : "plan postpaid|family share change plan",
      trackName  : "vp-generic",
      subSection2: "plan postpaid"
    },
    "postpaid-change-plan"                    : {
      pageName   : "plan postpaid|change plan",
      trackName  : "vp-generic",
      subSection2: "plan postpaid"
    },
    "prepaid-agree-recharge"                  : {
      pageName : "plan prepaid|agree and recharge",
      trackName: "vp-generic"
    },
    "prepaid-4g-device-required"              : {
      pageName : "plan prepaid|4g device required",
      trackName: "vp-generic"
    },
    "prepaid-need-4g-sim"                     : {
      pageName   : "plan prepaid|need 4g sim",
      trackName  : "vp-generic",
      subSection2: "plan prepaid"
    },
    "prepaid-request-4g-sim-success"          : {
      pageName   : "plan prepaid|request sim success",
      trackName  : "vp-generic",
      subSection2: "plan prepaid"
    },
    "prepaid-enter-number"                    : {pageName: "plan prepaid|enter number", trackName: "vp-generic"},
    "prepaid-wrong-city-change-plan"          : {
      pageName   : "plan prepaid|wrong city change plan",
      trackName  : "vp-generic",
      subSection2: "plan prepaid"
    },
    "simswap-need-device"                     : {
      pageName   : "simswap|need device",
      subSection2: "simswap",
      trackName  : "vp-generic"
    },
    register                                  : {
      pageName   : "register for challenge",
      subSection2: "register for challenge",
      trackName  : "vp-generic"
    },
    "register-success"                        : {
      pageName   : "challenge registration success",
      subSection2: "challenge registration success",
      trackName  : "vp-generic"
    },
    "manage-order-enter-order"                : {
      pageName : "for home|manage order|enter order",
      trackName: "vp-generic"
    },
    "manage-order-mobile-number"              : {
      pageName : "for home|manage order|enter mobile",
      trackName: "vp-generic"
    },
    "manage-order-otp"                        : {
      pageName : "for home|manage order|enter otp",
      trackName: "vp-generic"
    },
    "infinity-postpaid-customer-selection"    : {pageName: "infinity postpaid|home", trackName: "vp-generic"},
    "infinity-postpaid-confirm-plan"          : {pageName: "infinity postpaid|confirm", trackName: "vp-generic"},
    "infinity-postpaid-save-plan"             : {
      pageName : "infinity postpaid|save plan infinity",
      trackName: "vp-generic"
    },
    "infinity-postpaid-lead-success"          : {
      pageName : "infinity postpaid|lead success",
      trackName: "vp-generic",
      leadlob  : "resp-4G-postpaid"
    },
    "infinity-postpaid-unable-upgrade"        : {
      pageName   : "infinity postpaid|unable to upgrade",
      trackName  : "vp-generic",
      subSection2: "infinity postpaid"
    },
    "infinity-postpaid-need-4g-device"        : {
      pageName   : "infinity postpaid|need 4g device",
      trackName  : "vp-generic",
      subSection2: "infinity postpaid"
    },
    "infinity-postpaid-need-4g-sim"           : {
      pageName   : "infinity postpaid|need 4g sim",
      trackName  : "vp-generic",
      subSection2: "infinity postpaid"
    },
    "infinity-postpaid-agree-upgrade"         : {
      pageName   : "infinity postpaid|agree and upgrade",
      trackName  : "vp-generic",
      subSection2: "infinity postpaid"
    },
    "infinity-postpaid-agree-upgrade-success" : {
      pageName   : "infinity postpaid|upgrade success",
      trackName  : "vp-generic",
      subSection2: "infinity postpaid"
    },
    "infinity-postpaid-request-4g-sim"        : {
      pageName   : "infinity postpaid|request 4G SIM",
      trackName  : "vp-generic",
      subSection2: "infinity postpaid"
    },
    "infinity-postpaid-request-4g-sim-success": {
      pageName   : "infinity postpaid|4G SIM Success",
      trackName  : "vp-generic",
      subSection2: "infinity postpaid"
    },
    "infinity-postpaid-change-plan"           : {
      pageName   : "infinity postpaid|change plan",
      trackName  : "vp-generic",
      subSection2: "infinity postpaid"
    },
    "infinity-postpaid-wrong-city"            : {
      pageName   : "infinity postpaid|wrong city change plan",
      trackName  : "vp-generic",
      subSection2: "infinity postpaid"
    },
    "infinity-prepaid-customer-selection"     : {pageName: "infinity prepaid|home", trackName: "vp-generic"},
    "infinity-prepaid-enter-number"           : {
      pageName : "infinity prepaid|enter number",
      trackName: "vp-generic"
    },
    "infinity-prepaid-request-4g-sim"         : {
      pageName : "infinity prepaid|request 4g sim",
      trackName: "vp-generic"
    },
    "infinity-prepaid-request-4g-sim-success" : {
      pageName : "infinity prepaid|request sim success",
      trackName: "vp-generic"
    },
    "infinity-prepaid-4g-device-required"     : {
      pageName : "infinity prepaid|4g device required",
      trackName: "vp-generic"
    },
    "infinity-prepaid-agree-and-recharge"     : {
      pageName : "infinity prepaid|agree and recharge",
      trackName: "vp-generic"
    },
    "infinity-prepaid-save-plan"              : {
      pageName   : "infinity prepaid|save plan",
      subSection2: "infinity prepaid|save plan",
      trackName  : "vp-generic"
    },
    "my-plan-infinity-prepaid-leadform"       : {
      pageName   : "infinity prepaid|save plan",
      subSection2: "infinity prepaid|save plan"
    },
    "infinity-prepaid-agree-recharge"         : {
      pageName : "infinity prepaid|agree and recharge",
      trackName: "vp-generic"
    },
    "error-404"                               : {
      pageName   : "forme|error|404 error",
      channel    : "forme|error",
      subSection1: "forme|error|404",
      subSection2: "forme|error|404"
    },
    "error-500"                               : {
      pageName   : "forme|error|500 error",
      channel    : "forme|error",
      subSection1: "forme|error|500",
      subSection2: "forme|error|500"
    }
  },
  pages  : {
    home                                          : {pageName: "home"},
    "manage-order"                                : {pageName: "for home|manage order", subSection2: "for home"},
    "my-plan-prepaid-leadform"                    : {
      pageName   : "for mobile|prepaid|lead form",
      subSection2: "for mobile"
    },
    "new-postpaid-customer"                       : {
      pageName   : "for mobile|postpaid|select city",
      subSection2: "for mobile",
      fgPlanType : "New/Normal"
    },
    "sim-swap"                                    : {
      pageName   : "for mobile|sim swap",
      subSection2: "for mobile",
      trackName  : "vp-generic"
    },
    "simswap-not-4g-circle"                       : {pageName: "simswap|not 4g circle", subSection2: "simswap"},
    "simswap-success"                             : {
      pageName   : "for mobile|sim swap success",
      subSection2: "for mobile",
      productType: "resp-4g-sim",
      trackName  : "4g-new-lead-form"
    },
    "prepaid-request-4g-sim"                      : {
      pageName   : "plan prepaid|request 4g sim",
      trackName  : "vp-generic",
      subSection2: "plan prepaid"
    },
    "get-4g-sim-new-customer-request"             : {
      pageName   : "new customer|request 4g sim",
      trackName  : "vp-generic",
      subSection2: "new customer",
      subSection3: "new customer|request 4g sim"
    },
    "get-4g-sim-existing-customer-request"        : {
      pageName   : "existing customer|request 4g sim",
      trackName  : "vp-generic",
      subSection2: "existing customer",
      subSection3: "existing customer|request 4g sim"
    },
    "get-4g-sim-new-customer-request-success"     : {
      pageName   : "new customer|request 4g sim thank you",
      trackName  : "vp-generic",
      subSection2: "new customer",
      subSection3: "new customer|request 4g sim thank you",
      leadlob    : "resp-4g-sim swap new customer",
      from_page  : "forme|internet|4g|new customer|request 4g sim"
    },
    "get-4g-sim-existing-customer-request-success": {
      pageName   : "existing customer|request 4g sim success",
      trackName  : "vp-generic",
      subSection2: "existing customer",
      subSection3: "existing customer|request 4g sim success",
      leadlob    : "resp-4g-sim swap existing customer",
      from_page  : "forme|internet|4g|existing customer|request 4g sim"
    }
  }
}), function(){
  var e, t;
  return window.Airtel || (window.Airtel = {}), e = $("html, body"), t = null, window.Airtel.utils = {
    debounce        : function(e, t){
      var a;
      return a = null, function(){
        var o, i;
        return i = this, o = arguments, clearTimeout(a), a = setTimeout(function(){
          return e.apply(i, o)
        }, t)
      }
    },
    throttle        : function(e, t, a){
      var o;
      return null == t && (t = 300), o = !1, function(){
        return o ? void 0 : (e.call(a), o = !0, setTimeout(function(){
          return o = !1
        }, t))
      }
    },
    scrollTo        : function(t, a){
      var o, i, n, r, s, l;
      return o = {
        duration : 500,
        easing   : "swing",
        edge     : "top",
        offset   : 0,
        callback : null,
        autoStop : !0,
        container: "html, body"
      }, s = $.type(t), r = !1, "function" === $.type(a) ? (o.callback = a, a = o) : a = $.extend(o, a), e = $(a.container), ("object" === s || "string" === s) && (i = $(t), i.size() && (t = $(i).offset().top), "bottom" === a.edge && (l = $(window).height(), n = i.outerHeight(), t = t + n - l)), ".list-of-stores" === a.container && (t = t + e.scrollTop() - e.offset().top), e.stop(!0, !1).animate({scrollTop: t + a.offset}, a.duration, a.easing, function(){
        return a.callback && !r ? (r = !0, a.callback.call(this)) : void 0
      }), a.autoStop ? e.bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(){
        return e.stop()
      }) : void 0
    },
    getQueryParam   : function(e, a){
      var o;
      return t || (window.location.search.length ? (o = window.location.search.slice(1).split("&"), t = {}, o.forEach(function(e){
        var a;
        return a = e.split("="), t[a.shift()] = a.shift()
      })) : t = {}), e ? t[e] || a : t
    },
    sortOn          : function(e, t, a){
      return null != e ? e.sort(function(e, o){
        return a ? parseInt(e[t]) < parseInt(o[t]) ? -1 : e[t] > o[t] ? 1 : 0 : e[t] < o[t] ? -1 : e[t] > o[t] ? 1 : 0
      }) : void 0
    },
    setFreebiesIcon : function(e){
      switch(e.name){
        case"Music":
          return e.icon = "music";
        case"Movies":
          return e.icon = "movie";
        case"Roaming":
          return e.icon = "road-sign";
        case"All local calls":
          return e.icon = "local";
        case"All STD":
          return e.icon = "india";
        case"Airtel to Airtel":
          return e.icon = "phone"
      }
    },
    measureScrollbar: function(){
      var e, t;
      return e = document.createElement("div"), e.className = "modal-scrollbar-measure", $("body").append(e), t = e.offsetWidth - e.clientWidth, $("body")[0].removeChild(e), t
    },
    checkScrollbar  : function(){
      var e, t;
      return t = window.innerWidth, t || (e = document.documentElement.getBoundingClientRect(), t = e.right - Math.abs(e.left)), this.bodyIsOverflowing = document.body.clientWidth < t, this.scrollbarWidth = this.measureScrollbar()
    },
    preventDefault  : function(e){
      return e.preventDefault ? e.preventDefault() : e.returnValue = !1
    }
  }
}();
var configBaseUrls = {
  cmsUrl       : "http://www.airtel.in/beta/",
  feedbackUrl  : "https://esbsol.airtel.in:8081/airtel/online/",
  getCircleUrl : "http://www.airtel.in/wps/postpaidproxy/Restgenericservice/generalua/userprofile/",
  postLeadUrl  : "http://www.airtel.in/wps/postpaidproxy/Restgenericservice/generalua/ilms/captureLeadData",
  networkAPIUrl: "http://www.airtel.in/leap/rest/networks/"
}, centerLatlng = "", isLocChange = !1, isShowAddress = !1, map = "", isBtnSub = !1, circleFromMap = "", adCity = "", lat = 28.709903, lang = 77.485261, zoom = 4, centerCords = {
  lat: 21.1610858,
  lng: 79.0725101
}, initflag = !0, geocoder, globalMarker, globalInfowindow, networkType = "", sitesVisible = !1, hideData = !1, globalInfowindow, markersList = [], prev_infowindow = !1, plotNetworkMarkers = function(e){
  sitesVisible = !0;
  var t = getSelectedFilters();
  for(obj in e)t ? (1 == t.planned && "Planned" == e[obj].type && addMarker(parseFloat(e[obj].latitude), parseFloat(e[obj].longitude), e[obj].type, e[obj].pincode, e[obj].locked), 1 == t.existing && "Live" == e[obj].type && addMarker(parseFloat(e[obj].latitude), parseFloat(e[obj].longitude), e[obj].type, e[obj].pincode, e[obj].locked), 1 == t.existing && "WiFi" == e[obj].type && addMarker(parseFloat(e[obj].latitude), parseFloat(e[obj].longitude), e[obj].type, e[obj].pincode, e[obj].locked), 1 == t.upgrade && "Upgrade" == e[obj].type && addMarker(parseFloat(e[obj].latitude), parseFloat(e[obj].longitude), e[obj].type, e[obj].pincode, e[obj].locked), 1 == t.locked && e[obj].locked && addMarker(parseFloat(e[obj].latitude), parseFloat(e[obj].longitude), e[obj].type, e[obj].pincode, e[obj].locked)) : addMarker(parseFloat(e[obj].latitude), parseFloat(e[obj].longitude), e[obj].type, e[obj].pincode, e[obj].locked)
}, networkApiResp = "", xhrRunninng = !1, pinCode, rulerpoly, ruler1label;
Label.prototype = new google.maps.OverlayView, Label.prototype.onAdd = function(){
  var e = this.getPanes().overlayLayer;
  e.appendChild(this.div_);
  var t = this;
  this.listeners_ = [google.maps.event.addListener(this, "position_changed", function(){
    t.draw()
  }), google.maps.event.addListener(this, "text_changed", function(){
    t.draw()
  })]
}, Label.prototype.onRemove = function(){
  this.div_.parentNode.removeChild(this.div_);
  for(var e = 0, t = this.listeners_.length; t > e; ++e)google.maps.event.removeListener(this.listeners_[e])
}, Label.prototype.draw = function(){
  var e = this.getProjection(), t = e.fromLatLngToDivPixel(this.get("position")), a = this.div_;
  a.style.left = t.x + "px", a.style.top = t.y + "px", a.style.display = "block", this.span_.innerHTML = this.get("text").toString()
};
var overlay, dataOverlay;
USGSOverlay.prototype = new google.maps.OverlayView, USGSOverlay.prototype.onAdd = function(){
  var e = document.createElement("div");
  e.style.position = "absolute";
  var t = document.createElement("img");
  t.src = this.image_, t.style.width = "100%", t.style.height = "100%", void 0 != this.width_ ? (t.id = "overlayId", t.style.top = 0, t.style.left = 0, t.style.opacity = .7) : (t.id = "borderOverlayId", t.style.zIndex = "9999"), t.style.position = "absolute", e.appendChild(t), this.div_ = e;
  var a = this.getPanes();
  a.overlayLayer.appendChild(e)
}, USGSOverlay.prototype.draw = function(){
  var e = this.getProjection(), t = e.fromLatLngToDivPixel(this.bounds_.getSouthWest()), a = e.fromLatLngToDivPixel(this.bounds_.getNorthEast()), o = this.div_;
  o.style.left = t.x + "px", o.style.top = a.y + "px", void 0 != this.width_ ? (o.style.width = this.width_ + "px", o.style.height = this.height_ + "px") : (o.style.width = a.x - t.x + "px", o.style.height = t.y - a.y + "px")
}, USGSOverlay.prototype.onRemove = function(){
  this.div_.parentNode.removeChild(this.div_), this.div_ = null
}, function(){
  initMap(), mobileOverlayVisitor(), $("#autocomplete").keyup(function(e){
    13 == e.keyCode && searchOnHit()
  }), $('[data-toggle="tooltip"]').tooltip(), $("#mapCircleNews").load(function(e){
    var t = $("#mapCircleNews");
    if(t.contents().find("body").html() && t.contents().find("body").html().indexOf("Error 404") >= 0){
      var a = configBaseUrls.cmsUrl + "forme/new-online/leap/global-news/india/news?v=" + Math.random();
      document.getElementById("mapCircleNews").src = a
    }
  })
}();
var circleFromMap = "", adCity = "", trackCityName, trackStateName;
$("#btnSubmit").click(function(e){
  e.preventDefault(), e.stopPropagation(), 1 == validate() && getCircle($("#txtMob").val())
});
var circleIdMaster = {
  104: ["Andhra Pradesh", "701"],
  122: ["Assam", "702"],
  119: ["Bihar and Jharkhand", "703"],
  103: ["Chennai", "704"],
  102: ["Delhi NCR", "705"],
  111: ["Gujarat", "706"],
  108: ["Haryana", "707"],
  101: ["Himachal Pradesh", "708"],
  117: ["Jammu and Kashmir", "709"],
  105: ["Karnataka", "710"],
  113: ["Kerala", "711"],
  115: ["Kolkata", "712"],
  106: ["MP and Chattisgarh", "713"],
  109: ["Maharashtra and Goa", "714"],
  124: ["Mumbai", "715"],
  125: ["Mumbai", "715"],
  123: ["North East", "716"],
  120: ["Orissa", "717"],
  107: ["Punjab", "718"],
  121: ["Rajasthan", "719"],
  114: ["Tamil Nadu", "720"],
  116: ["UP East", "721"],
  110: ["UP(West) and Uttarakhand", "722"],
  118: ["West Bengal", "723"]
}, stateCircleMapping = {
  "Andhra Pradesh"             : ["Andhra Pradesh", "701"],
  "Arunachal Pradesh"          : ["North East", "716"],
  Assam                        : ["Assam", "702"],
  Bihar                        : ["Bihar and Jharkhand", "703"],
  Chhattisgarh                 : ["MP and Chattisgarh", "713"],
  Goa                          : ["Maharashtra and Goa", "714"],
  Gujarat                      : ["Gujarat", "706"],
  Haryana                      : ["Haryana", "707"],
  "Himachal Pradesh"           : ["Himachal Pradesh", "708"],
  "Jammu & Kashmir"            : ["Jammu and Kashmir", "709"],
  Jharkhand                    : ["Bihar and Jharkhand", "703"],
  Karnataka                    : ["Karnataka", "710"],
  Kerala                       : ["Kerala", "711"],
  "Madhya Pradesh"             : ["MP and Chattisgarh", "713"],
  Maharashtra                  : ["Maharashtra and Goa", "714"],
  Manipur                      : ["North East", "716"],
  Meghalaya                    : ["North East", "716"],
  Mizoram                      : ["North East", "716"],
  Nagaland                     : ["North East", "716"],
  Odisha                       : ["Orissa", "717"],
  Punjab                       : ["Punjab", "718"],
  Rajasthan                    : ["Rajasthan", "719"],
  Sikkim                       : ["North East", "721"],
  "Tamil Nadu"                 : ["Tamil Nadu", "720"],
  Telangana                    : ["Andhra Pradesh", "701"],
  Tripura                      : ["North East", "716"],
  Uttarakhand                  : ["UP(West) and Uttarakhand", "722"],
  "Uttar Pradesh"              : ["UP East", "721"],
  "West Bengal"                : ["West Bengal", "723"],
  "Andaman and Nicobar Islands": ["West Bengal", "723"],
  Chandigarh                   : ["Punjab", "718"],
  Delhi                        : ["Delhi NCR", "705"],
  "Dadra and Nagar Haveli"     : ["West Bengal", "723"],
  "Daman and Diu"              : ["Gujarat", "706"],
  Lakshadweep                  : ["Kerala", "711"],
  Puducherry                   : ["Tamil Nadu", "720"],
  Kolkata                      : ["Kolkata", "712"],
  Mumbai                       : ["Mumbai", "715"],
  Chennai                      : ["Chennai", "704"],
  Gurgaon                      : ["Delhi NCR", "705"],
  Noida                        : ["Delhi NCR", "705"],
  Ghaziabad                    : ["Delhi NCR", "705"],
  Faridabad                    : ["Delhi NCR", "705"],
  "Gautam Buddh Nagar"         : ["Delhi NCR", "705"]
};
$(function(){
  $("input:radio").change(function(){
    var e = $("input[name='rdb']:checked").val();
    "tenant" == e || "other" == e || "society" == e ? ("tenant" == e ? $("#oname-text").html("Owner's ") : "society" == e ? $("#oname-text").html("RWA representative's ") : $("#oname-text").html("Authorised person's "), $("#dvOwnMob").show()) : $("#dvOwnMob").hide()
  }), $("#txtMob").blur(function(){
    var e = this.value;
    "" == e || null == e ? ($(this).css("border", "1px solid red"), $("#mobBlock").addClass("warning"), $("#mobBlock .message").removeClass("hide")) : ($(this).css("border", "1px solid #e5e5e5"), $("#mobBlock").removeClass("warning"), $("#mobBlock .message").addClass("hide"))
  }).trigger("change")
}), $(document).on("click", ".openLeadModel", function(){
  var e = $(this).data("id").split(",");
  leadLat = e[0], leadLang = e[1];
  var t = t = new google.maps.Geocoder;
  t.geocode({latLng: new google.maps.LatLng(leadLat, leadLang)}, function(e, t){
    if(t == google.maps.GeocoderStatus.OK && e[0]){
      leadAddress = e[0].formatted_address;
      for(var a = 0; a < e[0].address_components.length; a++){
        if("administrative_area_level_2" == e[0].address_components[a].types[0] && (adCity = e[0].address_components[a].long_name, trackCityName = adCity, "Kolkata" == adCity || "Mumbai" == adCity || "Chennai" == adCity || "Gurgaon" == adCity || "Noida" == adCity || "Gautam Buddh Nagar" == adCity || "Ghaziabad" == adCity || "Faridabad" == adCity)){
          circleFromMap = stateCircleMapping[adCity][0];
          break
        }
        if("administrative_area_level_1" == e[0].address_components[a].types[0]){
          trackStateName = e[0].address_components[a].long_name, circleFromMap = stateCircleMapping[e[0].address_components[a].long_name][0];
          break
        }
      }
    }
  })
});
var pinsMumbai = ["400707", "410206", "400702", "400704", "421204", "400614", "400706", "400705", "400703", "400709", "400701", "400708", "400603", "400602", "400604", "400610", "401107", "401101", "401106", "401105", "401201", "421203", "421306", "421103", "421305", "421102", "421605", "421202", "400605", "400608", "400615", "421201", "400606", "400601", "400607", "400612", "401209", "400001", "400021", "400032", "400020", "400002", "400003", "400009", "400088", "400089", "400043", "400077", "400086", "400072", "400070", "400005", "400004", "400008", "400010", "400007", "400006", "400011", "400027", "400033", "400015", "400035", "400026", "400034", "400066", "400101", "400013", "400018", "400012", "400031", "400074", "400028", "400014", "400030", "400025", "400019", "400016", "400037", "400022", "400017", "400051", "400050", "400071", "400024", "400085", "400094", "400079", "400098", "400029", "400099", "400052", "400055", "400054", "400049", "400057", "400056", "400053", "400061", "400095", "400059", "400069", "400058", "400076", "400083", "400042", "400078", "400081", "400096", "400093", "400060", "400065", "400104", "400064", "400067", "400102", "400063", "400097", "400087", "400092", "400103", "400091", "400080", "400082", "400068", "400075", "400084", "410210", "410208", "400710"], pinsPanchkula = ["134107", "134117", "134108", "134114", "134112", "134102", "134113", "134109"], pinsDelhiNCR = ["201102", "201307", "203207", "201304", "201310", "201010", "201014", "201001", "201012", "201009", "201002", "201003", "201013", "201008", "201005", "201004", "201006", "201007", "201011", "201305", "201306", "201303", "201309", "201301", "201302", "110092", "110001", "110069", "110084", "110035", "110054", "110088", "110033", "110009", "110094", "110095", "110093", "110089", "110081", "110085", "110049", "110013", "110014", "110062", "110017", "110071", "110073", "110041", "110028", "110023", "110058", "110008", "110018", "110059", "110086", "110026", "110041", "110087", "110063", "110053", "110046", "110045", "110078", "110075", "110077", "110061", "110072", "110038", "110037", "110057", "110067", "110070", "110029", "110016", "110021", "110010", "110012", "110060", "110030", "110068", "110076", "110020", "110025", "110065", "110048", "110024", "110004", "110010", "110091", "110096", "110031", "110051", "110002", "110006", "110055", "110005", "110011", "110052", "110005", "110007", "110015", "110035", "110056", "110027", "110083", "110034", "110082", "110036", "110040", "110039", "110032", "110044", "110019", "110064", "110042", "110086", "110043", "110074", "110047", "110022", "110066", "110013", "110003", "121006", "121008", "121101", "121012", "121001", "121004", "121005", "121007", "121002", "121010", "121009", "121003", "121013", "122102", "122004", "122103", "122413", "122505", "122051", "122052", "122006", "122017", "122016", "122015", "122010", "122009", "122008", "122001", "122005", "122018", "122101", "122011", "122003", "122002", "122007", "122101", "122102", "122413", "121004"], pinsKolkata = ["711405", "700144", "711317", "711308", "700149", "711310", "711305", "711307", "712202", "700146", "700147", "700148", "700138", "743377", "743318", "743384", "743398", "743513", "712409", "712411", "712306", "712147", "712407", "700124", "712201", "700118", "712204", "712203", "700120", "712136", "712222", "712503", "712139", "743126", "712101", "712105", "741250", "743128", "743129", "743134", "743193", "743165", "743166", "743194", "712102", "741251", "712138", "741235", "712103", "712104", "743135", "700123", "743125", "743234", "743248", "743195", "700137", "700145", "711302", "711315", "711322", "712124", "712223", "712502", "741245", "711411", "712123", "712137", "712125", "743145", "743144", "700135", "700139", "700119", "700121", "700126", "700104", "743503", "743122", "700122", "711316", "711306", "700049", "700026", "700078", "700130", "700065", "700089", "700068", "712234", "700050", "700115", "700032", "700127", "711107", "700058", "700095", "700096", "700064", "700091", "700011", "700087", "711409", "700027", "700093", "712248", "700055", "711403", "711309", "711111", "700048", "711313", "712247", "700039", "700100", "700154", "700079", "700057", "700109", "700114", "700129", "712250", "700110", "700073", "700092", "700047", "700083", "700157", "700077", "700031", "700081", "700082", "700056", "700153", "700098", "700010", "700112", "700113", "700117", "700131", "700132", "711101", "711105", "711112", "711201", "711227", "712311", "712708", "712304", "712249", "712258", "712232", "712246", "712235", "700134", "700040", "700044", "700007", "700041", "700009", "700015", "700046", "700085", "700054", "700042", "711102", "711104", "700067", "700002", "700037", "700005", "700003", "700004", "700006", "700008", "700012", "700017", "700018", "700063", "700061", "700034", "700060", "700062", "700001", "700072", "700013", "700069", "700016", "700021", "700022", "700023", "700025", "700019", "700020", "700101", "700102", "700028", "700080", "700030", "700074", "700036", "700088", "700038", "700053", "700033", "700086", "700075", "700029", "700045", "700024", "700043", "712245", "700071", "700107", "700099", "700066", "700152", "700014", "700090", "700106", "700070", "700094", "700097", "700076", "700035", "700108", "700084", "700103", "700105", "700150", "700111", "700133", "700116", "700052", "700051", "700136", "700158", "700142", "700141", "700143", "700140", "700156", "711109", "711103", "711108", "711106", "711110", "711114", "711205", "711202", "711204", "711203", "711113", "712233", "712310", "700059", "743127", "700159"];
!function(){
  "use strict";
  var e = $(".mobile-overlay a"), t = $(".mobile-overlay");
  $(window).resize(function(){
    $(window).width() < 768 ? ($(".details-content").hide(), $(".details-toggle span").text("View details")) : $(".details-content").show()
  }), e.click(function(e){
    e.preventDefault(), t.addClass("got-it")
  }), $(".details-toggle").on("touchend click", function(e){
    e.stopPropagation(), e.preventDefault(), $(".details-toggle span").text(function(e, t){
      return "View details" === t ? "Hide details" : "View details"
    }), $(".details-content").slideToggle(), $(".details-toggle i").toggleClass("active")
  })
}(), dataLayer = [{
  tatvicVar1: "",
  tatvicVar2: "",
  tatvicVar3: "",
  tatvicVar4: "",
  tatvicVar5: ""
}], function(e, t, a, o, i){
  e[o] = e[o] || [], e[o].push({"gtm.start": (new Date).getTime(), event: "gtm.js"});
  var n = t.getElementsByTagName(a)[0], r = t.createElement(a), s = "dataLayer" != o ? "&l=" + o : "";
  r.async = !0, r.src = "//www.googletagmanager.com/gtm.js?id=" + i + s, n.parentNode.insertBefore(r, n)
}(window, document, "script", "dataLayer", "GTM-L6QJ");
var page = getParameterByName("page");
switch(page){
  case"forMe":
    pageName = "forme|leap|what is for me", channel = "forme|leap", subSection1 = "forme|leap|what is for me", subSection2 = "forme|leap|what is for me";
    break;
  case"reportIssues":
    pageName = "forme|leap|report issue", channel = "forme|leap", subSection1 = "forme|leap|report issue", subSection2 = "forme|leap|report issue";
    break;
  case"mySafety":
    pageName = "forme|leap|safety", channel = "forme|leap", subSection1 = "forme|leap|safety", subSection2 = "forme|leap|safety";
    break;
  default:
    pageName = "forme|leap|my network", channel = "forme|leap", subSection1 = "forme|leap|my network", subSection2 = "forme|leap|my network"
}
!function(e, t){
  t.onPageLoad("network-quality-home"), e && window.pageName ? e.pageBottom() : window.pageName = ""
}(_satellite, AdobeTagging);
var _0xb916 = ["response", "responseCode", "responseLogged", "responseData", "length", "charAt", "substring", "parse"], adwordmanager = {
  extractresponse: function(e){
    var t = e[_0xb916[0]], a = t[_0xb916[1]], o = t[_0xb916[2]], i = t[_0xb916[3]];
    if(o)for(var n = 0; a > n; n++)i = i[_0xb916[5]](i[_0xb916[4]] - 1) + i[_0xb916[6]](0, i[_0xb916[4]] - 1); else for(var r = 0; a > r; r++)i = i[_0xb916[6]](1, i[_0xb916[4]]) + i[_0xb916[5]](0);
    var s = atob(i), l = JSON[_0xb916[7]](s);
    return l
  }
};