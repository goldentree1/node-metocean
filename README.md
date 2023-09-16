# MetOcean API

A [typescript](https://www.npmjs.com/package/typescript) wrapper for [MetOcean Solutions'](https://forecast-docs.metoceanapi.com/docs/#/getting-started) weather and marine APIs, featuring type-safety, error-handling and native JS Dates. Get an API key [here](https://console.metoceanapi.com/).

Currently supports time-series, point, and route endpoints.

<b>Disclaimer: this package is unofficial and its creator is not affiliated with
[MetOcean Solutions'](https://www.metocean.co.nz/). </b>  

## Requirements
- Node.js v18 or higher (or works fine with a [fetch polyfill](https://www.npmjs.com/package/node-fetch) on v16)
- ES6+
- Typescript 4.5.0+

## Installation
```bash
$ npm install metocean-api
```

## Basic Usage
<b>Important: do not use this package client-side as you will expose your API key.</b>

Create a new instance of MetOcean by passing in your API key. 
```ts
import { MetOcean } from 'metocean-api';
const m = new MetOcean({ apiKey: '<YOUR-API-KEY>' });
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
} from 'metocean-api';

const m = new MetOcean({ apiKey: 'your-api-key' });

try {
    const data = await m.getPointTimeSeries({
        points: [{ lat: -37.82, lon: 174.89 }],
        time: { from: new Date(), repeat: 3 },
        variables: ['cloud.cover']
    });

    //Print 'cloud.cover' if request/response successful e.g:
    //@example[0.56, 0.78]"
    console.log(data.variables['wave.height']?.data); // [0.56, 0.59, 0.71]
} catch (err) {

    if(err instanceof MetOceanUnauthorizedError){
        //unauthorised: probably a bad api key (status 401)
    }
    
    if(err instanceof MetOceanNotFoundError){
        //not found error (status 404)
    }

    if(err instanceof MetOceanInputError){
        //indicates incorrect user input (all other 4XX status codes)
    }

    if(err instanceof MetOceanServerError){
        //server errors (all http status 5XX codes)
    }

    if(err instanceof MetOceanError){
        //Any of the above MetOcean errors can also simply be idenrtified by their err.httpStatusCode.
        console.log(err.httpStatusCode);
        //The error list provides helpful error messages from the api
        console.log(err.errorList.toString());
    }else{
        //Not a MetOcean error - probably a networking error (4XX and 5XX)
    }

    console.error(err);
}
```

## Contribution
Contributions to this package are welcome. Please open an issue to discuss any changes, bugs or improvements you would like to make. Suggestions are welcome.

### Current todo
 - add support for /variables endpoint.
 - add support for /models endpoint.
 - write (better) tests

## License
[MIT License](https://github.com/goldentree1/node-metocean/blob/main/LICENSE).
