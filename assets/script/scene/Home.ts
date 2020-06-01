import { Constant } from "./Constant";
import { socket } from "../serve/Socket";
import { inffor } from "../prefab/inffor";

const { ccclass, property } = cc._decorator;

@ccclass
export class Loading extends cc.Component {

    @property(cc.Prefab)
    settingPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    inforPrefab: cc.Prefab = null;

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
        const node = cc.instantiate(this.settingPrefab);
        this.node.addChild(node);

        this.clickstate = false;
    }

    onClickInforBut() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        const node = cc.instantiate(this.inforPrefab);
        this.node.addChild(node);
        node.getComponent(inffor).init(1, 1);
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
