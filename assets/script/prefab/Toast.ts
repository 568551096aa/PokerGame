import { Manager } from "../scene/Consist";
import { SyncPromise } from "../serve/SyncPromise";

const { ccclass, property } = cc._decorator;

@ccclass
export class Toast extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Node)
    closeBut: cc.Node = null;

    clickstate: boolean = false;


    sycPro = new SyncPromise();
    

    init(str: string) {
        this.label.string = str;
    }



    onClickClose() {
        if (this.clickstate == true) {
            return;
        }
        this.clickstate = true;
        this.sycPro.resolve();
    }


    getDonePromise(): Promise<any> {
        return this.sycPro.promise;
    }
    // update (dt) {}
}
