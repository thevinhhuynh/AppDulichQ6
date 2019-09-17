var MAP_ZOOM_LEVEL_ON_FOCUS = 15;


function HTMap(refId, center, zoom) {
    this.initMap(refId, center, zoom);
}

/*L.TileLayer.include({

    _prepareBgBuffer: function() {

        var front = this._tileContainer,
            bg = this._bgBuffer;

        // if foreground layer doesn't have many tiles but bg layer does,
        // keep the existing bg layer and just zoom it some more

        var bgLoaded = this._getLoadedTilesPercentage(bg),
            frontLoaded = this._getLoadedTilesPercentage(front);

        var addtional = (bgLoaded > 0.5 && frontLoaded < 0.5) || this.options._htjs_hidden_on_zoom;

        if (bg && addtional) {
            this._bgBuffer.style.visibility = 'visible';
            this._stopLoadingImages(front);
            front.style.visibility = 'hidden';
            return;
        }
        // prepare the buffer to become the front tile pane
        bg.style.visibility = 'hidden';
        bg.style[L.DomUtil.TRANSFORM] = '';

        this._stopLoadingImages(bg);
        // switch out the current layer to be the new bg layer (and vice-versa)
        this._tileContainer = bg;
        bg = this._bgBuffer = front;

        //prevent bg buffer from clearing right after zoom
        clearTimeout(this._clearBgBufferTimer);
    },
});*/

HTMap.prototype.initMap = function(refId, center, zoom) {
    L.mapbox.accessToken = 'pk.eyJ1IjoibGV2b2h1dXRyaSIsImEiOiJjaW90dG9tNmUwMGQxdTltNHEzc3NlZjNnIn0.slJXkuPwAyViUJNkJl_tDg';
    this.objMap = L.map(refId, {
        center: center,
        zoom: zoom,
        maxZoom: 20,
        zoomAnimation: true,
        //visualClickEvents: 'click contextmenu',
    });

    //this.objMap.visualClick.enable();

    this.currentClick = null;
    this.focusCircles = L.layerGroup().addTo(this.objMap);

    var _this = this;
    this.objMap.on('click', function(e) {
        _this.currentClick = e.latlng;
    })

    this.layers = [];
    this.markers = [];
    this.dupmarkers = [];
    this.overwms = L.featureGroup().addTo(this.objMap);
}


HTMap.prototype.addMarker = function(id, marker) {
    this.markers[id] = marker;
}


HTMap.prototype.addScaleControl = function() {
    L.control.scale({ position: 'bottomright', metric: true, imperial: false }).addTo(this.objMap);
    var graphicScale = L.control.graphicScale({ fill: 'fill', labelPlacement: 'top', position: 'bottomright' }).addTo(this.objMap);
}

HTMap.prototype.checkZoomLevel = function() {
    console.log(this.objMap.getZoom());
    if (this.objMap.getZoom() <= 11) {
        if (!this.objMap.hasLayer(this.layers['hanh_chinh'])) {
            console.log('add hanh_chinh');
            this.objMap.addLayer(this.layers['hanh_chinh']);
        }
    } else {
        console.log('remove hanh_chinh');
        if (this.objMap.hasLayer(this.layers['hanh_chinh'])) {
            this.removeLayer('hanh_chinh');
            console.log('remove hanh_chinh');
        }
    }
}


HTMap.prototype.hasLayer = function(layerid) {
    return this.objMap.hasLayer(layerid);
}


HTMap.prototype.refreshAllLayers = function() {
    this.objMap.eachLayer(function(layer) {
        if (layer instanceof L.TileLayer) {
            layer.setParams({ 'A': Math.random() });
        }
    })
}


HTMap.prototype.refreshOnCurrentClick = function() {
    var click = this.currentClick !== null ? this.currentClick : this.getMapCenter();
    this.refreshAllLayers();
    this.objMap.fireEvent('click', {
        latlng: click
    })
}


