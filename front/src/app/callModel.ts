export class CallModel {
    id: number;
    date: Date;
    ipSource: string;
    requestVerb: string;
    requestUrl: string;
    requestQuery: string;
    requestBody: string;
    requestFileName: string;
    responseStatus: number;
    responseBody: string;
    responseFileName: string;
    proxy: number;
    color: string;
    time: number;
}
