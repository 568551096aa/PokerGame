import { SyncPromise } from "./SyncPromise";
import { Constant } from "../scene/Constant";

export class Socket {
    private ws: WebSocket = null;

    private packetId: number = 0; //通过packetId我们才能把响应包和返回包对应起来
    private pending: { [key: number]: SyncPromise } = {}; //存放发送消息请求的promise
    private opened: boolean = false; //是否连接
    private binded: boolean = false; //是否绑定
    private heartBeatHandler = null;; //心跳检测

    tryConnect() {
        if (!this.opened) {
            this.resetConnect();
            console.warn("websocket 连接中...")
            this.ws = new WebSocket(Constant.WS_HOST);
            this.ws.onopen = this.onOpen.bind(this);
            this.ws.onerror = this.onError.bind(this);
            this.ws.onclose = this.onClose.bind(this);
            this.ws.onmessage = this.onMessage.bind(this);
        }
    }

    closeConnect() {
        this.ws.close();
    }

    private resetConnect() {
        if (this.ws) {
            this.ws.close();
        }
        this.packetId = 0;
        this.pending = {};
        this.opened = false;
        this.binded = false;
        if (this.heartBeatHandler) {
            clearInterval(this.heartBeatHandler);
            this.heartBeatHandler = null;
        }
    }

    private onOpen() {
        console.warn("websocket 连接成功")
        this.opened = true;
        this.checkBind();
    }

    private onError(res: any) {
        console.warn("websocket 连接出错", res)
    }

    private onClose(res: any) {
        console.warn("websocket 连接已关闭", res)
        this.opened = false;
        this.binded = false;
        if (this.heartBeatHandler) {
            clearInterval(this.heartBeatHandler);
            this.heartBeatHandler = null;
        }
    }

    private onMessage(res: any) {
        this.handleMessage(res);
    }

    //外部调用request发起请求，先检测是否bind，没有则先bind再发请求
    //连接未建立则返回null，请求失败返回header(里面有错误信息)，请求成功返回body
    async request(commandId: string, body: any): Promise<any> {
        await this.checkBind();
        if (this.binded) {
            return this.sendMessage(commandId, body);
        }
        return Promise.resolve(null);
    }


    private async checkBind() {
        if (!this.binded) {
            const bindMessage = await this.sendMessage("", "");
            console.log("bindMessage " + bindMessage);
            if (bindMessage) {
                this.binded = true;
                //bind成功后检测是否需要恢复团战和加入团战邀请
                this.heartBeatHandler = setInterval(() => {
                    console.log("开始发送心跳");
                    this.sendMessage("", "");
                }, 3000);
            }
        }
    }

    //同步发起网络请求，每个请求分配packetId，创建promise并保存在pending中，待promise返回则表示请求已经完成
    private async sendMessage(commandId: string, body: any): Promise<any> {
        //连接还未完成则尝试重连并返回
        if (!this.opened) {
            console.warn("websocket 连接没有建立");
            this.tryConnect();
            return Promise.resolve(null);
        }

        if (commandId != "heartbeat") {
            console.warn(`websocket 发送${commandId}请求, body:`, body);
        }

        const packet = {
            header: {
                command_id: commandId,
                packet_id: ++this.packetId,
            },
            body: JSON.stringify(body),
        };

        const promise = new SyncPromise();
        this.pending[this.packetId] = promise;
        this.ws.send(JSON.stringify(packet));
        const resp = await promise.promise;
        return Promise.resolve(resp);
    }

    private handleMessage(res: any) {
        console.warn("res " + res.data);
        const packet = JSON.parse(res.data);
        const header = packet.header;
        const commandId = header.command_id;
        const body = JSON.parse(packet.body || "{}");

        const promise = this.pending[header.packet_id];
        if (promise) {
            //处理客户端主动请求的消息
            if (header.err_code && header.err_code != 0) {
                if (header.command_id != "heartbeat") {
                    console.warn(`websocket 收到${commandId}回复, errCode: ${header.err_code}, errMsg: ${header.err_msg}`);
                }
                promise.resolve(header);
            } else {
                if (header.command_id != "heartbeat") {
                    console.warn(`websocket 收到${commandId}回复, body:`, body);
                }
                promise.resolve(body);
            }
        } else {
            //处理服务器主动推送的消息
            console.warn(`websocket 收到服务器消息${commandId}, body:`, body);
            this.dispatch(header, body);
        }
    }

    private dispatch(header: any, body: any) {
        if (!body) {
            return;
        }
        const commandId = header.command_id;
        switch (commandId) {
            case 0:
                //cc.director.emit(TeamConstant.eventTeamInfoChange, body.group_info);
                break;
        }
    }

}

export const socket = new Socket();