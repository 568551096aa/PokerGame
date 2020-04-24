import { DdzGame } from "../DdzGame"
import { Constant } from "../scene/Constant";
import { Room } from "../scene/Room";
const { ccclass, property } = cc._decorator;

@ccclass
export class PlayCards extends cc.Component {
    @property(cc.Button)
    NonPlayCardsBut: cc.Button = null;

    @property(cc.Button)
    TipBut: cc.Button = null;

    @property(cc.Button)
    PlayCardsBut: cc.Button = null;

    private clickstate: boolean = false;
    game: DdzGame = null;
    init(game: any) {
        this.game = game;
        //自己为出牌人 不能不出牌
        if (this.game.state == Constant.playCard) {
            this.NonPlayCardsBut.interactable = false;
            this.PlayCardsBut.interactable = false;
        }
        else if (this.game.state == Constant.connCard) {
            this.NonPlayCardsBut.interactable = true;
            this.PlayCardsBut.interactable = false;
        }
        else {
            this.NonPlayCardsBut.interactable = true;
        }
    }

    onClickNonPlay() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.node.active = false;
        this.game.room.playCardCalbak(this.game.myself, false);
        this.clickstate = false;
    }

    onClickTip() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.clickstate = false;
    }

    onClickPlay() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.node.active = false;
        this.game.room.playCardCalbak(this.game.myself, true);
        this.clickstate = false;
    }
}
