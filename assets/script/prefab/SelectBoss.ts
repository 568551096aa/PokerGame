import { DdzGame } from "../DdzGame"
import { Constant } from "../scene/Constant";
const { ccclass, property } = cc._decorator;

@ccclass
export class SelectBoss extends cc.Component {
    @property(cc.Node)
    SelectBut: cc.Node = null;

    @property(cc.Node)
    GiveupBut: cc.Node = null;

    @property(cc.SpriteFrame)
    qiangBoss: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    jiaoBoss: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    giveupBoss: cc.SpriteFrame = null;




    private clickstate: boolean = false;
    game: any = null;

    private type: number = 0;

    init(game: any) {
        this.game = game;
        if (game.bossId == -1) {
            this.SelectBut.getComponent(cc.Sprite).spriteFrame = this.jiaoBoss;
            this.type = 1;
        }
        else {
            this.SelectBut.getComponent(cc.Sprite).spriteFrame = this.qiangBoss;
            this.type = 2;
        }
    }

    onClickSelect() {
        if (this.game.clickstate == Constant.ClickStart) {
            return;
        }
      

        if (this.clickstate) {
            return;
        }


        this.game.clickstate = Constant.ClickStart;
        this.clickstate = true;
        this.node.active = false;

        if (Constant.isLxDdz()) {
            this.game.room.selectBossCalbak(this.game.myself, true);
        }
        else {
            this.game.selectBossComm(this.game.myself, true);
        }


        this.game.clickstate = Constant.ClickNothing;
        this.clickstate = false;
    }

    onClickGiveup() {
        if (this.game.clickstate == Constant.ClickStart) {
            return;
        }
        if (this.clickstate) {
            return;
        }


        this.game.clickstate = Constant.ClickStart;
        this.clickstate = true;
        this.node.active = false;
        if (Constant.isLxDdz()) {
            this.game.room.selectBossCalbak(this.game.myself, false);
        }
        else {
            this.game.selectBossComm(this.game.myself, false);
        }

        this.game.clickstate = Constant.ClickNothing;
        this.clickstate = false;
    }

}