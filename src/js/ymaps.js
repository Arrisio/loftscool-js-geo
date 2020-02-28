import customBalloonLayoutRender from '../templates/customBalloonLayoutTemplate.hbs';
import customBalloonContentLayoutRender from '../templates/customBalloonContentLayoutTemplate.hbs';

function initMap() {
    ymaps.ready(function () {
        const mapCenter = [55.755381, 37.619044],
            myMap = new ymaps.Map('map', {
                center: mapCenter,
                zoom: 10,
            });

        const customBalloonLayout = ymaps.templateLayoutFactory.createClass(customBalloonLayoutRender());
        const customBalloonContentLayout = ymaps.templateLayoutFactory.createClass(customBalloonContentLayoutRender());
        // #####
        let currentCoords,
            currentAddress = '';

        function addFeedbackToModal() {
            let template = new ymaps.Template(customBalloonContentLayoutRender()),
                feedback = document.createElement('div'),
                feedbacks = document.getElementById('feedbacks'),
                feedbackPlaceholder = document.getElementById('feedbackPlaceholder'),
                data = new ymaps.data.Manager({
                    properties: {
                        userName: feedbackForm.userName.value,
                        placeName: feedbackForm.placeName.value,
                        comment: feedbackForm.comment.value
                    }
                });

            if (feedbackPlaceholder) {
                feedbackPlaceholder.remove();
            }
            feedback.innerHTML = template.build(data).text;
            feedbacks.appendChild(feedback);
        };

        function setAddress(coords) {
            ymaps.geocode(coords, {
                results: 1
            }).then(res => {
                currentAddress = res.geoObjects.get(0).getAddressLine();
            })
        }

        function createPlacemark(coords, userName = '', placeName = '', comment = 'a') {
            let placemark = new ymaps.Placemark(coords, {
                balloonContentHeader: `<b>${placeName}</b>`,
                balloonContentBody: `<div><a href="https://www.w3schools.com">${currentAddress}</a></div><div>${comment}</div>`,
                placeName: placeName,
                address: currentAddress,
                comment: comment,
                userName: userName
            }, {
                balloonContentLayout: customBalloonContentLayout,
                balloonLayout: customBalloonLayout
            });
            placemark.events.add('open', e => {
                currentCoords = e.get('coords')
            });
            return placemark
        }

        myMap.events.add('click', e => {
            if (myMap.balloon.isOpen()) {
                myMap.balloon.close();
            } else {
                currentCoords = e.get('coords');
                ymaps.geocode(currentCoords, {
                    results: 1
                })
                    .then(res => res.geoObjects.get(0).getAddressLine())
                    .then(res => {
                        currentAddress = res;
                        myMap.balloon.open(
                            currentCoords,
                            {
                                properties: { address: res }
                            }, {
                                contentLayout: customBalloonContentLayout,
                                layout: customBalloonLayout
                            });
                    })
            }
        });

        myMap.balloon.events.add('open', () => {
            document.getElementById('addBtn').addEventListener('click', () => {
                let feedbackForm = document.getElementById('feedbackForm');
                let p = createPlacemark(
                    currentCoords,
                    feedbackForm.userName.value,
                    feedbackForm.placeName.value,
                    feedbackForm.comment.value
                );

                clusterer.add([p]);
                addFeedbackToModal();
                feedbackForm.reset();
            });

            document.getElementById('modalAddress').innerText = currentAddress;
            document.querySelector('.balloon__close-button').addEventListener('click', evt => {
                myMap.balloon.close()
            })
            // myMap.balloon.autoPan();  // Dont work. 2020-02-28
        });

        var clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonMaxHeight: 200,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
        });

        myMap.geoObjects.add(clusterer);
    });
}

export {
    initMap
}

