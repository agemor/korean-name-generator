# Korean Name Generator [![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/korean-name-generator.svg
[npm-url]: https://npmjs.org/package/korean-name-generator

한국어 이름을 랜덤으로 작명해 주는 간단한 라이브러리입니다. 남자 이름과 여자 이름 중 하나를 지정하면 그에 어울리는 이름이 생성됩니다. 통계적 학습 방법을 사용하여 그럴듯한 이름이 만들어지도록 하였습니다.


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

### 작명 예제
```javascript
// 남자 이름
"곽형수", "전창희", "박진석", "이상지", "송성훈", "김혜석", "김장군", "최정웅", "서재균", "고상희", "이승호"

// 여자 이름
"이세연", "홍승현", "최주원", "변지경", "최은아", "이민서", "권주안", "진하은", "김소경", "임수영", "정유진"
```

## 다른 언어에서 사용하기
현재 Python과 Go로 포팅된 버전이 존재합니다.

| 환경   | 리포지토리                                                                | 개발                                     |
|--------|---------------------------------------------------------------------------|------------------------------------------|
| Python | [korean-name-generator](https://github.com/tinyjin/korean-name-generator) | [@tinyjin](https://github.com/tinyjin)   |
| Go     | [korname](https://github.com/dfkdream/korname)                            | [@dfkdream](https://github.com/dfkdream) |

## 작명 원리

초성, 중성, 종성의 자모별 연관 관계를 [인접행렬](https://en.wikipedia.org/wiki/Adjacency_matrix) 형태로 도출한 후, 아래와 같은 간단한 확률 모델을 사용하여 *어울릴 법한* 자모들을 조합하는 방식입니다. 초성이 선택되면 중성의 확률변수 `A`가 정해지고, 중성이 정해지면 종성의 확률변수 `B*C`가 정해집니다.

![Diagram](https://user-images.githubusercontent.com/6297755/29570112-74a030aa-8790-11e7-906a-e479e982fe08.png)

### 커스텀 학습 데이터

현재 기본 내장된 `trained-data.js`에 약 10,000개의 90년대생 남자 이름과 약 1,000개의 90년대생 여자 이름이 학습되어 있습니다. 혹시 다른 특성을 가진 이름군을 소스로 사용하고 싶다면, 아래의 메서드로 학습 및 적용이 가능합니다.
```javascript
var names = ["홍범도", "안중근", "유관순", "이봉창", "김좌진"];

// 학습
var trainedData = namer.train(names);

// 학습된 데이터를 바탕으로 이름 생성
var name = namer.generateCustom(trainedData);
```
커스텀 데이터를 사용하실 경우 최소 500개 이상의 이름을 학습시키는 것을 권장합니다.

## 라이센스
이 프로젝트는 [MIT]() 라이센스에 따라 자유롭게 이용 가능합니다.
