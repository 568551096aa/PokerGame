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
    game: DdzGame = null;

    init(game: any) {
        this.game = game;
        if (game.bossId == -1) {
            this.SelectText.string = "叫地主";
        }
        else {
            this.SelectText.string = "抢地主";
        }
    }

    onClickSelect() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.node.active = false;
        if (this.game.bossId == -1) {
            this.game.bossId = this.game.myself;
        }
        this.game.bossState[this.game.myself] = true;
        this.game.players[this.game.myself].isOperate = true;
        clearTimeout(this.game.room.setTimeOutId);
        this.game.players[this.game.myself].isOperate = false;
        this.game.room.timerStop();
        this.game.main(Constant.selectBoss, (this.game.myself + 1) % 3);
        this.clickstate = false;
    }

    onClickGiveup() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.node.active = false;
        this.game.players[this.game.myself].isOperate = true;
        clearTimeout(this.game.room.setTimeOutId);
        this.game.players[this.game.myself].isOperate = false;
        this.game.bossState[this.game.myself] = false;
        this.game.room.timerStop();
        this.game.main(Constant.selectBoss, (this.game.myself + 1) % 3);
        this.clickstate = false;
    }

}