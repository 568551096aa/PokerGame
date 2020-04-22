
import { Player } from "./Player"
import { Room } from "./scene/Room"
import { Constant } from "./scene/Constant";
import { AiPlayer } from "./AiPlayer";
export class DdzGame {
    //一副牌 1 2 大小鬼 3以后通过黑美心 红心 黑梅花  红方块交替存放 最后是A 和 2
    allPokers: number[] = new Array(Constant.PokerNum);
    players: Player[] = new Array(3);
    host: number[] = new Array(3);//地主牌
    bossState: boolean[] = new Array(3);//叫地主状态
    lastTypeAndSize: number[] = new Array(2);
    state: number = 0;//游戏状态 0准备阶段  1叫地主阶段 2出牌阶段 3接牌阶段
    pointer: number = 0//轮询判断
    bossId: number = -1;//地主id
    myself: number = 0;//我的 id
    firstPlayerId: number = 0;//第一个叫牌人
    winerId: number = -1;
    playPlayerId: number = 0;//出牌人id
    pokerSize: number = 17;
    room: Room = null;

    constructor() {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i] = new Player();
        }
    }

    init() {
        var i = 0;
        for (i = 0; i < this.allPokers.length; i++) {
            this.allPokers[i] = i;
        }
        for (i = 0; i < this.bossState.length; i++) {
            this.bossState[i] = false;
        }
        this.lastTypeAndSize = [-1, -1];
        this.state = Constant.ready;
        this.pointer = 0;
        this.bossId = -1;
        this.myself = 0;
        this.winerId = -1;

    }

    startGame() {
        //this.firstPlayerId = AiPlayer.randomNum(0, 2);
        this.firstPlayerId = 0;
        this.shuffleCards();
        this.room.dealCardsA();
    }

    main(type: number, id: number) {
        switch (type) {
            case Constant.selectBoss:
                this.room.setTimerPos(id);
                this.room.selectBoss(id);
                break;
            case Constant.playCard:
                this.room.setTimerPos(id);
                this.room.playCard(id);
                break;
            case Constant.connCard:
                this.room.setTimerPos(id);
                this.room.connCard(id);
                break;
            default:
                this.room.onClickQuit();
                break;
        }
    }

    setBoss(id: number) {
        this.playPlayerId = id;
        this.state = Constant.playCard;
        this.players[id].setBoss(this.host);
        this.players[id].sortPokers();
        this.room.setBoss(id);
    }

    //洗牌 
    shuffleCards() {
        //洗牌
        //0 1 大小王 /2-5 3  /6-9 4 ..
        var randArr = new Array(Constant.PokerNum);
        var i = 0;
        for (i = 0; i < Constant.PokerNum; i++) {
            randArr[i] = i;
        }
        var length = Constant.PokerNum - 1;
        for (i = 0; i < Constant.PokerNum; i++) {
            var index = AiPlayer.randomNum(0, length);
            this.allPokers[i] = randArr[index];
            var temp = randArr[index];
            randArr[index] = randArr[length]
            randArr[length] = temp;
            length--;
        }
        //发牌
        var i = 0, index = 0;
        for (i = 0; i < 3; i++) {
            var pokers = this.allPokers.slice(index, index + this.pokerSize);
            this.players[i].init(pokers);
            index += this.pokerSize;
        }
        //设置地主牌
        this.host = this.allPokers.slice(index, index + this.host.length);
    }

    //发牌A
    dealCardsA(id: number, pokers: number[]) {
        this.players[id].init(pokers);
    }

    playCard(id: number, pokers: number[]) {
        this.players[id].playCard(pokers);
        if (this.players[id].getValidPokerNum() == 0) {
            this.winerId = id;
        }
    }

    connCard(id: number, pokers: number[]) {
        this.players[id].connCard(pokers);
        if (this.players[id].getValidPokerNum() == 0) {
            this.winerId = id;
        }
    }

    isGameOver() {
        if (this.winerId != -1) {
            return true;
        }
        else {
            return false;
        }
    }

    //发牌特效
    dealCardsAnim() {

    }

    //获得牌的类型和大小
    getPokerTypeAndLevel(pokers: number[]) {
        //0双王 1单 2单对子  3单三个 4单四个 5三个带一个 6三个带两个 7 5个顺子 8 四个带两个
        //9 六个顺子  10两个三张 11  三连对子 12 7张顺子 13八张顺子 14 两带飞机带一张 15四连对子
        //16 九个顺子 17 三个三张 18十张顺子 19两个三带两张 20 五个连对 21 十一个顺子 22 12个顺子
        //23 三个三代一张 24 六个连对 25七个连对 26三个三代两张 27五个三张 28四个三代一张 29 八个 两连对子
        //30 六个三张 31八个两连对子 32四个带两个对子
        var res = [-1, -1];
        if (pokers.length == 0) {
            console.warn("错误");
            return res;
        }
        var map = new Map();
        for (var i = 0; i < pokers.length; i++) {
            var num = 0;
            if (pokers[i] == 0) {
                num = -2;
            }
            else if (pokers[i] == 1) {
                num = -1;
            }
            else {
                num = Math.floor((pokers[i] - 2) / 4);
            }
            if (map.has(num)) {
                var temp = map.get(num);
                map.set(num, temp + 1);
            }
            else {
                map.set(num, 1);
            }
        }
        if (pokers.length == 1) {
            res[0] = 1;
            pokers[0] < 2 ? res[1] = pokers[0] + 54 : res[1] = pokers[0];
        }
        else if (pokers.length == 2) {
            if (map.size == 1) {
                res[0] = 2;
                res[1] = Math.floor((pokers[0] - 2) / 4);
            }
            else {
                if (pokers[0] == 0 && pokers[1] == 1) {
                    res[0] = 0;
                }
            }
        }
        else if (pokers.length == 3) {
            if (map.size == 1) {
                res[0] = 3;
                res[1] = Math.floor((pokers[0] - 2) / 4);
            }
        }
        else if (pokers.length == 4) {
            if (map.size == 1) {
                res[0] = 4;
                res[1] = Math.floor((pokers[0] - 2) / 4);
            }
            else if (map.size == 2) {
                map.forEach((value, key) => {
                    if (value == 3) {
                        res[0] = 5;
                        res[1] = key;
                        return;
                    }
                });
            }
        }
        else if (pokers.length == 5) {
            if (map.size == 2) {
                map.forEach((value, key) => {
                    if (value == 3) {
                        res[0] = 6;
                        res[1] = key;
                        return;
                    }
                });
            }
            else if (map.size == 5) {
                var max = -1, min = 20;
                map.forEach((value, key) => {
                    max < key ? max = key : max;
                    min > key ? min = key : min;
                });
                if (max < 12 && max - min == 4) {
                    res[0] = 7;
                    res[1] = max;
                }
            }
        }
        else if (pokers.length == 6) {
            if (map.size == 2) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[5] - 2) / 4)) {
                    res[0] = 9;
                    map.forEach((value, key) => {
                        res[1] < key ? res[1] = key : res[1];
                    });
                }
            }
            else if (map.size == 3) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)) {
                    res[0] = 11;
                    map.forEach((value, key) => {
                        res[1] < key ? res[1] = key : res[1];
                    });
                }
                else {
                    map.forEach((value, key) => {
                        if (value == 4) {
                            res[0] = 8;
                            res[1] = key;
                            return;
                        }
                    });
                }
            }
            else if (map.size == 6) {
                var max = -1, min = 20;
                map.forEach((value, key) => {
                    max < key ? max = key : max;
                    min > key ? min = key : min;
                });
                if (max < 12 && max - min == 5) {
                    res[0] = 9;
                    res[1] = max;
                }
            }
        }
        else if (pokers.length == 7) {
            if (map.size == 7) {
                var max = -1, min = 20;
                map.forEach((value, key) => {
                    max < key ? max = key : max;
                    min > key ? min = key : min;
                });
                if (max < 12 && max - min == 6) {
                    res[0] = 12;
                    res[1] = max;
                }
            }
        }
        else if (pokers.length == 8) {
            if (map.size == 4) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[6] - 2) / 4)) {
                    res[0] = 15;
                    map.forEach((value, key) => {
                        res[1] < key ? res[1] = key : res[1];
                    });
                }
                else {
                    map.forEach((value, key) => {
                        if (value == 3) {
                            if (map.get(key + 1) == 3) {
                                res[0] = 14;
                                res[1] = key + 1;
                                return;
                            }
                            else if (map.get(key - 1) == 3) {
                                res[0] = 14;
                                res[1] = key;
                                return;
                            }
                        }
                    });
                }
            }
            else if (map.size == 3) {
                map.forEach((value, key) => {
                    if (value == 4) {
                        res[0] = 32;
                        res[1] = key;
                        return;
                    }
                });
            }
            else if (map.size == 8) {
                var max = -1, min = 20;
                map.forEach((value, key) => {
                    max < key ? max = key : max;
                    min > key ? min = key : min;
                });
                if (max < 12 && max - min == 7) {
                    res[0] = 13;
                    res[1] = max;
                }
            }
        }
        else if (pokers.length == 9) {
            if (map.size == 3) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[3] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[6] - 2) / 4)) {
                    res[0] = 17;
                    map.forEach((value, key) => {
                        res[1] < key ? res[1] = key : res[1];
                    });
                }
            }
            else if (map.size == 9) {
                var max = -1, min = 20;
                map.forEach((value, key) => {
                    max < key ? max = key : max;
                    min > key ? min = key : min;
                });
                if (max < 12 && max - min == 8) {
                    res[0] = 16;
                    res[1] = max;
                }
            }
        }
        else if (pokers.length == 10) {
            if (map.size == 4) {
                var valid = [0, 0];
                var threeNum = 0;
                var twoNum = 0;
                map.forEach((value, key) => {
                    if (threeNum > 2 || twoNum > 2) {
                        return;
                    }
                    if (value == 2) {
                        valid[threeNum] = 1;
                        twoNum++;
                    }
                    else if (value == 3) {
                        threeNum++;
                    }
                });
                if (threeNum == 2 && twoNum == 2) {
                    if (valid[0] == valid[1] + 1 || valid[0] == valid[1] - 1) {
                        res[0] = 19;
                        res[1] = valid[0] > valid[1] ? valid[0] : valid[1];
                    }
                }
            }
            else if (map.size == 5) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[6] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 4 == Math.floor((pokers[8] - 2) / 4)) {
                    res[0] = 20;
                    map.forEach((value, key) => {
                        res[1] < key ? res[1] = key : res[1];
                    });
                }
            }
            else if (map.size == 10) {
                var max = -1, min = 20;
                map.forEach((value, key) => {
                    max < key ? max = key : max;
                    min > key ? min = key : min;
                });
                if (max < 12 && max - min == 9) {
                    res[0] = 18;
                    res[1] = max;
                }
            }
        }
        else if (pokers.length == 11) {
            if (map.size == 11) {
                var max = -1, min = 20;
                map.forEach((value, key) => {
                    max < key ? max = key : max;
                    min > key ? min = key : min;
                });
                if (max < 12 && max - min == 10) {
                    res[0] = 21;
                    res[1] = max;
                }
            }
        }
        else if (pokers.length == 12) {
            if (map.size == 4) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[3] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[6] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[9] - 2) / 4)) {
                    res[0] = 25;
                    map.forEach((value, key) => {
                        res[1] < key ? res[1] = key : res[1];
                    });
                }
            }
            else if (map.size == 6) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[6] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 4 == Math.floor((pokers[8] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 5 == Math.floor((pokers[10] - 2) / 4)) {
                    res[0] = 24;
                    map.forEach((value, key) => {
                        res[1] < key ? res[1] = key : res[1];
                    });
                }
                else {
                    map.forEach((value, key) => {
                        if (value == 3) {
                            if (map.get(key + 1) == 3 && map.get(key + 2) == 3) {
                                res[0] = 23;
                                res[1] = key + 1;
                                return;
                            }
                            else if (map.get(key - 1) == 3 && map.get(key + 1) == 3) {
                                res[0] = 23;
                                res[1] = key;
                                return;
                            }
                            else if (map.get(key - 1) == 3 && map.get(key - 2) == 3) {
                                res[0] = 23;
                                res[1] = key;
                                return;
                            }
                        }
                    });
                }
            }
            else if (max < 12 && map.size == 12) {
                var max = -1, min = 20;
                map.forEach((value, key) => {
                    max < key ? max = key : max;
                    min > key ? min = key : min;
                });
                if (max < 12 && max - min == 11) {
                    res[0] = 22;
                    res[1] = max;
                }
            }
        }
        else if (pokers.length == 14) {
            if (map.size == 7) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[6] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 4 == Math.floor((pokers[8] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 5 == Math.floor((pokers[10] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 6 == Math.floor((pokers[12] - 2) / 4)) {
                    res[0] = 26;
                    map.forEach((value, key) => {
                        res[1] < key ? res[1] = key : res[1];
                    });
                }
            }
        }
        else if (pokers.length == 15) {
            if (map.size == 5) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[3] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[6] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[9] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 4 == Math.floor((pokers[12] - 2) / 4)) {
                    res[0] = 27;
                    map.forEach((value, key) => {
                        res[1] < key ? res[1] = key : res[1];
                    });
                }
            }
            else if (map.size == 6) {
                var valid = [0, 0, 0];
                var threeNum = 0;
                var twoNum = 0;
                map.forEach((value, key) => {
                    if (threeNum > 3 || twoNum > 3) {
                        return;
                    }
                    if (value == 2) {
                        valid[threeNum] = 1;
                        twoNum++;
                    }
                    else if (value == 3) {
                        threeNum++;
                    }
                });
                if (threeNum == 3 && twoNum == 3) {
                    valid.sort();
                    if (valid[0] + 1 == valid[1] && valid[0] + 2 == valid[2]) {
                        res[0] = 26;
                        res[1] = valid[2];
                    }
                }
            }
        }
        else if (pokers.length == 16) {
            if (map.size == 8) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[6] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 4 == Math.floor((pokers[8] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 5 == Math.floor((pokers[10] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 6 == Math.floor((pokers[12] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 6 == Math.floor((pokers[14] - 2) / 4)) {
                    res[0] = 29;
                    map.forEach((value, key) => {
                        res[1] < key ? res[1] = key : res[1];
                    });
                }
                else {
                    var valid = [0, 0, 0, 0];
                    var threeNum = 0;
                    map.forEach((value, key) => {
                        if (threeNum > 4) {
                            return;
                        }
                        if (value == 3) {
                            threeNum++;
                        }
                    });
                    if (threeNum == 4) {
                        valid.sort();
                        if (valid[0] + 1 == valid[1] && valid[0] + 2 == valid[2] && valid[0] + 3 == valid[3]) {
                            res[0] = 28;
                            res[1] = valid[2];
                        }
                    }
                }
            }
        }
        else if (pokers.length == 18) {
            if (map.size == 6) {
                var valid = [0, 0, 0, 0, 0, 0];
                var threeNum = 0;
                map.forEach((value, key) => {
                    if (threeNum > 6) {
                        return;
                    }
                    if (value == 3) {
                        threeNum++;
                    }
                });
                if (threeNum == 6) {
                    valid.sort();
                    if (valid[0] + 5 == valid[5]) {
                        res[0] = 30;
                        res[1] = valid[5];
                    }
                }
            }
            else if (map.size == 8) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[6] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 4 == Math.floor((pokers[8] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 5 == Math.floor((pokers[10] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 6 == Math.floor((pokers[12] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 7 == Math.floor((pokers[14] - 2) / 4)) {
                    res[0] = 31;
                    map.forEach((value, key) => {
                        res[1] < key ? res[1] = key : res[1];
                    });
                }
            }
        }
        return res;
    }
}
