// ==UserScript==
// @name         WME Open In Mapillary
// @namespace    https://greasyfork.org/users/45389
// @version      0.1
// @description  Click link in WME footer to open Mapillary at the same location.
// @author       MapOMatic
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/.*$/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var alertUpdate = true;
    var debugLevel = 0;

    function log(message, level) {
        if (message && level <= debugLevel) {
            console.log('WMEOIM: ' + message);
        }
    }
    function onButtonClick() {
        var center = W.map.getCenter();
        var OLCenter = new OL.LonLat(center.lon, center.lat);
        var zoom = W.map.getZoom();
        OLCenter.transform('EPSG:900913','EPSG:4326');
        var url = 'https://www.mapillary.com/app/?lat=' + OLCenter.lat + '&lng=' + OLCenter.lon + '&z=' + (11.10651067+zoom*1.012533361);
        console.log(url);
        window.open(url, '_blank');
    }

    function init() {
        $('.WazeControlPermalink').prepend(
            $('<div>').css({float:'left',dispaly:'inline-block', padding:'0px 5px 0px 3px'}).append(
                $('<a>',{id:'mapillary-button',title:'Open a Mapillary map in a new window'}).attr('href','javascript:void(0)').css({float:'left',textDecoration:'none', color:'green', fontWeight:'bold'}).click(onButtonClick)
                .append(
                    $('<img border="0" alt="Mapillary" src="https://github.com/WazeUSA/WME-Open-In-Mapillary/raw/master/mapillary.gif" height="18" width="18">')
                )
            )
        );

        log('Initialized.', 0);
    }

    function bootstrap() {
        if (W && W.loginManager && W.loginManager.isLoggedIn() && W.map) {
            log('Initializing...', 0);
            init();
        } else {
            log('Bootstrap failed. Trying again...', 0);
            window.setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }

    log('Bootstrap...', 0);
    bootstrap();
})();