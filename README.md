# Visual Code.Studio

![](README.assets/visualcode.studio.gif)

[YouTube 데모](https://youtu.be/tiP9faHD5Zc)

"visual code.studio"는 [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter)를 활용한 Javascript 코드 시각화 어플리케이션 입니다.



## Installation

```shell
git clone https://github.com/kizmo04/visualcode.studio.git
cd visualcode.studio
npm install
npm start
```



## Features

- [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter)을 이용한 line by line 코드 실행
- Codemirror를 이용한 Code Editor
- 스크립트에서 실행되고 있는 line은 하이라이트 효과
- 실행중인 line의 Closure Execution Context를 실시간 Logging
- Context의 Value에 변동이 있을 경우(재할당) Log에서 붉은 색 하이라이트 효과
- [Pts.js](https://ptsjs.org)을 이용해 실행중인 line의 Closure Excution Context를 애니메이션으로 시각화
  - Function Declaration, Function Expression 시 Function을 Background Animation 으로 표현
  - For Statement, For In Statement, While Statement, Do While Statement의 경우 배경이 빠르게 회전하도록 표현
  - Array, ArrayLike Type의 변수는 Cardinal Curve 곡선으로 표현
  - undefined Type의 변수는 500ms 간격으로 반지름과 색상이 변화하는 원으로 표현
  - String Type의 변수는 length의 크기와 같은 width를 갖는 직사각형으로 표현
  - Object Type 변수는 하늘색 정사각형으로 표현
  - Boolean Type 변수는 true일 경우 보라색 원, false일 경우 노란색 원으로 표현
  - Number Type 변수는 value를 n으로 하는 n각형으로 표현 (3 미만일 경우 삼각형)
- Firebase Realtime Database로 스크립트를 저장 후 Url로 Sharing
- Slider로 실행 속도를 조절
- 스크립트 실행은 ES5 Syntax 지원
- Web API 지원
  - Console (`.log()`, `.error()`, `.dir()`, `.warn()`, `.clear()`)
  - `alert()`



## Skills

- Modern Javascript (ES2015+)
- React를 이용한 Component Based Architecture
- Redux.js를 이용한 Predictable State Container
- Sass Modules, Bulma를 통해 Variables, Mixins, Nesting Style CSS 사용
- Jest, Enzyme을 이용한 테스트



## Test

- Reducer Unit Test (Jest)
- Component Unit Test (Jest, Enzyme)
- Integration Test 셋업



## Deployment & Continuous Integration

- Netlify CI로 테스트 및 배포 자동화



## Project Control

- Git Branch(Dev, Master) 기반 개발 진행
- Trello를 이용한 Task Management



## Challenges & Things to do

### 1. Limit of Interpreter Architecture

프로젝트에 사용한 [Interpreter의 설계상 제약](https://github.com/NeilFraser/JS-Interpreter/issues/130)으로

> ### JS-Interpreter Restriction
>
> The version of JavaScript implemented by the interpreter has a few differences from that which executes in a browser:
>
> - API
>   None of the DOM APIs are exposed. That's kind of the point of a sandbox. If you need these, write your own interfaces.
> - ES6
>   More recent additions to JavaScript such as let or Set aren't implemented. Feel free to fork the project if you need more than ES5.
> - toString & valueOf
>   User-created functions are not called when casting objects to primitives.
> - Performance
>   The interpreter is not particularly efficient. It currently runs about 200 times slower than native JavaScript.

> ### [External Higher Order Functions #130](https://github.com/NeilFraser/JS-Interpreter/issues/130)
>
> this is a limitation of the interpreter, it is *really* hard for external JavaScript to initiate a callback into the interpreter. The solution is to move the higher order function into the interpreted code.

Higher Order Function이 포함된 스크립트의 실행이 어려워졌습니다. 초기 프로젝트 일정 상 기능 구현에 할애할 수 있는 시간이 10여일뿐이었고, 프로젝트 진행 중반에 발견된 이슈였습니다. 초기에 설정한 프로젝트 일정 계획을 지키는 것을 우선으로 했기때문에, Higher Order Function 실행이 가능하도록 Interpreter를 수정하는 일은 추후에 실행할 2차 Task로 설정했습니다. 



### 2. Wrapper Component

애니메이션 효과를 위해 사용한 Pts.js를 컴포넌트로 만들어 사용했지만, 1차 구현 단계에서는 컴포넌트 라이프 사이클 메소드안에서 불필요하게 비슷한 로직이 중복되고 있습니다. 기존의 컴포넌트를 애니메이션 렌더링 시점에 맞춰 렌더링을 관리할 수 있는 Wrapper Component로 분리하여 렌더링이 관리되도록 2차 Task로 설정했습니다.



### 3. Addition of Dependency

애니메이션 시각화 구현을 위한 라이브러리로 Pts.js를 도입한 뒤에 부족한 API문서의 내용으로 프로젝트 일정에 차질이 생길 뻔 했습니다. 새로운 라이브러리를 도입할 때는 라이브러리가 배포된 이후 부족하지 않은 사용 경험(1.0.0 이상의 Version)이 있어야 했고, API문서도 시각화 구현을 위한 충분한 내용을 포함해야 했습니다. 추후 프로젝트 진행시에는 계획 단계에서 중점적으로 고려할 것 입니다.



### 4. Etc

- Seperation of Concerns
- Integration Test
- Customizing Interpreter
- Animation



### Sincere Thanks

[Ken Huh](https://github.com/Ken123777) / Vanilla Coding

[DDody](https://github.com/DDODY)

