
import { Player } from "./Player"
import { Room } from "./scene/Room"
import { Constant } from "./scene/Constant";
export class DdzGame {
    //一副牌 1 2 大小鬼 3以后通过黑美心 红心 黑梅花  红方块交替存放 最后是A 和 2
    allPokers: number[] = new Array(Constant.PokerNum);

    players: Player[] = new Array();

    //游戏状态 0准备阶段  1叫地主阶段 2出牌阶段 3接牌阶段
    state: number = 0;

    //轮询判断
    pointer: number = 0

    //地主牌
    host: number[] = new Array(3);

    room: Room = null;

    pokerSize: number = 17;

    bossState: boolean[] = new Array(3);//叫地主状态

    bossId: number = -1;//地主id

    //我的 id
    myself: number = 0;

    //第一个叫牌人
    firstPlayerId: number = 0;

    constructor() {
        for (var i = 0; i < 3; i++) {
            var player = new  Player();
            this.players.push(player);
        }
    }

    init() {

    }

    startGame() {

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


    //洗牌
    shuffleCards() {

    }
}
