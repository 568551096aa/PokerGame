import { DdzGame } from "../DdzGame"
import { Constant } from "./Constant";

const { ccclass, property } = cc._decorator;

@ccclass
export class Room extends cc.Component {
    @property(cc.Node)
    myPokersNode: cc.Node = null;

    @property(cc.Node)
    leftPokersNode: cc.Node = null;

    @property(cc.Node)
    rightPokersNode: cc.Node = null;

    @property(cc.Node)
    readyBtn: cc.Node = null;

    @property(cc.SpriteFrame)
    pokerSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.Node)
    midPoker: cc.Node = null;

    allPoker: cc.Node[] = new Array();
    //逻辑控制
    game: any = null;

    clickstate: boolean = false;
    onLoad() {
        for (var i = 0; i < Constant.PokerNum; i++) {
            var node = new cc.Node();
            //调用新建的node的addComponent函数，会返回一个sprite的对象
            const sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = this.pokerSpriteFrame[54];
            this.midPoker.addChild(node);
            this.allPoker.push(node);
        }
        if (Constant.isDdz()) {
            this.initDdz();
        }
        else if (Constant.isZzh()) {

        }
    }

    initDdz() {
        this.readyBtn.active = true;
        this.game = new DdzGame();
    }

    initZzh() {

    }

    //发牌A
    dealCardsA() {
        this.midPoker.active = true;
        var leftPos = [];
        var midPos = [-178, -160];
        var rightPos = [];
        var time = 0.3;
        for (var i = 0; i < this.game.pokerSize; i++) {
            const callbackA = cc.callFunc((target, index: number) => {
                this.allPoker[this.game.pokerSize + index].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[index];
            }, this, i);
            const callbackB = cc.callFunc((target, index: number) => {
                this.allPoker[this.game.pokerSize + index].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[index];
            }, this, i);
            const callbackC = cc.callFunc((target, index: number) => {
                this.allPoker[this.game.pokerSize + index].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[index];
            }, this, i);
            this.allPoker[i].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, midPos[0], midPos[1]), callbackB));
            this.allPoker[this.game.pokerSize + i].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, midPos[0], midPos[1]), callbackB));
            this.allPoker[2 * this.game.pokerSize + i].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, midPos[0], midPos[1]), callbackB));
            time += 0.1;
            midPos[0] += Constant.PokerWidth / 5;
        }
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

    onClickReady() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.readyBtn.active = false;
        this.midPoker.active = true;
        this.game.startGame();
        this.dealCardsA();
        this.clickstate = false;
    }

    onClickQuit() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        cc.director.loadScene("Home");
    }
}
