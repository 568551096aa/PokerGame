
export class Constant {

    static LxDdzMode = 0;//离线斗地主
    static DdzMode = 1;//斗地主
    static ZzhMode = 2;//扎金花


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

    static isLxDdz() {
        return Constant.gameMode == Constant.LxDdzMode;
    }
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


    static COMMAND_HEART_BEAT = 0;//心跳包
    static COMMAND_STARTGAME = 1;//开始游戏

    static COMMAND_OPESELECTBOSS = 2;//叫地主
    static COMMAND_OPERPLAYCARD = 3;//出牌
    static COMMAND_OPERCONNCARD = 4;//接牌
    static COMMAND_RECONN = 6;//重新连接
    static COMMAND_GMAEEND = 7;//游戏结束
    static COMMAND_MAIN = 8;//游戏控制
    static COMMAND_SETBOSS = 9;//游戏控制


    static COMMAND_SELECTBOSS = 10;//叫地主阶段
    static COMMAND_PLAYCARD = 11;//出牌阶段
    static COMMAND_CONNCARD = 12;//主动阶段

    static COMMAND_LEAVEROOM = 13;//离开房间
    static COMMAND_READY = 14;//准备


    static COMMAND_BIND = 15;//绑定用户信息
    static COMMAND_TUOGUAN = 16;//托管


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

    static GET_GOLD = 0;
    static ADD_GOLD = 1;
    static MINUS_GOLD = 2;
    static LOGININ = 3;//登录
    static REGISTER = 4;//注册

    static URL = "http://192.168.2.127:3000";

    static httpGetgold = 0;
    static httpAddgold = 1;
    static httpMinusold = 2;
    static httpSignIn = 3;
    static httpRegister = 4;
    static infor = 5;

    static uid = 0;
    static gold = 0;
    static id = 0;

    static isReconn = false;
}
