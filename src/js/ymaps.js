function initMap() {
    ymaps.ready(function () {
        var mapCenter = [55.755381, 37.619044],
            myMap = new ymaps.Map('map', {
                center: mapCenter,
                zoom: 10,
            }),
            placemarks = [];

        let customBalloonLayout = ymaps.templateLayoutFactory.createClass([
                '<div class="modal">',
                '<div class="">{{ address }}</div>',
                // '<div>{{ properties.address }}</div>',
                '$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]',
                '</div>',
                '</div>'
            ].join('')
        );
        var customBalloonContentLayout = ymaps.templateLayoutFactory.createClass([
            '<ul class=list>',
            // Outputting a list of all geo objects in the cycle.
            '{% for geoObject in properties.geoObjects %}',
            '<li><a href=# data-placemarkid="{{ geoObject.properties.placemarkId }}" class="list_item">{{ geoObject.properties.balloonContentHeader|raw }}</a></li>',
            '{% endfor %}',
            '</ul>',
            '<div>{{ properties.placemarkId }}</div>',
            '<div>{{ properties.address }}</div>',

            '<button id ="addBtn">BT</button>',
            '</div>'
        ].join(''));
        // #####
        let currentCoords,
            currentAddress = 'NNA';

        function getAddress(coords) {
            ymaps.geocode(coords, {
                results: 1
            }).then(function (res) {
                let firstGeoObject = res.geoObjects.get(0);
                let coords = firstGeoObject.geometry.getCoordinates();
                currentAddress = res.geoObjects.get(0).getAddressLine()
                return currentAddress;
            })
        }

        function createPlacemark(coords, i = 0) {
            let p = new ymaps.Placemark(coords, {
                // Defining the data that will be displayed in the balloon.
                balloonContentHeader: 'The title of the placemark #' + currentAddress,
                balloonContentBody: 'Information about the placemark #' + (i + 1),
                placemarkId: 10000,
                address: currentAddress,
                object: 'Центр современного искусства'
            }, {
                balloonContentLayout: customBalloonContentLayout,
                balloonLayout: customBalloonLayout
            });
            p.events.add('mousedown', e => {
                currentCoords = e.get('coords')
            });
            // console.log(p)
            // ymaps.Events.observe(p , p.Events.Click, e =>{alert(e)})
            return p
        }

        // Creating a custom layout with information about the selected geo object.

        // jQuery(document).on('click', 'a.list_item', function () {
        //     var selectedPlacemark = placemarks[jQuery(this).data().placemarkid];
        //     alert(selectedPlacemark.properties.get('balloonContentBody'));
        // });

        // jQuery(document).on('click', '#addBtn', function (e) {
        //     let p = createPlacemark(currentCoords);
        //     // console.log(p);
        //     // clusterer.add([p]);
        //     clusterer.add([p]);
        //     // alert(`your cords ${currentCoords}`)
        // });

        myMap.events.add('click', e => {
            if (myMap.balloon.isOpen()) {
                myMap.balloon.close();
            } else {
                currentCoords = e.get('coords');
                // getAddress(currentCoords)
                ymaps.geocode(currentCoords, {
                    results: 1
                })
                    .then(res => res.geoObjects.get(0).getAddressLine())
                    .then(res => {
                        currentAddress = res;
                        myMap.balloon.open(
                            currentCoords,
                            {
                                properties: {address: res}
                            }, {
                                contentLayout: customBalloonContentLayout,
                                layout: customBalloonLayout
                            });
                    });
            }
        });

        myMap.balloon.events.add('open', function (event) {
            document.getElementById('addBtn').addEventListener('click', () => {
                let p = createPlacemark(currentCoords);
                clusterer.add([p]);
            })
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
            placemarks.push(createPlacemark(getRandomPosition()));
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
};

// console.log(a);

export {
    initMap
}

