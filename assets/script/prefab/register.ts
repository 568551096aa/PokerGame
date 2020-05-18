
import { Http } from "../serve/Http";
import { Constant } from "../scene/Constant";
const { ccclass, property } = cc._decorator;

@ccclass
export class register extends cc.Component {

    @property(cc.EditBox)
    userEdit: cc.EditBox = null;

    @property(cc.EditBox)
    passEdit: cc.EditBox = null;

    @property(cc.Button)
    confirmBtn: cc.Button = null;

    @property(cc.Button)
    cancelBtn: cc.Button = null;

    clickstate: boolean = false;

    @property(cc.Prefab)
    signinPrefab: cc.Prefab = null;


    onLoad() {

    }

    async onClickConfirm() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        var user = Number(this.userEdit.string);
        var pass = Number(this.passEdit.string);
        var res = await Http.httpPost(Constant.URL, JSON.stringify({
            id: Constant.httpRegister,
            uid: user,
            sid: pass
        }));

        if (res.res == null) {

        }
        else if (res.res == 1) {
            const node = cc.instantiate(this.signinPrefab);
            this.node.parent.addChild(node);
            this.destroy();
        }
        else {

        }
        this.clickstate = false;
    }

    onClickCancel() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.node.destroy();
    }

}
