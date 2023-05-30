/*** Enforces requirement of one of the two listed properties, but not both.*/
export type OneOf<T, Keys extends keyof T = keyof T> =
    Omit<T, Keys> & {
        [K in Keys]-?:
        Required<Pick<T, K>>
        & Partial<Omit<Record<Keys, undefined>, K>>
    }[Keys]

/** Enforces one or more of the listed properties are present */
export type OneOrMoreOf<T, Keys extends keyof T = keyof T> =
    Omit<T, Keys> & {
        [K in Keys]-?:
        Required<Pick<T, K>>
        & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]

/** Contains only properties of T listed in Keys*/
export type SelectedVariables<T, Keys extends any[]> = {
    [K in Keys[number]]?: T;
};

/** Constructor for a MetOcean instance. An `apiKey` string is required.*/
export type MetOceanConstructor = {
    apiKey: string;
    options?: {
        validateArgs?: boolean;
    }
}

/** A MetOcean coordinate point */
export type MetOceanPoint = {
    lat: number;
    lon: number;
}
/** A MetOcean coordinate point with a date timestamp */
export type MetOceanPointWithTime = {
    lat: number;
    lon: number;
    time: Date;
}

/** Object that specifies the dates that forecast data is retrieved for.
 * Specify either `times` or `time`, not both.
 */
export type MetOceanPointTimeSeriesTime = OneOrMoreOf<{
    /** 
     * Starting time to retrieve data from.
     * At least one of `from` or `to` is required.
     */
    from?: Date;

    /**
     * Interval in hours between data points
     * @default 3 hours 
    */
    interval?: number;
    /**
     * The amount of datapoints to retrieve data for.
     * Specify either `repeat` or `to`, not both.
     */
    repeat?: number;
    /**
     * Ending date to retrieve points from. 
     * Specify either `repeat` or `to`, not both.
    */
    to?: Date;
}, 'to' | 'from'> & ({ repeat?: never; } | { to?: never; })

/** Time-series atmospheric variables */
export type MetOceanTimeSeriesAtmosphericVariable = 'air.humidity.at-2m' | 'air.pressure.at-sea-level' | 'air.temperature.at-2m' | 'air.visibility' | 'atmosphere.convective.potential.energy' | 'cloud.base.height' | 'cloud.cover' | 'precipitation.rate' | 'radiation.flux.downward.longwave' | 'radiation.flux.downward.shortwave' | 'wind.direction.at-10m' | 'wind.direction.at-100m' | 'wind.speed.at-10m' | 'wind.speed.at-100m' | 'wind.speed.eastward.at-100m' | 'wind.speed.eastward.at-10m' | 'wind.speed.gust.at-10m' | 'wind.speed.northward.at-100m' | 'wind.speed.northward.at-10m';
/** Time-series wave variables */
export type MetOceanTimeSeriesWaveVariable = 'wave.height' | 'wave.height.max' | 'wave.direction.peak' | 'wave.period.peak' | 'wave.height.above-8s' | 'wave.height.below-8s' | 'wave.period.above-8s.peak' | 'wave.period.below-8s.peak' | 'wave.direction.above-8s.peak' | 'wave.direction.below-8s.peak' | 'wave.direction.mean' | 'wave.directional-spread' | 'wave.period.tm01.mean' | 'wave.period.tm02.mean';
/** Time-series hydrodynamic variables */
export type MetOceanTimeSeriesHydrodynamicVariable = 'current.speed.eastward.at-sea-surface' | 'current.speed.eastward.at-sea-surface-no-tide' | 'current.speed.eastward.barotropic' | 'current.speed.eastward.barotropic-no-tide' | 'current.speed.northward.at-sea-surface' | 'current.speed.northward.at-sea-surface-no-tide' | 'current.speed.northward.barotropic' | 'current.speed.northward.barotropic-no-tide' | 'sea.temperature.at-surface' | 'sea.temperature.at-surface-anomaly';
/** Variables for the Point Forecast API route/time-series data responses  */
export type MetOceanTimeSeriesVariable = `${MetOceanTimeSeriesAtmosphericVariable | MetOceanTimeSeriesWaveVariable | MetOceanTimeSeriesHydrodynamicVariable}`;
/** Variables for the Point Forecast API point endpoint response
 * @todo Are there more non time-series variables? This was only one listed in docs */
export type MetOceantNonTimeSeriesVariable = `${`sea.depth.below-sea-level`}`;


/**
 * Possible reasons for missing data in the MetOcean Point Forecast API time-series response.
 * @see https://forecast-docs.metoceanapi.com/docs/#/response?id=no-data-values
*/
export type MetOceanNoDataReasons = {
    ERROR_INTERNAL: number;
    FILL: number;
    GAP: number;
    GOOD: number;
    INVALID_HIGH: number;
    INVALID_LOW: number;
    MASK_ICE: number;
    MASK_LAND: number;
};

