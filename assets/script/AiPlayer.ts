export class AiPlayer {

    // 随机抢地主
    static selectBoss() {
        if(this.randomNum(0,1)){
            return true;
        }
        else{
            return false;
        }
    }
    //生成从minNum到maxNum的随机数
    static randomNum(minNum: number, maxNum: number) {
        var Range = maxNum - minNum;
        var Rand = Math.random();
        var num = minNum + Math.round(Rand * Range); //四舍五入
        return num;
    }
}
