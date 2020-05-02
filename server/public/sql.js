var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'poker',
    port: 3306
});


function select(sql, callback) {
    return new Promise((reslove, reject) => {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
                reject(null);
            } else {
                conn.query(sql, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                    reslove(true);
                });
            }
        });
    });
}


function set(sql, callback) {
    return new Promise((reslove, reject) => {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
                reject(false);
            } else {
                conn.query(sql, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                    reslove(true);
                });
            }
        });
    });
}





function getGold(uid) {
    return new Promise((reslove) => {
        select("select gold from userdata where uid = " + uid.toString(), (qerr, vals, fields) => {
            if (qerr) {
                console.log(qerr);
                reslove(0);
            }
            else {
                reslove(vals[0].gold);
            }
        });
    });
}

function addtGold(uid, num) {
    return new Promise((reslove) => {
        select("update userdata set gold = gold + " + num.toString() + " where uid =" + uid.toString(), (qerr, vals, fields) => {
            if (qerr) {
                console.log(qerr);
                reslove(0);
            }
            else {
                reslove(1);
            }
        });
    });
}

function minustGold(uid, num) {
    return new Promise((reslove) => {
        select("update userdata set gold = gold - " + num.toString() + " where uid =" + uid.toString(), (qerr, vals, fields) => {
            if (qerr) {
                console.log(qerr);
                reslove(0);
            }
            else {
                reslove(1);
            }
        });
    });
}

//-1账号不存在 1成功 0密码错误
function signin(uid, sid, succeed) {
    return new Promise((reslove) => {
        select("select sid from userdata where uid =" + uid.toString(), (qerr, vals, fields) => {
            if (qerr) {
                reslove(-1);
            }
            else {
                if (vals[0].sid == sid) {
                    reslove(1);
                }
                else {
                    reslove(0);
                }
            }
        });
    });
}

//-2 错误 -1已存在 1成功 0创建失败
function register(uid, sid) {
    return new Promise((reslove) => {
        select("select uid from userdata where uid =" + uid.toString(), (qerr, vals, fields) => {
            if (qerr) {
                reslove(-1);
            }
            else {
                if (vals.length == 1) {
                    reslove(-1);
                }
                else {
                    select("insert into userdata (uid,sid,gold) values (" + uid.toString() + "," +
                        sid.toString() + ",3000);", (qerr, vals, fields) => {
                            if (qerr == null) {
                                reslove(1);
                            }
                            else {
                                reslove(0);
                            }
                        });
                }
            }
        });
    });
}


module.exports = {
    getGold, addtGold, minustGold, signin, register
};