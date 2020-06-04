import { Toast } from "../prefab/Toast";
import { commonPrefab } from "./commonPrefab";
import { TextToast } from "../prefab/TextToast";
import { SyncPromise } from "../serve/SyncPromise";
import { AudioManage } from "./AudioManage";
const { ccclass, property } = cc._decorator;

@ccclass
export class Manager extends cc.Component {


    static BgmSetting = true;

    static EffectSetting = true;

    static ToastNode: cc.Node = null;

    static TestNode: cc.Node = null;


    static playBgmAudio() {
        if (this.BgmSetting) {
            console.log("背景");
            cc.director.getScene().getChildByName('Consist').getComponent(AudioManage).playBgmAudio();
        }
    }

    static playGameBgmAudio() {
        if (this.BgmSetting) {
            cc.director.getScene().getChildByName('Consist').getComponent(AudioManage).playGameBgmAudio();
        }
    }

    static pauseBgmAudio() {
        cc.director.getScene().getChildByName('Consist').getComponent(AudioManage).pauseBgmAudio();
    }

    static pauseGameBgmAudio() {
        cc.director.getScene().getChildByName('Consist').getComponent(AudioManage).pauseGameBgmAudio();
    }

    static playStartBtnAudio() {
        if (this.EffectSetting) {
            cc.director.getScene().getChildByName('Consist').getComponent(AudioManage).playStartBtnAudio();
        }
    }


    static playselectBossAudio() {
        if (this.EffectSetting) {
            cc.director.getScene().getChildByName('Consist').getComponent(AudioManage).playselectBossAudio();
        }
    }

    static playnotSelectBossAudio() {
        if (this.EffectSetting) {
            cc.director.getScene().getChildByName('Consist').getComponent(AudioManage).playnotSelectBossAudio();
        }
    }

    static async touastShow(str: string, node: cc.Node): Promise<any> {
        var pro = new SyncPromise();
        this.ToastNode = cc.instantiate(cc.director.getScene().getChildByName('Consist').getComponent(commonPrefab).commonTouast);
        node.addChild(this.ToastNode);
        this.ToastNode.getComponent(Toast).init(str);
        this.ToastNode.active = true;
        await this.ToastNode.getComponent(Toast).getDonePromise();
        this.ToastNode.destroy();
        return pro.resolve();
    }

    static async Show(str: string, node: cc.Node) {
        this.TestNode = cc.instantiate(cc.director.getScene().getChildByName('Consist').getComponent(commonPrefab).TextTouast);
        node.addChild(this.TestNode);
        this.TestNode.getComponent(TextToast).init(str);;
    }

    static touastHide() {
        if (this.TestNode != null) {
            this.TestNode.active = false;
            this.TestNode.destroy();
        }
        this.TestNode = null;
    }




}
