
const {ccclass, property} = cc._decorator;

@ccclass
export  class Setting extends cc.Component {

    @property(cc.Sprite)
    effectSprite: cc.Sprite = null;

    @property(cc.Sprite)
    bgmSprite: cc.Sprite = null;


    @property(cc.SpriteFrame)
    openSprifame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    closeSprifame: cc.SpriteFrame = null;

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

    onclickQuit(){
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        this.node.destroy();
        this.clickstate = false;
    }

}
