import { Constant } from "../scene/Constant";
import { Http } from "../serve/Http";
const { ccclass, property } = cc._decorator;
@ccclass
export class signIn extends cc.Component {

    @property(cc.EditBox)
    userEdit: cc.EditBox = null;

    @property(cc.EditBox)
    passEdit: cc.EditBox = null;

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
        var pass = Number(this.passEdit.string);
        var res = await Http.httpPost(Constant.URL, JSON.stringify({
            id: Constant.httpSignIn,
            uid: user,
            sid: pass
        }));
        console.log(res);

        if (res == null) {

        }
        else if (res.res == 1) {
            Constant.uid = user;
            Constant.gold = res.gold;
            cc.director.loadScene("Home");
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
