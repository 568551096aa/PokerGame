
const { ccclass, property } = cc._decorator;

@ccclass
export class win extends cc.Component {
    @property(cc.Label)
    text: cc.Label = null;

    game: any = null;
    clickstate: boolean = false;
    //0地主获胜 1农民获胜
    init(game, type) {
        this.game = game;
        if (type == 0) {
            this.text.string = "地主获胜\n地主 +10000金币\n农民 - 10000金币";
        }
        else {
            this.text.string = "农民获胜\n农民 +10000金币\n地主 - 10000金币";
        }
    }

    onClickCancel() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;

        this.game.restart();
        this.node.active = false;
        this.clickstate = false;
    }

}
