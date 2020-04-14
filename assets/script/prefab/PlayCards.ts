import {DdzGame} from "../DdzGame"
const {ccclass, property} = cc._decorator;

@ccclass
export  class PlayCards extends cc.Component {
    @property(cc.Button)
    NonPlayCardsBut: cc.Button = null;

    @property(cc.Button)
    TipBut: cc.Button = null;

    @property(cc.Button)
    PlayCardsBut: cc.Button = null;

    init(game:any){

    }

}
