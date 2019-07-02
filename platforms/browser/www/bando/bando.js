var MAP, APPSTATE = {};
APPSTATE.MAP_MARKERS_DIADIEM = [];

class MapIndex {
    static Init() {
        this.InitMap();
    }

    static InitMap() {
        MAP = new HTMap('map-dienthoai', [10.7416495,106.6335287], 13);
        MAP.addHCMGISLayer(false);
        initHCMGISROADMAP();
        MAP.addGoogleLayer(true, 'ROADMAP');
        MAP.addGoogleLayer(false, 'SATELLITE');

        MAP.initOrderingOfLayers();

        initDiaDiemFromServer();

        initCloseMapOver();
        initLayerControl();
    }
}

function initCloseMapOver() {
    $('#map-over-close').on('click', function() {
        $('#map-over-container').empty();
        $('#map-over').removeClass('show');
    })
}

function showMapOver(html) {
    $('#map-over-container').empty().append(html);
    $('#map-over').removeClass('show').addClass('show');
}


function initLayerControl() {
    var baselayer = {
        'HCMGIS giao thông': MAP.layers.hcmgis_ROADMAP,
        'Google giao thông': MAP.layers.google_ROADMAP,
        'Google vệ tinh': MAP.layers.google_SATELLITE,
        'Không nền': MAP.layers.none
    };
    L.control.layers(baselayer).addTo(MAP.objMap)
}

function initHCMGISROADMAP() {
    MAP.addWMSLayer('hcmgis_ROADMAP', 'https://maps.hcmgis.vn/geoserver/wms', {
       layers: 'hcm_map:hcm_map',
       format: 'image/png',
       transparent: true,
       _htjs_hidden_on_zoom: false,
       async: true,
       maxZoom: 24
   }, true, false, false);
    MAP.addWMSLayer('none', '', {
       layers: '',
       format: 'image/png',
       transparent: true,
       _htjs_hidden_on_zoom: false,
       async: true,
       maxZoom: 24
   }, true, false, false);

}

function initDiaDiemFromServer() {
    var _diadiem_geojson_url = APP.Server.local + '/geojson/';
    $.ajax({
        url: _diadiem_geojson_url,
        success: function(json) {
            APPSTATE.MAP_LAYER_DIADIEM = L.geoJson(json, {
                pointToLayer: function(feature, latlng) {
                    var icon = new L.Icon({
                        iconSize: [50, 50],
                        popupAnchor: [0, -25],
                        className: 'marker-icon-diadiem',
                        iconUrl: APP.Server.local + feature.properties.image_url
                    });

                    var marker = L.marker(latlng, {
                        icon: icon,
                        zIndexOffset: 1000
                    });
                    marker.bindPopup(
                        "<div class='popup-diadiem-ten'>" + feature.properties.title + "</div>" +
                        "<div class='popup-diadiem-diachi'>" + feature.properties.diachi + "</div>",
                        {
                            autoPan: false
                        }
                    );
                    
                    marker.on('mouseover', function(e) {
                        //this.openPopup();
                    })
                    marker.on('mouseout', function(e) {
                        if (APPSTATE.current_selected_marker != this) {
                           // this.closePopup();
                        }
                    })
                    APPSTATE.MAP_MARKERS_DIADIEM['marker-' + feature.id] = marker;
                    return marker;
                }
            });
            APPSTATE.MAP_LAYER_DIADIEM.addTo(MAP.objMap);
        }
    })
}