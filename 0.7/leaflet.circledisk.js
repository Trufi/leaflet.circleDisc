//  Required:
// leaflet.js ver. 0.7

// Author: Mstislav Zhivodkov

L.CircleDisk = L.Circle.extend({
    initialize: function (latlng, radius, radius2, options) {
        L.Path.prototype.initialize.call(this, options);

        this._latlng = L.latLng(latlng);
        this._mRadius = radius;
        this._iRadius = radius2;
    },
    projectLatlngs: function () {
        var lngRadius = this._getLngRadius(),
            latlng = this._latlng,
            pointLeft = this._map.latLngToLayerPoint([latlng.lat, latlng.lng - lngRadius]),
            lngRadius2 = ((this._iRadius / 40075017) * 360) / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat),
            pointLeft2 = this._map.latLngToLayerPoint([latlng.lat, latlng.lng - lngRadius2]);

        this._point = this._map.latLngToLayerPoint(latlng);
        this._radius = Math.max(this._point.x - pointLeft.x, 1);
        this._radiusI = Math.max(this._point.x - pointLeft2.x, 1);
    },
    getPathString: function () {
        var p = this._point,
            r = this._radius,
            rI = this._radiusI,
            dr = r - rI,
            arc = 'a' + r + ',' + r + ' 0 1,0 ',
            arcI = 'a' + rI + ',' + rI + ' 0 0,1 ';

        if (this._checkIfEmpty()) {
            return '';
        }

        if (L.Browser.svg) {
            return 'M' + (p.x - r) + ',' + p.y +
                arc +  (r * 2) + ',0 ' +
                'm' + (-dr) + ' 0' +
                arcI +  (-rI * 2) + ',0 ' +
                arcI +  (rI * 2) + ',0 ' +
                'm' + dr + ' 0' +
                arc + (-r * 2) + ',0 ';
        } else {
            p._round();
            r = Math.round(r);
            // Не поменял для кольца
            return 'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r + ' 0,' + (65535 * 360);
        }
    }
});

L.circleDisk = function (latlng, radius, radius2, options) {
    return new L.CircleDisk(latlng, radius, radius2, options);
};