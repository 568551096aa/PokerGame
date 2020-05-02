

const http = require("http");
const sql = require("./sql");

var httpID = {
    getgold: 0,
    addgold: 1,
    minusgold: 2,
    signin: 3,
    register: 4
};

async function receCalBak(param, res) {
    var data = JSON.parse(param);
    console.log(data);
    if (data.id == undefined) {
        res.write(JSON.stringify({ info: "数据错误" }));
        res.end();
        return;
    }

    switch (data.id) {
        case httpID.getgold:
            var num = await sql.getGold(data.uid);
            res.write(JSON.stringify({ res: num }));
            break;
        case httpID.addgold:
            var isSucceed = await sql.addtGold(data.uid, data.num);
            res.write(JSON.stringify({ res: isSucceed }));
            break;
        case httpID.minusgold:
            var isSucceed = await sql.minustGold(data.uid, data.num);
            res.write(JSON.stringify({ res: isSucceed }));
            break;
        case httpID.signin:
            var isSucceed = await sql.signin(data.uid, data.sid);
            res.write(JSON.stringify({ res: isSucceed }));
            break;
        case httpID.register:
            var isSucceed = await sql.register(data.uid, data.sid);
            res.write(JSON.stringify({ res: isSucceed }));
            break;
    }
    res.end();
}

const server = http.createServer((req, res) => {
    req.on('data', (data) => {
        res.setHeader("Content-Type", "application/json;charset=utf-8");
        res.statusCode = 200;
        res.sendDate = false;

        receCalBak(data, res);
    });
});

server.listen(3000);
console.log("http监听启动");