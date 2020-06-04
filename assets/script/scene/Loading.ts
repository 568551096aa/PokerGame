import { GameMode } from "./GameMode"
import { Http } from "../serve/Http";
import { socket } from "../serve/Socket";
import { Constant } from "./Constant";
import { Manager } from "./Consist";
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

    @property(cc.Node)
    persisNode: cc.Node = null;


    onLoad() {

        /*var res = await Http.httpPost("http://192.168.2.127:3000", JSON.stringify({
            id: Constant.MINUS_GOLD, uid: 1, num:
                "static COMMAND_OPESELECTBOSS = 1;自动不叫static COMMAND_OPERPLAYCARD = 2;自动出牌static COMMAND_OPERCONNCARD = 3;自动接static COMMAND_RECONN = 4;重新连static COMMAND_GMAEEND = 5;游戏结static COMMAND_MAIN = 6;游戏控制 static COMMAND_SETBOSS = 7;游戏控制        static COMMAND_SELECTBOSS = 8;主动叫地主操        static COMMAND_PLAYCARD = 9;主动出牌操作        static COMMAND_CONNCARD = 10;主动接牌操作       static COMMAND_LEAVEROOM = 11;离开房间"
        }));*/
        //console.log(res);
        this.showMenu();
        /*setTimeout(() => {
            setTimeout(() => {
                this.processBar.progress = 0.5;
            }, 1000);
            this.configLabel.string = "加载完成";
            this.processBar.progress = 1
            setTimeout(() => {
                
            }, 10);
        }, 10)*/
        cc.game.addPersistRootNode(this.persisNode);

        this.init();

    }

    init() {
        
        Manager.playBgmAudio();
    }

    showMenu() {
        this.loadingNode.active = false;
        this.menuNode.active = true;
        const node = cc.instantiate(this.gameModePrefab);
        this.menuNode.addChild(node);
    }

}
