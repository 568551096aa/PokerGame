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
        this.game.pointer++;
        this.game.players[this.game.myself].isOperate = true;
        clearTimeout(this.game.room.setTimeOutId);
        this.game.players[this.game.myself].isOperate = false;
        this.game.room.afterPlay(this.game.myself);

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

        this.game.pointer = 0;
        this.game.players[this.game.myself].isOperate = true;
        clearTimeout(this.game.room.setTimeOutId);
        this.game.players[this.game.myself].isOperate = false
        this.game.room.play(this.game.myself);
        this.game.room.afterPlay(this.game.myself);
        this.clickstate = false;
    }
}
