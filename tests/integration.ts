import { config } from 'dotenv';
config();

import fetch from 'node-fetch';
globalThis.fetch = fetch as any;

import { MetOcean, MetOceanUnauthorizedError } from './../src/index'

/**Throw your api key in .env or here for integration tests. */
const apiKey = process.env.METOCEAN_API_KEY;
if (!apiKey) throw Error('API key is required to run integration tests. Please copy .env.example to `.env`, and put your MetOcean API key in there.')
const mo = new MetOcean({ apiKey });

main();
async function main() {
    try {
        await run()
        return true;
    } catch (err) {
        //Tests failed
        console.log(err)
        return false;
    }

    async function run() {
        console.log('Basic integration tests: ')

        console.log('\n------------------------------------------')
        console.log('\t - Point time-series data (checking for success response ok):')
        console.log('------------------------------------------')
        const timeSeriesData = await timeSeriesDataSuccessResponse();
        console.log(timeSeriesData);

        console.log('\n------------------------------------------')
        console.log('\t - Point data (checking for success response ok):')
        console.log('------------------------------------------')
        const pointData = await pointDataSuccessResponse();
        console.log(pointData);

        console.log('\n------------------------------------------')
        console.log('\t - Route speed data (checking for success response ok):')
        console.log('------------------------------------------')
        const routeSpeedData = await routeSpeedSuccessResponse();
        console.log(routeSpeedData);

        console.log('\n------------------------------------------')
        console.log('\t - Route time-series data (checking for success response ok):')
        console.log('------------------------------------------')
        const routeTimeSeriesData = await routeTimeSeriesSuccessResponse();
        console.log(routeTimeSeriesData);


        console.log('\n\n\n Passed "Success responses ok". \n\n\n')

        console.log('\n------------------------------------------')
        console.log('\t - Throw on authorized (checking for MetOceanUnauthorisedError response ok):')
        console.log('------------------------------------------')
        const unauthed = await unauthorisedErrorThrows()
        if (unauthed === false) throw Error('Unauthorised doesnt throw error.')
        else { console.log(`Throws on unauthorised: ${unauthed.errorList}`) }

        console.log('TESTS PASSED!')
        return true;
    }
}

async function unauthorisedErrorThrows() {
    try {
        const unauthedMo = new MetOcean({ apiKey: 'bad-key' });
        await unauthedMo.getPoint({ points: [{ lat: 41, lon: 42 }], variables: ['sea.depth.below-sea-level'] })
        return false;
    } catch (err) {
        if (err instanceof MetOceanUnauthorizedError) {
            return err;
        }
        return false
    }
}

async function timeSeriesDataSuccessResponse() {
    const data = await mo.getPointTimeSeries({
        points: [{ lat: 30, lon: 40 }],
        variables: ['air.humidity.at-2m'],
        time: {
            from: new Date(),
            interval: 2,
            to: new Date(Date.now() + 1000 * 60 * 60 * 6),
        }
    });
    if(data.dimensions.time.data.length !== 4) throw Error('Time series data not correct length')
    return data;
}
async function pointDataSuccessResponse() {
    const pointData = await mo.getPoint({
        points: [{ lat: 30, lon: 40 }],
        variables: ['sea.depth.below-sea-level']
    });
    return pointData;
}

async function routeSpeedSuccessResponse() {
    const routeSpeedData = await mo.getRouteSpeed({
        start: new Date(),
        points: [{ lat: 30, lon: 39 }, { lat: 31, lon: 38 }, { lat: 30, lon: 20 }],
        speeds: [2, 3],
        variables: ['air.temperature.at-2m']
    })
    return routeSpeedData;
}

async function routeTimeSeriesSuccessResponse() {
    const routeTimeSeriesData = await mo.getRouteTimeSeries({
        route: [{
            lon: 186.77271306302663,
            lat: -30.939924331023455,
            time: new Date()
        },
        {
            lon: 181.8061859929176,
            lat: -30.145127183376115,
            time: new Date(Date.now() + 1000 * 60 * 60 * 3)
        }],
        variables: ['air.humidity.at-2m']
    });
    return routeTimeSeriesData;
}
