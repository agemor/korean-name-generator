var trainedData = require("./trained-data.js");

trainedData.firstNames = uncompressEmptyPart(trainedData.firstNames);

/**
 * 랜덤한 한국 이름을 생성한다.
 * 
 * @param {boolean} isMale 
 */
function generate(trainedDataMatrix) {

    let ensure = (n) => n == undefined ? 0 : n;

    // 요소들의 가중치에 비례한 확률로 랜덤 뽑기
    let pick = (count, item) => {

        let sum = 0;
        let selected = 0;

        for (let i = 0; i < count; i++) {
            sum += item(i);
        }

        let pivot = Math.random() * sum;

        for (let i = 0; i < count; i++) {
            if ((pivot -= item(i)) <= 0) {
                selected = i;
                break;
            }
        }

        return selected;
    }

    // 랜덤으로 음절 생성
    let pickSyllable = (set) => {

        let choseong = pick(19, (n) => ensure(trainedDataMatrix[set][0][n]));
        let jungseong = pick(21, (n) => ensure(trainedDataMatrix[set][1][choseong * 21 + n]));
        let jongseong = pick(28, (n) => ensure(trainedDataMatrix[set][2][jungseong * 28 + n]) * ensure(trainedDataMatrix[set][3][choseong * 28 + n]));

        return constructFromJamoIndex([choseong, jungseong, jongseong]);
    }

    let pickLastName = () => {

        let lastNameIndex = pick(trainedData.lastNames.length, (n) => trainedData.lastNameFrequency[n]);

        return String.fromCharCode(trainedData.lastNames[lastNameIndex] + 0xAC00);
    }

    return pickLastName() + pickSyllable(0) + pickSyllable(1);
}

function generateByDefault(isMale = true) {
    return generate(trainedData.firstNames[isMale ? 0 : 1]);
}

/**
 * 이름 리스트를 토대로 통계적 학습 데이터를 생성한다.
 * 
 * @param {array} nameList 
 */
function train(nameList, compress = false) {

    let trainedNameData = [
        [
            [],
            [],
            [],
            []
        ],
        [
            [],
            [],
            [],
            []
        ]
    ];

    let increase = (array, index) => {
        array[index] = (array[index] == undefined ? 1 : array[index] + 1);
    };

    let process = (set, jamo) => {
        increase(trainedNameData[set][0], jamo[0]);
        increase(trainedNameData[set][1], jamo[0] * 21 + jamo[1]);
        increase(trainedNameData[set][2], jamo[1] * 28 + jamo[2]);
        increase(trainedNameData[set][3], jamo[0] * 28 + jamo[2]);
    };

    for (let i = 0; i < nameList.length; i++) {

        let firstName = nameList[i].substring(1);

        let cheot = firstName.charAt(0);
        let du = firstName.length > 0 ? firstName.charAt(1) : "";

        let cheotJamo = resolveToJamoIndex(cheot);
        let duJamo = resolveToJamoIndex(du);

        if (cheotJamo != null) process(0, cheotJamo);
        if (duJamo != null) process(1, duJamo);
    }

    return compress ? compressEmptyPart(trainedNameData) : trainedNameData;
}

/**
 * 빈 공간이 많은 배열을 압축한다.
 * 
 * @param {array} array 
 */
function compressEmptyPart(array) {

    let compressedArray = [];
    let emptyCount = 0;

    for (let i = 0; i < array.length; i++) {

        if (array[i] == null) {
            emptyCount++;
        } else if (array[i] instanceof Array) {
            compressedArray.push(compressEmptyPart(array[i]));
        } else {
            if (emptyCount > 0) {
                compressedArray.push(-emptyCount);
                emptyCount = 0;
            }
            compressedArray.push(array[i]);
        }
    }

    return compressedArray;
}

/**
 * 압축된 배열을 원래 상태로 되돌린다.
 * 
 * @param {array} array 
 */
function uncompressEmptyPart(array) {

    let originalArray = [];

    for (let i = 0; i < array.length; i++) {

        if (array[i] instanceof Array) {
            originalArray.push(uncompressEmptyPart(array[i]));
        } else {

            if (array[i] >= 0) {
                originalArray.push(array[i]);
            } else {

                for (let j = 0; j < -array[i]; j++) {
                    originalArray.push(0);
                }
            }
        }
    }

    return originalArray;
}

/**
 * 자모 배열로부터 음절을 생성한다.
 * 
 * @param {array} jamoIndex 
 */
function constructFromJamoIndex(jamoIndex) {
    return String.fromCharCode(0xAC00 + 28 * 21 * jamoIndex[0] + 28 * jamoIndex[1] + jamoIndex[2]);
}

/**
 * 음절로부터 자보 배열을 생성한다.
 * 
 * @param {string} syllable 
 */
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

module.exports = {
    generate: generateByDefault,
    generateCustom: generate,
    train: train
};