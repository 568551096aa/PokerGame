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

    @property(cc.Prefab)
    signinPrefab: cc.Prefab = null;


    @property(cc.Prefab)
    registerPrefab: cc.Prefab = null;


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

        //const node = cc.instantiate(this.signinPrefab);
        //this.node.addChild(node);
    }

    onClickRegister() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        const node = cc.instantiate(this.registerPrefab);
        this.node.addChild(node);

        this.clickstate = false;
    }

    onClickDanji() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        Constant.gameMode = Constant.DdzMode;
        cc.director.loadScene("Room");
    }
}
