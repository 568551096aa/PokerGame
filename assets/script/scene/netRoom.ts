
import { Constant } from "./Constant";
import { SelectBoss } from "../prefab/SelectBoss";
import { PlayCards } from "../prefab/PlayCards";
import { Timer } from "../prefab/Timer";
import { Player } from "../Player";
import { socket } from "../serve/Socket"
import { win } from "../prefab/win";
import { Manager } from "./Consist";

const { ccclass, property } = cc._decorator;

@ccclass
export class Room extends cc.Component {
    @property(cc.Node)
    animNode: cc.Node = null;

    @property(cc.Node)
    alerNode: cc.Node = null;

    @property(cc.Node)
    tuoguanNode: cc.Node = null;

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

    @property(cc.Prefab)
    winPrefab: cc.Prefab = null;

    @property(cc.Label)
    textLabel: cc.Label[] = [];

    @property(cc.Label)
    pokerNum: cc.Label[] = [];

    @property(cc.Label)
    loding: cc.Label = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;

    @property(cc.Sprite)
    playerAve: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    boosSpriteframe: cc.SpriteFrame = null;

    @property(cc.Label)
    TuoguanLeble: cc.Label = null;

    @property(cc.SpriteFrame)
    frameSpriteframe: cc.SpriteFrame = null;


    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Node)
    tuoguanBut: cc.Node = null;

    private playCardNode: cc.Node = null;
    private selectBossNode: cc.Node = null;
    private timerNode: cc.Node = null;
    private winNode: cc.Node = null;

    allPoker: cc.Node[] = new Array();
    mypokerPos: number[] = null;

    isauto: boolean = false;//是否托管
    timerCalBak: any;//倒计时回调函数
    private clickstate = Constant.ClickNothing;
    private pokerBeg: number = -1;//选中牌最开始的下标
    private pokerEnd: number = 0;//选中牌结束的下标
    private pokerLeft: number = 0;//手牌最左端坐标
    private touchPokerType: number[] = [-1, -1];

    private isSelect: boolean[] = new Array(20);;
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
    isTuoguan: boolean = false;
    score: number = 1;

    onLoad() {
        for (var i = 0; i < Constant.PokerNum; i++) {
            var node = new cc.Node();
            //调用新建的node的addComponent函数，会返回一个sprite的对象
            node.addComponent(cc.Sprite);
            this.midPoker.addChild(node);
            this.allPoker.push(node);
        }
        ///if (Constant.isLxDdz()) {
        if (Constant.isDdz()) {
            this.playCardNode = cc.instantiate(this.playCardPrefab);
            this.alerNode.addChild(this.playCardNode);
            this.selectBossNode = cc.instantiate(this.selectBossPrefab);
            this.alerNode.addChild(this.selectBossNode);

            this.winNode = cc.instantiate(this.winPrefab);
            this.alerNode.addChild(this.winNode);


            this.timerNode = cc.instantiate(this.timerPrefab);
            this.alerNode.addChild(this.timerNode);
            cc.director.on(Constant.COMMAND_STARTGAME.toString(), this.startGame, this);
            cc.director.on(Constant.COMMAND_OPESELECTBOSS.toString(), this.selectBossCalbak, this);
            cc.director.on(Constant.COMMAND_OPERPLAYCARD.toString(), this.playCardCalbak, this);
            cc.director.on(Constant.COMMAND_OPERCONNCARD.toString(), this.connCardCalbak, this);
            cc.director.on(Constant.COMMAND_RECONN.toString(), this.reconnect, this);
            cc.director.on(Constant.COMMAND_GMAEEND.toString(), this.GAMEOVER, this);
            cc.director.on(Constant.COMMAND_SETBOSS.toString(), this.setBoss, this);
            cc.director.on(Constant.COMMAND_SELECTBOSS.toString(), this.selectBoss, this);
            cc.director.on(Constant.COMMAND_PLAYCARD.toString(), this.playCard, this);
            cc.director.on(Constant.COMMAND_CONNCARD.toString(), this.connCard, this);
            cc.director.on(Constant.COMMAND_TUOGUAN.toString(), this.tuoguancall, this);
            this.tuoguanBut.active = false;

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
        if (Constant.isDdz()) {
            this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
            this.initDdz();
        }
        else if (Constant.isZzh()) {

        }
    }

    initDdz() {


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

        this.playCardNode.position = new cc.Vec2(0, 0);
        this.winNode.active = false;

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
            this.players[i] = new Player();
        }
        this.goldLabel.string = Constant.gold.toString();
    }

    initZzh() {

    }

    restart() {
        this.state = Constant.ready;
        this.readyBtn.active = true;
        this.timerNode.getComponent(Timer).timerStop();
        for (var i = 0; i < Constant.PokerNum; i++) {
            this.allPoker[i].setPosition(0, 0);
            this.allPoker[i].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
            this.allPoker[i].active = true;
            this.allPoker[i].scale = 1;
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
        for (var i = 0; i < 3; i++) {
            this.playerAve[i].spriteFrame = this.frameSpriteframe;
        }
        this.initDdz();
        this.goldLabel.string = Constant.gold.toString();
        this.clickstate = Constant.ClickNothing;
    }

    startGame(data) {
        this.myself = Constant.id;
        console.log("myself", this.myself);
        //数据同步
        this.loding.node.active = false;
        this.players[this.myself].pokers = data.pokers;
        this.firstPlayerId = data.firstPlayerId;

        var pokerBite = new Array(54);
        var i = 0;
        for (i = 0; i < data.pokers.length; i++) {
            pokerBite[data.pokers[i]] = true;
        }

        this.players[(this.myself + 1) % 3].pokers = new Array(17);
        this.players[(this.myself + 2) % 3].pokers = new Array(17);
        var j = 0, k = (this.myself + 1) % 3;
        for (i = 0; i < 54; i++) {
            if (j == 17) {
                j = 0;
                k = (k + 1) % 3;
            }
            if (pokerBite[i]) {
                continue;
            }
            if (k == this.myself) {
                if (pokerBite[i]) {
                    continue;
                }
                this.host[j] = i;
                j++;
                continue;
            }
            this.players[k].pokers[j] = i;
            j++;
        }

        this.players[0].init(this.players[0].pokers);
        this.players[1].init(this.players[1].pokers);
        this.players[2].init(this.players[2].pokers);
        this.mypokerPos = new Array(17);
        this.mypokerPos = data.pokers;

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
                if (type[0] == -1) {
                    this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = false;
                }
                else {
                    if (this.state == Constant.playCard) {
                        this.playCardNode.getComponent(PlayCards).PlayCardsBut.interactable = true;
                    }
                    else if (this.state == Constant.connCard) {
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
        }, this, midPos);

        const callbackD = cc.callFunc((target) => {
            this.pokerNum[1].node.active = true;
            this.pokerNum[1].node.setPosition(350, -100);
            this.pokerNum[1].string = "17";
            this.pokerNum[2].node.active = true;
            this.pokerNum[2].node.setPosition(-350, -100);
            this.pokerNum[2].string = "17";
            this.dealEnd = true;
        }, this);
        this.midPoker.runAction(cc.sequence(callbackA, cc.delayTime(0.3), callbackB, cc.delayTime(1.0), callbackC, cc.delayTime(0.5), callbackD));
    }

    //叫地主
    selectBoss(data) {
        var id = data.id;
        this.bossId = data.bossId;
        this.state = Constant.selectBoss;
        var score = data.score;
        if (id == this.myself) {
            //出牌显示 设置20s的定时器 如果手动选择则调main 否则在定时器的回调里main  如果首位玩家已经叫了地主后又到了这位玩家
            //继续抢地主则为最终地主 否则最先抢地主的玩家是地主
            var midPos = [-180, -220 + 150];
            this.timerNode.getComponent(Timer).timerStart(midPos);
            this.selectBossNode.active = true;
            this.selectBossNode.getComponent(SelectBoss).init(this);

        }
        else if (id == (this.myself + 1) % 3) {
            var rightPos = [250, 150];
            this.timerNode.getComponent(Timer).timerStart(rightPos);

        }
        else {
            var leftPos = [-250, 150];
            this.timerNode.getComponent(Timer).timerStart(leftPos);
        }
    }

    setScore(score) {
        this.scoreLabel.string = score.toString() + "倍";
    }

    //主动地主操作
    selectBossComm(id: number, isBoss: boolean) {
        socket.selectBoss(id, isBoss);
    }

    //自动地主
    selectBossCalbak(data) {
        var id = data.id;
        var isBoss = data.isBoss;
        var textType = data.textType;
        if (id == this.myself) {
            this.roundAnim(id, textType)
        }
        else if (id == (this.myself + 1) % 3) {
            this.roundAnim(id, textType)
        }
        else {
            this.roundAnim(id, textType)
        }
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
    playCard(data) {
        var id = data.id;
        this.beforplayCard(id);

        if (id == this.myself) {
            if (this.isTuoguan) {
                return;
            }
            this.clickIsSelect = true;
            var midPos = [-180, -220 + 150];
            this.timerNode.getComponent(Timer).timerStart(midPos);
            this.playCardNode.active = true;
            this.playCardNode.getComponent(PlayCards).init(this);

        }
        else if (id == (this.myself + 1) % 3) {
            var rightPos = [250, 150];
            this.timerNode.getComponent(Timer).timerStart(rightPos);

        }
        else {
            var leftPos = [-250, 150];
            this.timerNode.getComponent(Timer).timerStart(leftPos);

        }
    }


    //主动出牌操作
    playCardComm() {
        var nums = new Array();
        var i = 0;
        for (i = 0; i < this.players[this.myself].pokers.length; i++) {
            if (this.players[this.myself].playedPokers[i]) {
                continue;
            }
            if (this.isSelect[i]) {
                this.players[this.myself].playedPokers[i] = true;
                nums.push(this.players[this.myself].pokers[i]);
            }
        }
        socket.playCard(this.myself, nums);
    }

    //自动出牌
    playCardCalbak(data) {
        var id = data.id;
        var isPlay = data.isPlay;
        var num = data.pokers;
        var score = data.score;
        if (data.pokers == null) {
            num = new Array();
        }
        else {
            num.sort(this.compareAsc);
        }

        this.players[id].lastPokers = num;
        this.players[id].validPokerNum -= num.length;
        var j = 0;
        for (var i = 0; i < this.players[id].pokers.length; i++) {
            if (this.players[id].pokers[i] == this.players[id].lastPokers[j]) {
                this.players[id].playedPokers[i] = true;
                j++;
            }
            if (j == this.players[id].lastPokers.length) {
                break;
            }
        }
        if (isPlay) {
            this.play(id);
        }
        else {
            this.roundAnim(id, 3);
        }
        this.timerNode.getComponent(Timer).timerStop();
        this.afterPlay(id);
    }



    //自动出牌
    connCardCalbak(data) {
        var id = data.id;
        var isPlay = data.isPlay;
        var num = data.pokers;
        var score = data.score;
        if (data.pokers == null) {
            num = new Array();
        }
        else {
            num.sort(this.compareAsc);
        }

        this.players[id].lastPokers = num;
        this.players[id].validPokerNum -= num.length;
        var j = 0;
        for (var i = 0; i < this.players[id].pokers.length; i++) {
            if (this.players[id].pokers[i] == this.players[id].lastPokers[j]) {
                this.players[id].playedPokers[i] = true;
                j++;
            }
            if (j == this.players[id].lastPokers.length) {
                break;
            }
        }
        if (isPlay) {
            this.play(id);
        }
        else {
            this.roundAnim(id, 3);
        }
        this.timerNode.getComponent(Timer).timerStop();
        this.afterPlay(id);
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
            this.pokerNum[1].string = this.players[id].validPokerNum.toString();
        }
        else {
            this.pokerNum[2].string = this.players[id].validPokerNum.toString();
        }

    }

    //接牌
    connCard(data) {
        var id = data.id;
        if (this.players[id].lastPokers != null) {
            for (var i = 0; i < this.players[id].lastPokers.length; i++) {
                this.allPoker[this.players[id].lastPokers[i]].active = false;
            }
        }
        this.state = Constant.connCard;

        if (id == this.myself) {
            if (this.isTuoguan) {
                return;
            }
            this.clickIsSelect = true;
            var midPos = [-180, -220 + 150];
            this.timerNode.getComponent(Timer).timerStart(midPos);
            this.playCardNode.active = true;
            this.playCardNode.getComponent(PlayCards).init(this);
        }
        else if (id == (this.myself + 1) % 3) {
            var rightPos = [250, 150];
            this.timerNode.getComponent(Timer).timerStart(rightPos);

        }
        else {
            var leftPos = [-250, 150];
            this.timerNode.getComponent(Timer).timerStart(leftPos);
        }
    }

    //主动接牌操作
    connCardComm() {
        var nums = new Array();
        var i = 0;

        for (i = 0; i < this.players[this.myself].pokers.length; i++) {
            if (this.players[this.myself].playedPokers[i]) {
                continue;
            }
            if (this.isSelect[i]) {
                this.players[this.myself].playedPokers[i] = true;
                nums.push(this.players[this.myself].pokers[i]);
            }
        }

        socket.connCard(this.myself, nums);
    }

    reconnect(data) {
        var id = data.id;
        this.state = data.state;
        this.myself = data.muself;
        this.players[this.myself].pokers = data.pokers;
        this.players[this.myself].playedPokers = data.playedPokers;
        var idConn = data.isConn;
        var ConnPokers = data.ConnPokers;


        this.isTuoguan = data.tuoguan;
        this.score = data.score;
        if (this.isTuoguan) {
            this.TuoguanLeble.node.active = true;
            this.clickstate = Constant.ClickMoveing;
        }
        else {
            this.TuoguanLeble.node.active = false;
            this.clickstate = Constant.ClickNothing;
        }
        this.setScore(this.score);
        this.initPoker();
        if (id == this.myself) {
            var midPos = [-180, -220 + 150];
            this.timerNode.getComponent(Timer).timerStart(midPos);
            this.playCardNode.active = true;
            this.playCardNode.getComponent(PlayCards).init(this);
        }
        else {
            for (var i = 0; i < idConn.length; i++) {
                this.players[idConn[i]].lastPokers = ConnPokers[i];
                this.play(idConn[i]);
            }
        }
    }

    tuoguancall(body) {
        var id = body.id;
        var tuoguan = body.tuoguan;
        this.isTuoguan = tuoguan;

        if (this.isTuoguan) {
            this.TuoguanLeble.node.active = true;
            this.clickstate = Constant.ClickMoveing;
        }
        else {
            this.TuoguanLeble.node.active = false;
            this.clickstate = Constant.ClickNothing;
        }
    }

    setBoss(data) {
        var id = data.id;
        var host = data.host;

        this.players[id].setBoss(host);
        this.players[id].sortPokers();


        this.mypokerPos.sort(this.players[0].compareAsc);
        this.host.sort(this.players[0].compareAsc);
        host.sort(this.players[0].compareAsc);

        for (var k = 0; k < 3; k++) {
            var temp = this.allPoker[host[k]].position;
            this.allPoker[host[k]].setPosition(this.allPoker[this.host[k]].position);
            this.allPoker[this.host[k]].setPosition(temp);
        }
        this.host = host;
        //翻开地主牌
        const callbackA = cc.callFunc(() => {
            for (var i = 0; i < this.host.length; i++) {
                this.allPoker[this.host[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[host[i]];
            }
        }, this);
        var callbackB;
        if (id == this.myself) {
            this.pokerLeft = -1 * Math.floor((this.players[id].validPokerNum * Constant.PokerWidth / 5 + Constant.PokerWidth / 4) / 2);//初始化手牌边界

            //移动手牌到指定位置 把地主拍放入手中
            callbackB = cc.callFunc(() => {
                this.playerAve[0].spriteFrame = this.boosSpriteframe;
                var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220];
                var pos: number[] = new Array(6);
                var j = 0;
                for (var i = 0; i < this.players[id].pokers.length; i++) {
                    this.allPoker[this.players[id].pokers[i]].zIndex = i;
                    if (this.players[id].pokers[i] == host[j]) {
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
                this.playerAve[1].spriteFrame = this.boosSpriteframe;
                var rightPos = [350, 0];
                this.pokerNum[1].string = this.players[id].validPokerNum.toString();
                for (var i = 0; i < this.host.length; i++) {
                    this.allPoker[this.host[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
                    this.allPoker[this.host[i]].runAction(cc.moveTo(0.2, rightPos[0], rightPos[1]));
                }

            }, this);
        }
        else {
            callbackB = cc.callFunc(() => {
                this.playerAve[2].spriteFrame = this.boosSpriteframe;
                var leftPos = [-350, 0];
                this.pokerNum[2].string = this.players[id].validPokerNum.toString();
                for (var i = 0; i < this.host.length; i++) {
                    this.allPoker[this.host[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[54];
                    this.allPoker[this.host[i]].runAction(cc.moveTo(0.2, leftPos[0], leftPos[1]));
                }
            }, this);
        }
        const callbackC = cc.callFunc((target) => {

            for (var i = 0; i < 20; i++) {
                this.isSelect[i] = false;
            }
            for (var i = 0; i < 3; i++) {
                this.roundAnim(i, -1);
            }
        }, this);
        this.midPoker.runAction(cc.sequence(cc.delayTime(0.5), callbackA, callbackB, callbackC))
    }



    //0不出 1叫地主 2抢地主 
    roundAnim(id: number, type: number) {
        var showId = 0;
        if (id == this.myself) {
            showId = 0;
        }
        else if (id == (this.myself + 1) % 3) {
            showId = 1;
        }
        else {
            showId = 2;
        }
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
        this.textLabel[showId].node.active = true;
        this.textLabel[showId].string = text;
    }

    play(id: number) {
        var leftPos = [-250 + 135, 100];
        var midPos = [this.pokerLeft + Constant.PokerWidth / 2, -220 + 180];
        var rightPos = [250 - 135, 100];


        if (id == this.myself) {
            var i = 0;

            var left = -1 * Math.floor((this.players[this.myself].lastPokers.length * Constant.PokerWidth / 8 + Constant.PokerWidth * 0.8) / 2);
            midPos[0] = left + Constant.PokerWidth / 2;
            for (i = 0; i < this.players[this.myself].lastPokers.length; i++) {
                this.allPoker[this.players[this.myself].lastPokers[i]].setPosition(midPos[0], midPos[1]);
                this.allPoker[this.players[this.myself].lastPokers[i]].scale = 0.7;
                midPos[0] += Constant.PokerWidth / 8;
            }
        }
        else if (id == (this.myself + 1) % 3) {
            var left = Math.floor((this.players[id].lastPokers.length * Constant.PokerHeight / 8 + Constant.PokerHeight * 0.80) / 2);//初始化手牌边界
            rightPos[0] = left + Constant.PokerWidth / 2;
            for (i = 0; i < this.players[id].lastPokers.length; i++) {
                this.allPoker[this.players[id].lastPokers[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.players[id].lastPokers[i]];
                this.allPoker[this.players[id].lastPokers[i]].zIndex = this.players[id].lastPokers.length - i;
                this.allPoker[this.players[id].lastPokers[i]].setPosition(rightPos[0], rightPos[1]);
                this.allPoker[this.players[id].lastPokers[i]].scale = 0.7;
                rightPos[0] -= Constant.PokerHeight / 8;
            }
        }
        else {
            var left = Math.floor((this.players[id].lastPokers.length * Constant.PokerHeight / 8 + Constant.PokerHeight * 0.80) / 2);//初始化手牌边界
            leftPos[0] = -1 * (left + Constant.PokerWidth / 2);
            for (i = 0; i < this.players[id].lastPokers.length; i++) {
                this.allPoker[this.players[id].lastPokers[i]].getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrame[this.players[id].lastPokers[i]];
                this.allPoker[this.players[id].lastPokers[i]].zIndex = i;
                this.allPoker[this.players[id].lastPokers[i]].setPosition(leftPos[0], leftPos[1]);
                this.allPoker[this.players[id].lastPokers[i]].scale = 0.7;
                leftPos[0] += Constant.PokerHeight / 8;
            }
        }
        this.lastTypeAndSize = this.getPokerTypeAndLevel(this.players[id].lastPokers);
    }

    GAMEOVER(data) {
        var winer = data.winer;
        var gold = data.gold;
        Constant.gold = gold;
        var type = 1;
        if (this.bossId == winer) {
            type = 0;
        }
        this.winNode.getComponent(win).init(this, type);
        this.winNode.active = true;
        this.clickstate = Constant.ClickStart;
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
        this.tuoguanBut.active = true;
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

    onClickTuoguan() {
        if (this.clickstate == Constant.ClickStart) {
            return;
        }
        this.clickstate = Constant.ClickStart;
        this.isTuoguan = !this.isTuoguan;


        if (this.isTuoguan) {
            this.TuoguanLeble.node.active = true;
            this.clickstate = Constant.ClickMoveing;
        }
        else {
            this.TuoguanLeble.node.active = false;
            this.clickstate = Constant.ClickNothing;
        }
        socket.Tuoguan(this.isTuoguan);
        this.clickstate = Constant.ClickNothing;
    }




    onDestroy() {
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

        return res;
    }
}

