import fetch from 'node-fetch'
globalThis.fetch = fetch
import { MetOcean } from './../src/index';
const mo = new MetOcean({ apiKey: 'GAn3hYKGAf4SiL1X7YGzdk' })
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
runMO();