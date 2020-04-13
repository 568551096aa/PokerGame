
const {ccclass, property} = cc._decorator;

@ccclass
export class Loading extends cc.Component {

    @property(cc.Label)
    configLabel: cc.Label = null;

    @property(cc.ProgressBar)
    processBar: cc.ProgressBar = null;
    onLoad(){
        setTimeout(()=>{
            setTimeout(()=>{
                this.processBar.progress = 0.5;
            },1000);
            this.configLabel.string = "加载完成";
            this.processBar.progress = 1;
            cc.director.loadScene("Home");
        },2000)
    }


}
