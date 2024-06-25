<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Classum Back-end Development Assignment

## ERD
![Screenshot 2024-06-26 at 8 38 39 AM](https://github.com/jparkrighthere/classum-jeonghyeon/assets/116504082/ed29df21-7648-47c4-a1e0-fe157fdb4098)
[ERDCloud](https://www.erdcloud.com/d/eL952wqQBSXM2ceWB)

## 참고

```bash
인프런 강의: https://www.inflearn.com/course/%EB%94%B0%EB%9D%BC%ED%95%98%EB%8A%94-%EB%84%A4%EC%8A%A4%ED%8A%B8-%EC%A0%9C%EC%9D%B4%EC%97%90%EC%8A%A4#
강의 소스 코드: https://github.com/jaewonhimnae/nestjs-board-app
```

## 과제 설치

```bash
$ git clone https://github.com/jparkrighthere/classum-jeonghyeon.git
$ cd classum-jeonghyeon
$ npm install
```

## DB 설정
```
Production 환경: NODE_ENV=development
Development 환경: NODE_ENV=production
```
> 사용할 사용자명과 비밀번호를 .env.development 또는 .env.production 파일에 기입해주세요

### .env.production
```
NODE_ENV=production 
DB_HOST=production-hostname //변경
DB_PORT=3306 //필요 시 변경
DB_NAME=production-dbname // 변경
DB_USERNAME=production-username // 변경
DB_PASSWORD=production-password // 변경
DB_SYNC=false // 변경 (false 시, app.module.ts에서도 수정 필요)
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start
```

## API 리스트
테스트 시 참고해주세요.[API LIST](https://documenter.getpostman.com/view/31370456/2sA3XY6dHG)

## Contact
혹시라도 질문이 있으시거나 오류 발생 시 언제든 연락주세요! 
> fishbox0923@gmail.com

> 010-2516-7220
