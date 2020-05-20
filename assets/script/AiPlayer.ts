
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
    //自己出牌
    static playCards(pokers: number[]) {
        var type = this.game.getPokerTypeAndLevel(pokers);
        //直接出完
        if (type[0] != -1) {
            return pokers;
        }
        var nums = new Array();
        var map = new Map<number, number>();
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
        if (pokers.length == 2 && pokers[0] == 0 && pokers[1] == 1) {
            nums = pokers;
            return nums;
        }
        if (pokers.length == 1) {
            nums = pokers;
            return nums;
        }
        //所有单张 对子 三张 四张 
        var aNum = 0, bNum = 0, cNum = 0, dNum = 0;
        var aFirst = new Array(), bFirst = new Array(), cFirst = new Array(), dFirst = new Array();
        map.forEach((value, key) => {
            if (value == 1) {
                aNum++;
                aFirst.push(key);
            }
            if (value == 2) {
                bNum++;
                bFirst.push(key);
            }
            if (value == 3) {
                cNum++;
                cFirst.push(key);
            }
            if (value == 4) {
                dNum++;
                dFirst.push(key);
            }
        });
        //优先级 顺子 三张 两张 四张
        for (i = 0; i < aFirst.length; i++) {
            if (aFirst[i] >= 8) {
                break;
            }
            if (aFirst[i] <= type[2]) {
                continue;
            }
            var beg = 0;
            for (var j = i + 1; j < aFirst.length; j++) {
                if (aFirst[j] = aFirst[j - 1] + 1) {
                    beg++;
                    if (beg == type[1]) {
                        var k = i;
                        for (var k = 0; k < pokers.length; k++) {
                            if (Math.floor((pokers[k] - 2) / 4) == aFirst[k]) {
                                nums.push(pokers[k]);
                                k++;
                                if (k == type[1]) {
                                    break;
                                }
                            }
                        }
                        return nums;
                    }
                }
                else {
                    break;
                }
            }
        }
        if (cNum > 0) {
            var time = 1;
            for (var i = 0; i < cFirst.length; i++) {
                time = 1
                for (var j = i + 1; j < cFirst.length; j++) {
                    if (cFirst[j] < 12 && cFirst[j] == cFirst[j - 1] + 1) {
                        time++;
                    }
                    else {
                        break;
                    }
                }
                if (time >= 2) {
                    //找单牌
                    if (aNum >= time) {
                        var abite = 0;
                        for (var k = 0; k < pokers.length; k++) {
                            if (Math.floor((pokers[k] - 2) / 4) == aFirst[abite]) {
                                nums.push(pokers[k]);
                                abite++;
                                if (abite == time) {
                                    break;
                                }
                            }
                        }
                    }
                    //找对子
                    else if (bNum >= time) {
                        var bbite = 0, two = 0;
                        for (var k = 0; k < pokers.length; k++) {
                            if (Math.floor((pokers[k] - 2) / 4) == bFirst[bbite]) {
                                nums.push(pokers[k]);
                                two++;
                                if (two == 2) {
                                    two = 0;
                                    bbite++;
                                }
                                if (bbite == time) {
                                    break;
                                }
                            }
                        }
                    }
                    var cbite = i, three = 0;
                    for (var k = 0; k < pokers.length; k++) {
                        if (Math.floor((pokers[k] - 2) / 4) == cFirst[cbite]) {
                            nums.push(pokers[k]);
                            three++;
                            if (three == 3) {
                                three = 0;
                                cbite++;
                            }
                            if (cbite == time) {
                                break;
                            }
                        }
                    }
                    return nums;
                }
            }
            //找单牌
            if (aNum >= time) {
                var abite = 0;
                for (var k = 0; k < pokers.length; k++) {
                    if (Math.floor((pokers[k] - 2) / 4) == aFirst[abite]) {
                        nums.push(pokers[k]);
                        abite++;
                        if (abite == time) {
                            break;
                        }
                    }
                }
            }
            //找对子
            else if (bNum >= time) {
                var bbite = 0, two = 0;
                for (var k = 0; k < pokers.length; k++) {
                    if (Math.floor((pokers[k] - 2) / 4) == bFirst[bbite]) {
                        nums.push(pokers[k]);
                        two++;
                        if (two == 2) {
                            two = 0;
                            bbite++;
                        }
                        if (bbite == time) {
                            break;
                        }
                    }
                }
            }
            var cbite = 0, three = 0;
            for (var k = 0; k < pokers.length; k++) {
                if (Math.floor((pokers[k] - 2) / 4) == cFirst[cbite]) {
                    nums.push(pokers[k]);
                    three++;
                    if (three == 3) {
                        three = 0;
                        cbite++;
                    }
                    if (cbite == time) {
                        break;
                    }
                }
            }
            return nums;
        }
        if (bNum > 0) {
            var time = 1;
            for (var i = 0; i < bFirst.length; i++) {
                time = 1;
                for (var j = i + 1; j < bFirst.length; j++) {
                    if (bFirst[j] < 12 && bFirst[j] == bFirst[j - 1] + 1) {
                        time++;
                    }
                    else {
                        break;
                    }
                }
                if (time >= 3) {
                    var bbite = i, two = 0;
                    for (var k = 0; k < pokers.length; k++) {
                        if (Math.floor((pokers[k] - 2) / 4) == bFirst[bbite]) {
                            nums.push(pokers[k]);
                            two++;
                            if (two == 2) {
                                two = 0;
                                bbite++;
                            }
                            if (bbite == time) {
                                break;
                            }
                        }
                    }
                    return nums;
                }
            }
            time = 1;
            var bbite = 0, two = 0;
            for (var k = 0; k < pokers.length; k++) {
                if (Math.floor((pokers[k] - 2) / 4) == bFirst[bbite]) {
                    nums.push(pokers[k]);
                    two++;
                    if (two == 2) {
                        two = 0;
                        bbite++;
                    }
                    if (bbite == time) {
                        break;
                    }
                }
            }
            return nums;
        }
        if (aNum > 0) {
            var abite = 0;
            for (var k = 0; k < pokers.length; k++) {
                if (Math.floor((pokers[k] - 2) / 4) == aFirst[abite]) {
                    nums.push(pokers[k]);
                    break;
                }
            }
            return nums;
        }
        if (dNum > 0) {
            var dbite = 0, four = 0;
            for (var k = 0; k < pokers.length; k++) {
                if (Math.floor((pokers[k] - 2) / 4) == dFirst[dbite]) {
                    nums.push(pokers[k]);
                    four++;
                    if (four == 4) {
                        break;
                    }
                }
            }
            return nums;
        }
        console.warn("错误", pokers);
    }

    //王炸： 0 顺子：1 长度 第一张牌大小   4张炸弹： 2 第一张牌大小 
    //四张带一张： 3 个数 第一张牌大小 四张带两张： 4 个数 第一张牌大小
    //3张：5 个数 第一张大小 三张带一张：6 个数 第一张大小 三张带两张：7 个数 第一张大小
    //2张：8 个数 第一张大小
    //1张：9 大小
    //单张

    //接对手牌
    static connCards(pokers: number[], type: number[]) {
        //牌分为组合类型的牌  非组合类型的牌
        //组合类型 3-9连对 1-6三带一或二 5-12顺子     非组合 单 双王 四带两个或两对 
        var map = new Map();
        var i = 0;
        for (i = 0; i < pokers.length; i++) {
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
        if (type[0] == 0) {
            return nums;
        }
        if (type[0] == 1 && type[2] != 7) {
            var max = -1, min = 20;
            var aFirst = new Array();
            var aNum = 0;
            map.forEach((value, key) => {
                if (value == 1) {
                    aNum++;
                    aFirst.push(key);
                }
            });
            for (i = 0; i < aFirst.length; i++) {
                if (aFirst[i] >= 8) {
                    break;
                }
                if (aFirst[i] <= type[2]) {
                    continue;
                }
                var beg = 0;
                for (var j = i + 1; j < aFirst.length; j++) {
                    if (aFirst[j] = aFirst[j - 1] + 1) {
                        beg++;
                        if (beg == type[1]) {
                            var k = i;
                            for (var k = 0; k < pokers.length; k++) {
                                if (Math.floor((pokers[k] - 2) / 4) == aFirst[k]) {
                                    nums.push(pokers[k]);
                                    k++;
                                    if (k == type[1]) {
                                        break;
                                    }
                                }
                            }
                            return nums;
                        }
                    }
                    else {
                        break;
                    }
                }

            }
        }
        else if (type[0] == 2) {
            var dFirst = new Array();
            var dNum = 0;
            map.forEach((value, key) => {
                if (value == 4) {
                    dNum++;
                    dFirst.push(key);
                }
            });
            for (i = 0; i < dFirst.length; i++) {
                if (dFirst[i] > type[2]) {
                    for (var k = 0; k < pokers.length; k++) {
                        if (Math.floor((pokers[k] - 2) / 4) == dFirst[i]) {
                            nums.push(pokers[k]);
                        }
                        else {
                            break;
                        }
                    }
                    return nums;
                }
            }
        }
        else if (type[0] == 3) {
            var dFirst = new Array();
            var dNum = 0;
            var aFirst = new Array();
            var aNum = 0;
            map.forEach((value, key) => {
                if (value == 1) {
                    aNum++;
                    aFirst.push(key);
                }
                if (value == 4) {
                    dNum++;
                    dFirst.push(key);
                }
            });
            if (dNum >= type[1]) {
                for (i = 0; i < dFirst.length; i++) {
                    if (dFirst[i] <= type[2]) {
                        continue;
                    }
                    var j = 0, bite = 1;
                    for (j = i + 1; j < dFirst.length; j++) {
                        if (dFirst[j] < 12 && dFirst[j] == dFirst[j - 1] + 1) {
                            bite++;
                            if (bite == type[1]) {
                                if (aNum >= type[1]) {
                                    var beg = 0;
                                    for (var k = 0; k < pokers.length; k++) {
                                        if (Math.floor((pokers[k] - 2) / 4) == aFirst[beg]) {
                                            nums.push(pokers[k]);
                                            beg++;
                                            if (beg == type[1]) {
                                                break;
                                            }
                                        }
                                    }

                                    beg = 0;
                                    var four = 0;
                                    for (var k = 0; k < pokers.length; k++) {
                                        if (Math.floor((pokers[k] - 2) / 4) == dFirst[beg]) {
                                            nums.push(pokers[k]);
                                            four++;
                                            if (four == 4) {
                                                four = 0;
                                                beg++;
                                            }
                                            if (beg == type[1]) {
                                                break;
                                            }
                                        }
                                    }
                                    return nums;
                                }
                                else {
                                    break;
                                }
                            }
                        }
                    }
                }
            }

        }
        else if (type[0] == 4) {
            var dFirst = new Array();
            var dNum = 0;
            var bFirst = new Array();
            var bNum = 0;
            map.forEach((value, key) => {
                if (value == 2) {
                    bNum++;
                    bFirst.push(key);
                }
                if (value == 4) {
                    dNum++;
                    dFirst.push(key);
                }
            });
            if (dNum >= type[1]) {
                for (i = 0; i < dFirst.length; i++) {
                    if (dFirst[i] <= type[2]) {
                        continue;
                    }
                    var j = 0, bite = 1;
                    for (j = i + 1; j < dFirst.length; j++) {
                        if (dFirst[j] < 12 && dFirst[j] == dFirst[j - 1] + 1) {
                            bite++;
                            if (bNum >= type[1]) {
                                var beg = 0, two = 0;
                                for (var k = 0; k < pokers.length; k++) {
                                    if (Math.floor((pokers[k] - 2) / 4) == bFirst[beg]) {
                                        nums.push(pokers[k]);
                                        two++;
                                        if (two == 2) {
                                            two = 0;
                                            beg++;
                                        }
                                        if (beg == type[1]) {
                                            break;
                                        }
                                    }
                                }

                                beg = i;
                                var four = 0;
                                for (var k = 0; k < pokers.length; k++) {
                                    if (Math.floor((pokers[k] - 2) / 4) == dFirst[beg]) {
                                        nums.push(pokers[k]);
                                        four++;
                                        if (four == 4) {
                                            four = 0;
                                            beg++;
                                        }
                                        if (beg == type[1]) {
                                            break;
                                        }
                                    }
                                }
                                return nums;
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
            }
        }
        else if (type[0] == 5) {
            var cFirst = new Array();
            var cNum = 0;
            map.forEach((value, key) => {
                if (value == 3) {
                    cNum++;
                    cFirst.push(key);
                }
            });
            if (cNum >= type[1]) {
                for (i = 0; i < cFirst.length; i++) {
                    if (cFirst[i] <= type[2]) {
                        continue;
                    }
                    var j = 0, bite = 1;
                    for (j = i + 1; j < cFirst.length; j++) {
                        if (cFirst[j] < 12 && cFirst[j] == cFirst[j - 1] + 1) {
                            bite++;
                            if (bite == type[1]) {
                                var beg = i, three = 0;
                                for (var k = 0; k < pokers.length; k++) {
                                    if (Math.floor((pokers[k] - 2) / 4) == cFirst[beg]) {
                                        nums.push(pokers[k]);
                                        three++;
                                        if (three == 3) {
                                            three = 0;
                                            beg++;
                                        }
                                        if (beg == type[1]) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return nums;

        }
        else if (type[0] == 6) {
            var cFirst = new Array();
            var cNum = 0;
            var aFirst = new Array();
            var aNum = 0;
            map.forEach((value, key) => {
                if (value == 1) {
                    aNum++;
                    aFirst.push(key);
                }
                if (value == 3) {
                    cNum++;
                    cFirst.push(key);
                }
            });
            if (cNum >= type[1]) {
                for (i = 0; i < cFirst.length; i++) {
                    if (cFirst[i] <= type[2]) {
                        continue;
                    }
                    var j = 0, bite = 1;
                    for (j = i + 1; j < cFirst.length; j++) {
                        if (cFirst[j] < 12 && cFirst[j] == cFirst[j - 1] + 1) {
                            bite++;
                            if (bite == type[1]) {
                                if (aNum >= type[1]) {
                                    var beg = 0;
                                    for (var k = 0; k < pokers.length; k++) {
                                        if (Math.floor((pokers[k] - 2) / 4) == aFirst[beg]) {
                                            nums.push(pokers[k]);
                                            beg++;
                                            if (beg == type[1]) {
                                                break;
                                            }
                                        }
                                    }

                                    beg = i;
                                    var three = 0;
                                    for (var k = 0; k < pokers.length; k++) {
                                        if (Math.floor((pokers[k] - 2) / 4) == cFirst[beg]) {
                                            nums.push(pokers[k]);
                                            three++;
                                            if (three == 3) {
                                                three = 0;
                                                beg++;
                                            }
                                            if (beg == type[1]) {
                                                break;
                                            }
                                        }
                                    }
                                    return nums;
                                }
                                else {
                                    break;
                                }
                            }
                        }
                    }
                }
            }

        }
        else if (type[0] == 7) {
            var cFirst = new Array();
            var cNum = 0;
            var bFirst = new Array();
            var bNum = 0;
            map.forEach((value, key) => {
                if (value == 2) {
                    bNum++;
                    bFirst.push(key);
                }
                if (value == 3) {
                    cNum++;
                    cFirst.push(key);
                }
            });
            if (cNum >= type[1]) {
                for (i = 0; i < cFirst.length; i++) {
                    if (cFirst[i] <= type[2]) {
                        continue;
                    }
                    var j = 0, bite = 1;
                    for (j = i + 1; j < cFirst.length; j++) {
                        if (cFirst[j] < 12 && cFirst[j] == cFirst[j - 1] + 1) {
                            bite++;
                            if (bNum >= type[1]) {
                                var beg = 0, two = 0;
                                for (var k = 0; k < pokers.length; k++) {
                                    if (Math.floor((pokers[k] - 2) / 4) == bFirst[beg]) {
                                        nums.push(pokers[k]);
                                        two++;
                                        if (two == 2) {
                                            two = 0;
                                            beg++;
                                        }
                                        if (beg == type[1]) {
                                            break;
                                        }
                                    }
                                }

                                beg = i;
                                var three = 0;
                                for (var k = 0; k < pokers.length; k++) {
                                    if (Math.floor((pokers[k] - 2) / 4) == cFirst[beg]) {
                                        nums.push(pokers[k]);
                                        three++;
                                        if (three == 3) {
                                            three = 0;
                                            beg++;
                                        }
                                        if (beg == type[1]) {
                                            break;
                                        }
                                    }
                                }
                                return nums;
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
            }
        }
        else if (type[0] == 8) {
            var bFirst = new Array();
            var bNum = 0;
            map.forEach((value, key) => {
                if (value == 2) {
                    bNum++;
                    bFirst.push(key);
                }
            });
            if (bNum >= type[1]) {
                for (i = 0; i < bFirst.length; i++) {
                    if (bFirst[i] <= type[2]) {
                        continue;
                    }
                    var j = 0, bite = 1;
                    for (j = i + 1; j < bFirst.length; j++) {
                        if (bFirst[j] < 12 && bFirst[j] == bFirst[j - 1] + 1) {
                            bite++;
                        }
                        else {
                            break;
                        }
                    }
                    if (type[1] >= 3 && bite == type[1] && bFirst[i] > type[2]) {
                        var beg = 0, two = 0;
                        for (var k = 0; k < pokers.length; k++) {
                            if (Math.floor((pokers[k] - 2) / 4) == bFirst[beg + i]) {
                                nums.push(pokers[k]);
                                two++;
                                if (two == 2) {
                                    two = 0;
                                    beg++;
                                }
                                if (beg == type[1]) {
                                    return nums;
                                }
                            }
                        }
                    }
                    if (type[1] == 1 && bFirst[i] > type[2]) {
                        var two = 0;
                        for (var k = 0; k < pokers.length; k++) {
                            if (Math.floor((pokers[k] - 2) / 4) == bFirst[beg + i]) {
                                nums.push(pokers[k]);
                                two++;
                                if (two == 2) {
                                    return nums;
                                }
                            }
                        }
                    }
                }

            }
            return nums;
        }
        else if (type[0] == 9) {
            if (type[2] != 100) {
                if (type[2] == 99) {
                    if (map.has(-3)) {
                        nums.push(0);
                    }
                }
                else {
                    var beg = 0;
                    for (var k = 0; k < pokers.length; k++) {
                        if (Math.floor((pokers[k] - 2) / 4) > type[2]) {
                            nums.push(pokers[k]);
                            return nums;
                        }
                    }
                    if (map.has(-2)) {
                        nums.push(1);
                    }
                    else if (map.has(-3)) {
                        nums.push(0);
                    }
                    else {
                        for (var k = 0; k < pokers.length; k++) {
                            if (Math.floor((pokers[k] - 2) / 4) > 10 && Math.floor((pokers[k] - 2) / 4) > type[2]) {
                                nums.push(pokers[k]);
                                break;
                            }
                        }
                    }
                }
                return nums;
            }
        }
        var dFirst = new Array();
        var dNum = 0;
        map.forEach((value, key) => {
            if (value == 4) {
                dNum++;
                dFirst.push(key);
            }
        });
        //炸弹
        for (i = 0; i < dFirst.length; i++) {
            if (dFirst[i]) {
                for (var k = 0; k < pokers.length; k++) {
                    if (Math.floor((pokers[k] - 2) / 4) == dFirst[i]) {
                        nums.push(pokers[k]);
                    }
                    else {
                        break;
                    }
                }
                return nums;
            }
        }
        //王炸
        if (map.has(-3) && map.has(-2)) {
            nums.push(0, 1);
            return nums;
        }
        return nums;

    }

    //接队友牌
    static connCardsFrame(pokers: number[], connCardTypeAndSize: number[]) {
        var nums: number[] = new Array;
        return nums;
    }


    static playCards1(pokers: number[]) {
        //所有单张 对子 三张 四张 
        var aNum = 0, bNum = 0, cNum = 0, dNum = 0;
        var map = new Map<number, number>();
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
        var aFirst = new Array(), bFirst = new Array(), cFirst = new Array(), dFirst = new Array();
        map.forEach((value, key) => {
            if (value == 1) {
                aNum++;
                aFirst.push(key);
            }
            if (value == 2) {
                bNum++;
                bFirst.push(key);
            }
            if (value == 3) {
                cNum++;
                cFirst.push(key);
            }
            if (value == 4) {
                dNum++;
                dFirst.push(key);
            }
        });
    }




}

