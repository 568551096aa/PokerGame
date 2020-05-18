export class Http {

    static async httpPost(url: string, params: string): Promise<any> {
        return new Promise<any>((resolve) => {
            var xhr = new XMLHttpRequest();
            xhr.timeout = 5000;

            xhr.open("POST", url, true);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

            xhr.send(params);

            xhr.onload = e => {

            };
            // 请求结束
            xhr.onloadend = e => {
                console.log('request success');
                let res = null;
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    res = xhr.response;
                }
                resolve(JSON.parse(res));
            };
            // 请求出错
            xhr.onerror = e => {
                console.log('request error ' + xhr.status + " " + e);
            };
            // 请求超时
            xhr.ontimeout = e => {
                console.log('request timeout');
            };
        });
    }
}