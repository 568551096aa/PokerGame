export class Constant {
    static DdzMode = 0;//斗地主
    static ZzhMode = 1;//扎金花

    //游戏模式
    static gameMode: number = 0;
    //版本号
    static Version = "1.5.46";
    //一副牌总共54张
    static PokerNum = 54;
    //牌的宽高
    static PokerWidth = 105;
    static PokerHeight = 150;
    static isDdz() {
        return Constant.gameMode == Constant.DdzMode;
    }
    static isZzh() {
        return Constant.gameMode == Constant.ZzhMode;
    }

    static ClickNothing = 0;
    static ClickStart = 1;
    static ClickMoveing = 2;
    static ClickEnd = 3;

    static ready = 0;
    static selectBoss = 1;
    static playCard = 2;
    static connCard = 3;
}
