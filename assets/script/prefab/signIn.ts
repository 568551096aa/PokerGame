import { Constant } from "../scene/Constant";
import { Http } from "../serve/Http";
const { ccclass, property } = cc._decorator;
@ccclass
export class signIn extends cc.Component {

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
        cc.director.loadScene("Home");
        return;

        this.clickstate = true;
        var user = Number(this.userEdit.string);
        var pass = Number(this.userEdit.string);
        var res = await Http.httpPost(Constant.URL, JSON.stringify({
            commid: Constant.httpSignIn,
            data: [user, pass]
        }));
        if (res.res == 200) {
            Constant.uid = user;
            Constant.gold = res.data.gold;
            
        }
        else {

        }
        this.clickstate = true;
    }

    onClickCancel() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.node.destroy();
    }
}
