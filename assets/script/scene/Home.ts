import { Constant } from "./Constant";
import { socket } from "../serve/Socket";
import { inffor } from "../prefab/inffor";
import { Setting } from "../prefab/Setting";
import { Manager } from "./Consist";
import { Http } from "../serve/Http";

const { ccclass, property } = cc._decorator;

@ccclass
export class Loading extends cc.Component {

    @property(cc.Prefab)
    settingPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    inforPrefab: cc.Prefab = null;

    @property(cc.Button)
    DdzzBut: cc.Button = null;

    @property(cc.Button)
    settingBut: cc.Button = null;

    @property(cc.Button)
    quitBut: cc.Button = null;

    @property(cc.Label)
    goldNumLabel: cc.Label = null;


    clickstate: boolean = false;

    onLoad() {
        socket.tryConnect();
        this.goldNumLabel.string = Constant.gold.toString();
        Manager.playBgmAudio();
    }

    onClickDdz() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        Constant.gameMode = Constant.DdzMode;
        cc.director.loadScene("netDDZ");
        socket.bind();
    }

    onClicksettingBut() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        const node = cc.instantiate(this.settingPrefab);
        node.getComponent(Setting).init();
        this.node.addChild(node);

        this.clickstate = false;
    }

    async onClickInforBut() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        var win = 0, lose = 0;
        Manager.Show("网络请求中", this.node);
        var res = await Http.httpPost(Constant.URL, JSON.stringify({
            id: Constant.infor,
            uid: Constant.uid
        }));
        if (res == null) {
            await Manager.touastShow("失败", this.node);
        }
        else if (res.res == 1) {
            win = res.win;
            lose = res.lose;
            const node = cc.instantiate(this.inforPrefab);
            this.node.addChild(node);
            node.getComponent(inffor).init(win, lose);
        }
        else {
            await Manager.touastShow("账号或密码错误", this.node);
        }
        Manager.touastHide();
        this.clickstate = false;
    }


    onClickQuit() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        Constant.gameMode = Constant.DdzMode;
        cc.director.loadScene("Loading");
    }
}
