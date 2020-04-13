
import { Player } from "./Player"
import {Room} from "./scene/Room"
export class DdzGame {
    //一副牌 1 2 大小鬼 3以后通过黑美心 红心 黑梅花  红方块交替存放 最后是A 和 2
    allPokers: number[] = [];

    //左侧玩家
    leftPleyer: Player = null;

    //中间玩家及自己
    midPleyer: Player = null;

    //右侧玩家
    rightPleyer: Player = null;

    //游戏状态 0准备阶段  1叫地主阶段 2出牌阶段 3接牌阶段
    state: number = 0;

    //轮询判断
    pointer: number = 0

    //地主牌
    host: number[] = [];

    room:Room = null;

    pokerSize:number = 17;
    constructor(){
        this.allPokers = new Array(54);
        this.host = new Array(3);

    }

    startGame() {
        this.leftPleyer = new Player();
        this.midPleyer = new Player();
        this.rightPleyer = new Player();
        
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
