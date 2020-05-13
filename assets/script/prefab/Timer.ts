
const { ccclass, property } = cc._decorator;

@ccclass
export class Timer extends cc.Component {
    @property(cc.Label)
    Num: cc.Label = null;

    private time = 20;
    private isOpen: boolean = false;

    timerStart(pos: number[]) {
        if (this.isOpen) {
            this.timerStop();
        }
        this.isOpen = true;
        this.Num.string = "20";
        this.time = 20;
        this.node.setPosition(pos[0], pos[1]);
        this.node.active = true;
        this.schedule(this.timerFunc, 1, 19, 0);
    }

    timerFunc() {
        this.Num.string = this.time.toString();
        if(this.time != 0){
            this.time--;
        }
    }

    timerStop() {
        this.node.active = false;
        this.unschedule(this.timerFunc);
        this.isOpen = false;
    }

}