HTMap.prototype.addWMSLayer = function(layerid, server, options, insertAtBottom = false, isbetter = true, isActive = true) {
    var wmslayers = null;
    if (isbetter)
        wmslayers = L.tileLayer.betterWms(server, options);
    else
        wmslayers = L.tileLayer.wms(server, options);

    if (isActive)
        this.objMap.addLayer(wmslayers, insertAtBottom);

    this.layers[layerid] = wmslayers;
}

HTMap.prototype.setBoundary = function(url) {
    var _this = this;
    $.ajax({
        url: url,
        success: function(json) {
/*            _this.state = json.features[0];
            //_this.objMap.setMaxBounds(L.geoJson(_this.state).getBounds());
            _this.state.geometry.coordinates = [
                [
                    [-180, -90],
                    [-180, 90],
                    [180, 90],
                    [180, -90],
                    [-180, -90]
                ],
                _this.state.geometry.coordinates[0][0]
            ]
            _this.state.geometry.type = 'Polygon';
            _this.statesLayer = L.geoJson(_this.state, {
                fillOpacity: 0.5,
                fillColor: '#fff',
                weight: 0
            }).addTo(_this.objMap);*/
            _this.statesLayer = L.geoJson(json, {invert: true, fillColor: '#fff', fillOpacity: 1, weight: 0});
            _this.statesLayer.addTo(_this.objMap);

        }
    })
}

HTMap.prototype.refresh = function() {
    this.clearAllFocusCircles();
}


HTMap.prototype.getMapCenter = function() {
    return this.objMap.getCenter();
}


HTMap.prototype.panTo = function(point, color) {
    if (typeof(point) == 'string')
        point = HTPoint.getLPointFromString(point);

    var zoom = this.objMap.getZoom();
    this.objMap.setView(point, zoom, { pan: { duration: 2 } });

    //this.clearAllFocusCircles();
    //this.addToFocusCircles(point, color);

    this.objMap.fireEvent('click', {
        latlng: point
    });
}

HTMap.prototype.panAndZoomTo = function(point, color, zoom) {
    if (typeof(point) == 'string')
        point = HTPoint.getLPointFromString(point);

    if (typeof(zoom) == 'undefined')
        zoom = MAP_ZOOM_LEVEL_ON_FOCUS;
    this.objMap.setView(point, zoom, { pan: { duration: 2 } });

    this.clearAllFocusCircles();
    this.addToFocusCircles(point, color);

    this.objMap.fireEvent('click', {
        latlng: point
    });
}

HTMap.prototype.setProxyUrl = function(url) {
    this.objMap._proxyUrl = url;
}


HTMap.prototype.addOSMLayer = function(isActive = false) {
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, { maxZoom: 24 });

    if (isActive) {
        this.objMap.addLayer(osm);
    }
    this.layers['osm'] = osm;
}

HTMap.prototype.addGoogleLayer = function(isActive = true, type = 'TERRAIN', notremove = false) {
    var layer = 'p';
    if (type == 'SATELLITE') {
        layer = 's,h';
    } else if (type == 'ROADMAP') {
        layer = 'r';
    }

    var googlelayer = L.tileLayer('http://{s}.google.com/vt/lyrs=' + layer + '&x={x}&y={y}&z={z}', {
        maxZoom: 24,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        _htjs_not_remove: notremove
    });
    if (isActive) {
        this.objMap.addLayer(googlelayer, true);
    }
    this.layers['google_' + type] = googlelayer;
}


HTMap.prototype.addHCMGISLayer = function(isActive = true, type = 'SATELLITE') {
    var layer = L.tileLayer('http://hcmgisportal.vn/basemap/cache_lidar/{z}/{x}/{y}.jpg', { maxZoom: 24 });
    if (isActive) {
        this.objMap.addLayer(layer);
    }
    this.layers['hcmgis_' + type] = layer;
}


HTMap.prototype.addLegendControl = function() {
    this.objMap.addControl(L.mapbox.legendControl());
}


