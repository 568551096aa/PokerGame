import { Constant } from "./Constant";
import { socket } from "../serve/Socket";

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
        socket.tryConnect();

    }

    onClickDdz() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        Constant.gameMode = Constant.DdzMode; 
        socket.bind();
        cc.director.loadScene("netDDZ");
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
