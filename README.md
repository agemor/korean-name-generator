# Korean Name Generator [![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/korean-name-generator.svg
[npm-url]: https://npmjs.org/package/korean-name-generator

한국어 이름을 랜덤으로 작명해 주는 라이브러리입니다. 남자 이름과 여자 이름 중 하나를 지정하면 그에 어울리는 이름이 생성됩니다.

## 설치하기
```
npm install korean-name-generator
```

## 사용하기
```javascript
var namer = require("korean-name-generator");

// 남자 이름 생성
var maleName = namer.generate(true);

// 여자 이름 생성
var femaleName = namer.generate(false);
```

## 작명 원리

초성, 중성, 종성의 자모별 연관 관계를 [인접행렬](https://en.wikipedia.org/wiki/Adjacency_matrix) 형태로 도출한 후, 아래와 같은 간단한 확률 모델을 사용하여 *어울릴 법한* 자모들을 조합하는 방식입니다. 초성이 선택되면 중성의 확률변수 `A`가 정해지고, 중성이 정해지면 종성의 확률변수 `B*C`가 정해집니다.

![Diagram](https://user-images.githubusercontent.com/6297755/29570112-74a030aa-8790-11e7-906a-e479e982fe08.png)

현재 기본적으로 남자 이름은 약 10000개, 여자 이름은 1000개가 학습되어 있으나, 다른 이름을 학습 데이터로 사용할 수도 있습니다.
```javascript
var names = ["홍범도", "안중근", "유관순", "이봉창", "김좌진"];

// 학습
var trainedData = namer.train(names);

// 학습된 데이터를 바탕으로 이름 생성
var name = namer.generateCustom(trainedData);
```

## 라이센스
이 프로젝트는 [MIT]() 라이센스에 따라 자유롭게 이용 가능합니다.
