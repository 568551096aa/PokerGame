
const {ccclass, property} = cc._decorator;

@ccclass
export  class AudioManage extends cc.Component {

    @property({ type: cc.AudioClip })
    bgmAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    GamebgmAudioClip: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    startBtn: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    selectBoss: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    notSelectBoss: cc.AudioClip = null;

    playBgmAudio() {
        cc.audioEngine.playMusic(this.bgmAudioClip, true);
    }

    playGameBgmAudio() {
        cc.audioEngine.playMusic(this.GamebgmAudioClip, true);
    }

    playStartBtnAudio() {
        cc.audioEngine.playEffect(this.startBtn, false);
    }


    playselectBossAudio() {
        cc.audioEngine.playEffect(this.selectBoss, false);
    }

    playnotSelectBossAudio() {
        cc.audioEngine.playEffect(this.notSelectBoss, false);
    }


    pauseBgmAudio() {
        cc.audioEngine.pauseMusic();
    }

    pauseGameBgmAudio() {
        cc.audioEngine.pauseMusic();
    }


}
