'use strict';
import {Field, ItemType} from './ver.2_field.js';
import * as sound from './ver.2_sound.js';

// 타입 보장
export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
}); 

// Builder Pattern
export class GameBuilder {
  withGameDuration(duration) {
    this.gameDuration = duration;
    // console.log(this) -> GameBuilder {gameDuration: 5}
    return this;
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    // console.log(this) -> GameBuilder {gameDuration: 5, carrotCount: 3}
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    // console.log(this) -> GameBuilder {gameDuration: 5, carrotCount: 3, bugCount: 3}
    return this;
  }

  build() {
    // console.log(this) -> GameBuilder {gameDuration: 5, carrotCount: 3, bugCount: 3}
    return new Game(
      this.gameDuration,
      this.carrotCount,
      this.bugCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameTimer = document.querySelector('.game_timer');
    this.gameScore = document.querySelector('.game_score');
    this.gameBtn = document.querySelector('.game_button');
    this.gameBtn.addEventListener('click', () => {
      if(this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start = () => {
    // console.log(this);
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackground();
  }
  
  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBackground();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if(!this.started) {
      return;
    }
    if(item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if(this.score === this.carrotCount) {
      this.stop(Reason.win);
      }
    } else if(item === ItemType.bug) {
      this.stop(Reason.lose);
    }
  }

  showStopButton() {
    const icon = this.gameBtn.querySelector('.fa-solid');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    this.gameBtn.style.visibility = 'visible';
  }
  
  hideGameButton() {
    this.gameBtn.style.visibility = 'hidden';
  }
  
  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }
  
  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if(remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }
  
  stopGameTimer() {
    // clearInterval은 window api이므로 this 안 붙인다.
    clearInterval(this.timer);
  }
  
  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }
  
  initGame() {
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }
  
  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
}