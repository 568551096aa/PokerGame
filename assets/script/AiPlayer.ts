import { DdzGame } from "./DdzGame";

export class AiPlayer {

    static game: any = null;

    // 随机抢地主
    static selectBoss() {
        if (this.randomNum(0, 1)) {
            return true;
        }
        else {
            return false;
        }
    }
    //生成从minNum到maxNum的随机数
    static randomNum(minNum: number, maxNum: number) {
        if (minNum == maxNum) {
            return minNum;
        }
        var Range = maxNum - minNum;
        var Rand = Math.random();
        var num = minNum + Math.round(Rand * Range); //四舍五入
        return num;
    }

    static playCards(pokers: number[]) {
        var num: number[] = new Array;
        for (var i = 0; i < pokers.length; i++) {
            num.push(pokers[0]);
            break;
        }
        return num;
    }

    static connCards(pokers: number[], connCardTypeAndSize: number[]) {

        //牌分为组合类型的牌  非组合类型的牌
        //组合类型 3-9连对 1-6三带一或二 5-12顺子     非组合 单 双王 四带两个或两对 
        var map = new Map();
        var i = 0;
        for (var i = 0; i < pokers.length; i++) {
            var num = 0;
            if (pokers[i] == 0) {
                num = -3;
            }
            else if (pokers[i] == 1) {
                num = -2;
            }
            else {
                num = Math.floor((pokers[i] - 2) / 4);
            }
            if (map.has(num)) {
                var temp = map.get(num);
                map.set(num, temp + 1);
            }
            else {
                map.set(num, 1);
            }
        }
        var nums: number[] = new Array;
        return nums;
        if (connCardTypeAndSize[0] == 1) {
            //单
            var index = -1;
            map.forEach((value, key) => {
                if (value == 1 && key > connCardTypeAndSize[0]) {
                    for (var i = 0; i < pokers.length; i++) {
                        if ((pokers[i] == 0 && key == -3) || (pokers[i] == 1 && key == -2) || (Math.floor((pokers[i] - 2) / 4) == key)) {
                            index = i;
                            break;
                        }
                    }
                    return;
                }
            });
            if (index != -1) {
                nums.push(index);
            }
        }
        else if (connCardTypeAndSize[0] == 2) {
            if (pokers.length < 2) {
                return nums;
            }
            var index = -1;
            map.forEach((value, key) => {
                if (connCardTypeAndSize[0] == 0) {
                    return;
                }
                if (value == 2 && key > connCardTypeAndSize[1]) {
                    var j = 0;
                    for (var i = 0; i < pokers.length; i++) {
                        if (key == Math.floor((pokers[i] - 2) / 4)) {
                            nums.push(index);
                            j++;
                        }
                        if (j == 2) {
                            break;
                        }
                    }
                }
            });
        }
        else if (connCardTypeAndSize[0] == 3) {
            if (pokers.length < 3) {
                return nums;
            }
            //三个
            var index = -1;
            map.forEach((value, key) => {
                if (value == 3 && key > connCardTypeAndSize[1]) {
                    var j = 0;
                    for (var i = 0; i < pokers.length; i++) {
                        if (key == Math.floor((pokers[i] - 2) / 4)) {
                            nums.push(index);
                            j++;
                        }
                        if (j == 3) {
                            break;
                        }
                    }
                }
            });
        }
        else if (connCardTypeAndSize[0] == 4) {
            if (pokers.length < 4) {
                return nums;
            }
            //三个
            var index = -1;
            map.forEach((value, key) => {
                if (value == 4 && key > connCardTypeAndSize[1]) {
                    var j = 0;
                    for (var i = 0; i < pokers.length; i++) {
                        if (key == Math.floor((pokers[i] - 2) / 4)) {
                            nums.push(index);
                            j++;
                        }
                        if (j == 4) {
                            break;
                        }
                    }
                }
            });
        }
        else if (connCardTypeAndSize[0] == 5) {
            if (pokers.length < 4) {
                return nums;
            }
            //三个带一个
            var index = -1;
            map.forEach((value, key) => {
                if (j != 3 && value == 3 && key > connCardTypeAndSize[1]) {
                    var j = 0;
                    for (var i = 0; i < pokers.length; i++) {
                        if (key == Math.floor((pokers[i] - 2) / 4)) {
                            nums.push(index);
                            j++;
                        }
                        if (j == 3) {
                            break;
                        }
                    }
                }
                if (j == 3) {
                    if (value >= 1) {
                        for (var i = 0; i < pokers.length; i++) {
                            if (key == Math.floor((pokers[i] - 2) / 4)) {
                                nums.push(index);
                                break;
                            }
                        }
                        j++;
                    }

                }
            });
        }
        else if (connCardTypeAndSize[0] == 6) {
            //三个带两个
            if (pokers.length < 5) {
                return nums;
            }
            var index = -1;
            var j = 0;
            map.forEach((value, key) => {
                if (j != 3 && value == 3 && key > connCardTypeAndSize[1]) {
                    for (var i = 0; i < pokers.length; i++) {
                        if (key == Math.floor((pokers[i] - 2) / 4)) {
                            nums.push(index);
                            j++;
                        }
                        if (j == 3) {
                            break;
                        }
                    }
                }
                if (j == 3) {
                    if (value >= 2) {
                        for (var i = 0; i < pokers.length; i++) {
                            if (key == Math.floor((pokers[i] - 2) / 4)) {
                                nums.push(index);
                                j++;
                                if (j == 5) {
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        }
        else if (connCardTypeAndSize[0] == 7) {
            if (pokers.length < 5) {
                return nums;
            }
            var index = -1;
            map.forEach((value, key) => {
                if (key <= 11) {
                    var index = 0;
                    for (var i = 1; i < 5; i++) {
                        if (!map.get(key + i)) {
                            index = -1;
                            break;
                        }
                    }
                    if (index == 0) {
                        var j = 0;
                        for (var i = 0; i < pokers.length; i++) {
                            if (key + j == Math.floor((pokers[i] - 2) / 4)) {
                                nums.push(index);
                                j++;
                                if (j == 5) {
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        }
        else if (connCardTypeAndSize[0] == 8) {

        }
        else if (connCardTypeAndSize[0] == 7) {
            //顺子
        }
        else if (connCardTypeAndSize[0] == 7) {
            //顺子
        }
        else if (connCardTypeAndSize[0] == 7) {
            //顺子
        }
        else if (connCardTypeAndSize[0] == 7) {
            //顺子
        }
        else if (connCardTypeAndSize[0] == 7) {
            //顺子
        }
        else if (connCardTypeAndSize[0] == 7) {
            //顺子
        }
        else if (connCardTypeAndSize[0] == 7) {
            //顺子
        }
        else if (connCardTypeAndSize[0] == 7) {
            //顺子
        }
        else if (connCardTypeAndSize[0] == 7) {
            //顺子
        }
        else if (connCardTypeAndSize[0] == 7) {
            //连对
        }
        else if (connCardTypeAndSize[0] == 7) {
            //连对
        }
        else if (connCardTypeAndSize[0] == 7) {
            //连对
        }
        else if (connCardTypeAndSize[0] == 7) {
            //连对
        }
        else if (connCardTypeAndSize[0] == 7) {
            //连对
        }
        else if (connCardTypeAndSize[0] == 7) {
            //连对
        }
        else if (connCardTypeAndSize[0] == 7) {
            //连对
        }
        else if (connCardTypeAndSize[0] == 7) {
            //三张连着
        }
        else if (connCardTypeAndSize[0] == 7) {
            //三张连着
        }
        else if (connCardTypeAndSize[0] == 7) {
            //三张连着
        }

        return nums;
    }
}
