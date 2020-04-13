
const {ccclass, property} = cc._decorator;

@ccclass
export class Loading extends cc.Component {

    @property(cc.Button)
    loginInBut: cc.Button = null;

    @property(cc.Button)
    loginUpBut: cc.Button = null;

    @property(cc.Button)
    localBut: cc.Button = null;

    onLoad(){
        
    }


}
