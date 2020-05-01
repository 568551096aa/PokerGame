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
    static websocketUrl: string;
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

    static COMMAND_HEART_BEAT = "heartbeat";//心跳包

    static COMMAND_BIND = "bind";//绑定用户信息
    static COMMAND_RECOVER_GAME = "receive_game";//重启游戏
    static COMMAND_MATCH = "startmatch";//开始匹配
    static COMMAND_CREATE_ROOM = "creategroup";//创建房间
    static COMMAND_JOIN_ROOM = "joingroup";//加入房间
    static COMMAND_EXIT_ROOM = "exitgroup";//退出房间
    static COMMAND_EXIT_GAME = "exitgame";//退出房间
    static COMMAND_GROUPSTATE = "groupstate";//房间状态
    static COMMAND_GROUPINFO = "groupinfo";//房间信息
    static COMMAND_MATCH_SUCCESS = "matchsuc";//匹配成功
    static BIND_STATE_NORMAL = 1;//绑定正常
    static BIND_STATE_GROUPING = 2;//绑定队伍中
    static BIND_STATE_MATCHING = 3;//绑定匹配中
    static BIND_STATE_GAMEING = 4;//绑定匹配中

    static MAX_TRY_LOGIN_COUNT = 6;//最大重连数
    static RETRY_TIME = 20000;//重连延迟时间
    static WS_HOST = "ws://192.168.2.127:8888";
    static GAME_MODE_TEAMWAR = 4;//团战模式
    static VERSION = "1.0"; //游戏版本号
    static TEAM_PLAYER_NUMBER = 5;

}
