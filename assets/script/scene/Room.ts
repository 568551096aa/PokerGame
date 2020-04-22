import { DdzGame } from "../DdzGame"
import { Constant } from "./Constant";
import { SelectBoss } from "../prefab/SelectBoss";
import { AiPlayer } from "../AiPlayer";
import { PlayCards } from "../prefab/PlayCards";

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

    //拖动节点
    @property(cc.Node)
    pokerNode: cc.Node = null;

    @property(cc.Node)
    timer: cc.Node = null;

    @property(cc.Prefab)
    PlayCardPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    SelectBossPrefab: cc.Prefab = null;

    private playCardNode: cc.Node = null;
    private selectBossNode: cc.Node = null;
    allPoker: cc.Node[] = new Array();
    game: any = null;//逻辑控制
    isauto: boolean = false;//是否托管
    setTimeOutId: number = 0;//倒计时回调函数id
    private timerNum: number = 20;//倒计时秒数
    private clickstate = Constant.ClickNothing;
    private pokerBeg: number = -1;//选中牌最开始的下标
    private pokerEnd: number = 0;//选中牌结束的下标
    private pokerLeft: number = 0;//手牌最左端坐标

    private isSelect: boolean[] = null;
    private clickIsSelect: boolean = false;

    onLoad() {
        for (var i = 0; i < Constant.PokerNum; i++) {
            var node = new cc.Node();
            //调用新建的node的addComponent函数，会返回一个sprite的对象
            node.addComponent(cc.Sprite);
            this.midPoker.addChild(node);
            this.allPoker.push(node);
        }
        if (Constant.isDdz()) {
            this.playCardNode = cc.instantiate(this.PlayCardPrefab);
            this.node.addChild(this.playCardNode);

            this.selectBossNode = cc.instantiate(this.SelectBossPrefab);
            this.node.addChild(this.selectBossNode);
        }
        else if (Constant.isZzh()) {

        }
        this.init();
    }

    init() {
        for (var i = 0; i < Constant.PokerNum; i++) {
            this.allPoker[i].position = new cc.Vec2(0, 0);
            this.allPoker[i].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
        }
        this.midPoker.active = false;
        if (Constant.isDdz()) {
            this.initDdz();
        }
        else if (Constant.isZzh()) {

        }
    }

    initDdz() {
        this.game = new DdzGame();

        this.pokerNode.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.pokerNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.pokerNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.pokerNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);

        //准备按钮
        this.readyBtn.active = true;

        this.playCardNode.position = new cc.Vec2(0, -30);
        this.playCardNode.active = false;

        this.selectBossNode.position = new cc.Vec2(0, -30);
        this.selectBossNode.active = false;

        this.game.myself = 0;
        this.pokerLeft = -1 * Math.floor((this.game.pokerSize * Constant.PokerWidth / 5 + Constant.PokerWidth / 4) / 2);//初始化手牌边界
        this.isSelect = new Array(this.game.pokerSie);
        this.clickIsSelect = false;

        this.game.init();
        this.game.room = this;
    }

    initZzh() {

    }

    restart() {
        console.log("重新开始");
        this.readyBtn.active = true;
        for (var i = 0; i < Constant.PokerNum; i++) {
            this.allPoker[i].position = new cc.Vec2(0, 0);
            this.allPoker[i].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
            this.allPoker[i].active = true;

        }
        this.midPoker.active = false;
        if (Constant.isDdz()) {
            this.pokerLeft = -1 * Math.floor((this.game.pokerSize * Constant.PokerWidth / 5 + Constant.PokerWidth / 4) / 2);//初始化手牌边界
            for (var i = 0; i < this.isSelect.length; i++) {
                this.isSelect[i] = false;
            }
            this.game.init();
        }
        else if (Constant.isZzh()) {

        }
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
        console.log("connCards");
        if (this.clickstate != Constant.ClickNothing) {
            return;
        }
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
            if (this.allPoker[this.game.pokerSize + i].color != color) {
                this.allPoker[this.game.pokerSize + i].color = color;
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
            if (this.allPoker[this.game.pokerSize + i].color != color) {
                this.allPoker[this.game.pokerSize + i].color = color;
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
                if (this.allPoker[this.game.pokerSize + i].color != color) {
                    this.allPoker[this.game.pokerSize + i].color = color;
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
                    this.allPoker[this.game.pokerSize + i].y = -220 + 30;
                }
                else {
                    this.allPoker[this.game.pokerSize + i].y = -220;
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
                        this.game.typeAndSize = type;
                        this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = true;
                    }
                    else if (this.game.state == Constant.connCard) {
                        this.game.typeAndSize = type;
                        this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = true;
                        /*if (type[0] == this.game.typeAndSize[0] && type[1] > this.game.typeAndSize[1]) {
                            this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = true;
                        }
                        else {

                        }*/
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
        var leftPos = [-250, 0];
        var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220];
        var rightPos = [250, 0];
        var time = 0.3;
        for (var i = 0; i < this.game.pokerSize; i++) {
            const callbackB = cc.callFunc((target, index: number) => {
                index = this.game.pokerSize + index;
                this.allPoker[index].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.game.allPokers[index]];
                this.game.players[this.game.myself].pokers = this.game.allPokers.slice(this.game.pokerSize, this.game.pokerSize + this.game.pokerSize);

            }, this, i);
            this.allPoker[i].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, leftPos[0], leftPos[1])));
            this.allPoker[this.game.pokerSize + i].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, midPos[0], midPos[1]), callbackB));
            this.allPoker[2 * this.game.pokerSize + i].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, rightPos[0], rightPos[1])));
            time += 0.1;
            midPos[0] += Constant.PokerWidth / 5;
            //发地主牌
            if (i == this.game.pokerSize - 1) {
                var pos = [[-120, 230], [0, 230], [120, 230]];
                for (var j = 3; j >= 1; j--) {
                    this.allPoker[Constant.PokerNum - j].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, pos[j - 1][0], pos[j - 1][1]), cc.callFunc((target, index: number) => {
                        this.allPoker[index].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.game.allPokers[index]];
                    }, this, Constant.PokerNum - j)
                    ));
                }

                time += 0.1;
                //开始叫地主
                const callback = cc.callFunc(() => {
                    this.game.players[this.game.myself].sortPokers();
                    for (var j = 0; j < this.game.players[this.game.myself].pokers.length; j++) {
                        var index = this.game.players[this.game.myself].pokers[j];
                        this.allPoker[this.game.pokerSize + j].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[index];
                    }
                    console.log("叫地主开始");
                    this.game.main(Constant.selectBoss, this.game.firstPlayerId);
                });
                this.node.runAction(cc.sequence(cc.delayTime(time), callback));
            }
        }
    }

    //叫地主
    selectBoss(id: number) {
        if (this.game.pointer == 3) {
            var bossTime = 0;
            for (var i = 0; i < 3; i++) {
                if (this.game.bossState[i]) {
                    bossTime++;
                }
            }
            console.log("bossTime " + bossTime + " bossId " + this.game.bossId);
            if (bossTime == 0) {
                this.init();
                return;
            }
            else if (this.game.bossId != this.game.firstPlayerId && bossTime >= 1) {
                this.game.setBoss(this.game.bossId);
                return;
            }
            this.game.bossState[this.game.firstPlayerId] = false;
        }
        else if (this.game.pointer == 4) {
            if (this.game.bossState[this.game.firstPlayerId]) {
                this.game.setBoss(this.game.bossId);
            }
            else {
                for (var j = 1; j <= 2; j++) {
                    if (this.game.bossState[(this.game.firstPlayerId + j) % 3]) {
                        this.game.bossId = (this.game.firstPlayerId + j) % 3;
                        this.game.setBoss(this.game.bossId);
                        break;
                    }
                }
            }
            return;
        }
        this.timerStart();
        this.game.state = Constant.selectBoss;
        if (id == this.game.myself) {
            //出牌显示 设置20s的定时器 如果手动选择则调main 否则在定时器的回调里main  如果首位玩家已经叫了地主后又到了这位玩家
            //继续抢地主则为最终地主 否则最先抢地主的玩家是地主
            this.selectBossNode.active = true;
            this.selectBossNode.getComponent(SelectBoss).init(this.game);
            this.setTimeOutId = setTimeout(() => {
                if (!this.game.players[id].isOperate) {
                    this.selectBossNode.active = false;
                    this.game.main(Constant.selectBoss, (id + 1) % 3);
                }
                this.game.players[id].isOperate = false;
            }, 20000);
        }
        else {
            if (AiPlayer.selectBoss()) {
                console.log("地主 " + id);
                if (this.game.bossId == -1) {
                    this.game.bossId = id;
                }
                this.game.bossState[id] = true;
            }
            else {
                console.log("不叫 " + id);
                this.game.bossState[id] = false;
            }
            this.setTimeOutId = setTimeout(() => {
                this.timerStop();
                this.game.main(Constant.selectBoss, (id + 1) % 3);
            }, 100);
        }
        this.game.pointer++;
    }

    //出牌
    playCard(id: number) {
        this.timerStart();
        this.game.state = Constant.playCard;
        this.game.pointer = 0;//轮询置为0
        console.log("出牌");
        if (id == this.game.myself) {
            this.clickIsSelect = true;
            this.playCardNode.active = true;
            this.playCardNode.getComponent(PlayCards).init(this.game);
            this.setTimeOutId = setTimeout(() => {
                if (!this.game.players[id].isOperate) {
                    this.afterPlay(id);
                }

            }, 20000);
        }
        else {
            var nums = new Array;
            //nums = AiPlayer.playCards(new Array);
            if (!nums.length) {

            }
            else {

            }
            //ai出牌
            this.setTimeOutId = setTimeout(() => {
                this.timerStop();
                this.game.main(Constant.connCard, (id + 1) % 3);
            }, 100);
        }
    }



    //接牌
    connCard(id: number) {
        if (this.game.pointer == 2) {
            this.game.main(Constant.playCard, id);
            return;
        }
        this.timerStart();
        this.game.state = Constant.connCard;
        console.log("接牌");
        if (id == this.game.myself) {
            this.clickIsSelect = true;
            this.playCardNode.active = true;
            this.playCardNode.getComponent(PlayCards).init(this.game);
            this.setTimeOutId = setTimeout(() => {
                if (!this.game.players[id].isOperate) {
                    this.afterPlay(id);
                }
            }, 20000);
        }
        else {
            var nums = new Array;
            // nums = AiPlayer.connCards(new Array, new Array);
            if (!nums.length) {

            }
            else {

            }
            //ai出牌
            this.setTimeOutId = setTimeout(() => {
                this.timerStop();
                this.game.main(Constant.connCard, (id + 1) % 3);
            }, 100);
        }
    }

    setBoss(id: number) {
        if (id == this.game.myself) {
            this.isSelect = new Array(this.game.players[this.game.myself].pokers.length);
            for (var i = 0; i < this.game.players[this.game.myself].pokers.length; i++) {
                this.allPoker[this.game.pokerSize + i].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.game.players[this.game.myself].pokers[i]];
            }
            this.initPoker();
        }
        else {

        }
        this.game.main(Constant.playCard, this.game.bossId);//出牌
    }

    afterPlay(id: number) {
        this.clickIsSelect = false;
        this.clickstate = Constant.ClickNothing;
        if (this.game.state == Constant.ready) {
            return;
        }

        this.playCardNode.active = false;
        if (id == this.game.myself) {
            this.initPoker();
        }
        else {

        }
        this.game.room.timerStop();
        this.game.players[id].isOperate = false;
        this.game.typeAndSize[0] = -1;
        this.game.main(Constant.connCard, (id + 1) % 3);
    }

    play(id: number) {
        if (id == this.game.myself) {
            var nums = new Array();
            for (var i = 0; i < this.game.players[this.game.myself].pokers.length; i++) {
                if (this.game.players[this.game.myself].playedPokers[i]) {
                    continue;
                }
                if (this.isSelect[i]) {
                    this.game.players[this.game.myself].playedPokers[i] = true;
                    this.allPoker[this.game.pokerSize + i].active = false;
                    nums.push(nums);
                }
            }
            this.game.players[this.game.myself].validPokerNum -= nums.length;
            if (this.game.players[this.game.myself].validPokerNum == 0) {
                //游戏结束
                this.restart();
            }
        }
        else {

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
        this.timerNum = 20;
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

    initPoker() {
        var newLefet = -1 * Math.floor((this.game.players[this.game.myself].validPokerNum * Constant.PokerWidth / 5 + Constant.PokerWidth / 4) / 2);//初始化手牌边界
        if (this.pokerLeft != newLefet) {
            this.pokerLeft = newLefet;
        }
        var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220];
        for (var i = 0; i < this.game.players[this.game.myself].pokers.length; i++) {
            if (this.game.players[this.game.myself].playedPokers[i]) {
                continue;
            }
            //this.allPoker[this.game.pokerSize + i].runAction(cc.sequence(cc.moveTo(0.1, midPos[0], midPos[1])));
            this.allPoker[this.game.pokerSize + i].position = new cc.Vec2(midPos[0], midPos[1]);
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
        this.clickstate = Constant.ClickNothing;
    }

    onClickQuit() {
        if (this.clickstate == Constant.ClickStart) {
            return;
        }
        this.clickstate = Constant.ClickStart;
        cc.director.loadScene("Home");
    }
}
