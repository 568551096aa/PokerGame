import { Constant } from "../scene/Constant";

const { ccclass, property } = cc._decorator;

@ccclass
export class Loading extends cc.Component {

    @property(cc.Button)
    loginInBut: cc.Button = null;

    @property(cc.Button)
    loginUpBut: cc.Button = null;

    @property(cc.Button)
    localBut: cc.Button = null;

    clickstate: boolean = false;

    onLoad() {

    }

    onClickLoginIn() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        Constant.gameMode = Constant.DdzMode;
        cc.director.loadScene("Home");
    }
}
