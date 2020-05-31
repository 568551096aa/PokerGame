
const {ccclass, property} = cc._decorator;

@ccclass
export  class commonPrefab extends cc.Component {

    @property(cc.Prefab)
    commonTouast: cc.Prefab = null;

    @property(cc.Prefab)
    TextTouast: cc.Prefab = null;
}
