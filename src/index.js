var trainedData = require('./trained-data.js');

console.log(generate());

/**
 * 랜덤한 한국 이름을 생성한다.
 */
function generate() {

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
         
        let choseong = pick(19, (n) => ensure(trainedData.firstNames[set][0][n]));
        let jungseong = pick(21, (n) => ensure(trainedData.firstNames[set][1][choseong * 21 + n]));
        let jongseong = pick(28, (n) => ensure(trainedData.firstNames[set][2][jungseong * 28 + n]) * ensure(trainedData.firstNames[set][3][choseong * 28 + n]));

        return constructFromJamoIndex([choseong, jungseong, jongseong]);
    }

    let pickLastName = () => {

        let lastNameIndex = pick(trainedData.lastNames.length, (n) => trainedData.lastNameFrequency[n]);

        return String.fromCharCode(trainedData.lastNames[lastNameIndex] + 0xAC00);
    }

    return pickLastName() + pickSyllable(0) + pickSyllable(1);
}


/**
 * 이름 리스트를 토대로 통계적 학습 데이터를 생성한다.
 * 
 * @param {array} nameList 
 */
function train(nameList) {

    let trainedNameData = [[[], [], [], []], [[], [], [], []]];

    let increase = (array, index) => {
        array[index] = (array[index] == undefined ? 0 : array[index] + 1);
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

    return trainedNameData;
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