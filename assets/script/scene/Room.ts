import { DdzGame } from "../DdzGame"
import { Constant } from "./Constant";
import { SelectBoss } from "../prefab/SelectBoss";
import { AiPlayer } from "../AiPlayer";
import { PlayCards } from "../prefab/PlayCards";
import { Timer } from "../prefab/Timer";
import { Manager } from "./Consist";

const { ccclass, property } = cc._decorator;

@ccclass
export class Room extends cc.Component {
    @property(cc.Node)
    animNode: cc.Node = null;

    @property(cc.Node)
    alerNode: cc.Node = null;

    @property(cc.Node)
    readyBtn: cc.Node = null;

    @property(cc.SpriteFrame)
    pokerSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.Node)
    midPoker: cc.Node = null;

    //拖动节点
    @property(cc.Node)
    touchNode: cc.Node = null;

    @property(cc.Prefab)
    playCardPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    selectBossPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    timerPrefab: cc.Prefab = null;

    @property(cc.Label)
    textLabel: cc.Label[] = [];

    @property(cc.Label)
    pokerNum: cc.Label[] = [];

    @property(cc.SpriteFrame)
    boosSpriteframe: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    frameSpriteframe: cc.SpriteFrame = null;

    @property(cc.Sprite)
    playerAve: cc.Sprite[] = [];

    private playCardNode: cc.Node = null;
    private selectBossNode: cc.Node = null;
    private timerNode: cc.Node = null;

    allPoker: cc.Node[] = new Array();
    game: any = null;//逻辑控制
    isauto: boolean = false;//是否托管
    timerCalBak: any;//倒计时回调函数
    private clickstate = Constant.ClickNothing;
    private pokerBeg: number = -1;//选中牌最开始的下标
    private pokerEnd: number = 0;//选中牌结束的下标
    private pokerLeft: number = 0;//手牌最左端坐标
    private touchPokerType: number[] = [-1, -1];

    private isSelect: boolean[] = null;
    private clickIsSelect: boolean = false;

    pos: cc.Vec2[] = null;

    onLoad() {
        Manager.playGameBgmAudio();
        Constant.gameMode = Constant.LxDdzMode;
        for (var i = 0; i < Constant.PokerNum; i++) {
            var node = new cc.Node();
            //调用新建的node的addComponent函数，会返回一个sprite的对象
            node.addComponent(cc.Sprite);
            this.midPoker.addChild(node);
            this.allPoker.push(node);
        }
        this.playCardNode = cc.instantiate(this.playCardPrefab);
        this.alerNode.addChild(this.playCardNode);

        this.selectBossNode = cc.instantiate(this.selectBossPrefab);
        this.alerNode.addChild(this.selectBossNode);

        this.timerNode = cc.instantiate(this.timerPrefab);
        this.alerNode.addChild(this.timerNode);
        this.init();
    }

    init() {
        for (var i = 0; i < Constant.PokerNum; i++) {
            this.allPoker[i].position = new cc.Vec2(0, 0);
            this.allPoker[i].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
        }
        this.midPoker.active = false;
        this.initDdz();
    }

    initDdz() {
        this.game = new DdzGame();
        AiPlayer.game = this.game;

        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);

        this.pos = new Array(3);
        var pos = [[0, -220 + 180], [250 - 50, 50], [-250 + 50, 50]];

        for (var i = 0; i < 3; i++) {
            this.pos[i] = new cc.Vec2(pos[i][0], pos[i][1]);
            this.textLabel[i].node.active = false;
            this.textLabel[i].node.setPosition(this.pos[i]);

            this.pokerNum[i].node.active = false;
            this.pokerNum[i].node.zIndex = 60;

            this.playerAve[i].spriteFrame = this.frameSpriteframe;
        }

        //准备按钮
        this.readyBtn.active = true;

        this.playCardNode.position = new cc.Vec2(0, -80);
        this.playCardNode.active = false;

        this.selectBossNode.position = new cc.Vec2(0, -80);
        this.selectBossNode.active = false;

        this.timerNode.active = false;

        this.pokerLeft = -1 * Math.floor((this.game.pokerSize * Constant.PokerWidth / 5 + Constant.PokerWidth / 4) / 2);//初始化手牌边界
        this.clickIsSelect = false;

        this.timerCalBak = new Array(3);

        this.game.init();
        this.game.room = this;
    }

    initZzh() {

    }

    restart() {
        console.log("重新开始");
        this.game.state = Constant.ready;
        this.readyBtn.active = true;
        this.timerNode.getComponent(Timer).timerStop();
        for (var i = 0; i < Constant.PokerNum; i++) {
            this.allPoker[i].setPosition(0, 0);
            this.allPoker[i].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
            this.allPoker[i].scale = 1;
            this.allPoker[i].active = true;
        }
        for (var i = 0; i < 3; i++) {
            this.roundAnim(i, -1);
        }
        this.playerAve[0].spriteFrame = this.frameSpriteframe;
        this.playerAve[1].spriteFrame = this.frameSpriteframe;
        this.playerAve[2].spriteFrame = this.frameSpriteframe;
        this.midPoker.active = false;
        this.pokerLeft = -1 * Math.floor((this.game.pokerSize * Constant.PokerWidth / 5 + Constant.PokerWidth / 4) / 2);//初始化手牌边界
        this.game.init();
    }

    gettouchuBegIndex(pos: cc.Vec2) {
        var width = Constant.PokerWidth / 5;
        var length = pos.x - this.pokerLeft;
        var index = length / width;
        if (index > this.game.players[this.game.myself].validPokerNum - 1) {
            index = this.game.players[this.game.myself].validPokerNum - 1;
        }
        return Math.floor(index);
    }

    gettouchuEndIndex(pos: cc.Vec2) {
        var width = Constant.PokerWidth / 5;
        var length = pos.x - this.pokerLeft;
        var index = 0;
        var size = Math.floor(this.game.players[this.game.myself].validPokerNum * Constant.PokerWidth / 5 + Constant.PokerWidth / 4);
        if (length < 0) {
            index = 0;
        }
        else if (length > size) {
            index = this.game.players[this.game.myself].validPokerNum - 1;
        }
        else {
            index = length / width;
            if (index > this.game.players[this.game.myself].validPokerNum - 1) {
                index = this.game.players[this.game.myself].validPokerNum - 1;
            }
        }
        return Math.floor(index);
    }

    touchStart(event: cc.Event.EventTouch) {
        if (!this.clickIsSelect) {
            return;
        }
        if (this.clickstate != Constant.ClickNothing) {
            return;
        }
        console.log("connCards");
        this.clickstate = Constant.ClickStart;
        const pos: cc.Vec2 = this.midPoker.convertToNodeSpaceAR(cc.v2(event.getLocationX(), event.getLocationY()));
        var pokerRect = new cc.Rect(this.pokerLeft, -220 - Constant.PokerHeight / 2,
            (this.game.players[this.game.myself].validPokerNum - 1) * Constant.PokerWidth / 5 + Constant.PokerWidth, Constant.PokerHeight);
        if (pokerRect.contains(pos)) {
            var index = this.gettouchuBegIndex(pos);
            this.pokerBeg = index;
            this.pokerEnd = this.pokerBeg;
        }
        else {
            this.initPoker();
            this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = false;
            this.clickstate = Constant.ClickNothing;
        }


    }

    touchMove(event: cc.Event.EventTouch) {
        if (this.clickstate != Constant.ClickStart && this.clickstate != Constant.ClickMoveing) {
            return;
        }
        this.clickstate = Constant.ClickMoveing;

        const pos: cc.Vec2 = this.midPoker.convertToNodeSpaceAR(cc.v2(event.getLocationX(), event.getLocationY()));
        //var pokerRect = new cc.Rect(this.pokerLeft, -220 - Constant.PokerHeight / 2,
        //(this.game.players[this.game.myself].validPokerNum - 1) * Constant.PokerWidth / 5 + Constant.PokerWidth, Constant.PokerHeight);
        var index = this.gettouchuEndIndex(pos);
        this.pokerEnd = index
        var touchBeg = this.pokerBeg;
        var touchEnd = this.pokerEnd;
        if (index > touchBeg) {
            touchEnd = index;
        }
        else {
            touchEnd = touchBeg;
            touchBeg = index;
        }
        //选中变色  106 127 240
        var beg = -1, i = 0;
        for (i = 0; i < this.game.players[this.game.myself].pokers.length; i++) {
            if (this.game.players[this.game.myself].playedPokers[i]) {
                continue;
            }
            var color = new cc.Color(255, 255, 255);
            if (this.allPoker[this.game.players[this.game.myself].pokers[i]].color != color) {
                this.allPoker[this.game.players[this.game.myself].pokers[i]].color = color;
            }
        }
        for (i = 0; i < this.game.players[this.game.myself].pokers.length; i++) {
            if (this.game.players[this.game.myself].playedPokers[i]) {
                continue;
            }
            beg++;
            if (beg == touchBeg) {
                break;
            }
        }
        for (; i < this.game.players[this.game.myself].pokers.length; i++) {
            if (this.game.players[this.game.myself].playedPokers[i]) {
                continue;
            }
            var color = new cc.Color(106, 127, 240);
            if (this.allPoker[this.game.players[this.game.myself].pokers[i]].color != color) {
                this.allPoker[this.game.players[this.game.myself].pokers[i]].color = color;
            }
            beg++;
            if (beg > touchEnd) {
                break;
            }
        }
    }

    touchEnd(event: cc.Event.EventTouch) {
        if (this.clickstate != Constant.ClickMoveing && this.clickstate != Constant.ClickStart) {
            return;
        }
        this.clickstate = Constant.ClickEnd;

        if (this.pokerBeg != -1) {
            var isPlayCard = false;
            if (this.pokerEnd < this.pokerBeg) {
                var temp = this.pokerEnd;
                this.pokerEnd = this.pokerBeg;
                this.pokerBeg = temp;
            }
            //把拖动的牌颜色变回来
            var beg = -1, i = 0;
            for (i = 0; i < this.game.players[this.game.myself].pokers.length; i++) {
                if (this.game.players[this.game.myself].playedPokers[i]) {
                    continue;
                }
                beg++;
                if (beg == this.pokerBeg) {
                    break;
                }
            }
            for (; i < this.game.players[this.game.myself].pokers.length; i++) {
                if (this.game.players[this.game.myself].playedPokers[i]) {
                    continue;
                }
                this.isSelect[i] = !this.isSelect[i];
                var color = new cc.Color(255, 255, 255);
                if (this.allPoker[this.game.players[this.game.myself].pokers[i]].color != color) {
                    this.allPoker[this.game.players[this.game.myself].pokers[i]].color = color;
                }
                beg++;
                if (beg > this.pokerEnd) {
                    break;
                }
            }
            //弹出所有选中的牌
            for (i = 0; i < this.game.players[this.game.myself].pokers.length; i++) {
                if (this.game.players[this.game.myself].playedPokers[i]) {
                    continue;
                }
                if (this.isSelect[i]) {
                    isPlayCard = true;
                    this.allPoker[this.game.players[this.game.myself].pokers[i]].y = -220 + 30;
                }
                else {
                    this.allPoker[this.game.players[this.game.myself].pokers[i]].y = -220;
                }
            }
            if (isPlayCard) {
                var nums = new Array();
                for (i = 0; i < this.game.players[this.game.myself].pokers.length; i++) {
                    if (this.game.players[this.game.myself].playedPokers[i]) {
                        continue;
                    }
                    if (this.isSelect[i]) {
                        nums.push(this.game.players[this.game.myself].pokers[i]);
                    }
                }
                var type = this.game.getPokerTypeAndLevel(nums);
                console.log(type);
                if (type[0] == -1) {
                    this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = false;
                }
                else {
                    if (this.game.state == Constant.playCard) {
                        this.touchPokerType = type;
                        this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = true;
                    }
                    else if (this.game.state == Constant.connCard) {
                        this.touchPokerType = type;
                        console.log("需要出牌的类型 " + this.game.lastTypeAndSize);
                        if (this.game.compTypeAndSize(this.game.lastTypeAndSize, type)) {
                            this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = true;
                        }
                        else {
                            this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = false;
                        }
                    }
                }
            }
            else {
                this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = false;
            }
        }
        this.pokerBeg = -1;
        this.clickstate = Constant.ClickNothing;
    }

    touchCancel(event: cc.Event.EventTouch) {
        this.touchEnd(event);
    }

    //发牌A
    dealCardsA() {
        this.midPoker.active = true;
        var leftPos = [-350, 0];
        var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220];
        var rightPos = [350, 0];
        //发三个玩家牌
        const callbackA = cc.callFunc((target) => {
            var time = 0.3;
            for (var i = 0; i < this.game.pokerSize; i++) {
                this.allPoker[this.game.players[this.game.myself].pokers[i]].zIndex = i;
                this.allPoker[this.game.players[this.game.myself].pokers[i]].runAction(cc.sequence(cc.delayTime(time),
                    cc.moveTo(0.1, midPos[0], midPos[1]), cc.callFunc((target, index: number) => {
                        this.allPoker[index].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[index];
                    }, this, this.game.players[this.game.myself].pokers[i])));
                this.allPoker[this.game.players[(this.game.myself + 1) % 3].pokers[i]].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, rightPos[0], rightPos[1])));
                this.allPoker[this.game.players[(this.game.myself + 2) % 3].pokers[i]].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, leftPos[0], leftPos[1])));
                time += 0.05;
                midPos[0] += Constant.PokerWidth / 5;
            }
        }, this);
        //发地主牌
        const callbackB = cc.callFunc((target) => {


            //发地主牌
            var pos = [[-120, 230], [0, 230], [120, 230]];
            for (var i = 0; i < 3; i++) {
                this.allPoker[this.game.host[i]].runAction(cc.moveTo(0.1, pos[i][0], pos[i][1]));
            }
        }, this);
        //开始叫地主
        const callbackC = cc.callFunc((target, midPos) => {
            this.game.players[this.game.myself].sortPokers();
            midPos[0] = this.pokerLeft + Constant.PokerWidth / 2;
            for (var i = 0; i < this.game.players[this.game.myself].pokers.length; i++) {
                this.allPoker[this.game.players[this.game.myself].pokers[i]].zIndex = i;
                this.allPoker[this.game.players[this.game.myself].pokers[i]].runAction(cc.moveTo(0.2, midPos[0], midPos[1]));
                midPos[0] += Constant.PokerWidth / 5;
            }
            console.log("叫地主开始");

        }, this, midPos);

        //开始叫地主
        const callbackD = cc.callFunc((target) => {
            this.pokerNum[1].node.active = true;
            this.pokerNum[1].node.setPosition(350, -100);
            this.pokerNum[1].string = "17";
            this.pokerNum[2].node.active = true;
            this.pokerNum[2].node.setPosition(-350, -100);
            this.pokerNum[2].string = "17";
            this.game.main(Constant.selectBoss, this.game.firstPlayerId);
        }, this);
        this.midPoker.runAction(cc.sequence(callbackA, cc.delayTime(0.3), callbackB, cc.delayTime(1.0), callbackC, cc.delayTime(0.5), callbackD));
    }

    beforSelectBoss(id: number) {

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
            if (bossTime == 0) {
                this.init();
                return;
            }
            else if (bossTime == 1) {
                this.game.setBoss(this.game.bossId);
                return;
            }
            else if (!this.game.bossState[this.game.firstPlayerId]) {
                this.game.setBoss(this.game.bossId);
                return;
            }
            this.game.bossState[this.game.firstPlayerId] = false;
        }
        else if (this.game.pointer == 4) {
            if (this.game.bossState[this.game.firstPlayerId]) {
                this.game.bossId = this.game.firstPlayerId;
                this.game.setBoss(this.game.bossId);
            }
            else {
                for (var j = 2; j >= 1; j--) {
                    if (this.game.bossState[(this.game.firstPlayerId + j) % 3]) {
                        this.game.bossId = (this.game.firstPlayerId + j) % 3;
                        this.game.setBoss(this.game.bossId);
                        break;
                    }
                }
            }
            return;
        }
        this.game.state = Constant.selectBoss;
        this.game.pointer++;

        if (id == this.game.myself) {
            //出牌显示 设置20s的定时器 如果手动选择则调main 否则在定时器的回调里main  如果首位玩家已经叫了地主后又到了这位玩家
            //继续抢地主则为最终地主 否则最先抢地主的玩家是地主
            var midPos = [-180, -220 + 150];
            this.timerNode.getComponent(Timer).timerStart(midPos);
            this.selectBossNode.active = true;
            this.selectBossNode.getComponent(SelectBoss).init(this.game);
            const callback = cc.callFunc(this.afterSelectBoss, this, id);
            this.timerCalBak[id] = this.alerNode.runAction(cc.sequence(cc.delayTime(20), callback));
        }
        else if (id == (this.game.myself + 1) % 3) {
            var rightPos = [250, 150];
            this.timerNode.getComponent(Timer).timerStart(rightPos);
            if (AiPlayer.selectBoss()) {
                if (this.game.bossId == -1) {
                    this.game.players[id].textType = 1;
                }
                else {
                    this.game.players[id].textType = 2;
                }
                this.game.bossId = id;
                this.game.bossState[id] = true;

            }
            else {
                this.game.bossState[id] = false;
                this.game.players[id].textType = 0;
            }
            const callback = cc.callFunc(this.afterSelectBoss, this, id);
            this.timerCalBak[id] = this.alerNode.runAction(cc.sequence(cc.delayTime(20), callback));
            setTimeout(() => {
                this.selectBossCalbak(id, this.game.bossState[id]);
            }, 500);
        }
        else {
            var leftPos = [-250, 150];
            this.timerNode.getComponent(Timer).timerStart(leftPos);
            if (AiPlayer.selectBoss()) {
                if (this.game.bossId == -1) {
                    this.game.players[id].textType = 1;
                }
                else {
                    this.game.players[id].textType = 2;
                }
                this.game.bossId = id;
                this.game.bossState[id] = true;
            }
            else {
                this.game.bossState[id] = false;
                this.game.players[id].textType = 0;
            }
            const callback = cc.callFunc(this.afterSelectBoss, this, id);
            this.timerCalBak[id] = this.alerNode.runAction(cc.sequence(cc.delayTime(20), callback));
            setTimeout(() => {
                this.selectBossCalbak(id, this.game.bossState[id]);
            }, 500);

        }

    }

    //主动叫地主或不叫
    selectBossCalbak(id: number, isBoss: boolean) {
        if (id == this.game.myself) {
            if (isBoss) {
                var type = 1;
                if (this.game.bossId == -1) {
                    type = 1;
                }
                else {
                    type = 2;
                }
                this.game.bossId = id;
                this.game.bossState[id] = true;
                this.roundAnim(id, type);
            }
            else {
                this.game.bossState[id] = false;
                this.roundAnim(id, 0)
            }
        }
        else if (id == (this.game.myself + 1) % 3) {
            this.roundAnim(id, this.game.players[id].textType)
        }
        else {
            this.roundAnim(id, this.game.players[id].textType)
        }
        this.game.players[id].isOperate = true;
        this.alerNode.stopAction(this.timerCalBak[id]);
        this.game.players[id].isOperate = false;

        this.timerNode.getComponent(Timer).timerStop();
        this.game.main(Constant.selectBoss, (id + 1) % 3);
    }

    afterSelectBoss(target, id: number) {
        if (id == this.game.myself) {
            console.log("setTimeout1");
            if (!this.game.players[id].isOperate) {
                this.selectBossNode.active = false;
                this.game.bossState[id] = false;
                this.roundAnim(id, 0);
            }
            this.game.players[id].isOperate = false;
        }
        else if (id == (this.game.myself + 1) % 3) {
            console.log("setTimeout3");
            this.roundAnim(id, this.game.players[id].textType);
        }
        else {
            //this.textLabelLeft.node.active = true;
            //this.textLabelLeft.string = "";
            console.log("setTimeout3");
            this.roundAnim(id, this.game.players[id].textType);
        }
        this.timerNode.getComponent(Timer).timerStop();
        this.game.main(Constant.selectBoss, (id + 1) % 3);
    }

    beforplayCard(id: number) {
        for (var i = 0; i < 3; i++) {
            this.roundAnim(i, -1);
        }
        if (this.game.players[id].lastPokers != null) {
            for (var i = 0; i < this.game.players[id].lastPokers.length; i++) {
                this.allPoker[this.game.players[id].lastPokers[i]].active = false;
            }
            this.game.players[id].lastPokers = null;
        }

        if (id == this.game.myself) {
        }
        else if (id == (this.game.myself + 1) % 3) {

        }
        else {

        }
        this.game.state = Constant.playCard;
    }

    //出牌
    playCard(id: number) {
        console.log("出牌");
        this.beforplayCard(id);
        this.game.pointer = 0;

        if (id == this.game.myself) {
            this.clickIsSelect = true;

            var midPos = [-180, -220 + 150];
            this.timerNode.getComponent(Timer).timerStart(midPos);
            this.playCardNode.active = true;
            this.playCardNode.getComponent(PlayCards).init(this.game);
            const callback = cc.callFunc(this.afterPlayCard, this, id);
            this.timerCalBak[id] = this.node.runAction(cc.sequence(cc.delayTime(3), callback, cc.delayTime(0.5)));
        }
        else if (id == (this.game.myself + 1) % 3) {
            var rightPos = [250, 150];
            this.timerNode.getComponent(Timer).timerStart(rightPos);

            var nums = new Array();
            for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                if (this.game.players[id].playedPokers[i]) {
                    continue;
                }
                nums.push(this.game.players[id].pokers[i]);
            }
            var pokers = AiPlayer.playCards(nums);
            pokers.sort(this.compareAsc);
            console.log("出牌 poker", pokers);
            this.game.players[id].lastPokers = pokers;


            var j = 0;
            for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                if (this.game.players[id].playedPokers[i]) {
                    continue;
                }
                if (this.game.players[id].lastPokers[j] == this.game.players[id].pokers[i]) {
                    this.game.players[id].playedPokers[i] = true;
                    j++;
                }
                if (j == this.game.players[id].lastPokers.length) {
                    break;
                }
            }

            this.game.players[id].validPokerNum -= this.game.players[id].lastPokers.length;
            this.game.lastTypeAndSize = this.game.getPokerTypeAndLevel(this.game.players[id].lastPokers);


            setTimeout(() => {
                this.playCardCalbak(id, true);
            }, 800);
        }
        else {
            var leftPos = [-250, 150];
            this.timerNode.getComponent(Timer).timerStart(leftPos);

            var nums = new Array();

            for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                if (this.game.players[id].playedPokers[i]) {
                    continue;
                }
                nums.push(this.game.players[id].pokers[i]);
            }

            var pokers = AiPlayer.playCards(nums);
            this.game.players[id].lastPokers = pokers;
            console.log("poker", pokers);
            pokers.sort(this.compareAsc);

            var j = 0;
            for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                if (this.game.players[id].playedPokers[i]) {
                    continue;
                }
                if (this.game.players[id].lastPokers[j] == this.game.players[id].pokers[i]) {
                    this.game.players[id].playedPokers[i] = true;
                    j++;
                }
                if (j == this.game.players[id].lastPokers.length) {
                    break;
                }
            }
            this.game.players[id].validPokerNum -= this.game.players[id].lastPokers.length;
            this.game.lastTypeAndSize = this.game.getPokerTypeAndLevel(this.game.players[id].lastPokers);

            setTimeout(() => {
                this.playCardCalbak(id, true);
            }, 800);

        }
    }

    compareAsc(numA: number, numB: number) {
        var A = numA, B = numB;
        if (A == 1) {
            A += 54;
        }
        else if (A == 0) {
            A += 56;
        }
        if (B == 1) {
            B += 54;
        }
        else if (B == 0) {
            B += 56;
        }
        if (A < B) {
            return -1;
        }
        else {
            return 1;
        }
    }

    //主动出牌
    playCardCalbak(id: number, isPlay: boolean) {
        if (id == this.game.myself) {

        }
        else if (id == (this.game.myself + 1) % 3) {

        }
        else {

        }
        this.game.players[this.game.myself].isOperate = true;
        this.alerNode.stopAction(this.timerCalBak[id]);
        this.game.players[this.game.myself].isOperate = false;
        if (isPlay) {
            this.play(id);
        }
        else {
            this.game.pointer++;
            this.roundAnim(id, 3);
        }
        this.afterPlay(id);
    }

    afterPlayCard(target, id: number) {

        if (id == this.game.myself) {
            var nums = new Array();
            for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                if (this.game.players[id].playedPokers[i]) {
                    continue;
                }
                nums.push(this.game.players[id].pokers[i]);
            }

            var pokers = AiPlayer.playCards(nums);
            pokers.sort(this.compareAsc);
            console.log("出牌poker", pokers);
            this.game.players[id].lastPokers = pokers;


            var j = 0;
            for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                if (this.game.players[id].playedPokers[i]) {
                    continue;
                }
                if (this.game.players[id].lastPokers[j] == this.game.players[id].pokers[i]) {
                    this.game.players[id].playedPokers[i] = true;
                    j++;
                }
                if (j == this.game.players[id].lastPokers.length) {
                    break;
                }
            }

            var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220 + 180];
            var left = -1 * Math.floor((pokers.length * Constant.PokerWidth / 8 + Constant.PokerWidth * 0.8) / 2);
            midPos[0] = left + Constant.PokerWidth / 2;
            for (i = 0; i < pokers.length; i++) {
                this.allPoker[pokers[i]].setPosition(midPos[0], midPos[1]);
                this.allPoker[pokers[i]].scale = 0.7;
                midPos[0] += Constant.PokerWidth / 8;
            }
            this.game.players[id].validPokerNum -= pokers.length;
            this.game.lastTypeAndSize = this.game.getPokerTypeAndLevel(this.game.players[id].lastPokers);


            if (this.game.players[id].validPokerNum == 0) {
                //游戏结束
                setTimeout(() => {
                    this.restart();
                }, 2000);

            }
        }
        else if (id == (this.game.myself + 1) % 3) {

        }

        else {

        }
        this.afterPlay(id);
    }

    afterConnCard(target, id: number) {

        if (id == this.game.myself) {
            var nums = new Array();
            for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                if (this.game.players[id].playedPokers[i]) {
                    continue;
                }
                nums.push(this.game.players[id].pokers[i]);
            }


            console.log("this.game.lastTypeAndSize", this.game.lastTypeAndSize);
            var pokers = AiPlayer.connCards(nums, this.game.lastTypeAndSize);
            pokers.sort(this.compareAsc);
            this.game.players[id].lastPokers = pokers;
            console.log("poker", pokers);

            if (pokers.length == 0) {
                this.roundAnim(id, 3);
                this.game.pointer++;
            }
            else {
                this.game.pointer = 0;
                var j = 0;
                for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                    if (this.game.players[id].playedPokers[i]) {
                        continue;
                    }
                    if (this.game.players[id].lastPokers[j] == this.game.players[id].pokers[i]) {
                        this.game.players[id].playedPokers[i] = true;
                        j++;
                    }
                }
                this.game.players[id].validPokerNum -= this.game.players[id].lastPokers.length;

                var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220 + 180];
                var left = -1 * Math.floor((nums.length * Constant.PokerWidth / 5 + Constant.PokerWidth * 0.8) / 2 * 0.7);
                midPos[0] = left + Constant.PokerWidth / 2 * 0.7;
                for (i = 0; i < this.game.players[id].lastPokers.length; i++) {
                    this.allPoker[this.game.players[id].lastPokers[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.game.players[id].lastPokers[i]];
                    this.allPoker[this.game.players[id].lastPokers[i]].zIndex = i;
                    this.allPoker[this.game.players[id].lastPokers[i]].setPosition(midPos[0], midPos[1]);
                    this.allPoker[this.game.players[id].lastPokers[i]].scale = 0.7;
                    midPos[0] += Constant.PokerHeight / 5 * 0.7;
                }
                this.game.lastTypeAndSize = this.game.getPokerTypeAndLevel(this.game.players[id].lastPokers);
            }
        }
        else if (id == (this.game.myself + 1) % 3) {

        }

        else {

        }
        this.afterPlay(id);
    }



    afterPlay(id: number) {
        this.clickIsSelect = false;
        this.clickstate = Constant.ClickNothing;

        this.playCardNode.active = false;

        if (id == this.game.myself) {
            this.initPoker();
        }
        else if (id == (this.game.myself + 1) % 3) {
            this.pokerNum[1].string = this.game.players[id].validPokerNum.toString();
        }
        else {
            this.pokerNum[2].string = this.game.players[id].validPokerNum.toString();
        }

        if (this.game.players[id].validPokerNum == 0) {
            //游戏结束
            console.log("有效 " + this.game.players[id].validPokerNum);
            setTimeout(() => {
                this.restart();
            }, 2000);
            return;
        }
        setTimeout(() => {
            this.game.main(Constant.connCard, (id + 1) % 3);
        }, 500);

    }


    beforConnCard(id: number) {

    }

    //接牌
    connCard(id: number) {
        console.log("接牌");
        if (this.game.pointer == 2) {
            this.game.main(Constant.playCard, id);
            return;
        }

        if (this.game.players[id].lastPokers != null) {
            for (var i = 0; i < this.game.players[id].lastPokers.length; i++) {
                this.allPoker[this.game.players[id].lastPokers[i]].active = false;
            }
        }
        this.game.state = Constant.connCard;

        if (id == this.game.myself) {
            this.clickIsSelect = true;
            var midPos = [-180, -220 + 150];
            this.timerNode.getComponent(Timer).timerStart(midPos);
            this.playCardNode.active = true;
            this.playCardNode.getComponent(PlayCards).init(this.game);
            const callback = cc.callFunc(this.afterConnCard, this, id);
            this.timerCalBak[id] = this.node.runAction(cc.sequence(cc.delayTime(3), callback, cc.delayTime(0.5)));
        }
        else if (id == (this.game.myself + 1) % 3) {
            var rightPos = [250, 150];
            this.timerNode.getComponent(Timer).timerStart(rightPos);

            var isPlay: boolean = false;
            var nums = new Array();
            for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                if (this.game.players[id].playedPokers[i]) {
                    continue;
                }
                nums.push(this.game.players[id].pokers[i]);
            }

            console.log("this.game.lastTypeAndSize", this.game.lastTypeAndSize);
            var pokers = AiPlayer.connCards(nums, this.game.lastTypeAndSize);
            this.game.players[id].lastPokers = pokers;
            console.log("poker", pokers);

            if (this.game.players[id].lastPokers.length == 0) {
                isPlay = false;
            }
            else {
                isPlay = true;
                var j = 0;
                for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                    if (this.game.players[id].playedPokers[i]) {
                        continue;
                    }
                    if (this.game.players[id].lastPokers[j] == this.game.players[id].pokers[i]) {
                        this.game.players[id].playedPokers[i] = true;
                        j++;
                    }
                    if (j == this.game.players[id].lastPokers.length) {
                        break;
                    }
                }
                this.game.players[id].validPokerNum -= this.game.players[id].lastPokers.length;
                this.game.lastTypeAndSize = this.game.getPokerTypeAndLevel(this.game.players[id].lastPokers);
            }

            setTimeout(() => {
                this.playCardCalbak(id, isPlay);
            }, 800);
        }
        else {
            var leftPos = [-250, 150];
            this.timerNode.getComponent(Timer).timerStart(leftPos);

            var isPlay: boolean = false;
            var nums = new Array();
            for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                if (this.game.players[id].playedPokers[i]) {
                    continue;
                }
                nums.push(this.game.players[id].pokers[i]);
            }

            console.log("this.game.lastTypeAndSize", this.game.lastTypeAndSize);
            var pokers = AiPlayer.connCards(nums, this.game.lastTypeAndSize);
            this.game.players[id].lastPokers = pokers;
            console.log("poker", pokers);

            if (this.game.players[id].lastPokers.length == 0) {
                isPlay = false;
            }
            else {
                isPlay = true;
                var j = 0;
                for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                    if (this.game.players[id].playedPokers[i]) {
                        continue;
                    }
                    if (this.game.players[id].lastPokers[j] == this.game.players[id].pokers[i]) {
                        this.game.players[id].playedPokers[i] = true;
                        j++;
                    }
                    if (j == this.game.players[id].lastPokers.length) {
                        break;
                    }
                }
                this.game.players[id].validPokerNum -= this.game.players[id].lastPokers.length;
                this.game.lastTypeAndSize = this.game.getPokerTypeAndLevel(this.game.players[id].lastPokers);
            }

            setTimeout(() => {
                this.playCardCalbak(id, isPlay);
            }, 800);
        }
    }



    setBoss(id: number) {
        //翻开地主牌
        const callbackA = cc.callFunc(() => {
            for (var i = 0; i < this.game.host.length; i++) {
                this.allPoker[this.game.host[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.game.host[i]];
            }

        }, this);
        var callbackB;
        if (id == this.game.myself) {
            this.pokerLeft = -1 * Math.floor((this.game.players[id].validPokerNum * Constant.PokerWidth / 5 + Constant.PokerWidth / 4) / 2);//初始化手牌边界
            this.playerAve[0].spriteFrame = this.boosSpriteframe;

            //移动手牌到指定位置 把地主拍放入手中
            callbackB = cc.callFunc(() => {
                var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220];
                var pos: number[] = new Array(6);
                this.game.host.sort(this.game.players[0].compareAsc);
                var j = 0;
                for (var i = 0; i < this.game.players[id].pokers.length; i++) {
                    this.allPoker[this.game.players[id].pokers[i]].zIndex = i;
                    if (this.game.players[id].pokers[i] == this.game.host[j]) {
                        pos[j * 2] = midPos[0];
                        pos[j * 2 + 1] = midPos[1];
                        j++;
                    }
                    else {
                        this.allPoker[this.game.players[id].pokers[i]].runAction(cc.moveTo(0.4, midPos[0], midPos[1]));
                    }
                    midPos[0] += Constant.PokerWidth / 5;
                }
                for (var i = 0; i < this.game.host.length; i++) {
                    this.allPoker[this.game.host[i]].runAction(cc.sequence(cc.delayTime(0.3), cc.moveTo(0.4, pos[i * 2], pos[i * 2 + 1])));
                }

            }, this);
        }
        else if (id == (this.game.myself + 1) % 3) {
            callbackB = cc.callFunc(() => {
                this.playerAve[1].spriteFrame = this.boosSpriteframe;
                var rightPos = [350, 0];
                this.pokerNum[1].string = this.game.players[1].validPokerNum.toString();
                for (var i = 0; i < this.game.host.length; i++) {
                    this.allPoker[this.game.host[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
                    this.allPoker[this.game.host[i]].runAction(cc.moveTo(0.2, rightPos[0], rightPos[1]));
                }

            }, this);
        }
        else {
            callbackB = cc.callFunc(() => {
                this.playerAve[2].spriteFrame = this.boosSpriteframe;
                var leftPos = [-350, 0];
                this.pokerNum[2].string = this.game.players[2].validPokerNum.toString();
                for (var i = 0; i < this.game.host.length; i++) {
                    this.allPoker[this.game.host[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
                    this.allPoker[this.game.host[i]].runAction(cc.moveTo(0.2, leftPos[0], leftPos[1]));
                }

            }, this);
        }
        const callbackC = cc.callFunc((target) => {
            for (var i = 0; i < 3; i++) {
                this.roundAnim(i, -1);
            }
            this.isSelect = new Array(this.game.players[this.game.myself].pokers.length);
            this.game.main(Constant.playCard, this.game.bossId);//出牌
        }, this);
        this.midPoker.runAction(cc.sequence(cc.delayTime(0.5), callbackA, cc.delayTime(1), callbackB, callbackC))

    }



    //0不出 1叫地主 2抢地主 
    roundAnim(id: number, type: number) {
        if (type == -1) {
            this.textLabel[id].node.active = false;
            return;
        }
        var text: string;
        switch (type) {
            case 0:
                text = "不叫";
                break;
            case 1:
                text = "叫地主";
                break;
            case 2:
                text = "抢地主";
                break;
            case 3:
                text = "不出";
                break;
        }
        this.textLabel[id].node.active = true;
        this.textLabel[id].string = text;
    }

    play(id: number) {
        var leftPos = [-250 + 135, 100];
        var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220 + 180];
        var rightPos = [250 - 135, 100];

        if (id == this.game.myself) {


            var nums = new Array();
            var i = 0;
            for (i = 0; i < this.game.players[id].pokers.length; i++) {
                if (this.game.players[id].playedPokers[i]) {
                    continue;
                }
                if (this.isSelect[i]) {
                    this.game.players[id].playedPokers[i] = true;
                    nums.push(this.game.players[id].pokers[i]);
                }
            }

            var left = -1 * Math.floor((nums.length * Constant.PokerWidth / 8 + Constant.PokerWidth * 0.8) / 2);
            midPos[0] = left + Constant.PokerWidth / 2;
            for (i = 0; i < nums.length; i++) {
                this.allPoker[nums[i]].setPosition(midPos[0], midPos[1]);
                this.allPoker[nums[i]].scale = 0.7;
                midPos[0] += Constant.PokerWidth / 8;
            }

            this.game.players[id].lastPokers = nums;
            this.game.players[id].validPokerNum -= nums.length;


        }
        else if (id == (this.game.myself + 1) % 3) {

            var left = Math.floor((this.game.players[id].lastPokers.length * Constant.PokerHeight / 8 + Constant.PokerHeight * 0.8) / 2);//初始化手牌边界
            rightPos[0] = left + Constant.PokerWidth / 2;
            for (i = 0; i < this.game.players[id].lastPokers.length; i++) {
                this.allPoker[this.game.players[id].lastPokers[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.game.players[id].lastPokers[i]];
                this.allPoker[this.game.players[id].lastPokers[i]].zIndex = this.game.players[id].lastPokers.length - i;
                this.allPoker[this.game.players[id].lastPokers[i]].setPosition(rightPos[0], rightPos[1]);
                this.allPoker[this.game.players[id].lastPokers[i]].scale = 0.7;
                rightPos[0] -= Constant.PokerHeight / 8;
            }

        }
        else {
            var left = Math.floor((this.game.players[id].lastPokers.length * Constant.PokerHeight / 8 + Constant.PokerHeight * 0.8) / 2);//初始化手牌边界
            leftPos[0] = -1 * (left + Constant.PokerWidth / 2);
            for (i = 0; i < this.game.players[id].lastPokers.length; i++) {
                this.allPoker[this.game.players[id].lastPokers[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.game.players[id].lastPokers[i]];
                this.allPoker[this.game.players[id].lastPokers[i]].zIndex = i;
                this.allPoker[this.game.players[id].lastPokers[i]].setPosition(leftPos[0], leftPos[1]);
                this.allPoker[this.game.players[id].lastPokers[i]].scale = 0.7;
                leftPos[0] += Constant.PokerHeight / 8;
            }
        }

    }


    initPoker() {

        var newLefet = -1 * Math.floor((this.game.players[this.game.myself].validPokerNum * Constant.PokerWidth / 5 + Constant.PokerWidth * 0.8) / 2);//初始化手牌边界
        this.pokerLeft = newLefet;
        var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220];
        for (var i = 0; i < this.game.players[this.game.myself].pokers.length; i++) {
            if (this.game.players[this.game.myself].playedPokers[i]) {
                continue;
            }
            this.allPoker[this.game.players[this.game.myself].pokers[i]].color = cc.color(255, 255, 255);
            this.allPoker[this.game.players[this.game.myself].pokers[i]].setPosition(midPos[0], midPos[1]);
            midPos[0] += Constant.PokerWidth / 5;
        }
        for (var i = 0; i < this.isSelect.length; i++) {
            this.isSelect[i] = false;
        }

    }

    //发牌B
    dealCardsB() {

    }

    //发牌特效
    dealCardsAnim() {

    }

    //重新显示我的手牌
    showPoker() {
        var index = 0, i = 0;
        var size = Math.floor(this.game.players[this.game.myself].pokers.length * Constant.PokerWidth / 5 + Constant.PokerWidth / 4);
        var pos = [-1 * size / 2 + Constant.PokerWidth / 2, -220];
        for (var i = 0; i < this.game.pokerSize; i++) {
            if (this.game.players[this.game.myself].playedPokers[i]) {
                continue;
            }
            this.allPoker[this.game.pokerSize + i].runAction(cc.sequence(cc.moveTo(0.05, pos[0], pos[1])));
            pos[0] += Constant.PokerWidth / 5;
        }
    }

    onClickReady() {
        if (this.clickstate == Constant.ClickStart) {
            return;
        }
        this.clickstate = Constant.ClickStart;
        this.readyBtn.active = false;
        this.game.startGame();
        Manager.playStartBtnAudio();
        this.clickstate = Constant.ClickNothing;
    }

    onClickQuit() {
        if (this.clickstate == Constant.ClickStart) {
            return;
        }
        this.clickstate = Constant.ClickStart;
        this.onDestroy();
        cc.director.loadScene("Loading");
    }

    onDestroy() {

    }
}
