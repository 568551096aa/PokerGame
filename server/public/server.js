var ws = require('nodejs-websocket');
const gashaponEnterHome = 1;//首页入口
const gashaponEnterShop = 2;//商城入口
const gashaponEnterGoCollect = 3;//商城去收集按钮
const gashaponEnterSkinInfoGo = 4;//皮肤详情页去收集

const COMMAND_HEART_BEAT = 0;//心跳包
const COMMAND_BIND = 1;//绑定用户信息
const MAX_TRY_LOGIN_COUNT = 6;//最大重连数
const RETRY_TIME = 2000;//重连延迟时间
const COMMAND_RECOVER_GAME = 2;//重启游戏
const COMMAND_MATCH = 3;//匹配
const COMMAND_CREATE_ROOM = 4;//创建房间
const COMMAND_JOIN_ROOM = 5;//加入房间
const COMMAND_KICK_PLAYER = 6;//踢出玩家
const COMMAND_EXIT_ROOM = 7;//退出房间
const COMMAND_USER_STATE = 8;//用户状态改变
const COMMAND_GET_READY = 9;//得到用户状态
const COMMAND_GET_RID = 10;//获得用户rid
const COMMAND_CANCEL_READY = 11;//取消准备
const userStateOnline = 12;//用户在线状态
var allsocketconnect = 0;

//接受消息
function recMessage(connect, str) {
    var data = JSON.parse(str);  //需要存储连接用户的信息
    var command_id, packet_id, body;
    command_id = data.header.command_id;
    packet_id = data.header.packet_id;
    body = data.body;

    switch (command_id) {
        case COMMAND_BIND:
            singlecast(connect, command_id, packet_id, body);
            break;
        case COMMAND_RECOVER_GAME:
            singlecast(connect, command_id, packet_id, body);
            break;
        case COMMAND_CREATE_ROOM:
            ssinglecast(connect, command_id, packet_id, body);
            break;
        case COMMAND_JOIN_ROOM:
            singlecast(connect, command_id, packet_id, body);
            break;
        case COMMAND_KICK_PLAYER:
            singlecast(connect, command_id, packet_id, body);
            break;
        case COMMAND_EXIT_ROOM:
            singlecast(connect, command_id, packet_id, body);
            break;
        case COMMAND_USER_STATE:
            singlecast(connect, command_id, packet_id, body);
            break;
        case COMMAND_GET_READY:
            singlecast(connect, command_id, packet_id, body);
            break;
        case COMMAND_GET_RID:
            singlecast(connect, command_id, packet_id, body);
            break;
        case COMMAND_CANCEL_READY:
            singlecast(connect, command_id, packet_id, body);
            break;
        default:
            singlecast(connect, command_id, packet_id, body);
            break;
    }
}
//单播函数
function singlecast(oneconn, command_id, packet_id, body = {}) {
    const data = JSON.stringify({
        header: {
            command_id,
            uid: this.uid,
            packet_id: ++this.packetId
        },
        body: JSON.stringify(body)
    })
    oneconn.sendText(data);
};


var server = ws.createServer();
server.listen(8888);

server.on("listening", () => {
    console.log("监听已启动");
});

server.on("erro", () => {
    console.log("erro " + erro);
});

server.on("close", () => {
    console.log("close " + close);
});

server.on("connection", (conn) => {
    console.log("connection ");
    var lastHeardID = 0;
    conn.on("text", (data) => {
        console.log(data);
        const packet = JSON.parse(data);
        const header = packet.header;
        const command_id = packet.command_id;
        const body = JSON.parse(packet.body);
        packet.body = JSON.stringify({ ss: "ss" });
        conn.sendText(JSON.stringify(packet));
    });

    conn.on("error", () => {
        console.log("error ");
    })


    conn.on("close", () => {
        console.log("close ");
    })

});




/*var server = ws.createServer(function (conn) {
    allsocketconnect++;
    console.log("连接数:" + allsocketconnect);
    conn.on('text', function (str) {
        var data = JSON.parse(str);  //需要存储连接用户的信息
        var command_id, packet_id, body;
        command_id = data.header.command_id;
        packet_id = data.header.packet_id;
        body = data.body;

        switch (command_id) {
            case COMMAND_BIND:
                singlecast(conn, command_id, packet_id, body);
                break;
            case COMMAND_RECOVER_GAME:
                singlecast(conn, command_id, packet_id, body);
                break;
            case COMMAND_CREATE_ROOM:
                ssinglecast(conn, command_id, packet_id, body);
                break;
            case COMMAND_JOIN_ROOM:
                singlecast(conn, command_id, packet_id, body);
                break;
            case COMMAND_KICK_PLAYER:
                singlecast(conn, command_id, packet_id, body);
                break;
            case COMMAND_EXIT_ROOM:
                singlecast(conn, command_id, packet_id, body);
                break;
            case COMMAND_USER_STATE:
                singlecast(conn, command_id, packet_id, body);
                break;
            case COMMAND_GET_READY:
                singlecast(conn, command_id, packet_id, body);
                break;
            case COMMAND_GET_RID:
                singlecast(conn, command_id, packet_id, body);
                break;
            case COMMAND_CANCEL_READY:
                singlecast(conn, command_id, packet_id, body);
                break;
        }
    });

    conn.on("close", function (code, reason) {

        var res = mymanger.mysocketmanger.find(conn);
        if (res != -1) {
            var connobject = mymanger.mysocketmanger.get(res);
            console.log("要删除的res" + res);
            console.log(connobject.number + "编号:" + connobject.myroom + "房间," + connobject.myseat + "号玩家退出房间");
            var myroom = mymanger.allroom[connobject.myroom];

            mymanger.erase(res);
            allsocketconnect--;
            for (var i = 0; i < 3; i++) {
                if (myroom.isready[i] == true) {
                    singlecast(mymanger.mysocketmanger.getsocket(myroom.connect[i]), JSON.stringify({ type: 'Restart' }));
                    myroom.isready[i] = false;
                    myroom.readycount--;
                }
            }
            myroom.init();
            //boardcast(myroom, JSON.stringify({type: 'Over'}));
        }
        console.log("Connection closed")
    })
    conn.on("error", function (code, reason) {
        var res = mymanger.mysocketmanger.find(conn);
        if (res != -1) {
            var connobject = mymanger.mysocketmanger.get(res);
            console.log("要删除的res" + res);
            console.log(connobject.number + "编号:" + connobject.myroom + "房间," + connobject.myseat + "号玩家退出房间");
            var myroom = mymanger.allroom[connobject.myroom];
            console.log("退出房间信息" + myroom);
            mymanger.erase(res);
            allsocketconnect--;
            for (var i = 0; i < 3; i++) {
                if (myroom.isready[i] == true) {
                    singlecast(mymanger.mysocketmanger.getsocket(myroom.connect[i]), JSON.stringify({ type: 'Restart' }));
                    myroom.isready[i] = false;
                    myroom.readycount--;
                }
            }
            myroom.init();
        }
        console.log("Connection error")
    })
    conn.on("listening", function (code, reason) {
        console.log("Connection listening")
    })

})*/