HTMap.prototype.addDrawControl = function(options) {
    if (typeof(this.drawFeatureGroup) === 'undefined') {
        this.drawFeatureGroup = L.featureGroup();
        this.drawFeatureGroup.addTo(this.objMap);

        options.edit = { featureGroup: this.drawFeatureGroup };
        var drawControl = new L.Control.Draw(options);
        drawControl.addTo(this.objMap);

        var _this = this;
        this.objMap.on('draw:created', function(e) {
            _this.drawFeatureGroup.clearLayers();
            _this.drawFeatureGroup.addLayer(e.layer);
        });
    }
}


HTMap.prototype.addLocateControl = function() {
    L.control.locate({
        drawCircle: false
    }).addTo(this.objMap);
}

HTMap.prototype.addMeasureControl = function() {
    //L.Control.measureControl().addTo(this.objMap);
    L.control.measure({ decPoint: ',', thousandsSep: '.', position: 'topleft', primaryLengthUnit: 'meters', primaryAreaUnit: 'sqmeters', captureZIndex: 10000 }).addTo(this.objMap);
}


HTMap.prototype.setZoom = function(zoom) {
    this.objMap.setZoom(zoom);
}

HTMap.prototype.showPopup = function(point, html) {
    if (typeof(point) == 'string')
        point = HTPoint.getLPointFromString(point);

    L.popup().setLatLng(point).setContent(html).openOn(this.objMap);
}

HTMap.prototype.clearAllFocusCircles = function() {
    this.focusCircles.clearLayers();
}

HTMap.prototype.addToFocusCircles = function(point, color) {
    if (typeof(color) == 'undefined') {
        color = '#0099FF';
    }

    var pulsingIcon = L.icon.pulse({ iconSize: [15, 15], color: color });
    var marker = L.marker(point, { icon: pulsingIcon });

    this.focusCircles.addLayer(marker);
}

HTMap.prototype.addMarkerToGeometryInput = function(point, srid, inputid, btncenterid = null) {
    if (typeof(point) == 'string')
        point = HTPoint.getLPointFromString(point);

    var _input = $(inputid);
    var marker = L.marker(point, {
        icon: L.mapbox.marker.icon({
            'marker-color': 'ff8888'
        }),
        draggable: true
    });

    marker.addTo(this.objMap);
    _input.val('SRID=' + srid + ';POINT(' + point.lng + ' ' + point.lat + ')');
    marker.on('dragend', function(e) {
        var latlng = e.target.getLatLng();
        _input.val('SRID=' + srid + ';POINT(' + latlng.lng + ' ' + latlng.lat + ')');
    })

    if (btncenterid != null) {
        var _this = this;
        var btncenter = $(btncenterid);
        btncenter.on('click', function() {
            var latlng = _this.objMap.getCenter();
            _input.val('SRID=' + srid + ';POINT(' + latlng.lng + ' ' + latlng.lat + ')');
            marker.setLatLng(latlng);
        })
    }
}


HTMap.prototype.addGeoJsonLayer = function(layerid, proxyurl, owsurl, typename, iconClusterFunction, iconPointFunction, isActive, filter, maxClusterRadius, disableClusteringAtZoom, callbackOnLoaded) {
    if (typeof(filter) == 'undefined') {
        filter = '1=1';
    }
    var maxFeatures = 10000;
    if (layerid == 'diem_khachsan') {
        maxFeatures = 1300;
    }
    var _disableClusteringAtZoom = disableClusteringAtZoom;
    if (typeof(_disableClusteringAtZoom) == 'undefined') {
        _disableClusteringAtZoom = 24;
    }
    var defaultParameters = {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: typename,
        maxFeatures: maxFeatures,
        outputFormat: 'application/json',
        CQL_FILTER: filter
    };

    if (typeof(maxClusterRadius) == 'undefined') {
        maxClusterRadius = 200;
    }

    var parameters = L.Util.extend(defaultParameters);
    var rootUrl = owsurl;
    var finalurl = proxyurl + encodeURIComponent(rootUrl + L.Util.getParamString(parameters));
    var _this = this;

    $.ajax({
        url: finalurl,
        success: function(data) {
            var layerJson = L.geoJson(data, { pointToLayer: iconPointFunction });
            layerJson.setZIndex(2);

            var cluster = L.markerClusterGroup({ iconCreateFunction: iconClusterFunction, chunkedLoading: true, maxClusterRadius: maxClusterRadius, animateAddingMarkers: true, animate: true, disableClusteringAtZoom: _disableClusteringAtZoom, spiderfyOnMaxZoom: true });

            if (isActive)
                cluster.addTo(_this.objMap);

            _this.layers[layerid + '_json'] = layerJson;

            cluster.addLayer(_this.layers[layerid + '_json']);
            _this.layers[layerid] = cluster;

            if (typeof(callbackOnLoaded) !== 'undefined')
                callbackOnLoaded(_this.layers[layerid]);
        }
    })
}

