mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [-103.59179687498357, 40.66995747013945],
    zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());

const provDisplay = document.getElementById('prov');
const locDisplay = document.getElementById('loc');
const totalDisplay = document.getElementById('tot');
const deathDisplay = document.getElementById('death');

map.on('load', function () {
    map.addSource('stats', {
        type: 'geojson',
        data: stats.send,
        generateId: true,
    });

    map.addLayer({
        id: 'covcases',
        type: 'circle',
        source: 'stats',
        paint: {
            'circle-color': [
                'step',
                ["get", "confirmed", ["get", "stats"]],
                '#00ff00',
                1000,
                '#66ff00',
                10000,
                '#ccff00',
                50000,
                '#ffff00',
                100000,
                '#ffcc00',
                250000,
                '#ff9900',
                500000,
                '#ff6600',
                1000000,
                '#ff3300',
                2000000,
                '#ff0000'
            ],
            'circle-radius': [
                'step',
                ["get", "confirmed", ["get", "stats"]],
                5,
                1000,
                5,
                10000,
                6,
                50000,
                6,
                100000,
                7,
                250000,
                7,
                500000,
                8,
                1000000,
                8,
                2000000,
                9
            ]
        }
    });


    map.on('click', 'covcases', function (e) {
        if (e.features[0].properties.province == "null") {
            const province = 'N/A';
            const location = e.features[0].properties.country;
            const all = JSON.parse(e.features[0].properties.stats);
            const totalcase = all.confirmed;
            const totaldeaths = all.deaths;

            provDisplay.textContent = province;
            locDisplay.textContent = location;
            totalDisplay.textContent = totalcase;
            deathDisplay.textContent = totaldeaths;

        } else {
            const province = e.features[0].properties.province;
            const location = e.features[0].properties.country;
            const all = JSON.parse(e.features[0].properties.stats);
            const totalcase = all.confirmed;
            const totaldeaths = all.deaths;

            provDisplay.textContent = province;
            locDisplay.textContent = location;
            totalDisplay.textContent = totalcase;
            deathDisplay.textContent = totaldeaths;
        }

    });

    map.on('mouseenter', 'covcases', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'covcases', function () {
        map.getCanvas().style.cursor = '';
    });
});




















/*map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'stats',
    filter: ['has', 'point_count'],
    paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [
            'step',
            ['get', 'point_count'],
            '#00BCD4',
            5,
            '#2196F3',
            30,
            '#3F51B5'
        ],
        'circle-radius': [
            'step',
            ['get', 'point_count'],
            10,
            10,
            15,
            30,
            20
        ]
    }
});

map.addLayer({
    id: 'covcases',
    type: 'circle',
    source: 'stats',
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': 'red',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
    }
});

// inspect a cluster on click
map.on('click', 'clusters', function (e) {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('stats').getClusterExpansionZoom(
        clusterId,
        function (err, zoom) {
            if (err) return;

            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
        }
    );
});*/

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
/*
    map.addLayer({
        id: 'covid-19',
        type: 'circle',
        source: 'stats',
        paint: {
            'circle-stroke-color': '#000',
            'circle-stroke-width': 1,
            'circle-color': '#000'
        }
    })
});*/