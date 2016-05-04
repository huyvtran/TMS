/// <reference path="~/Scripts/jquery-1.9.1.intellisense.js" />
/// <reference path="~/Scripts/common.js" />
/// <reference path="~/Scripts/ol3/ol.js" />
angular.module('starter').factory('openMap', function () {
    var apiUrl = { viaroute: '//router.project-osrm.org/viaroute?loc=', instructions: '&instructions=true' }
    var mapEPSG = { E4326: 'EPSG:4326', E3857: 'EPSG:3857' }       
    var mapFeature = { marker: 1, route: 2, polyline: 3, polygon: 4 }
    
    var openMap = function () {
        this.map = null;
        this.hasMap = true;
        this.windowInfo = null;
        this.mcallback = null;

        this.mapRoute = [];
        this.mapMarker = [];
        this.mapPolygon = [];
        this.mapPolyline = [];

        this.mapTile = {
            mapQuest: new ol.layer.Tile({
                source: new ol.source.MapQuest({ layer: 'osm' })
            }),
            //google: new olgm.layer.Google() //Google maps token required
        }
        this.mapColor = {
            aqua: '#00FFFF', black: '#000000', blue: '#0000FF', brown: '#A52A2A', coral: '#FF7F50',
            green: '#4CC417', olive: '#808000', orangeRed: '#FF4500', purple: '#800080', red: '#F70D1A',
            seaGreen: '#2E8B57', tan: '#D2B48C', teal: '#008080', yellow: '#FFFF00', yellowGreen: '#9ACD32',
            random: function () {
                var me = this;

                var count = 0;
                var color = me.aqua;
                try {
                    for (var prop in me) {
                        if (Math.random() < 1 / ++count) {
                            color = me[prop];
                        }
                    }
                }
                catch (e) { }
                return color;
            }
        }
        this.mapStyle = {
            icon: new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1], opacity: 0.6
                }))
            }),
            route: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 2, color: 'blue'
                })
            }),
            polygon: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.6)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'green', width: 1
                })
            }),
            Icon: function (src, opacity) {
                return new ol.style.Style({
                    image: new ol.style.Icon(({
                        anchor: [0.5, 1], opacity: opacity, src: src
                    }))
                });
            },
            Route: function (width, color) {
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        width: width, color: color
                    })
                });
            },
            Polygon: function (width, color, opacity) {
                return new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 255, ' + opacity + ')'
                    }),
                    stroke: new ol.style.Stroke({
                        color: color, width: width
                    })
                });
            }
        }
        this.mapImage = {
            Stock_Green: '/Images/map/stock_green.png',
            Stock_Red: '/Images/map/stock_red.png',
            Stock_Yellow: '/Images/map/stock_yellow.png',
            Depot_Green: '/Images/map/depot_green.png',
            Depot_Red: '/Images/map/depot_red.png',
            Depot_Yellow: '/Images/map/depot_yellow.png',
            Dock_Green: '/Images/map/dock_green.png',
            Dock_Red: '/Images/map/dock_red.png',
            Dock_Yellow: '/Images/map/dock_yellow.png',
            Pin_Green: '/Images/map/pin_green.png',
            Pin_Red: '/Images/map/pin_red.png',
            Pin_Yellow: '/Images/map/pin_yellow.png',
            Marker_Green: '/Images/map/marker_green.png',
            Marker_Red: '/Images/map/marker_red.png',
            Marker_Yellow: '/Images/map/marker_yellow.png',
            NumericPoint_Green: '/Images/map/numeric_green/point/{0}.png',
            NumericPoint_Red: '/Images/map/numeric_red/point/{0}.png',
            NumericPoint_Yellow: '/Images/map/numeric_yellow/point/{0}.png',
            NumericPoint_Platinum: '/Images/map/numeric_platinum/point/{0}.png',
            Truck_Orange: '/Images/map/truck_orange.png',
            Truck_Purple: '/Images/map/truck_purple.png'
        }

        this._to3875 = function (val) {
            return ol.proj.transform(val, mapEPSG.E4326, mapEPSG.E3857)
        }
        this._to4326 = function (val) {
            return ol.proj.transform(val, mapEPSG.E3857, mapEPSG.E4326)
        }
        this._toJson = function (url, pData) {
            var me = this;
            var xhr = new XMLHttpRequest(),
                when = {},
                onload = function () {
                    if (xhr.status === 200) {
                        when.ready.call(undefined, JSON.parse(xhr.response));
                    } else {
                        me.mcallback("Status: " + xhr.status);
                        console.error("Status: " + xhr.status);
                    }
                },
                onerror = function (e) {
                    console.error("Can't XHR " + JSON.stringify(url));
                },
                onprogress = function () { }
            ;

            xhr.open("GET", "http:"+url, true);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onload = onload;
            xhr.onerror = onerror;
            xhr.onprogress = onprogress;
            xhr.send(null);
            return {
                when: function (obj) {
                    when.ready = obj.ready;
                }
            };
        }

        this.Point = function (pLat, pLng) {
            return this._to3875([pLng, pLat]);
        }
        this.Create = function (pOptions) {
            var me = this;

            var options = $.extend({
                Element: '',
                Tooltip_Show: false,
                Tooltip_Element: "",
                InfoWin_Show: false,
                InfoWin_Element: "",
                InfoWin_Width: null,
                InfoWin_Height: null,
                Zoom: 11,
                Lat: 10.80187350042219,
                Lng: 106.7200799728422,
                Tile: me.mapTile.mapQuest,
                ClickMarker: null,
                ClickMap: null,
                mcallback: null
            }, true, pOptions);
            if (me.hasMap) {
                var mapView = new ol.View({
                    center: this.Point(options.Lat, options.Lng), zoom: options.Zoom
                });

                me.map = new ol.Map({
                    layers: [options.Tile], view: mapView, target: options.Element
                });

                ////Google maps
                //var olGM = new olgm.OLGoogleMaps({ map: map });
                //olGM.activate();

                me.map.on('click', function (e) {
                    var flag = false;
                    var orEv = e.coordinate;

                    me.map.forEachFeatureAtPixel(e.pixel, function (feature) {
                        flag = true;
                        if (feature.getProperties().type == mapFeature.marker) {
                            if (Common.HasValue(options.ClickMarker)) {
                                if (Common.HasValue(me.windowInfo)) {
                                    me.windowInfo.setPosition(orEv);
                                    me.windowInfo.getElement().style.display = "";
                                    me.windowInfo.getElement().parentElement.style.display = "";
                                }
                                options.ClickMarker(feature.getProperties().data, feature.getProperties().geometry.getCoordinates());
                            }
                        }
                    })
                    if (!flag && Common.HasValue(options.ClickMap)) {
                        if (Common.HasValue(me.windowInfo)) {
                            me.windowInfo.setPosition(orEv);
                            me.windowInfo.getElement().style.display = "";
                            me.windowInfo.getElement().parentElement.style.display = "";
                        }
                        options.ClickMap(e.coordinate);
                    }
                })

                $(me.map.getViewport()).on('mousemove', function (e) {
                    var title = "";
                    var isHit = me.map.forEachFeatureAtPixel(me.map.getEventPixel(e.originalEvent), function (feature) {
                        title = feature.getProperties().name;
                        return true;
                    });
                    if (options.Tooltip_Show && Common.HasValue(options.Tooltip_Element)) {
                        var element = $("#" + options.Tooltip_Element);
                        if (isHit) {
                            if (!element.is(':visible')) {
                                element.show();
                                element.text(title);
                                element.offset({ top: e.clientY - 20, left: e.clientX + 20 });
                            }
                        }
                        else {
                            element.hide();
                        }
                    }
                });

                if (options.InfoWin_Show) {
                    var win = new ol.Overlay({
                        element: document.getElementById(options.InfoWin_Element)
                    });
                    me.map.addOverlay(win);

                    var element = win.getElement().parentElement;
                    if (options.InfoWin_Width > 0) {
                        element.style.width = options.InfoWin_Width + "px";
                    }
                    if (options.InfoWin_Height > 0) {
                        element.style.height = options.InfoWin_Height + "px";
                    }

                    me.windowInfo = win;
                }
                if (options.mcallback != null)
                    this.mcallback = options.mcallback;
                return me.map;
            }
            else
                return null;
        }
        this.Marker = function (pLat, pLng, pTitle, pStyle, pData) {
            var me = this;

            if (!Common.HasValue(pStyle)) {
                pStyle = me.mapStyle.icon;
            }

            var feature = new ol.Feature({
                geometry: new ol.geom.Point(me.Point(pLat, pLng)), name: pTitle, data: pData, type: mapFeature.marker
            });
            feature.setStyle(pStyle);

            var vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [feature]
                })
            });

            vectorLayer.setZIndex(1001);

            if (Common.HasValue(me.map))
                me.map.addControl(vectorLayer);
            me.mapMarker.push(vectorLayer);

            return vectorLayer;
        }
        this.Polygon = function (pTitle, pPoints, pStyle) {
            var me = this;

            if (!Common.HasValue(pStyle)) {
                pStyle = me.mapStyle.polygon;
            }

            var feature = new ol.Feature({
                geometry: new ol.geom.Polygon(pPoints), name: pTitle, type: mapFeature.polygon
            });
            feature.setStyle(pStyle);

            var vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [feature]
                })
            });

            //vectorLayer.setZIndex(1000);

            if (Common.HasValue(me.map))
                me.map.addControl(vectorLayer);
            me.mapPolygon.push(vectorLayer);

            return vectorLayer;
        }
        this.Polyline = function (pTitle, pPoints, pTitle, pStyle) {
            var me = this;

            if (!Common.HasValue(pStyle)) {
                pStyle = me.mapStyle.polygon;
            }

            var feature = new ol.Feature({
                geometry: new ol.geom.LineString(pPoints, 'XY'), name: pTitle, type: mapFeature.polyline
            });
            feature.setStyle(pStyle);

            var vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [feature]
                })
            });

            //vectorLayer.setZIndex(1000);

            if (Common.HasValue(me.map))
                me.map.addControl(vectorLayer);
            me.mapPolyline.push(vectorLayer);

            return vectorLayer;
        }
        this.Route = function (pTitle, pPointFrom, pPointTo, pStyle, pData) {
            var me = this;
            try {
                var p1 = me._to4326(pPointFrom.getSource().getFeatures()[0].getGeometry().getCoordinates());
                var p2 = me._to4326(pPointTo.getSource().getFeatures()[0].getGeometry().getCoordinates());
                var sF = Math.round(p1[1] * 1000000) / 1000000 + "," + Math.round(p1[0] * 1000000) / 1000000;
                var sT = Math.round(p2[1] * 1000000) / 1000000 + "," + Math.round(p2[0] * 1000000) / 1000000;
                me._toJson(apiUrl.viaroute + sF + "&loc=" + sT + apiUrl.instructions).when({
                    ready: function (res) {
                        me.mcallback(res);
                        Common.Log(res);
                        if (res.status != 200) {
                            return;
                        }

                        if (!Common.HasValue(pStyle)) {
                            pStyle = me.mapStyle.route;
                        }

                        var feature = new ol.Feature({
                            name: pTitle, type: mapFeature.route, geometry: new ol.format.Polyline({
                                factor: 1e6
                            }).readGeometry(res.route_geometry, {
                                dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
                            })
                        });
                        feature.setStyle(pStyle);

                        var vectorLayer = new ol.layer.Vector();
                        vectorLayer.setSource(new ol.source.Vector({
                            features: [feature]
                        }))

                        //vectorLayer.setZIndex(1000);

                        if (Common.HasValue(me.map))
                            me.map.addControl(vectorLayer);
                        me.mapRoute.push(vectorLayer);

                        if (Common.HasValue(pData))
                            pData.push(vectorLayer);
                    }
                })
            }
            catch (e) {
                me.mcallback(e);
            }
        }
        this.Distance = function (p1, p2, callback, o) {
            var me = this;
            try {
                var sF = Math.round(p1.Lat * 1000000) / 1000000 + "," + Math.round(p1.Lng * 1000000) / 1000000;
                var sT = Math.round(p2.Lat * 1000000) / 1000000 + "," + Math.round(p2.Lng * 1000000) / 1000000;

                me._toJson(apiUrl.viaroute + sF + "&loc=" + sT + apiUrl.instructions).when({
                    ready: function (res) {
                        if (res.status != 200) {
                            return;
                        }
                        else {
                            if (Common.HasValue(callback)) {
                                var obj = {
                                    Distance: res.route_summary.total_distance,
                                    Time: res.route_summary.total_time,
                                    Data: o
                                }
                                callback(p1, p2, obj);
                            }
                        }
                    }
                })
            }
            catch (e) { }
        }
        this.Close = function () {
            var me = this;
            if (Common.HasValue(me.windowInfo)) {
                var element = me.windowInfo.getElement().parentElement;
                element.style.display = "none";
            }
        }
        this.FitBound = function (pData) {
            var me = this;

            var ex = ol.extent.createEmpty();
            angular.forEach(pData, function (o) {
                ol.extent.extend(ex, o.getSource().getExtent());
            })

            if (ex.length > 0) {
                var size = me.map.getSize();
                me.map.getView().fit(ex, [size[0] - 200, size[1] - 200]);
            }
        }
        this.SetVisible = function (mapLayers, visible) {
            var me = this;
            if (Common.HasValue(mapLayers)) {
                $.each(mapLayers, function (i, v) {
                    if (v != null)
                        try {
                            v.setVisible(visible);
                        } catch (e) { }
                })
            } else {
                $.each(me.mapRoute, function (i, v) {
                    if (v != null)
                        v.setVisible(visible);
                })
                $.each(me.mapMarker, function (i, v) {
                    if (v != null)
                        v.setVisible(visible);
                })
                $.each(me.mapPolygon, function (i, v) {
                    if (v != null)
                        v.setVisible(visible);
                })
                $.each(me.mapPolyline, function (i, v) {
                    if (v != null)
                        v.setVisible(visible);
                })
            }
        }
        this.GetDataFromLayer = function (mapLayer) {
            try {
                return mapLayer.getSource().getFeatures()[0].getProperties();
            }
            catch (e) { return {} }
        }
        this.Clear = function () {
            var me = this;
            me.ClearMarker();
            me.ClearRoute();
            me.ClearPolygon();
            me.ClearPolyline();
        }
        this.ClearRoute = function () {
            var me = this;
            $.each(me.mapRoute, function (i, v) {
                if (v != null)
                    v.setVisible(false);
            })
            me.mapRoute = [];
        }
        this.ClearMarker = function () {
            var me = this;
            $.each(me.mapMarker, function (i, v) {
                if (v != null)
                    v.setVisible(false);
            })
            me.mapMarker = [];
        }
        this.ClearPolygon = function () {
            var me = this;
            $.each(me.mapPolygon, function (i, v) {
                if (v != null)
                    v.setVisible(false);
            })
            me.mapPolygon = [];
        }
        this.ClearPolyline = function () {
            var me = this;
            $.each(me.mapPolyline, function (i, v) {
                if (v != null)
                    v.setVisible(false);
            })
            me.mapPolyline = [];
        }
    }

    return new openMap();
});