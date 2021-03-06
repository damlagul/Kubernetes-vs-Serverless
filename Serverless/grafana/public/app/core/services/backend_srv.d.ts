/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class BackendSrv {
    private $http;
    private alertSrv;
    private $rootScope;
    private $q;
    private $timeout;
    private contextSrv;
    inFlightRequests: {};
    HTTP_REQUEST_CANCELLED: number;
    /** @ngInject */
    constructor($http: any, alertSrv: any, $rootScope: any, $q: any, $timeout: any, contextSrv: any);
    get(url: any, params?: any): any;
    delete(url: any): any;
    post(url: any, data: any): any;
    patch(url: any, data: any): any;
    put(url: any, data: any): any;
    requestErrorHandler(err: any): void;
    request(options: any): any;
    addCanceler(requestId: any, canceler: any): void;
    resolveCancelerIfExists(requestId: any): void;
    datasourceRequest(options: any): any;
    loginPing(): any;
    search(query: any): any;
    getDashboard(type: any, slug: any): any;
    saveDashboard(dash: any, options: any): any;
}
