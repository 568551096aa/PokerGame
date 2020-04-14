import { DdzGame } from "../DdzGame"
import { Constant } from "./Constant";
import { SelectBoss } from "../prefab/SelectBoss";
import { AiPlayer } from "../AiPlayer";

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

    @property(cc.Node)
    timer: cc.Node = null;

    @property(cc.Prefab)
    PlayCardPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    SelectBossPrefab: cc.Prefab = null;

    private playCardNode: cc.Node = null;

    private selectBossNode: cc.Node = null;

    allPoker: cc.Node[] = new Array();
    //逻辑控制
    game: any = null;

    //手动操作
    handOperate: boolean = true;

    //是否托管
    isauto: boolean = false;

    //倒计时回调函数id
    setTimeOutId: number = 0;

    //倒计时秒数
    private timerNum: number = 20;

    clickstate: boolean = false;
    onLoad() {
        for (var i = 0; i < Constant.PokerNum; i++) {
            var node = new cc.Node();
            //调用新建的node的addComponent函数，会返回一个sprite的对象
            const sprite = node.addComponent(cc.Sprite);
            this.midPoker.addChild(node);
            this.allPoker.push(node);
        }
        this.game = new DdzGame();
        this.init();
    }

    init() {
        for (var i = 0; i < Constant.PokerNum; i++) {
            this.allPoker[i].position.x = 0;
            this.allPoker[i].position.y = 0;
            this.allPoker[i].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
        }
        this.midPoker.active = false;
        if (Constant.isDdz()) {
            this.initDdz();
        }
        else if (Constant.isZzh()) {

        }
        this.game.init();
    }

    initDdz() {
        this.readyBtn.active = true;
        this.playCardNode = cc.instantiate(this.PlayCardPrefab);
        this.node.addChild(this.playCardNode);
        this.playCardNode.position = new cc.Vec2(0, -30);
        this.playCardNode.active = false;

        this.selectBossNode = cc.instantiate(this.SelectBossPrefab);
        this.node.addChild(this.selectBossNode);
        this.selectBossNode.position = new cc.Vec2(0, -30);
        this.selectBossNode.active = false;

        this.game.myself = 0;

    }

    initZzh() {

    }

    //发牌A
    dealCardsA() {
        this.midPoker.active = true;
        var leftPos = [-200, 0];
        var midPos = [-178, -220];
        var rightPos = [200, 0];
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
            this.allPoker[i].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, leftPos[0], leftPos[1]), callbackA));
            this.allPoker[this.game.pokerSize + i].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, midPos[0], midPos[1]), callbackB));
            this.allPoker[2 * this.game.pokerSize + i].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, rightPos[0], rightPos[1]), callbackC));
            time += 0.1;
            midPos[0] += Constant.PokerWidth / 5;
            console.log(i);
            //发地主牌
            if (i == this.game.pokerSize - 1) {
                var pos = [[-120, 230], [0, 230], [120, 230]];
                for (var j = 3; j >= 1; j--) {
                    this.allPoker[Constant.PokerNum - j].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, pos[j - 1][0], pos[j - 1][1]), cc.callFunc((target, index: number) => {
                        this.allPoker[index].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[index];
                    }, this, Constant.PokerNum - j)
                    ));
                }
                time += 0.1;
                //开始叫地主
                const callback = cc.callFunc(() => {
                    this.main(0, 0);
                });
                this.node.runAction(cc.sequence(cc.delayTime(time), callback));
            }
        }
    }

    /*
    type: 0 叫地主 1出牌 2接牌
    type 0: id 叫地主人的id
    type 1: id 出牌人的id
    type 2: id 接牌牌人的id
    */
    main(type: number, id: number) {
        console.log("main" + type + " " + id);
        this.game.players[id].isOperate = false;
        switch (type) {
            case 0:
                this.setTimerPos(id);
                this.selectBoss(id);
                break;
            case 1:
                this.playCards(id);
                this.setTimerPos(id);
                break;
            case 2:
                this.setTimerPos(id);
                break;
            default:
                cc.director.loadScene("Home");
                break;
        }
    }

    //叫地主
    selectBoss(id: number) {
        console.log(this.game.pointer);
        if (this.game.pointer == 3) {
            var bossTime = 0;
            for (var i = 0; i < 3; i++) {
                if (this.game.bossState[i]) {
                    bossTime++;
                }
            }
            if(bossTime == 0){
                this.init();
                return;
            }
            else if (bossTime == 1) {
                this.main(1, id);//出牌
            }
        }
        else if (this.game.pointer == 4) {
            if (this.game.firstPlayerId == this.game.boosId) {
                this.main(1, this.game.firstPlayerId);//出牌
            }
            else {
                for (var j = 1; j <= 2; j++) {
                    if (this.game.bossState[(this.game.boosId + j) % 3]) {
                        this.game.bossId = (this.game.boosId + j) % 3;
                        this.main(1, this.game.bossId);//出牌
                        return;
                    }
                }
            }
            return;
        }
        this.timerStart();
        if (id == this.game.myself) {
            //出牌显示 设置20s的定时器 如果手动选择则调main 否则在定时器的回调里main  如果首位玩家已经叫了地主后又到了这位玩家
            //继续抢地主则为最终地主 否则最先抢地主的玩家是地主
            this.selectBossNode.active = true;
            this.selectBossNode.getComponent(SelectBoss).init(this.game);
            this.setTimeOutId = setTimeout(() => {
                if (!this.game.players[id].isOperate) {
                    this.selectBossNode.active = false;
                    this.main(0, (id + 1) % 3);
                }
            }, 20000);
        }
        else {
            if (AiPlayer.selectBoss()) {
                if (this.game.boosId == -1) {
                    this.game.bossId = id;
                }
                this.game.bossState[id] = true;
            }
            else {
                this.game.bossState[id] = false;
            }
            this.main(0, (id + 1) % 3);
            this.timerStop();
        }
        this.game.pointer++;
    }

    //出牌
    playCards(id: number) {
        this.timerStart();
        console.log("出牌");
        if (id == this.game.myself) {

        }
        else {
            //ai出牌
        }
    }


    //设置定时器位置
    setTimerPos(id: number) {
        if (id == this.game.myself) {
            this.timer.position.x = 0;
            this.timer.position.y = 0;
        }
        else {
            this.timer.position.x = 0;
            this.timer.position.y = 0;
        }
    }



    //开始倒计时
    timerStart() {
        this.timer.active = true;
        this.schedule(this.timerFunc, 1, 19, 1);
    }

    timerFunc() {
        this.timer.getChildByName("Num").getComponent(cc.Label).string = this.timerNum.toString();
        this.timerNum--;
    }

    //倒计时结束

    //关闭倒计时
    timerStop() {
        this.timer.active = false;
        this.unschedule(this.timerFunc);
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
