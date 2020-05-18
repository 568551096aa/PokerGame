import { Constant } from "./Constant";
import { socket } from "../serve/Socket";

const { ccclass, property } = cc._decorator;

@ccclass
export class Loading extends cc.Component {

    @property(cc.Button)
    DdzzBut: cc.Button = null;

    @property(cc.Button)
    settingBut: cc.Button = null;

    @property(cc.Button)
    quitBut: cc.Button = null;

    @property(cc.Label)
    goldNumLabel: cc.Label = null;


    clickstate: boolean = false;

    onLoad() {
        socket.tryConnect();
        this.goldNumLabel.string = Constant.gold.toString();
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

    onClicksettingBut() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        
        
        this.clickstate = false;
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
