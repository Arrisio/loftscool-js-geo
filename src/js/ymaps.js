function initMap() {
    jQuery(function () {
        ymaps.ready(function () {
            var mapCenter = [55.755381, 37.619044],
                myMap = new ymaps.Map('map', {
                    center: mapCenter,
                    zoom: 10,
                }),
                placemarks = [];

            // #####
            function getAddress(coords) {
                let myGeocoder = ymaps.geocode(coords, {
                    results: 1
                }).then(function (res) {
                    let firstGeoObject = res.geoObjects.get(0);
                    let coords = firstGeoObject.geometry.getCoordinates();
                    let addr = res.geoObjects.get(0).getAddressLine();
                    console.log(addr);
                })
            }
            function createPlacemark(coords) {
                return new ymaps.Placemark(coords, {
                    // Defining the data that will be displayed in the balloon.
                    balloonContentHeader: 'The title of the placemark #' + (i + 1),
                    balloonContentBody: 'Information about the placemark #' + (i + 1),
                    placemarkId: i
                }, {
                    balloonContentLayout: customBalloonContentLayout
                });
            }


            // Creating a custom layout with information about the selected geo object.
            var customBalloonContentLayout = ymaps.templateLayoutFactory.createClass([
                '<ul class=list>',
                // Outputting a list of all geo objects in the cycle.
                '{% for geoObject in properties.geoObjects %}',
                '<li><a href=# data-placemarkid="{{ geoObject.properties.placemarkId }}" class="list_item">{{ geoObject.properties.balloonContentHeader|raw }}</a></li>',
                '{% endfor %}',
                '</ul>',
                '<div>{{ properties.placemarkId }}</div>',
                '<button id ="addBtn">BT</button>'
            ].join(''));

            jQuery(document).on('click', 'a.list_item', function () {
                var selectedPlacemark = placemarks[jQuery(this).data().placemarkid];
                alert(selectedPlacemark.properties.get('balloonContentBody'));
            });

            // jQuery(document).on('click', '#addBtn', function (e) {
            //     console.log(1)
            // });

            myMap.events.add('click', e => {
                if (myMap.balloon.isOpen()) {
                    myMap.balloon.close();
                } else {
                    const coords = e.get('coords');
                    // let address = getAddress(coords);
                    console.log(coords);
                    // let p = createPlacemark(coords);
                    // clusterer.add([p]);
                    myMap.balloon.open(coords);
                }
            });

            var clusterer = new ymaps.Clusterer({
                clusterDisableClickZoom: true,
                clusterOpenBalloonOnClick: true,
                clusterBalloonPanelMaxMapArea: 0,
                clusterBalloonMaxHeight: 200,
                clusterBalloonContentLayout: 'cluster#balloonCarousel',
            });

            // Populating the cluster with geo objects with random positions.
            for (var i = 0, l = 100; i < l; i++) {
                var placemark = new ymaps.Placemark(getRandomPosition(), {
                    // Defining the data that will be displayed in the balloon.
                    balloonContentHeader: 'The title of the placemark #' + (i + 1),
                    balloonContentBody: 'Information about the placemark #' + (i + 1),
                    placemarkId: i
                }, {
                    balloonContentLayout: customBalloonContentLayout
                });
                placemarks.push(placemark);
            }

            clusterer.add(placemarks);
            myMap.geoObjects.add(clusterer);

            function getRandomPosition() {
                return [
                    mapCenter[0] + (Math.random() * 0.3 - 0.15),
                    mapCenter[1] + (Math.random() * 0.5 - 0.25)
                ];
            }

            // clusterer.balloon.open(clusterer.getClusters()[0]);
        });
    });
}


// console.log(a);

export {
    initMap
}

