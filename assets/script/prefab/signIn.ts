import { Constant } from "../scene/Constant";
import { Http } from "../serve/Http";
import { Manager } from "../scene/Consist";
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

    @property(cc.Node)
    waitingNode: cc.Node = null;

    @property(cc.Label)
    waitingLabel: cc.Label = null;


    clickstate: boolean = false;

    onLoad() {

    }

    async onClickConfirm() {
        if (this.clickstate) {
            return;
        }
        Manager.Show("网络请求中", this.node);
        this.clickstate = true;
        var user = Number(this.userEdit.string);
        var pass = Number(this.passEdit.string);
        var res = await Http.httpPost(Constant.URL, JSON.stringify({
            id: Constant.httpSignIn,
            uid: user,
            sid: pass
        }));
        console.log(res);
        Manager.touastHide();

        cc.director.loadScene("Home");

        /*if (res == null) {
            Manager.touastShow("失败", this.node);
        }
        else if (res.res == 1) {
            Constant.uid = user;
            Constant.gold = res.gold;
            Manager.touastShow("成功", this.node);
            cc.director.loadScene("Home");
        }
        else {
            Manager.touastShow("其他原因错误", this.node);
        }*/

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
