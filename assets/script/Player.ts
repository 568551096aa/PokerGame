
export class Player {
    pokers: number[] = new Array();//手牌
    id: number = 0;//id顺序号
    uid: number = 0;//用户号
    state: number = -1;//叫地主 状态 -1位操作 0叫地主 1抢地主
    isOperate: boolean = false;//是否操作

    init() {

    }

    addPoker(pokers: number[]) {

    }

    deletePoker(index: number[]) {

    }

    compareAsc(numA: number, numB: number) {
        var A = numA, B = numB;
        if (A == 0 || A == 1) {
            A += 54;
        }
        if (B == 0 || B == 1) {
            B += 54;
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
        for (var i = 0; i < this.pokers.length; i++) {
            console.log(this.pokers[i]);
        }
        this.pokers.sort(this.compareAsc);
        console.log("soet");
        for (var i = 0; i < this.pokers.length; i++) {
            console.log(this.pokers[i]);
        }
    }
}
