# MetOcean API

A wrapper for [MetOcean Solutions'](https://forecast-docs.metoceanapi.com/docs/#/getting-started) weather and marine APIs, featuring type-safety, error-handling and native JS Dates. Get an API key [here](https://console.metoceanapi.com/).

<b>Warning: this package is still in development and there may be bugs or breaking changes before we reach v1.0.0. Currently only supports the Point Forecast Time-Series API.</b>

<b>Disclaimer: this package is unofficial and its creator is not affiliated with
[MetOcean Solutions'](https://www.metocean.co.nz/) in any way. </b>

## Requirements
- Node.js v18 or higher (or use a fetch polyfill)
- ECMAScript 2015 or higher
- Typescript v.4.5.0 or higher

## Installation
```bash
$ npm install @goldentree1/metocean
```

## Basic Usage
<b>Important: do not use this package client-side as you will expose your API key.</b>

Create a new instance of MetOcean by passing in your API key. 
```ts
import { MetOcean } from '@goldentree1/metocean';
const m = new MetOcean({ apiKey: 'your-api-key' });
```
Call a method on the instance to retrieve data from the API, with the added bonus of autocomplete in modern IDEs!

![](https://github.com/goldentree1/node-metocean/blob/main/showcase.gif)

## Handling Errors
See [our full example with error-handling](#full-example-with-error-handling).

- #### `MetOceanIllegalArgumentError`
Thrown when an invalid argument is provided to an API method, such as providing an empty array of `variables`. This error is thrown <b>before</b> a request is made.

- #### `MetOceanRequestError`
Thrown when the API responds with a bad HTTP code, such as when an invalid API key is provided.

- #### `Error`
Networking issues such as loss of internet connection also throw an error.

## Full Example With Error-Handling 
```ts
import {
  MetOcean, 
  MetOceanError,
  MetOceanIllegalArgumentError,
  MetOceanRequestError
} from 'goldentree1/metocean';

const m = new MetOcean({ apiKey: 'your-api-key' });

try {
    const data = await m.getPointTimeSeries({
        points: [{ lat: -37.82, lon: 174.89 }],
        time: { from: new Date(), repeat: 10 },
        variables: ['cloud.cover']
    });
    //Print 'cloud.cover' if request/response successful.
    console.log(data.variables['cloud.cover']?.data);
} catch (err) {
    if(err instanceof MetOceanIllegalArgumentError){
        //... handle a bad input here
    }
    if(err instanceof MetOceanRequestError){
        //... handle a bad http code here
        console.log(err.httpStatusCode);
    }
    if(!(err instanceof MetOceanError)){
        //... handle a networking error here
    }
    console.error(err);
}
```

## Contribution
Contributions to this package are welcome. Please open an issue to discuss any changes, bugs or improvements you would like to make.

## License
[MIT License](https://github.com/goldentree1/node-metocean/blob/main/LICENSE).
