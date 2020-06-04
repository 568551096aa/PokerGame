import { Manager } from "../scene/Consist";
import { AudioManage } from "../scene/AudioManage";

const { ccclass, property } = cc._decorator;

@ccclass
export class Setting extends cc.Component {

    @property(cc.Sprite)
    effectSprite: cc.Sprite = null;

    @property(cc.Sprite)
    bgmSprite: cc.Sprite = null;


    @property(cc.SpriteFrame)
    openSprifame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    closeSprifame: cc.SpriteFrame = null;

    clickstate: boolean = false;

    init() {
        if (Manager.BgmSetting) {
            this.bgmSprite.spriteFrame = this.openSprifame;
        }
        else {
            this.bgmSprite.spriteFrame = this.closeSprifame;
        }
        if (Manager.EffectSetting) {
            this.effectSprite.spriteFrame = this.openSprifame;
        }
        else {
            this.effectSprite.spriteFrame = this.closeSprifame;
        }


    }

    onclickEffect() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        Manager.EffectSetting = !Manager.EffectSetting;
        if (Manager.EffectSetting) {
            this.effectSprite.spriteFrame = this.openSprifame;
        }
        else {
            this.effectSprite.spriteFrame = this.closeSprifame;
        }

        this.clickstate = false;
    }

    onclickBgm() {
        if (this.clickstate) {
            return;
        }
        this.clickstate = true;
        Manager.BgmSetting = !Manager.BgmSetting;
        if (Manager.BgmSetting) {
            Manager.playBgmAudio();
            this.bgmSprite.spriteFrame = this.openSprifame;
        }
        else {
            Manager.pauseBgmAudio();
            this.bgmSprite.spriteFrame = this.closeSprifame;
        }


        this.clickstate = false;
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
