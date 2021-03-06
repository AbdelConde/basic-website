function getUsers(){
    $.ajax({
        type: 'POST',
        url: '/users',
        success: function(data){
            for (var i = 0; i < data.length; i++) {
                showMarkerOnMap(data[i]);
            }
        },
        error: function(){
            alert('No data');
        }
    });
}

function showMarkerOnMap(user){
    var latlng = user.location.split(',');
    var singer = viewer.entities.add({
        name: user.username,
        position: Cesium.Cartesian3.fromDegrees(latlng[0], latlng[1]),
        billboard: {
            image: '/images/mic.png',
            width: 20,
            height: 20,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
            text: user.username,
            font: '10pt Helvetica',
            fillColor: Cesium.Color.BLACK,
            outlineColor: Cesium.Color.BLACK,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            pixelOffset: new Cesium.Cartesian2(0, 20)
        }
    });
    singer.description = '\
        <img\
          width="50px"\\n\
          heigth="50px"\
          style="float:left; margin: 0 1em 1em 0;"\
          src="/images/login.png"/>\
        <p>\
          Escuchar Grabacion de '+singer.name + 
        '</p>\
        <audio src="demo.wav" controls>';
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    var singer = viewer.entities.add({
        name: 'DianaBGomez',
        position: Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude),
        billboard: {
            image: '/images/mic.png',
            width: 28,
            height: 28,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
            text: 'DianaBGomez',
            font: '12pt Helvetica',
            fillColor: Cesium.Color.BLACK,
            outlineColor: Cesium.Color.BLACK,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            pixelOffset: new Cesium.Cartesian2(0, 32)
        }
    });
    singer.description = '\
        <img\
          width="50px"\\n\
          heigth="50px"\
          style="float:left; margin: 0 1em 1em 0;"\
          src="/images/login.png"/>\
        <p>\
          Escuchar Grabacion de '+singer.name + 
        '</p>\
        <audio src="demo.wav" controls>';
}
var login = function () {
    window.open('http://localhost:3000/profile', '_blank');
}
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YTNkM2M4OS1iYTUzLTQzMmItYTkxNi1iYjc5NGZlYTllMGYiLCJpZCI6Mjg2NCwiaWF0IjoxNTM0OTU5MjA0fQ.rp8FbC9rMLHK-KyLis8wvDnjni9a0saRK2GoqaEuf1k";
var cesiumContainer = document.getElementById('map');
var viewer = new Cesium.Viewer(cesiumContainer, {
    imageryProvider: new Cesium.BingMapsImageryProvider({
        url: 'https://dev.virtualearth.net',
        key: 'AkranHq1ElWu5Hox7cCdXcgaxtdapYNQgKTDL8IE_JKzAWDH4dxO-Rx6CrP9pk2x',
        mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS

    }),
    baseLayerPicker: false,
    terrainProvider: Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true
    })
});
//getLocation()
viewer.scene.globe.baseColor = Cesium.Color.BLUE;
$(viewer._animation.container).css('visibility', 'hidden');
$(viewer._timeline.container).css('visibility', 'hidden');
$(viewer._toolbar).css('visibility', 'hidden');

var scene = viewer.scene;
if (!scene.pickPositionSupported) {
    console.log('This browser does not support pickPosition.');
}

var handler;
var entity = viewer.entities.add({
        label : {
            show : false,
            showBackground : true,
            font : '14px monospace',
            horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
            verticalOrigin : Cesium.VerticalOrigin.TOP,
            pixelOffset : new Cesium.Cartesian2(15, 0)
        }
    });

    // Mouse over the globe to see the cartographic position
    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function(movement) {
        var pickedObject = scene.pick(movement.endPosition);
        pickedObject.billboard.scale = 2.0;
        pickedObject.billboard.color = Cesium.Color.YELLOW;
        
//        var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
//        if (cartesian) {
//            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
//            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
//            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
//
//            entity.position = cartesian;
//            entity.label.show = true;
//            entity.label.text =
//                'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
//                '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0';
//        } else {
//            entity.label.show = false;
//        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

viewer.forceResize();
getUsers();
