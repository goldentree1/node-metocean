
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
export type SelectedVariables<T, Keys extends MetOceanPointTimeSeriesVariable[]> = {
    [K in Keys[number]]?: T;
};

/** Constructor for a MetOcean instance. An `apiKey` string is required.*/
export type MetOceanConstructor = {
    apiKey: string;
    options?: {
        validateArgs?: boolean;
    }
}

/** MetOcean Point Forecast API time-series coordinate point */
export type MetOceanPointTimeSeriesPoint = {
    lat: number;
    lon: number;
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

/**
 * Arguments for the Point Forecast API time-series data.
 */
export type MetOceanPointTimeSeriesArgs<T extends MetOceanPointTimeSeriesVariable[]> = OneOf<{
    /** Array of coordinates to get data for.*/
    points: MetOceanPointTimeSeriesPoint[];
    /** Array of forecast variables to retrieve.*/
    variables: T;
    /** Object to specify times to retrieve data for. Only specify one of `time` and `times`*/
    time: MetOceanPointTimeSeriesTime;
    /** Array of Dates to retrieve data for. Only specify one of `time` and `times`.*/
    times: Date[];
}, 'time' | 'times'>

/** Time-series atmospheric variables */
export type MetOceanPointTimeSeriesAtmosphericVariable = 'air.humidity.at-2m' | 'air.pressure.at-sea-level' | 'air.temperature.at-2m' | 'air.visibility' | 'atmosphere.convective.potential.energy' | 'cloud.base.height' | 'cloud.cover' | 'precipitation.rate' | 'radiation.flux.downward.longwave' | 'radiation.flux.downward.shortwave' | 'wind.direction.at-10m' | 'wind.direction.at-100m' | 'wind.speed.at-10m' | 'wind.speed.at-100m' | 'wind.speed.eastward.at-100m' | 'wind.speed.eastward.at-10m' | 'wind.speed.gust.at-10m' | 'wind.speed.northward.at-100m' | 'wind.speed.northward.at-10m';
/** Time-series wave variables */
export type MetOceanPointTimeSeriesWaveVariable = 'wave.height' | 'wave.height.max' | 'wave.direction.peak' | 'wave.period.peak' | 'wave.height.above-8s' | 'wave.height.below-8s' | 'wave.period.above-8s.peak' | 'wave.period.below-8s.peak' | 'wave.direction.above-8s.peak' | 'wave.direction.below-8s.peak' | 'wave.direction.mean' | 'wave.directional-spread' | 'wave.period.tm01.mean' | 'wave.period.tm02.mean';
/** Time-series hydrodynamic variables */
export type MetOceanPointTimeSeriesHydrodynamicVariable = 'current.speed.eastward.at-sea-surface' | 'current.speed.eastward.at-sea-surface-no-tide' | 'current.speed.eastward.barotropic' | 'current.speed.eastward.barotropic-no-tide' | 'current.speed.northward.at-sea-surface' | 'current.speed.northward.at-sea-surface-no-tide' | 'current.speed.northward.barotropic' | 'current.speed.northward.barotropic-no-tide' | 'sea.temperature.at-surface' | 'sea.temperature.at-surface-anomaly';
/** Variables for the Point Forecast API time-series  */
export type MetOceanPointTimeSeriesVariable = `${MetOceanPointTimeSeriesAtmosphericVariable | MetOceanPointTimeSeriesWaveVariable | MetOceanPointTimeSeriesHydrodynamicVariable}`;
/**Possible reasons for missing data in the MetOcean Point Forecast API time-series response.*/
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

/** Dimensions of the response data returned by the Point Forecast API's time-series endpoint. */
export type MetOceanPointTimeSeriesResponseDimensions = {
    /** The coordinates at which the API retrieved data for */
    point: {
        type: string;
        units: string;
        data: {
            lat: number;
            lon: number;
        }[];
    };
    /** The times at which the API retrieved data for */
    time: {
        type: string;
        units: string;
        data: Date[];
    };
};

/** A single timepoint of a variable in response data returned by the Point Forecast API's time-series endpoint. */
export type MetOceanPointTimeSeriesResponseTimepoint = {
    standardName: string;
    units: string;
    siUnits: string;
    dimensions: string[];
    data: (number | null)[];
    noData: number[];
}

/** Successful response returned by the Point Forecast API's time-series endpoint. The T parameter is a union type of the variables being queried. */
export type MetOceanPointTimeSeriesResponse<T extends MetOceanPointTimeSeriesVariable[]> = {
    dimensions: MetOceanPointTimeSeriesResponseDimensions;
    noDataReasons: MetOceanNoDataReasons;
    variables: SelectedVariables<MetOceanPointTimeSeriesResponseTimepoint, T>;
}

/** Options for fetch() */
export type MetOceanFetchOptions = Omit<RequestInit, 'body' | 'headers' | 'method'>;

/** MetOcean errors extend this class.*/
export abstract class MetOceanError extends Error {
    constructor(message: string) { super(message); }
}

/** Error indicating that an illegal argument has been provided. */
export class MetOceanIllegalArgumentError extends MetOceanError {
    constructor(message: string) {
        super(`MetOcean Illegal Argument Error:\n${message}`);
    }
}

/** Error indicating that there was an issue with the API request response. */
export class MetOceanRequestError extends MetOceanError {
    private _httpStatusCode;

    constructor({ message, httpStatusCode }: { message: string; httpStatusCode: number; }) {
        super(`MetOcean Response Error:\nStatus ${httpStatusCode}\n${message}`);
        this._httpStatusCode = httpStatusCode;
    }

    get httpStatusCode() {
        return this._httpStatusCode;
    }
}
/**
 * Class used to interact with the MetOcean API. Requires an `apiKey`.
 * @see https://forecast-docs.metoceanapi.com/docs/#/getting-started
 * @example const metocean = new MetOcean({apiKey: 'your-api-key'})
 */
export class MetOcean {

    private static _POINT_TIME_SERIES_BASE_URL = 'https://forecast-v2.metoceanapi.com/point/time';

    /**Checks that at least one of `times` and `time` were included, but not both */
    private static _THROW_IF_TIME_AND_TIMES_OR_NEITHER({ time, times }: Pick<MetOceanPointTimeSeriesArgs<any>, 'time' | 'times'>) {
        if (time && times) throw new MetOceanIllegalArgumentError(`Both 'time' and 'times' properties were included as arguments, but only one of the two can be included. Please remove one.`);
        if (!time && !times) throw new MetOceanIllegalArgumentError(`Neither 'time' or 'times' was included. Please include one of these properties.`)
    }

    /**Checks that time variable is ok (if it exists) */
    private static _THROW_IF_TIME_INVALID({ time }: Pick<MetOceanPointTimeSeriesArgs<any>, 'time'>) {
        if (!time) return;
        const { from, repeat, to, interval } = time;
        //Don't allow simultaneous 'to' and 'repeat' properties
        if (repeat !== undefined && to !== undefined) throw new MetOceanIllegalArgumentError(`Both 'repeat' and 'to' properties were included in 'time', but only one of the two can be included. Please remove one.`);

        //At least one of 'from' and 'to' must exist.
        if (from === undefined && to === undefined) throw new MetOceanIllegalArgumentError(`Either 'from' or 'to' properties are required in property 'time'. Please add at least one.`);

        //check types are correct if they do exist.
        if (from && !(from instanceof Date)) throw new MetOceanIllegalArgumentError(`Property 'from' in property 'time' must be a Date or undefined. Got ${typeof from} ${typeof from === 'string' || typeof from === "number" ? `: ": '${from}'"` : '.'}`);
        if (to && !(to instanceof Date)) throw new MetOceanIllegalArgumentError(`Property 'to' in property 'time' must be a Date or undefined. Got ${typeof to} ${typeof to === 'string' || typeof to === "number" ? `: ": '${to}'"` : '.'}`)
        if (interval && typeof interval !== 'number') throw new MetOceanIllegalArgumentError(`Property 'interval' in property 'time' must be a number or undefined. Got ${typeof interval} ${typeof interval === 'string' || typeof interval === "number" ? `: "${interval}"` : ''}`)
        if (repeat && typeof repeat !== 'number') throw new MetOceanIllegalArgumentError(`Property 'repeat' in property 'time' must be a number or undefined. Got ${typeof repeat} ${typeof repeat === 'string' || typeof repeat === "number" ? `: "${repeat}"` : ''}`)
    }

    /**Checks that times is an array of Date objects w/ length > 0 (if it exists) */
    private static _THROW_IF_TIMES_INVALID({ times }: Pick<Record<keyof MetOceanPointTimeSeriesArgs<any>, unknown>, 'times'>) {
        if (!times) return;
        if (!Array.isArray(times)) throw new MetOceanIllegalArgumentError(`'times' property must be an array or undefined`)
        if (times.length === 0) throw new MetOceanIllegalArgumentError(`'times' property must contain an array of at least one Date(s), or be undefined. It was an empty array.`);
        times.map((t, i) => { if (!(t instanceof Date)) throw new MetOceanIllegalArgumentError(`'times' property must contain an array of only Date objects, but ${typeof t} was found at index ${i} ${typeof t === 'string' ? `: "${t}"` : ''}`) });
    }

    /** Checks that variables are an array of strings only */
    private static _THROW_IF_VARIABLES_BAD({ variables }: Pick<Record<keyof MetOceanPointTimeSeriesArgs<any>, unknown>, 'variables'>) {
        //throw if variables dont exist, if not an array, or if array is empty
        if (!variables || !Array.isArray(variables) || variables.length < 1) throw new MetOceanIllegalArgumentError(`'variables' property must contain an array of at least one forecast variable e.g., ["wave.height"]`);
        variables.forEach((v) => {
            if (typeof v !== 'string') throw new MetOceanIllegalArgumentError(`Variables array must all be of type 'string', but found ${typeof v}: "${typeof v === "string" ? `${v}` : ''}"`)
        });
    }

    /**Checks that points in an array of valid coordinates */
    private static _THROW_IF_POINTS_BAD({ points }: Pick<Record<keyof MetOceanPointTimeSeriesArgs<any>, unknown>, 'points'>) {
        if (!Array.isArray(points)) throw new MetOceanIllegalArgumentError(`'points' property was ${typeof points} instead of an array of points. Try something like 'points: [{lat:-37.82, lon:174.89}]'`)
        if (points.length === 0) throw new MetOceanIllegalArgumentError(`'points' array contained no points. Try something like 'points: [{lat:-37.82, lon:174.89}]'`)
        points.forEach(({ lat, lon }) => {
            const isLatValid = typeof lat === 'number' && lat <= 90 && lat >= -90;
            const isLonValid = typeof lon === 'number' && lon <= 180 && lon >= -180;
            if (!isLatValid || !isLonValid) {
                const errorMsg = `${isLatValid ? '' : ` - Latitude of ${lat} is invalid (latitudes must be between 90 and -90)`} ${isLonValid ? '' : `\n - Longitude of ${lon} is invalid (longitude must be between 180 and -180)`}`
                throw new MetOceanIllegalArgumentError(errorMsg);
            }
        });
    }

    private _requestHeaders;
    private _options;

    constructor({ apiKey, options }: MetOceanConstructor) {
        this._requestHeaders = { 'Content-Type': 'application/json', 'x-api-key': apiKey }

        this._options = {
            validateArgs: options?.validateArgs !== undefined ? options.validateArgs : true, //defaults to true
        }
    }

    /**
     * Retrieves time-series data from MetOcean Solutions' Point Forecast API.
     * @param args forecast properties
     * @param fetchOptions additional options for the fetch request
     * @returns MetOcean point time-series data.
     * @throws {MetOceanIllegalArgumentError} on bad arguments (e.g., `variables` is empty)
     * @throws {MetOceanRequestError} on invalid API requests (e.g., invalid api key)
     * @throws {Error} on fetch errors (e.g., no internet connect)
     * @example 
     * const data = await new MetOcean({apiKey}).getPointTimeSeries({
     *   points: [{lat: -37.82, lon: 174.89}],
     *   times: [new Date()],
     *   variables:['air.temperature.at-2m', 'cloud.cover']
     * })
     */
    async getPointTimeSeries<T extends MetOceanPointTimeSeriesVariable[]>(
        { points, time, times, variables }: MetOceanPointTimeSeriesArgs<T>,
        fetchOptions?: MetOceanFetchOptions): Promise<MetOceanPointTimeSeriesResponse<T>> {

        //validate
        if (this._options.validateArgs) {
            MetOcean._THROW_IF_POINTS_BAD({ points });
            MetOcean._THROW_IF_TIME_AND_TIMES_OR_NEITHER({ time, times });
            MetOcean._THROW_IF_TIME_INVALID({ time });
            MetOcean._THROW_IF_TIMES_INVALID({ times });
            MetOcean._THROW_IF_VARIABLES_BAD({ variables });
        }

        //build request
        const url = MetOcean._POINT_TIME_SERIES_BASE_URL;
        const reqOptions: RequestInit = {
            ...fetchOptions,
            method: 'post',
            headers: this._requestHeaders,
            body: JSON.stringify({
                points,
                time: time ? {
                    ...time,
                    interval: time?.interval ? `${time?.interval}h` : undefined,
                } : undefined,
                times,
                variables,
            }),
        };

        //fetch
        const res = await fetch(url, reqOptions);
        const resText = await res.text();

        //Throw request error on bad status code
        if (res.status !== 200) throw new MetOceanRequestError({
            httpStatusCode: res.status,
            message: resText
        });

        /** @todo make this not any? */
        const data = JSON.parse(resText) as any;
        /**@todo check this first? */
        data.dimensions.time.data = data.dimensions.time.data.map((dateString: string) => new Date(dateString));
        return data as MetOceanPointTimeSeriesResponse<T>;
    }
}
