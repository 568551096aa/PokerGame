
import { Http } from "../serve/Http";
import { Constant } from "../scene/Constant";
const { ccclass, property } = cc._decorator;

@ccclass
export class register extends cc.Component {

    @property(cc.EditBox)
    userEdit: cc.EditBox = null;

    @property(cc.EditBox)
    passEdit: cc.EditBox = null;

    @property(cc.EditBox)
    rePassEdit: cc.EditBox = null;

    @property(cc.Button)
    confirmBtn: cc.Button = null;

    @property(cc.Button)
    cancelBtn: cc.Button = null;

    clickstate: boolean = false;

    onLoad() {

    }

    async onClickConfirm() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        var user = Number(this.userEdit.string);
        var pass = Number(this.userEdit.string);
        var res = await Http.httpPost(Constant.URL, JSON.stringify({
            commid: Constant.httpRegister,
            data: [user, pass]
        }));
        if (res.res == 200) {
            
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
