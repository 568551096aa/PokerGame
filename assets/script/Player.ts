
export class Player {

    isOperate: boolean = false;//是否操作
    id: number = 0;//id顺序号
    uid: number = 0;//用户号

    pokers: number[] = null;//手牌
    lastPokers: number[] = null;//最后一次出手的牌
    validPokerNum: number = 0;//剩余手牌数
    playedPokers: boolean[] = null;//记录已经出的手牌
    isBoss: boolean = false;
    textType: number = 0;
    istuoguan:boolean = false;

    init(pokers: number[]) {
        this.validPokerNum = 17;
        this.pokers = new Array(this.validPokerNum);
        this.playedPokers = new Array(this.validPokerNum);
        for (var i = 0; i < this.validPokerNum; i++) {
            this.playedPokers[i] = false;
            this.pokers[i] = pokers[i];
        }
    }

    playCard(pokers: number[]) {

    }

    connCard(pokers: number[]) {

    }

    getValidPokerNum() {
        return this.validPokerNum;
    }

    setBoss(pokers: number[]) {
        this.isBoss = true;
        for (var i = 0; i < pokers.length; i++) {
            this.playedPokers.push(false);
            this.pokers.push(pokers[i]);
        }
        this.validPokerNum += pokers.length;
    }

    deletePoker(index: number[]) {
        for (var i = 0; i < index.length; i++) {
            this.playedPokers[i] = false;
            this.validPokerNum--;
        }
    }

    compareAsc(numA: number, numB: number) {
        var A = numA, B = numB;
        if (A == 1) {
            A += 54;
        }
        else if (A == 0) {
            A += 56;
        }
        if (B == 1) {
            B += 54;
        }
        else if (B == 0) {
            B += 56;
        }
        if (A < B) {
            return -1;
        }
        else {
            return 1;
        }
    }

    //洗牌
    sortPokers() {
        this.pokers.sort(this.compareAsc);
        console.log("sort");
    }
}
