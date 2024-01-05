'use strict';
import Popup from './ver.2_popup.js';
import {GameBuilder, Reason} from './ver.2_game.js';
import * as sound from './ver.2_sound.js';

const gameFinishBanner = new Popup();

// 메서드 체이닝 : 메서드가 자기 자신(this)을 반환하도록 설계되어 있을 때 가능
const game = new GameBuilder()
  .withGameDuration(5)
  .withCarrotCount(3)
  .withBugCount(3)
  .build();

game.setGameStopListener((reason) => {
  console.log(reason);
  let message;
  switch(reason) {
    case Reason.cancel:
      message = 'Replay❓';
      sound.playAlert();
      break;
    case Reason.win:
      message = 'YOU WON 🎉';
      sound.playWin();
      break;
    case Reason.lose:
      message = 'YOU LOST 💢'
      sound.playBug();
      break;
    default:
      throw new Error('경우를 벗어남.')
  }
  gameFinishBanner.showWithText(message);
});

// start()메서드의 this가 'Popup' 클래스를 가리키게 하지 않기 위해서, (arrow or bind)처리를 해줘야한다.
gameFinishBanner.setClickListener(game.start);


// main.js -> game, popup 연결
// 작성된 html 구조를 보면, section(header(game) + section(field)) 와 section(popup) 이렇게 크게 
// 2덩어리로 구성 되어있다.