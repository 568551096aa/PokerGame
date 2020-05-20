
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
    lastTypeAndSize: number[] = new Array(2);//上一家出牌类型和大小
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
            console.log("初始化");
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
        for (var i = 0; i < this.players.length; i++) {
            this.players[i] = new Player();
        }
        this.lastTypeAndSize = [-1, -1];
        this.state = Constant.ready;
        this.pointer = 0;
        this.bossId = -1;
        this.myself = 0;
        this.winerId = -1;
    }

    startGame() {
        this.firstPlayerId = AiPlayer.randomNum(0, 2);
        //this.firstPlayerId = 0;
        this.shuffleCards();
        this.room.dealCardsA();
    }

    main(type: number, id: number) {
        switch (type) {
            case Constant.selectBoss:
                this.room.selectBoss(id);
                break;
            case Constant.playCard:
                this.room.playCard(id);
                break;
            case Constant.connCard:
                this.room.connCard(id);
                break;
            default:
                this.room.onClickQuit();
                break;
        }
    }



    setBoss(id: number) {
        console.log("bossId " + id);
        this.playPlayerId = id;
        this.state = Constant.playCard;
        this.players[id].setBoss(this.host);
        this.players[id].sortPokers();
        for (var i = 0; i < 3; i++) {
            this.players[i].sortPokers();
        }
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

    //王炸： 0 顺子：1 个数 第一张牌大小   4张炸弹：2 个数 第一张牌大小 
    //四张带一张： 3 个数 第一张牌大小 四张带两张： 4 个数 第一张牌大小
    //3张：5 个数 第一张大小 三张带一张：6 个数 第一张大小 三张带两张：7 个数 第一张大小
    //2张：8 个数 第一张大小
    //1张：9 个数 大小

    //A已经出的牌 B要的牌
    compTypeAndSize(typeA: number[], typeB: number[]) {
        //4 炸弹  8四带2  0双王  32四带两对  
        var res: boolean = false;
        if (typeB[0] == 0) {
            res = true;
        }
        if (typeA[0] == typeB[0] && typeA[1] == typeB[1] && typeA[2] < typeB[2]) {
            res = true;
        }

        console.log("是否可以要 " + res);
        return res;
    }

    getPokerTypeAndLevel(pokers: number[]) {
        var res = [-1, -1, -1];
        if (pokers.length == 0) {
            console.warn("错误");
            return res;
        }
        var map = new Map<number, number>();
        for (var i = 0; i < pokers.length; i++) {
            var num = 0;
            if (pokers[i] == 0) {
                num = -3;
            }
            else if (pokers[i] == 1) {
                num = -2;
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

        //三张带一张  四张带一张

        //王炸： 0 顺子：1 长度 第一张牌大小   4张炸弹： 2 第一张牌大小 
        //四张带一张： 3 个数 第一张牌大小 四张带两张： 4 个数 第一张牌大小
        //3张：5 个数 第一张大小 三张带一张：6 个数 第一张大小 三张带两张：7 个数 第一张大小
        //2张：8 个数 第一张大小
        //1张：9 大小
        //单张
        if (pokers.length == 1) {
            res[0] = 9;
            res[1] = 1;
            if (pokers[0] == 0) {
                res[2] = 100;
            }
            else if (pokers[0] == 1) {
                res[2] = 99;
            }
            else {
                res[2] = Math.floor((pokers[0] - 2) / 4);
            }
            return res;
        }
        //王炸
        if (pokers.length == 2) {
            if (pokers[0] == 0 && pokers[1] == 1) {
                res[0] = 0;
                return res;
            }
        }
        var first = null;
        //所有单张
        var aNum = 0;
        map.forEach((value, key) => {
            if (value == 1) {
                aNum++;
            }
        });
        //所有对子
        var bNum = 0;
        first = new Array();
        map.forEach((value, key) => {
            if (value == 2) {
                bNum++;
                first.push(key);;
            }
        });
        if (bNum * 2 == pokers.length) {
            if (first.length == 1) {
                res[0] = 8;
                res[1] = bNum;
                res[2] = first[0];
            }
            else if (first.length == 2) {
                res[0] = -1;
                return res;
            }
            else {
                if (first[first.length - 1] == 11) {
                    res[0] = -1;
                    return res;
                }
                res[0] = 8;
                res[1] = bNum;
                res[2] = first[0];
            }
        }

        //所有三张
        var cNum = 0;
        first = new Array();
        map.forEach((value, key) => {
            if (value == 3) {
                cNum++;
                first.push(key);;
            }
        });
        if (cNum * 3 == pokers.length) {
            if (first[first.length - 1] == 11) {
                res[0] = -1;
                return res;
            }
            res[0] = 5;
            res[1] = cNum;
            res[2] = first[0];
        }
        else {
            if (cNum == aNum && pokers.length == cNum * 3 + aNum) {
                if (first.length == 1) {
                    res[0] = 6;
                    res[1] = cNum;
                    res[2] = first[0];
                }
                else {
                    if (first[first.length - 1] == 11) {
                        res[0] = -1;
                        return res;
                    }
                    var i = 1;
                    for (i = 1; i < first.length; i++) {
                        if (first[i] != first[i - 1] + 1) {
                            res[0] = -1;
                            break;
                        }
                    }
                    if (i == first.length) {
                        res[0] = 6;
                        res[1] = cNum;
                        res[2] = first[0];
                    }
                }
            }
            if (cNum == bNum && pokers.length == cNum * 3 + bNum * 2) {
                if (first.length == 1) {
                    res[0] = 7;
                    res[1] = cNum;
                    res[2] = first[0];
                }
                else {
                    if (first[first.length - 1] == 11) {
                        res[0] = -1;
                        return res;
                    }
                    var i = 1;
                    for (i = 1; i < first.length; i++) {
                        if (first[i] != first[i - 1] + 1) {
                            res[0] = -1;
                            return res;
                        }
                    }
                    if (i == first.length) {
                        res[0] = 7;
                        res[1] = cNum;
                        res[2] = first[0];
                    }
                }
            }
        }


        //所有四张  n连四张带一张 n连四张带两张
        var dNum = 0;
        first = new Array();
        map.forEach((value, key) => {
            if (value == 4) {
                dNum++;
                first.push(key);;
            }
        });
        if (dNum == 1 && pokers.length == 4) {
            res[0] = 2;
            res[1] = dNum;
            res[2] = first[0];
            return res;
        }
        else {
            if (dNum * 2 == aNum && pokers.length == dNum * 4 + aNum) {
                if (first.length == 1) {
                    res[0] = 3;
                    res[1] = dNum;
                    res[2] = first[0];
                    return res;
                }
                else {
                    if (first[first.length - 1] == 11) {
                        res[0] = -1;
                        return res;
                    }
                    var i = 1;
                    for (i = 1; i < first.length; i++) {
                        if (first[i] != first[i - 1] + 1) {
                            res[0] = -1;
                            return res;
                        }
                    }
                    if (i == first.length) {
                        res[0] = 3;
                        res[1] = dNum;
                        res[2] = first[0];
                    }
                }
            }
            if (dNum * 2 == bNum && pokers.length == dNum * 4 + bNum * 2) {
                if (first.length == 1) {
                    res[0] = 4;
                    res[1] = dNum;
                    res[2] = first[0];
                    return res;
                }
                else {
                    if (first[first.length - 1] == 11) {
                        res[0] = -1;
                        return res;
                    }
                    var i = 1;
                    for (i = 1; i < first.length; i++) {
                        if (first[i] != first[i - 1] + 1) {
                            res[0] = -1;
                            return res;
                        }
                    }
                    if (i == first.length) {
                        res[0] = 4;
                        res[1] = dNum;
                        res[2] = first[0];
                    }
                }
            }
        }

        //所有顺子 0 - 11
        if (aNum >= 5) {
            var temp = 0;
            var max = -1, min = 20;
            map.forEach((value, key) => {
                max < key ? max = key : max;
                min > key ? min = key : min;
            });
            if (max < 12 && max - min + 1 == pokers.length) {
                res[0] = 1;
                res[1] = pokers.length;
                res[2] = min;
            }
        }
        return res;
    }
}
