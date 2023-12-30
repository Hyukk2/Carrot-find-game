const startBgm = document.querySelector('.start_bgm');
const bugBgm = document.querySelector('.bug_bgm');
const carrotBgm = document.querySelector('.carrot_bgm');
const winBgm = document.querySelector('.win_bgm');
const lostBgm = document.querySelector('.lost_bgm');

class Bgm {
  start() {
    startBgm.play();
  }

  startStop() {
    startBgm.pause();
  }

  bug() {
    bugBgm.play();
  }

  carrotBgm() {
    carrotBgm.play();
  }

  win() {
    winBgm.play();
  }

  lost() {
    lostBgm.play();
  }
}
const bgm = new Bgm();