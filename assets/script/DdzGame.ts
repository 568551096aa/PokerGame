
import { Player } from "./Player"
import { Room } from "./scene/Room"
import { Constant } from "./scene/Constant";
import { AiPlayer } from "./AiPlayer";
export class DdzGame {
    //一副牌 1 2 大小鬼 3以后通过黑美心 红心 黑梅花  红方块交替存放 最后是A 和 2
    allPokers: number[] = new Array(Constant.PokerNum);
    players: Player[] = new Array();
    state: number = 0;//游戏状态 0准备阶段  1叫地主阶段 2出牌阶段 3接牌阶段
    pointer: number = 0//轮询判断
    host: number[] = new Array(3);//地主牌
    room: Room = null;
    pokerSize: number = 17;
    bossState: boolean[] = new Array(3);//叫地主状态
    bossId: number = -1;//地主id
    myself: number = 0;//我的 id
    firstPlayerId: number = 0;//第一个叫牌人
    playPlayerId: number = 0;//出牌人id
    type: number = 0;//牌的类型


    constructor() {
        for (var i = 0; i < 3; i++) {
            var player = new Player();
            this.players.push(player);
        }
    }

    init() {
        this.state = Constant.ready;
        this.pointer = 0;
        for (var i = 0; i < 3; i++) {
            this.bossState[i] = false;
        }
        this.bossId = 0;
        this.myself = 0;
        this.firstPlayerId = 0;
        this.shuffleCards();
    }

    startGame() {

    }

    setBoss(id: number) {
        this.playPlayerId = id;
        this.state = 2;
    }

    //洗牌 
    shuffleCards() {
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
    }

    //发牌A
    dealCardsA() {

    }

    //发牌B
    dealCardsB() {

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
        //30 六个三张 31八个两连对子 
        var res = [-1, -1];
        var map = new Map();
        for (var i = 0; i < pokers.length; i++) {
            if (map.has(pokers[i])) {
                map.set(pokers[i], map.get(pokers[i]));
            }
            else {
                map.set(pokers[i], 1);
            }
        }
        if (pokers.length == 1) {
            res[0] = 1;
            pokers[0] < 2 ? res[1] = pokers[0] + 54 : res[1] = pokers[0];
        }
        else if (pokers.length == 2) {
            if (map.size == 1) {
                var num = (pokers[0] - 3) % 4;
            }
            else {
                if (pokers[0] == 0 && pokers[1] == 1) {
                    res[0] = 0;
                }
            }
        }
        else if (pokers.length == 3) {

        }
        else if (pokers.length == 4) {

        }
        else if (pokers.length == 5) {

        }
        else if (pokers.length == 6) {

        }
        else if (pokers.length == 7) {

        }
        else if (pokers.length == 8) {

        }
        else if (pokers.length == 9) {

        }
        else if (pokers.length == 10) {

        }
        else if (pokers.length == 11) {

        }
        else if (pokers.length == 12) {

        }
        else if (pokers.length == 13) {

        }
        else if (pokers.length == 14) {

        }
        else if (pokers.length == 15) {

        }
        else if (pokers.length == 16) {

        }
        else if (pokers.length == 17) {

        }
        else if (pokers.length == 18) {

        }
        else if (pokers.length == 19) {

        }
        else {
            console.warn("erro 出牌 小于1");
        }
    }
}
