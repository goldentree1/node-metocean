import { MetOcean } from './../src/index';
const apiKey = '';
const mo = new MetOcean({ apiKey })
async function runMO() {
    const res = await mo.getRouteTimeSeries({
        route: [{
            time: new Date(),
            lat: 34,
            lon: 35
        }],
        variables: ['cloud.base.height']
    })
    console.log(res);
}
// runMO();

moEG();
async function moEG() {


    let url = 'https://forecast-v2.metoceanapi.com/route/speed';

    let data = {
        route: [
            {
                lon: 186.77271306302663,
                lat: -30.939924331023455,
                time: '2023-05-30T00:00:00Z'
            },
            {
                lon: 181.8061859929176,
                lat: -30.145127183376115,
                time: '2023-05-30T03:00:00Z'
            },
            {
                lon: 177.63078712866664,
                lat: -29.878755346037977,
                time: '2023-05-30T06:00:00Z'
            }
        ],
        variables: ['wave.height']
    };

    let options = {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        }
    };

    await fetch(url, options)
        .then(response => {
            console.log('API response status:', response.status);
            return response.json();
        }).then(json => {
            console.log('API response JSON:', json);
        });
        await two();
    async function two() {
        let url = 'https://forecast-v2.metoceanapi.com/point';

        let data = {
            points: [{ lon: 174.7842, lat: -37.7935 }],
            variables: ['sea.depth.below-sea-level']
        };

        let options = {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        };

        await fetch(url, options)
            .then(response => {
                console.log('API response status:', response.status);
                return response.json();
            }).then(json => {
                console.log('API response JSON:', json);
            });

    }
}