/**
 * Arguments for the Point Forecast API time-series data.
 */
export type MetOceanPointTimeSeriesArgs<T extends MetOceanTimeSeriesVariable[]> = OneOf<{
    /** Array of coordinates to get data for.*/
    points: MetOceanPoint[];
    /** Array of forecast variables to retrieve.*/
    variables: T;
    /** Object to specify times to retrieve data for. Only specify one of `time` and `times`*/
    time: MetOceanPointTimeSeriesTime;
    /** Array of Dates to retrieve data for. Only specify one of `time` and `times`.*/
    times: Date[];
}, 'time' | 'times'>
/**
 * Arguments for the Point Forecast API point data.
 * @todo should be MetOceanTimeSeriesVariable AND the point variables - but where tf are they?
 */
export type MetOceanPointArgs<T extends MetOceantNonTimeSeriesVariable[]> = {
    /** Array of coordinates to get data for.*/
    points: MetOceanPoint[];
    /** Array of forecast variables to retrieve.*/
    variables: T;
}
/**
 * Arguments for the Route Forecast API time-series data.
 */
export type MetOceanRouteTimeSeriesArgs<T extends MetOceanTimeSeriesVariable[]> = {
    /** Array of coordinates to get data for at the specified `time`.*/
    route: MetOceanPointWithTime[];
    /** Array of forecast variables to retrieve.*/
    variables: T;
}
/**
 * Arguments for the Route Forecast API time-series data.
 */
export type MetOceanRouteSpeedArgs<T extends MetOceanTimeSeriesVariable[]> = {
    /**Starting date of route */
    start: Date;
    /** Route speeds in meters per second (m/s) */
    speeds: number[];
    /** Array of coordinates to get data for.*/
    points: MetOceanPoint[];
    /** Array of forecast variables to retrieve.*/
    variables: T;
}

/** Dimensions of the response data returned by the Point Forecast API's time-series endpoint. */
export type MetOceanPointTimeSeriesResponseDimensions = {
    /** The coordinates at which the API retrieved data for */
    point: {
        type: string;
        units: string;
        data: MetOceanPoint[];
    };
    /** The times at which the API retrieved data for */
    time: {
        type: string;
        units: string;
        data: Date[];
    };
};
/** Dimensions of the response data returned by the Point Forecast API's time-series endpoint. */
export type MetOceanPointResponseDimensions = {
    /** The coordinates at which the API retrieved data for */
    point: {
        type: string;
        units: string;
        data: MetOceanPoint[];
    };
};
/** Dimensions of the response data returned by the Point Forecast API's route endpoints (time-). */
export type MetOceanRouteResponseDimensions = {
    /** The coordinates and times at which the API retrieved data for */
    timepoint: {
        type: string;
        units: string;
        data: {
            lat: number;
            lon: number;
            time: Date;
        }[];
    };
};

/** A single timepoint of a variable in response data returned by the Point Forecast API's time-series endpoint. */
export type MetOceanResponseVariable = {
    standardName: string;
    units: string;
    siUnits: string;
    dimensions: string[];
    data: (number | null)[];
    noData: number[];
}

/** Successful response returned by the Point Forecast API's time-series endpoint. The T parameter is a union type of the variables being queried. */
export type MetOceanPointTimeSeriesResponse<T extends MetOceanTimeSeriesVariable[]> = {
    dimensions: MetOceanPointTimeSeriesResponseDimensions;
    noDataReasons: MetOceanNoDataReasons;
    variables: SelectedVariables<MetOceanResponseVariable, T>;
}
/** Successful response returned by the Route Forecast API's route time-series endpoint. The T parameter is a union type of the variables being queried. */
export type MetOceanPointResponse<T extends MetOceantNonTimeSeriesVariable[]> = {
    dimensions: MetOceanPointResponseDimensions;
    noDataReasons: MetOceanNoDataReasons;
    variables: SelectedVariables<MetOceanResponseVariable, T>;
}
/** Successful response returned by the Point Forecast API's route time-series or route-speed endpoints. The T parameter is a union type of the variables being queried. */
export type MetOceanRouteResponse<T extends MetOceanTimeSeriesVariable[]> = {
    dimensions: MetOceanRouteResponseDimensions;
    noDataReasons: MetOceanNoDataReasons;
    variables: SelectedVariables<MetOceanResponseVariable, T>;
}

/** Options for fetch() */
export type MetOceanFetchOptions = Omit<RequestInit, 'body' | 'headers' | 'method'>;

/** MetOcean errors extend this class.*/
export abstract class MetOceanError extends Error {
    private _httpStatusCode;
    private _errorList;

