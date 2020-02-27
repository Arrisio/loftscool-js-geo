function mapInit() {
    ymaps.ready(() => {
        let myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 11,
        });

        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="margin: 10px;">' +
            '<b>{{properties.name}}</b><br />' +
            '<i id="count"></i> ' +
            '<button id="add-button"> BTN </button>' +
            '</div>'
        );

        var placemark = new ymaps.Placemark([55.650625, 37.62708], {
            name: 'Calculating'
        }, {
            balloonContentLayout: BalloonContentLayout
        });

        const save = document.querySelector('#add-button');
        console.log('Кнопка SAVE:');
        console.log(save);

        myMap.geoObjects.add(placemark);
    })
}

export {
    mapInit
}