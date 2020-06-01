
const { ccclass, property } = cc._decorator;

@ccclass
export class inffor extends cc.Component {

    @property(cc.Label)
    winLabel: cc.Label = null;

    @property(cc.Label)
    loseLabel: cc.Label = null;

    clickstate: boolean = false;

    init(win: number, lase: number) {
        this.winLabel.string = win.toString();
        this.loseLabel.string = lase.toString();
    }   


    onclickQuit() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.node.destroy();
        this.clickstate = false;
    }

}