    constructor(errorList: string[], httpStatusCode: number, errType?: string) {
        super(`MetOceanError: \n${errorList.map(msg => `\t - ${msg}`)}\nHTTP Status code: ${httpStatusCode} ${errType ? `(${errType})` : ``}`);
        this._httpStatusCode = httpStatusCode;
        this._errorList = errorList;
    }
    public get httpStatusCode() {
        return this._httpStatusCode;
    }
    public get errorList() {
        return this._errorList;
    }
}
/** Error indicating that the user is unauthorized: usually the result of an invalid `apiKey`. */
export class MetOceanUnauthorizedError extends MetOceanError {
    constructor(errorList: string[]) {
        super(errorList, 401, 'unauthorized')
    }
}
/** Error indicating that the resource was not found. */
export class MetOceanNotFoundError extends MetOceanError {
    constructor(errorList: string[]) {
        super(errorList, 404, 'unauthorized')
    }
}
/** Error indicating that the input is invalid. For example, specifying invalid parameters. */
export class MetOceanInputError extends MetOceanError {
    constructor(errorList: string[], httpStatusCode: number) {
        super(errorList, httpStatusCode, 'input error') //some other 4xx code
    }
}
export class MetOceanServerError extends MetOceanError {
    constructor(errorList: string[], httpStatusCode: number) {
        super(errorList, httpStatusCode, 'server error')
    }
}

/**
 * Class used to interact with the MetOcean API. Requires an `apiKey`.
 * @see https://forecast-docs.metoceanapi.com/docs/#/getting-started
 * @example const metocean = new MetOcean({apiKey: 'your-api-key'})
 */
export class MetOcean {

    private static POINT_TIME_SERIES_BASE_URL = 'https://forecast-v2.metoceanapi.com/point/time';
    private static ROUTE_TIME_SERIES_BASE_URL = 'https://forecast-v2.metoceanapi.com/route/time';
    private static ROUTE_SPEED_BASE_URL = 'https://forecast-v2.metoceanapi.com/route/speed';
    private static POINT_BASE_URL = 'https://forecast-v2.metoceanapi.com/point';

    private _requestHeaders;

    constructor({ apiKey }: MetOceanConstructor) {
        this._requestHeaders = { 'Content-Type': 'application/json', 'x-api-key': apiKey }
    }

