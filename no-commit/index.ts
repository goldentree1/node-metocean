import { MetOcean } from './../src/index';
const apiKey = '5cGt9KjwBF5D2bZ6iz8sEt';
const mo = new MetOcean({ apiKey })
// async function runMORoute() {
//     const res = await mo.getRouteTimeSeries({
//         route: [
//             {
//                 lon: 186.77271306302663,
//                 lat: -30.939924331023455,
//                 time: new Date()
//             },
//             {
//                 lon: 181.8061859929176,
//                 lat: -30.145127183376115,
//                 time: new Date(Date.now() + 1000 * 60 * 60 * 3)
//             },
//             {
//                 lon: 177.63078712866664,
//                 lat: -29.878755346037977,
//                 time: new Date(Date.now() + 1000 * 60 * 60 * 6)
//             }
//         ],
//         variables: ['wave.height']
//     })
//     console.log(res.variables['wave.height']?.data);
// }
// runMORoute();
// async function runMOTimeSeriesPoint() {
//     const data = await new MetOcean({ apiKey }).getPointTimeSeries({
//         points: [{ lat: -37.82, lon: 174.89 }],
//         times: [new Date()],
//         variables: ['air.temperature.at-2m', 'cloud.cover']
//     })

//     console.log(data);
// }
// runMOTimeSeriesPoint();

// moEG();
// async function moEG() {
//     //     await two();
//     // async function two() {
//     //     let url = 'https://forecast-v2.metoceanapi.com/point';

//     //     let data = {
//     //         points: [{ lon: 174.7842, lat: -37.7935 }],
//     //         variables: ['sea.depth.below-sea-level']
//     //     };

//     //     let options = {
//     //         method: 'post',
//     //         body: JSON.stringify(data),
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //             'x-api-key': apiKey
//     //         }
//     //     };

//     //     await fetch(url, options)
//     //         .then(response => {
//     //             console.log('API response status:', response.status);
//     //             return response.json();
//     //         }).then(json => {
//     //             console.log('API response JSON:', json);
//     //         });

//     // }
// }

// runMOPointEG();
// async function runMOPointEG() {
//     let url = 'https://forecast-v2.metoceanapi.com/route/speed';

//     let data = {
//         start: '2023-05-30T00:00:00Z',
//         speeds: [10.2, 14.5],
//         points: [
//             { lon: 186.77271306302663, lat: -30.939924331023455 },
//             { lon: 181.8061859929176, lat: -30.145127183376115 },
//             { lon: 177.63078712866664, lat: -29.878755346037977 }
//         ],
//         variables: ['wave.height']
//     };

//     let options = {
//         method: 'post',
//         body: JSON.stringify(data),
//         headers: {
//             'Content-Type': 'application/json',
//             'x-api-key': apiKey
//         }
//     };

//     await fetch(url, options)
//         .then(response => {
//             console.log('API response status:', response.status);
//             return response.json();
//         }).then(json => {
//             console.log('Point API response JSON:', json);
//         });

// }

// runMOPoint();
// async function runMOPoint() {
//     const data = await mo.getPoint({
//         points: [{ lat: 45, lon: 43 }],
//         variables: [
//             'sea.depth.below-sea-level'
//         ]
//     })
//     console.log(data);
// }

runMORouteSpeed();
async function runMORouteSpeed() {
    const data = await mo.getRouteSpeed({
        points: [{ lat: 45, lon: 43 }, { lat: 46, lon: 42 }, { lat: 33, lon: 55 }],
        variables: [
            'air.visibility'
        ],
        speeds: [10, 12],
        start: new Date()
    })
    console.log(data);
}
async function runMORouteSpeedEG() {
    let url = 'https://forecast-v2.metoceanapi.com/route/speed';

    let data = {
        start: '2023-05-30T00:00:00Z',
        speeds: [10.2, 14.5],
        points: [
            { lon: 186.77271306302663, lat: -30.939924331023455 },
            { lon: 181.8061859929176, lat: -30.145127183376115 },
            { lon: 177.63078712866664, lat: -29.878755346037977 }
        ],
        variables: ['air.temperature.at-2m']
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