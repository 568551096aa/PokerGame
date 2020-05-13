
import { Constant } from "./Constant";
import { SelectBoss } from "../prefab/SelectBoss";
import { PlayCards } from "../prefab/PlayCards";
import { Timer } from "../prefab/Timer";
import { Player } from "../Player";
import { socket } from "../serve/Socket"

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

    @property(cc.Label)
    loding: cc.Label = null;

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
    private dealEnd = false;//发牌结束
    pos: cc.Vec2[] = null;

    allPokers: number[] = new Array(Constant.PokerNum);
    players: Player[] = new Array(3);
    host: number[] = new Array(3);//地主牌
    lastTypeAndSize: number[] = new Array(2);//上一家出牌类型和大小
    state: number = 0;//游戏状态 0准备阶段  1叫地主阶段 2出牌阶段 3接牌阶段
    bossId: number = -1;//地主id
    myself: number = 0;//我的 id
    firstPlayerId: number = 0;//第一个叫牌人
    playPlayerId: number = 0;//出牌人id
    pokerSize: number = 17;
    id: number = 0;//当前叫话人
    isPlay: boolean = false;

    onLoad() {
        for (var i = 0; i < Constant.PokerNum; i++) {
            var node = new cc.Node();
            //调用新建的node的addComponent函数，会返回一个sprite的对象
            node.addComponent(cc.Sprite);
            this.midPoker.addChild(node);
            this.allPoker.push(node);
        }
        ///if (Constant.isLxDdz()) {
        if (1) {
            this.playCardNode = cc.instantiate(this.playCardPrefab);
            this.alerNode.addChild(this.playCardNode);

            this.selectBossNode = cc.instantiate(this.selectBossPrefab);
            this.alerNode.addChild(this.selectBossNode);

            this.timerNode = cc.instantiate(this.timerPrefab);
            this.alerNode.addChild(this.timerNode);
            cc.director.on(Constant.COMMAND_STARTGAME.toString(), this.startGame, this);
            cc.director.on(Constant.COMMAND_OPESELECTBOSS.toString(), this.selectBossCalbak, this);
            cc.director.on(Constant.COMMAND_OPERPLAYCARD.toString(), this.playCardCalbak, this);
            cc.director.on(Constant.COMMAND_OPERCONNCARD.toString(), this.playCardCalbak, this);
            cc.director.on(Constant.COMMAND_RECONN.toString(), this.startGame, this);
            cc.director.on(Constant.COMMAND_GMAEEND.toString(), this.GAMEOVER, this);
            cc.director.on(Constant.COMMAND_SETBOSS.toString(), this.setBoss, this);
            cc.director.on(Constant.COMMAND_SELECTBOSS.toString(), this.selectBoss, this);
            cc.director.on(Constant.COMMAND_PLAYCARD.toString(), this.playCard, this);
            cc.director.on(Constant.COMMAND_CONNCARD.toString(), this.connCard, this);
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
        //if (Constant.isLxDdz()) {
        if (1) {
            this.initDdz();
        }
        else if (Constant.isZzh()) {

        }
    }

    initDdz() {
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);

        this.pos = new Array(3);
        var pos = [[0, -220 + 180], [250 - 50, 150], [-250 + 50, 150]];

        for (var i = 0; i < 3; i++) {
            this.pos[i] = new cc.Vec2(pos[i][0], pos[i][1]);
            this.textLabel[i].node.active = false;
            this.textLabel[i].node.setPosition(this.pos[i]);

            this.pokerNum[i].node.active = false;
            this.pokerNum[i].node.zIndex = 60;
        }


        //准备按钮
        this.readyBtn.active = true;
        this.loding.node.active = false;

        this.playCardNode.position = new cc.Vec2(0, -80);
        this.playCardNode.active = false;

        this.selectBossNode.position = new cc.Vec2(0, -80);
        this.selectBossNode.active = false;

        this.timerNode.active = false;
        this.dealEnd = false;
        this.myself = Constant.id;
        this.pokerLeft = -1 * Math.floor((this.pokerSize * Constant.PokerWidth / 5 + Constant.PokerWidth / 4) / 2);//初始化手牌边界
        this.clickIsSelect = false;

        this.timerCalBak = new Array(3);

        for (var i = 0; i < this.players.length; i++) {
            console.log("初始化");
            this.players[i] = new Player();
        }
    }

    initZzh() {

    }

    restart() {
        console.log("重新开始");
        this.state = Constant.ready;
        this.readyBtn.active = true;
        this.timerNode.getComponent(Timer).timerStop();
        for (var i = 0; i < Constant.PokerNum; i++) {
            this.allPoker[i].setPosition(0, 0);
            this.allPoker[i].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
            this.allPoker[i].active = true;
        }
        this.midPoker.active = false;
        if (Constant.isDdz()) {
            this.pokerLeft = -1 * Math.floor((this.pokerSize * Constant.PokerWidth / 5 + Constant.PokerWidth / 4) / 2);//初始化手牌边界
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
        else if (Constant.isZzh()) {

        }
    }

    startGame(data) {
        //数据同步
    
        this.players[this.myself].pokers = data.pokers;
        this.firstPlayerId = data.firstPlayerId;
        //发牌开始
        this.dealCardsA();
    }

    gettouchuBegIndex(pos: cc.Vec2) {
        var width = Constant.PokerWidth / 5;
        var length = pos.x - this.pokerLeft;
        var index = length / width;
        if (index > this.players[this.myself].validPokerNum - 1) {
            index = this.players[this.myself].validPokerNum - 1;
        }
        return Math.floor(index);
    }

    gettouchuEndIndex(pos: cc.Vec2) {
        var width = Constant.PokerWidth / 5;
        var length = pos.x - this.pokerLeft;
        var index = 0;
        var size = Math.floor(this.players[this.myself].validPokerNum * Constant.PokerWidth / 5 + Constant.PokerWidth / 4);
        if (length < 0) {
            index = 0;
        }
        else if (length > size) {
            index = this.players[this.myself].validPokerNum - 1;
        }
        else {
            index = length / width;
            if (index > this.players[this.myself].validPokerNum - 1) {
                index = this.players[this.myself].validPokerNum - 1;
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
            (this.players[this.myself].validPokerNum - 1) * Constant.PokerWidth / 5 + Constant.PokerWidth, Constant.PokerHeight);
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
        //(this.players[this.myself].validPokerNum - 1) * Constant.PokerWidth / 5 + Constant.PokerWidth, Constant.PokerHeight);
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
        for (i = 0; i < this.players[this.myself].pokers.length; i++) {
            if (this.players[this.myself].playedPokers[i]) {
                continue;
            }
            var color = new cc.Color(255, 255, 255);
            if (this.allPoker[this.players[this.myself].pokers[i]].color != color) {
                this.allPoker[this.players[this.myself].pokers[i]].color = color;
            }
        }
        for (i = 0; i < this.players[this.myself].pokers.length; i++) {
            if (this.players[this.myself].playedPokers[i]) {
                continue;
            }
            beg++;
            if (beg == touchBeg) {
                break;
            }
        }
        for (; i < this.players[this.myself].pokers.length; i++) {
            if (this.players[this.myself].playedPokers[i]) {
                continue;
            }
            var color = new cc.Color(106, 127, 240);
            if (this.allPoker[this.players[this.myself].pokers[i]].color != color) {
                this.allPoker[this.players[this.myself].pokers[i]].color = color;
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
            for (i = 0; i < this.players[this.myself].pokers.length; i++) {
                if (this.players[this.myself].playedPokers[i]) {
                    continue;
                }
                beg++;
                if (beg == this.pokerBeg) {
                    break;
                }
            }
            for (; i < this.players[this.myself].pokers.length; i++) {
                if (this.players[this.myself].playedPokers[i]) {
                    continue;
                }
                this.isSelect[i] = !this.isSelect[i];
                var color = new cc.Color(255, 255, 255);
                if (this.allPoker[this.players[this.myself].pokers[i]].color != color) {
                    this.allPoker[this.players[this.myself].pokers[i]].color = color;
                }
                beg++;
                if (beg > this.pokerEnd) {
                    break;
                }
            }
            //弹出所有选中的牌
            for (i = 0; i < this.players[this.myself].pokers.length; i++) {
                if (this.players[this.myself].playedPokers[i]) {
                    continue;
                }
                if (this.isSelect[i]) {
                    isPlayCard = true;
                    this.allPoker[this.players[this.myself].pokers[i]].y = -220 + 30;
                }
                else {
                    this.allPoker[this.players[this.myself].pokers[i]].y = -220;
                }
            }
            if (isPlayCard) {
                var nums = new Array();
                for (i = 0; i < this.players[this.myself].pokers.length; i++) {
                    if (this.players[this.myself].playedPokers[i]) {
                        continue;
                    }
                    if (this.isSelect[i]) {
                        nums.push(this.players[this.myself].pokers[i]);
                    }
                }
                var type = this.getPokerTypeAndLevel(nums);
                console.log(type);
                if (type[0] == -1) {
                    this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = false;
                }
                else {
                    if (this.state == Constant.playCard) {
                        this.touchPokerType = type;
                        this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = true;
                    }
                    else if (this.state == Constant.connCard) {
                        this.touchPokerType = type;
                        console.log("需要出牌的类型 " + this.lastTypeAndSize);
                        if (this.compTypeAndSize(this.lastTypeAndSize, type)) {
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
            for (var i = 0; i < this.pokerSize; i++) {
                this.allPoker[this.players[this.myself].pokers[i]].zIndex = i;
                this.allPoker[this.players[this.myself].pokers[i]].runAction(cc.sequence(cc.delayTime(time),
                    cc.moveTo(0.1, midPos[0], midPos[1]), cc.callFunc((target, index: number) => {
                        this.allPoker[index].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[index];
                    }, this, this.players[this.myself].pokers[i])));
                this.allPoker[this.players[(this.myself + 1) % 3].pokers[i]].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, rightPos[0], rightPos[1])));
                this.allPoker[this.players[(this.myself + 2) % 3].pokers[i]].runAction(cc.sequence(cc.delayTime(time), cc.moveTo(0.1, leftPos[0], leftPos[1])));
                time += 0.05;
                midPos[0] += Constant.PokerWidth / 5;
            }
        }, this);
        //发地主牌
        const callbackB = cc.callFunc((target) => {
            //发地主牌
            var pos = [[-120, 230], [0, 230], [120, 230]];
            for (var i = 0; i < 3; i++) {
                this.allPoker[this.host[i]].runAction(cc.moveTo(0.1, pos[i][0], pos[i][1]));
            }
        }, this);
        //开始叫地主
        const callbackC = cc.callFunc((target, midPos) => {
            this.players[this.myself].sortPokers();
            midPos[0] = this.pokerLeft + Constant.PokerWidth / 2;
            for (var i = 0; i < this.players[this.myself].pokers.length; i++) {
                this.allPoker[this.players[this.myself].pokers[i]].zIndex = i;
                this.allPoker[this.players[this.myself].pokers[i]].runAction(cc.moveTo(0.2, midPos[0], midPos[1]));
                midPos[0] += Constant.PokerWidth / 5;
            }
            console.log("叫地主开始");
        }, this, midPos);

        const callbackD = cc.callFunc((target) => {
            this.pokerNum[1].node.active = true;
            this.pokerNum[1].node.setPosition(350, 0);
            this.pokerNum[1].string = "17";
            this.pokerNum[2].node.active = true;
            this.pokerNum[2].node.setPosition(-350, 0);
            this.pokerNum[2].string = "17";
            this.dealEnd = true;
        }, this);
        this.midPoker.runAction(cc.sequence(callbackA, cc.delayTime(0.3), callbackB, cc.delayTime(1.0), callbackC, cc.delayTime(0.5), callbackD));
    }

    main(type: number, id: number) {
        switch (type) {
            case Constant.selectBoss:
                this.selectBoss(id);
                break;
            case Constant.playCard:
                this.playCard(id);
                break;
            case Constant.connCard:
                this.connCard(id);
                break;
            default:
                this.onClickQuit();
                break;
        }
    }

    //叫地主
    selectBoss(id: number) {
        if (!this.dealEnd) {
            setTimeout(this.selectBoss, 3000, id);
            return;
        }
        this.state = Constant.selectBoss;

        if (id == this.myself) {
            //出牌显示 设置20s的定时器 如果手动选择则调main 否则在定时器的回调里main  如果首位玩家已经叫了地主后又到了这位玩家
            //继续抢地主则为最终地主 否则最先抢地主的玩家是地主
            var midPos = [this.pokerLeft, -220 + 180];
            this.timerNode.getComponent(Timer).timerStart(midPos);
            this.selectBossNode.active = true;
            this.selectBossNode.getComponent(SelectBoss).init(this.game);
            //const callback = cc.callFunc(this.afterSelectBoss, this, id);
            //this.timerCalBak[id] = this.alerNode.runAction(cc.sequence(cc.delayTime(20), callback));
        }
        else if (id == (this.myself + 1) % 3) {
            var rightPos = [250, 200];
            this.timerNode.getComponent(Timer).timerStart(rightPos);
            //const callback = cc.callFunc(this.afterSelectBoss, this, id);
            //this.timerCalBak[id] = this.alerNode.runAction(cc.sequence(cc.delayTime(20), callback));
        }
        else {
            var leftPos = [-250, 200];
            this.timerNode.getComponent(Timer).timerStart(leftPos);
            //const callback = cc.callFunc(this.afterSelectBoss, this, id);
            //this.timerCalBak[id] = this.alerNode.runAction(cc.sequence(cc.delayTime(20), callback));
        }

    }

    //主动地主操作
    selectBossComm(id: number, isBoss: boolean) {
        socket.selectBoss(id, isBoss);
    }

    //自动地主
    selectBossCalbak(id: number, isBoss: boolean) {
        if (id == this.myself) {
            this.roundAnim(id, this.players[id].textType)
        }
        else if (id == (this.myself + 1) % 3) {
            this.roundAnim(id, this.players[id].textType)
        }
        else {
            this.roundAnim(id, this.players[id].textType)
        }
        socket.selectBoss(id, isBoss);
        this.timerNode.getComponent(Timer).timerStop();
    }

    beforplayCard(id: number) {
        for (var i = 0; i < 3; i++) {
            this.roundAnim(i, -1);
        }
        if (this.players[id].lastPokers != null) {
            for (var i = 0; i < this.players[id].lastPokers.length; i++) {
                this.allPoker[this.players[id].lastPokers[i]].active = false;
            }
            this.players[id].lastPokers = null;
        }
        this.state = Constant.playCard;
    }

    //出牌
    playCard(id: number) {
        console.log("出牌");
        this.beforplayCard(id);

        if (id == this.myself) {
            this.clickIsSelect = true;
            var midPos = [this.pokerLeft, -220 + 180];
            this.timerNode.getComponent(Timer).timerStart(midPos);
            this.playCardNode.active = true;
            this.playCardNode.getComponent(PlayCards).init(this.game);
            //const callback = cc.callFunc(this.afterPlayCard, this, id);
            //this.timerCalBak[id] = this.node.runAction(cc.sequence(cc.delayTime(20), callback));
        }
        else if (id == (this.myself + 1) % 3) {
            var rightPos = [250, 200];
            this.timerNode.getComponent(Timer).timerStart(rightPos);
            this.players[id].validPokerNum -= this.players[id].lastPokers.length;

            //const callback = cc.callFunc(this.afterPlayCard, this, id);
            //this.timerCalBak[id] = this.node.runAction(cc.sequence(cc.delayTime(20), callback));
        }
        else {
            var leftPos = [-250, 200];
            this.timerNode.getComponent(Timer).timerStart(leftPos);
            this.players[id].validPokerNum -= this.players[id].lastPokers.length;

            //const callback = cc.callFunc(this.afterPlayCard, this, id);
            //this.timerCalBak[id] = this.node.runAction(cc.sequence(cc.delayTime(20), callback));
        }
    }


    //主动出牌操作
    playCardComm() {
        socket.playCard(this.myself, this.players[this.myself].lastPokers);
    }

    //自动出牌
    playCardCalbak(id: number, isPlay: boolean) {
        if (isPlay) {
            this.play(id);
        }
        else {
            this.roundAnim(id, 3);
        }
        this.timerNode.getComponent(Timer).timerStop();
        this.afterPlay(id);
    }



    afterPlay(id: number) {
        this.clickIsSelect = false;
        this.clickstate = Constant.ClickNothing;
        if (this.state == Constant.ready) {
            return;
        }
        this.playCardNode.active = false;
        if (id == this.myself) {
            this.initPoker();
        }
        else if (id == (this.myself + 1) % 3) {
            this.pokerNum[1].string = this.players[1].validPokerNum.toString();
        }
        else {
            this.pokerNum[1].string = this.players[1].validPokerNum.toString();
        }

    }

    //接牌
    connCard(id: number) {
        if (this.players[id].lastPokers != null) {
            for (var i = 0; i < this.players[id].lastPokers.length; i++) {
                this.allPoker[this.players[id].lastPokers[i]].active = false;
            }
        }
        this.state = Constant.connCard;

        console.log("接牌 " + id);
        if (id == this.myself) {
            this.clickIsSelect = true;
            var midPos = [this.pokerLeft, -220 + 180];
            this.timerNode.getComponent(Timer).timerStart(midPos);
            this.playCardNode.active = true;
            this.playCardNode.getComponent(PlayCards).init(this.game);
            //const callback = cc.callFunc(this.afterPlayCard, this, id);
            //this.timerCalBak[id] = this.node.runAction(cc.sequence(cc.delayTime(20), callback));
        }
        else if (id == (this.myself + 1) % 3) {
            var rightPos = [250, 200];
            this.timerNode.getComponent(Timer).timerStart(rightPos);

            //const callback = cc.callFunc(this.afterPlayCard, this, id);
            //this.timerCalBak[id] = this.node.runAction(cc.sequence(cc.delayTime(20), callback));
        }
        else {
            var leftPos = [-250, 200];
            this.timerNode.getComponent(Timer).timerStart(leftPos);

            //const callback = cc.callFunc(this.afterPlayCard, this, id);
            //this.timerCalBak[id] = this.node.runAction(cc.sequence(cc.delayTime(20), callback));
        }
    }

    //主动接牌操作
    connCardComm() {
        socket.connCard(this.myself, this.players[this.myself].lastPokers);
    }



    setBoss(id: number, host: number[]) {
        this.host = host;
        //翻开地主牌
        const callbackA = cc.callFunc(() => {
            for (var i = 0; i < this.host.length; i++) {
                this.allPoker[this.host[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.host[i]];
            }
        }, this);
        var callbackB;
        if (id == this.myself) {
            this.pokerLeft = -1 * Math.floor((this.players[id].validPokerNum * Constant.PokerWidth / 5 + Constant.PokerWidth / 4) / 2);//初始化手牌边界

            //移动手牌到指定位置 把地主拍放入手中
            callbackB = cc.callFunc(() => {
                var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220];
                var pos: number[] = new Array(6);
                this.host.sort(this.players[0].compareAsc);
                var j = 0;
                for (var i = 0; i < this.players[id].pokers.length; i++) {
                    this.allPoker[this.players[id].pokers[i]].zIndex = i;
                    if (this.players[id].pokers[i] == this.host[j]) {
                        pos[j * 2] = midPos[0];
                        pos[j * 2 + 1] = midPos[1];
                        j++;
                    }
                    else {
                        this.allPoker[this.players[id].pokers[i]].runAction(cc.moveTo(0.4, midPos[0], midPos[1]));
                    }
                    midPos[0] += Constant.PokerWidth / 5;
                }
                for (var i = 0; i < this.host.length; i++) {
                    this.allPoker[this.host[i]].runAction(cc.sequence(cc.delayTime(0.3), cc.moveTo(0.4, pos[i * 2], pos[i * 2 + 1])));
                }
            }, this);
        }
        else if (id == (this.myself + 1) % 3) {
            callbackB = cc.callFunc(() => {
                var rightPos = [350, 0];
                this.pokerNum[1].string = this.players[1].validPokerNum.toString();
                for (var i = 0; i < this.host.length; i++) {
                    this.allPoker[this.host[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
                    this.allPoker[this.host[i]].runAction(cc.moveTo(0.2, rightPos[0], rightPos[1]));
                }
            }, this);
        }
        else {
            callbackB = cc.callFunc(() => {
                var leftPos = [-350, 0];
                this.pokerNum[2].string = this.players[2].validPokerNum.toString();
                for (var i = 0; i < this.host.length; i++) {
                    this.allPoker[this.host[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
                    this.allPoker[this.host[i]].runAction(cc.moveTo(0.2, leftPos[0], leftPos[1]));
                }
            }, this);
        }
        const callbackC = cc.callFunc((target) => {
            for (var i = 0; i < 3; i++) {
                this.roundAnim(i, -1);
            }
        }, this);
        this.midPoker.runAction(cc.sequence(cc.delayTime(0.5), callbackA, callbackB, callbackC))
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
        var leftPos = [-250 + 135, 0];
        var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220 + 180];
        var rightPos = [250 - 135, 0];
        if (id == this.myself) {
            var i = 0;
            var left = -1 * Math.floor((this.players[this.myself].lastPokers.length * Constant.PokerWidth / 5 + Constant.PokerWidth * 0.8) / 2);
            midPos[0] = left + Constant.PokerWidth / 2;
            for (i = 0; i < this.players[this.myself].lastPokers.length; i++) {
                this.allPoker[this.players[this.myself].lastPokers[i]].setPosition(midPos[0], midPos[1]);
                midPos[0] += Constant.PokerWidth / 5;
            }
            this.lastTypeAndSize = this.touchPokerType;
        }
        else if (id == (this.myself + 1) % 3) {
            var top = Math.floor((this.players[id].lastPokers.length * Constant.PokerHeight / 4 + Constant.PokerHeight * 0.75) / 2);//初始化手牌边界
            rightPos[1] = top + Constant.PokerWidth / 2;
            for (i = 0; i < this.players[id].lastPokers.length; i++) {
                this.allPoker[this.players[id].lastPokers[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.players[id].lastPokers[i]];
                this.allPoker[this.players[id].lastPokers[i]].setPosition(rightPos[0], rightPos[1]);
                rightPos[1] -= Constant.PokerHeight / 4;
            }
        }
        else {
            var top = Math.floor((this.players[id].lastPokers.length * Constant.PokerHeight / 4 + Constant.PokerHeight * 0.75) / 2);//初始化手牌边界
            rightPos[1] = top + Constant.PokerWidth / 2;
            for (i = 0; i < this.players[id].lastPokers.length; i++) {
                this.allPoker[this.players[id].lastPokers[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.players[id].lastPokers[i]];
                this.allPoker[this.players[id].lastPokers[i]].setPosition(leftPos[0], leftPos[1]);
                rightPos[1] -= Constant.PokerHeight / 4;
            }
        }
    }

    GAMEOVER() {

    }

    initPoker() {
        var newLefet = -1 * Math.floor((this.players[this.myself].validPokerNum * Constant.PokerWidth / 5 + Constant.PokerWidth / 4) / 2);//初始化手牌边界
        this.pokerLeft = newLefet;
        var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220];
        for (var i = 0; i < this.players[this.myself].pokers.length; i++) {
            if (this.players[this.myself].playedPokers[i]) {
                continue;
            }
            //this.allPoker[this.pokerSize + i].runAction(cc.sequence(cc.moveTo(0.1, midPos[0], midPos[1])));
            this.allPoker[this.players[this.myself].pokers[i]].color = cc.color(255, 255, 255);
            this.allPoker[this.players[this.myself].pokers[i]].setPosition(midPos[0], midPos[1]);
            midPos[0] += Constant.PokerWidth / 5;
        }
        for (var i = 0; i < this.isSelect.length; i++) {
            this.isSelect[i] = false;
        }
    }

    onClickReady() {
        if (this.clickstate == Constant.ClickStart) {
            return;
        }
        this.clickstate = Constant.ClickStart;

        socket.ready();

        this.readyBtn.active = false;
        this.loding.node.active = true;
        this.clickstate = Constant.ClickNothing;
    }

    onClickQuit() {
        if (this.clickstate == Constant.ClickStart) {
            return;
        }
        this.clickstate = Constant.ClickStart;
        this.onDestroy();
        cc.director.loadScene("Home");
    }

    onDestroy() {
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
        if (pokers.length == 1) {
            res[0] = 1;
            pokers[0] < 2 ? res[1] = pokers[0] + 13 : res[1] = Math.floor((pokers[0] - 2) / 4);;
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
                    res[1] = min;
                }
            }
        }
        else if (pokers.length == 6) {
            if (map.size == 2) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[5] - 2) / 4)) {
                    res[0] = 9;
                    res[1] = 100;
                    map.forEach((value, key) => {
                        res[1] > key ? res[1] = key : res[1];
                    });
                }
            }
            else if (map.size == 3) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)) {
                    var min = 100;
                    map.forEach((value, key) => {
                        min > key ? min = key : min;
                    });
                    if (max <= 9) {
                        res[0] = 11;
                        res[1] = min;
                    }
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
                    res[1] = min;
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
                    res[1] = min;
                }
            }
        }
        else if (pokers.length == 8) {
            if (map.size == 4) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[6] - 2) / 4)) {
                    var min = 20;
                    map.forEach((value, key) => {
                        min > key ? min = key : min;
                    });
                    if (max < 12) {
                        res[0] = 11;
                        res[1] = min;
                    }
                }
                else {
                    map.forEach((value, key) => {
                        if (value == 3) {
                            if (map.get(key + 1) == 3) {
                                res[0] = 14;
                                res[1] = key;
                                return;
                            }
                            else if (map.get(key - 1) == 3) {
                                res[0] = 14;
                                res[1] = key - 1;
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
                    res[1] = min;
                }
            }
        }
        else if (pokers.length == 9) {
            if (map.size == 3) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[3] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[6] - 2) / 4)) {
                    res[0] = 17;
                    res[1] = 100;
                    map.forEach((value, key) => {
                        res[1] > key ? res[1] = key : res[1];
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
                    res[1] = min;
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
                        res[1] = valid[0] < valid[1] ? valid[0] : valid[1];
                    }
                }
            }
            else if (map.size == 5) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[6] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 4 == Math.floor((pokers[8] - 2) / 4)) {
                    var min = 20;
                    map.forEach((value, key) => {
                        min > key ? min = key : min;
                    });
                    if (min <= 7) {
                        res[0] = 20;
                        res[1] = min;
                    }
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
                    res[1] = min;
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
                    res[1] = min;
                }
            }
        }
        else if (pokers.length == 12) {
            if (map.size == 4) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[3] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[6] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[9] - 2) / 4)) {
                    res[0] = 25;
                    res[1] = 200;
                    map.forEach((value, key) => {
                        res[1] > key ? res[1] = key : res[1];
                    });
                }
            }
            else if (map.size == 6) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[6] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 4 == Math.floor((pokers[8] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 5 == Math.floor((pokers[10] - 2) / 4)) {
                    var min = 20;
                    map.forEach((value, key) => {
                        min > key ? min = key : min;
                    });
                    if (min < 7) {
                        res[0] = 24;
                        res[1] = min;
                    }
                }
                else {
                    map.forEach((value, key) => {
                        if (value == 3) {
                            if (map.get(key + 1) == 3 && map.get(key + 2) == 3) {
                                res[0] = 23;
                                res[1] = key;
                                return;
                            }
                            else if (map.get(key - 1) == 3 && map.get(key + 1) == 3) {
                                res[0] = 23;
                                res[1] = key - 1;
                                return;
                            }
                            else if (map.get(key - 1) == 3 && map.get(key - 2) == 3) {
                                res[0] = 23;
                                res[1] = key - 2;
                                return;
                            }
                        }
                    });
                }
            }
            else if (min < 11 && map.size == 12) {
                var max = -1, min = 20;
                map.forEach((value, key) => {
                    max < key ? max = key : max;
                    min > key ? min = key : min;
                });
                if (max < 12 && max - min == 11) {
                    res[0] = 22;
                    res[1] = min;
                }
            }
        }
        else if (pokers.length == 14) {
            if (map.size == 7) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[6] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 4 == Math.floor((pokers[8] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 5 == Math.floor((pokers[10] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 6 == Math.floor((pokers[12] - 2) / 4)) {
                    var min = 0;
                    map.forEach((value, key) => {
                        min > key ? min = key : min;
                    });
                    if (min < 6) {
                        res[0] = 26;
                        res[1] = min;
                    }
                }
            }
        }
        else if (pokers.length == 15) {
            if (map.size == 5) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[3] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[6] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[9] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 4 == Math.floor((pokers[12] - 2) / 4)) {
                    res[0] = 27;
                    res[1] = 20;
                    map.forEach((value, key) => {
                        res[1] > key ? res[1] = key : res[1];
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
                        res[1] = valid[0];
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
                    var min = 20;
                    map.forEach((value, key) => {
                        min > key ? min = key : min;
                    });
                    if (min <= 4) {
                        res[0] = 29;
                        res[1] = min;
                    }
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
                            res[1] = valid[0];
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
                        res[1] = valid[0];
                    }
                }
            }
            else if (map.size == 8) {
                if (Math.floor((pokers[0] - 2) / 4) + 1 == Math.floor((pokers[2] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 2 == Math.floor((pokers[4] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 3 == Math.floor((pokers[6] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 4 == Math.floor((pokers[8] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 5 == Math.floor((pokers[10] - 2) / 4) && Math.floor((pokers[0] - 2) / 4) + 6 == Math.floor((pokers[12] - 2) / 4)
                    && Math.floor((pokers[0] - 2) / 4) + 7 == Math.floor((pokers[14] - 2) / 4)) {
                    var min = 20;
                    map.forEach((value, key) => {
                        min > key ? min = key : min;
                    });
                    if (min <= 4) {
                        res[0] = 31;
                        res[1] = min;
                    }
                }
            }
        }
        return res;

    }

    //A已经出的牌 B要的牌
    compTypeAndSize(typeA: number[], typeB: number[]) {
        //4 炸弹  8四带2  0双王  32四带两对  
        var res: boolean = false;
        if (typeB[0] == 0) {
            res = true;
        }
        else if (typeB[0] == 4) {
            if (typeA[0] == 4 && typeA[1] > typeB[1]) {
                res = true;
            }
        }
        else if (typeB[0] == 8) {
            if (typeA[0] == 8 && typeA[1] > typeB[1]) {
                res = true;
            }
        }
        else if (typeB[0] == 32) {
            if (typeA[0] == 32 && typeA[1] > typeB[1]) {
                res = true;
            }
        }
        else if (typeA[0] == typeB[0] && typeA[1] < typeB[1]) {
            res = true;
        }
        console.log("是否可以要 " + res);
        return res;
    }
}

