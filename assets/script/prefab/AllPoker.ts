
const {ccclass, property} = cc._decorator;

@ccclass
export class Loading extends cc.Component {

    @property(cc.SpriteFrame)
    allPokers: cc.SpriteFrame[] = [];
    
    onLoad(){
    }

}