HTMap.prototype.removeLayer = function(layerid) {
    if (typeof(this.layers[layerid]) !== 'undefined') {

        this.objMap.removeLayer(this.layers[layerid]);

    }
}

HTMap.prototype.removeAllLayer = function() {
    for (var key in this.layers) {
        if (!this.layers[key].options._htjs_not_remove) {
            this.removeLayer(key);
        }
    }
}

HTMap.prototype.addLayer = function(layerid) {
    if (typeof(this.layers[layerid]) !== 'undefined') {
        this.objMap.addLayer(this.layers[layerid]);
        if (typeof(this.layers[layerid + '_json']) !== 'undefined') {
            this.layers[layerid].clearLayers();
            this.layers[layerid].addLayer(this.layers[layerid + '_json']);
        }
    }
}

HTMap.prototype.initOrderingOfLayers = function() {
    $('#_GMapContainer').css('z-index', 1);
    $('.leaflet-map-pane').css('z-index', 2);
}

HTMap.prototype.invalidateSize = function() {
    this.objMap.invalidateSize();
}


function callbackShowGetFeatureInfo(err, latlng, content) {
    // append response html to call back div to show
    var _div_callback = $('#div_calback_showgetfeatureinfo');
    _div_callback.empty().append(content);
    // get type and id to request data, and show data to map popup
    var _type = _div_callback.find('caption.featureInfo').text();

    var _td_id = _div_callback.find('table > tbody > tr:eq(1) > td:eq(0)');
    // break if not exist element
    if (typeof(_td_id) == 'undefined' || _type == '') {
        //_popup.append(ERROR_BOX);
        return;
    }
    // continue if exist element
    var _id = _td_id.text().split('.')[1];
    var _url = _div_callback.attr('data-url');
    var _data = {
        doituong: _type,
        slug: _id
    }
    var other_url = _div_callback.attr('data-url' + _type);
    if (typeof(other_url) !== 'undefined') {
        _url = other_url;
    }
    //MAP.showPopup(latlng, '<div class="panel" id="div_map_popup"></div>');
    //var _popup = $('#div_map_popup');
    //_popup.append(LOADING_BOX);
    $.ajax({
        url: _url,
        data: _data,
        complete: function() {
            //_popup.children('.overlay').remove();
        },
        success: function(response) {
            //_popup.append(response);
            addViewInfo(response, latlng);
        },
        error: function(response) {
            //_popup.append(ERROR_BOX);
        }
    })
}

function addViewInfo(html, latlng) {
    $('#view-featureinfo').empty().append(html).collapse('show');
    var divMap = $('.map-canvas .items-list');
    divMap.addClass('full-width');
    $('#map').addClass('full-width-map');
    $('.toggle-navigation').addClass('full-width-toggle');
    $('input#geocomplete').addClass('full-width-toggle-geocomplete');

    setTimeout(function() {
        MAP.invalidateSize()
    }, 500);
}


function HTPoint() {}

HTPoint.getLPointFromString = function(strPoint) {
    var splitedList = strPoint.split('(');
    splitedList = splitedList[1].split(')');
    splitedList = splitedList[0].split(' ');

    return L.latLng(splitedList[1], splitedList[0]);
}
