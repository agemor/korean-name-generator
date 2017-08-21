var maleNames = require('../database/male-names.json');

var r = train(maleNames);
console.log(generate(r));

function generate(nameData) {

    let choseong = 0, jungseong = 0, jongseong = 0;
    
    let ensure = (n) => n == undefined ? 0 : n; 

    // 초성 고르기
    sum = 0;
    for (let i = 0; i < 19; i++) {
        sum += ensure(nameData[0][i]);
    }
    let seed = Math.random() * sum;
    for (let i = 0; i < 19; i++) {
        if ((seed -= ensure(nameData[0][i])) <= 0) {
            choseong = i;
            break;
        }
    }
    
    // 중성 고르기
    sum = 0;
    for (let i = 0; i < 21; i++) {
        sum += ensure(nameData[1][choseong * 21 + i]);
    }

    seed = Math.random() * sum;
    for (let i = 0; i < 21; i++) {
        if ((seed -= ensure(nameData[1][choseong * 21 + i])) <= 0) {
            jungseong = i;
            break;
        }
    }

    // sum 다시 계산
    sum = 0;
    for (let i = 0; i < 28; i++) {
        sum += ensure(nameData[2][jungseong * 28 + i]) * ensure(nameData[3][choseong * 28 + i]);
    }

    // 종성 고르기
    seed = Math.random() * sum;
    for (let i = 0; i < 28; i++) {
        if ((seed -= ensure(nameData[2][jungseong * 28 + i]) * ensure(nameData[3][choseong * 28 + i])) <= 0) {
            jongseong = i;
            break;
        }
    }
    console.log([choseong, jungseong, jongseong]);
    let syllable = constructFromJamoIndex([choseong, jungseong, jongseong]);

    return syllable;
}

function train(nameList) {

    let trainedNameData = [[], [], [], []];

    let update = (array, index) => {
        array[index] = (array[index] == undefined ? 0 : array[index] + 1);
    }

    for (let i = 0; i < nameList.length; i++) {
        let firstName = nameList[i].substring(1);
        let cheot = firstName.charAt(0);
        let du = firstName.length > 0 ? firstName.charAt(1) : "";

        let cheotJamo = resolveToJamoIndex(cheot);
        if (cheotJamo == null) continue;

        update(trainedNameData[0], cheotJamo[0]);
        update(trainedNameData[1], cheotJamo[0] * 21 + cheotJamo[1]);
        update(trainedNameData[2], cheotJamo[1] * 28 + cheotJamo[2]);
        update(trainedNameData[3], cheotJamo[0] * 28 + cheotJamo[2]);
    }

    return trainedNameData;
}

function constructFromJamoIndex(jamoIndex) {
    return String.fromCharCode(0xAC00 + 28 * 21 * jamoIndex[0] + 28 * jamoIndex[1] + jamoIndex[2]);
}

function resolveToJamoIndex(syllable) {

    let code = syllable.charCodeAt(0) - 0xAC00;
    
    let choseong = Math.floor(((code - code % 28) / 28) / 21);
    let jungseong = Math.floor(((code - code % 28) / 28) % 21);
    let jongseong = code % 28;

    let isValid = (n) => !Number.isNaN(n) && n >= 0;

    if (!(isValid(choseong) && isValid(jungseong) && isValid(jongseong))) {
        return null;
    }

    return [choseong, jungseong, jongseong];
}