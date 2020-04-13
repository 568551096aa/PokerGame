import { Constant } from "./Constant";

const { ccclass, property } = cc._decorator;

@ccclass
export class Loading extends cc.Component {

    @property(cc.Button)
    DdzzBut: cc.Button = null;

    @property(cc.Button)
    ZzhBut: cc.Button = null;

    @property(cc.Button)
    localBut: cc.Button = null;

    clickstate: boolean = false;

    onLoad() {

    }

    onClickDdz() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        Constant.gameMode = Constant.DdzMode;
        cc.director.loadScene("Room");
    }

    onClickQuit() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        Constant.gameMode = Constant.DdzMode;
        cc.director.loadScene("Loading");
    }
}
