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

    state: number = 0;//0出牌 1接牌

    private clickstate: boolean = false;
    game: any = null;
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
        if (Constant.isLxDdz()) {
            this.game.room.playCardCalbak(this.game.myself, false);
        }
        else {
            if (this.game.state == Constant.playCard) {
                this.game.playCardComm();
            }
            else {
                this.game.connCardComm();
            }

        }
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

        if (Constant.isLxDdz()) {
            this.game.room.playCardCalbak(this.game.myself, true);
        }
        else {
            if (this.game.state == Constant.playCard) {
                this.game.playCardComm();
            }
            else {
                this.game.connCardComm();
            }
        }
        this.clickstate = false;
    }
}
