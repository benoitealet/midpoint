export class CallModel {
    id: number;
    date: Date;
    ipSource: string;
    requestVerb: string;
    requestUrl: string;
    requestBody: string;
    responseStatus: number;
    responseBody: string;
    proxy: number;
}
