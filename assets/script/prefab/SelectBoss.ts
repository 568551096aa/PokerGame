import { DdzGame } from "../DdzGame"
import { Constant } from "../scene/Constant";
const { ccclass, property } = cc._decorator;

@ccclass
export class SelectBoss extends cc.Component {
    @property(cc.Button)
    SelectBut: cc.Button = null;

    @property(cc.Button)
    GiveupBut: cc.Button = null;

    @property(cc.Label)
    SelectText: cc.Label = null;

    private clickstate: boolean = false;
    game: any = null;

    private type: number = 0;

    init(game: any) {
        this.game = game;
        if (game.bossId == -1) {
            this.SelectText.string = "叫地主";
            this.type = 1;
        }
        else {
            this.SelectText.string = "抢地主";
            this.type = 2;
        }
    }

    onClickSelect() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.node.active = false;

        if (1) {
            this.game.selectBossComm(this.game.myself, true);
        }
        else {
            this.game.room.selectBossCalbak(this.game.myself, true);
        }



        this.clickstate = false;
    }

    onClickGiveup() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.node.active = false;
        if (1) {
            this.game.selectBossComm(this.game.myself, false);
        }
        else {
            this.game.room.selectBossCalbak(this.game.myself, false);
        }
        this.clickstate = false;
    }

}