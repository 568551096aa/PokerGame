
const {ccclass, property} = cc._decorator;

@ccclass
export class TextToast extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    init(str: string) {
        this.label.string = str;
    }
    
}
