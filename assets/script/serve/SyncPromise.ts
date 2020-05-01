export class SyncPromise {
    resolve: any;
    reject: any;
    promise: Promise<any>;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
    }
}
