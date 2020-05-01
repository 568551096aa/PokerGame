import { GameMode } from "./GameMode"
import { Http } from "../serve/Http";
import { socket } from "../serve/Socket";
const { ccclass, property } = cc._decorator;

@ccclass
export class Loading extends cc.Component {

    @property(cc.Label)
    configLabel: cc.Label = null;

    @property(cc.ProgressBar)
    processBar: cc.ProgressBar = null;

    @property(cc.Node)
    loadingNode: cc.Node = null;

    @property(cc.Node)
    menuNode: cc.Node = null;

    @property(cc.Prefab)
    gameModePrefab: cc.Prefab = null;
    async onLoad() {

        var res = await Http.httpPost("http://192.168.2.127:3000", JSON.stringify({ rar: "dfs" }));

        socket.tryConnect();

        console.log(res);

        setTimeout(() => {
            setTimeout(() => {
                this.processBar.progress = 0.5;
            }, 1000);
            this.configLabel.string = "加载完成";
            this.processBar.progress = 1
            setTimeout(() => {
                this.showMenu();
            }, 500);
        }, 500)



    }

    showMenu() {
        this.loadingNode.active = false;
        this.menuNode.active = true;
        const node = cc.instantiate(this.gameModePrefab);
        this.menuNode.addChild(node);

    }
}
