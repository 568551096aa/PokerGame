
import { Http } from "../serve/Http";
import { Constant } from "../scene/Constant";
import { Manager } from "../scene/Consist";
const { ccclass, property } = cc._decorator;

@ccclass
export class register extends cc.Component {

    @property(cc.EditBox)
    userEdit: cc.EditBox = null;

    @property(cc.EditBox)
    passEdit: cc.EditBox = null;

    @property(cc.EditBox)
    repassEdit: cc.EditBox = null;


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
        if(this.userEdit.string == "" || this.passEdit.string == ""||this.repassEdit.string == ""){
            Manager.touastShow("账号密码不能为空", this.node);
            this.clickstate = false;
            return ;
        }

        Manager.Show("网络请求中", this.node);
        var user = Number(this.userEdit.string);
        var pass = Number(this.passEdit.string);
        var repass = Number(this.repassEdit.string);
        if(pass != repass){
            Manager.touastShow("两次输入密码不一致", this.node);
            this.clickstate = false;
            return ;
        }


        var res = await Http.httpPost(Constant.URL, JSON.stringify({
            id: Constant.httpRegister,
            uid: user,
            sid: pass
        }));

        if (res.res == null) {
            Manager.touastShow("失败", this.node);
        }
        else if (res.res == 1) {
            const node = cc.instantiate(this.signinPrefab);
            this.node.parent.addChild(node);
            Manager.touastShow("成功", this.node);
            this.destroy();
        }
        else {
            Manager.touastShow("账号已存在", this.node);
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
