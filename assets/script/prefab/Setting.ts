
const {ccclass, property} = cc._decorator;

@ccclass
export  class Setting extends cc.Component {

    @property(cc.Sprite)
    effectSprite: cc.Sprite = null;

    @property(cc.Sprite)
    bgmSprite: cc.Sprite = null;

    clickstate: boolean = false;

    init(){
        
    }

    onclickEffect(){
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;

        this.clickstate = false;
    }

    onclickBgm(){
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;

        this.clickstate = false;
    }

}
