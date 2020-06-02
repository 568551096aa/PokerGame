import { Toast } from "../prefab/Toast";
import { commonPrefab } from "./commonPrefab";
import { TextToast } from "../prefab/TextToast";
import { SyncPromise } from "../serve/SyncPromise";
const { ccclass, property } = cc._decorator;

@ccclass
export class Manager extends cc.Component {

    static AudioSetting = false;



    static ToastNode: cc.Node = null;

    static TestNode: cc.Node = null;
    static setup() {

    }


    static playAudil() {

        //cc.audioEngine.playEffect(this.eatWreckAudioClip, false);
    }

    static async touastShow(str: string, node: cc.Node) : Promise<any> {
        var pro =  new SyncPromise();
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