    private async _makeRequest(
        url: string,
        method: 'post' | 'get',
        data: { [id: string]: any },
        fetchOpts: MetOceanFetchOptions = {}
    ) {
        const reqOptions: RequestInit = {
            ...fetchOpts,
            method,
            headers: this._requestHeaders,
            body: JSON.stringify(data),
        };
        try {
            const res: Response = await fetch(url, reqOptions)
            const json: unknown = await res.json();
            if (res.status === 200) return json as unknown;
            if (res.status === 401) throw new MetOceanUnauthorizedError(json as string[]);
            if (res.status === 404) throw new MetOceanNotFoundError(json as string[]);
            if (res.status >= 400 && res.status < 500) throw new MetOceanInputError(json as string[], res.status);
            if (res.status >= 500) throw new MetOceanServerError(json as string[], res.status);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Retrieves time-series data from MetOcean Solutions' Point Forecast API.
     * @see https://forecast-docs.metoceanapi.com/docs/#/endpoint-point-time
     * @param args forecast properties
     * @param fetchOptions additional options for the fetch request
     * @returns MetOcean point time-series data.
     * @throws {MetOceanIllegalArgumentError} on bad arguments (e.g., `variables` is empty)
     * @throws {MetOceanRequestError} on invalid API requests (e.g., invalid api key)
     * @throws {Error} on fetch errors (e.g., no internet connect)
     * @example 
     * const timeSeriesData = await new MetOcean({apiKey}).getPointTimeSeries({
     *   points: [{lat: -37.82, lon: 174.89}],
     *   times: [new Date()],
     *   variables:['air.temperature.at-2m', 'cloud.cover']
     * });
     * console.log(timeSeriesData);
     */
    async getPointTimeSeries<T extends MetOceanTimeSeriesVariable[]>(
        args: MetOceanPointTimeSeriesArgs<T>,
        fetchOptions?: MetOceanFetchOptions
    ): Promise<MetOceanPointTimeSeriesResponse<T>> {

        const url = MetOcean.POINT_TIME_SERIES_BASE_URL;
        const res: any = await this._makeRequest(url, "post", args, fetchOptions);

        //convert strings to JS Dates
        res.dimensions.time.data = res.dimensions.time.data
            .map((dateString: string) => new Date(dateString));

        return res as MetOceanPointTimeSeriesResponse<T>;
    }

    /**
     * Retrieves point data from MetOcean Solutions' Point Forecast API point endpoint.
     * For data variables that do not have an associated time-series.
     * @see https://forecast-docs.metoceanapi.com/docs/#/endpoint-point
     * @todo should be MetOceanTimeSeriesVariable AND the point variables - but where tf are they?
     * @param args forecast properties
     * @param fetchOptions additional options for the fetch request
     * @returns MetOcean point data.
     * @throws {MetOceanIllegalArgumentError} on bad arguments (e.g., `variables` is empty)
     * @throws {MetOceanRequestError} on invalid API requests (e.g., invalid api key)
     * @throws {Error} on fetch errors (e.g., no internet connect)
     * @example 
     * const pointData = await new MetOcean({apiKey}).getPointTimeSeries({
     *   points: [{lat: -37.82, lon: 174.89}],
     *   times: [new Date()],
     *   variables:['air.temperature.at-2m', 'cloud.cover']
     * });
     * console.log(pointData);
    */
    async getPoint<T extends MetOceantNonTimeSeriesVariable[]>(
        args: MetOceanPointArgs<T>,
        fetchOptions?: MetOceanFetchOptions
    ): Promise<MetOceanPointResponse<T>> {

        const url = MetOcean.POINT_BASE_URL;
        const res = await this._makeRequest(url, "post", args, fetchOptions);
        return res as MetOceanPointResponse<T>;
    }

    /**
     * Warning: experimental.
     * Retrieves time-series data from MetOcean Solutions' Point Time-Series API route time-series endpoint.
     * @see https://forecast-docs.metoceanapi.com/docs/#/endpoint-route-time     * @param args forecast properties
     * @param fetchOptions additional options for the fetch request
     * @returns MetOcean route time-series data.
     * @throws {MetOceanIllegalArgumentError} on bad arguments (e.g., `variables` is empty)
     * @throws {MetOceanRequestError} on invalid API requests (e.g., invalid api key)
     * @throws {Error} on fetch errors (e.g., no internet connect)
     * @example 
     * const mo = new MetOcean({ apiKey:'YOUR-API-KEY' });
     * const routeTimeSeriesData = await mo.getRouteTimeSeries({
     *   route: [
     *      { lon: 186.77271306302663, lat: -30.939924331023455, 
     *        time: new Date() 
     *      },
     *      { lon: 177.63078712866664, lat: -29.878755346037977, 
     *        time: new Date(Date.now() + 1000 * 60 * 60 * 6) 
     *      }
     *   ],
     *   variables: ['wave.height']
     * });
     * console.log(routeTimeSeriesData);
     */
    async getRouteTimeSeries<T extends MetOceanTimeSeriesVariable[]>(
        args: MetOceanRouteTimeSeriesArgs<T>,
        fetchOptions?: MetOceanFetchOptions
    ): Promise<MetOceanRouteResponse<T>> {

        const url = MetOcean.ROUTE_TIME_SERIES_BASE_URL;
        const res: any = await this._makeRequest(url, "post", args, fetchOptions);

        //convert strings to JS Dates
        res.dimensions.timepoint.data = res.dimensions.timepoint.data
            .map((timepoint: any) => ({ ...timepoint, time: new Date(timepoint.time) }));
        return res as Promise<MetOceanRouteResponse<T>>;
    }
    /**
     * Warning: experimental.
     * Retrieves route-speed data from MetOcean Solutions' Point Forecast API route-speed endpoint
     * @see https://forecast-docs.metoceanapi.com/docs/#/endpoint-route-speed
     * @param args forecast properties
     * @param fetchOptions additional options for the fetch request
     * @returns MetOcean route speed (time-series) data.
     * @throws {MetOceanIllegalArgumentError} on bad arguments (e.g., `variables` is empty)
     * @throws {MetOceanRequestError} on invalid API requests (e.g., invalid api key)
     * @throws {Error} on fetch errors (e.g., no internet connect)
     * @example   
     * const mo = new MetOcean({apiKey:'YOUR-API-KEY'})
     * const routeSpeedData = await mo.getRouteSpeed({
     *    start: new Date(),
     *    points: [{ lat: 30, lon: 39 }, { lat: 31, lon: 38 }, { lat: 30, lon: 20 }],
     *    speeds: [2, 3],
     *    variables: ['air.temperature.at-2m']
     * });
     * console.log(routeSpeedData);
     */
    async getRouteSpeed<T extends MetOceanTimeSeriesVariable[]>(
        args: MetOceanRouteSpeedArgs<T>,
        fetchOptions?: MetOceanFetchOptions
    ): Promise<MetOceanRouteResponse<T>> {
        const url = MetOcean.ROUTE_SPEED_BASE_URL;
        const res: any = await this._makeRequest(url, "post", args, fetchOptions);

        res.dimensions.timepoint.data = res.dimensions.timepoint.data
            .map((timepoint: any) => ({ ...timepoint, time: new Date(timepoint.time) }));
        return res as Promise<MetOceanRouteResponse<T>>;
    }
}
