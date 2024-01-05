'use strict';

import * as sound from './ver.2_sound.js';

const CARROT_SIZE = 80;

export const ItemType = Object.freeze({
  carrot: 'carrot',
  bug: 'bug',
});

export class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.field = document.querySelector('.game_field');
    this.fieldRect = this.field.getBoundingClientRect();
    // 이벤트 핸들러로 사용되는 함수는 일반함수로 전달된다.
    // 그러므로 arrow 함수, bind를 해주지 않는 이상, onClick메서드 내부에 있는
    // this.onItemClick의 this는 'field'엘리멘트를 가리키므로, undefined가 된다.
    // this.onItemClick의 this는 'Field'클래스를 가리키게 만들어야한다.(arrow 함수 or bind)
    this.field.addEventListener('click', this.onClick);
  }
  
  init() {
    this.field.innerHTML = '';
    this.#addItem('carrot', this.carrotCount, '../img/carrot.png');
    this.#addItem('bug', this.bugCount, '../img/bug.png');
  }
  
  setClickListener(onItemClick) {
    // gameField = new Field(carrotCount, bugCount);
    // gameField.setClickListener(onItemClick);
    // 주석처리 된 코드를 보면 알 수 있듯이, onItemClick의 this는 'Field'클래스를 가리킨다.
    this.onItemClick = onItemClick;
  }

  #addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - CARROT_SIZE;
    const y2 = this.fieldRect.height - CARROT_SIZE;
    for(let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      item.style.position = 'absolute';
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  }

  // 클래스 안에 있는 함수를 콜백으로 전달할 때는 함수내부에 있는 클래스의 정보가
  // 사라진다. 그래서 arrow 함수를 이용해서 바인딩하는 효과처럼 적용시킨다.
  onClick = event => {
    const target = event.target;
    if(target.matches('.carrot')) {
      target.remove();
      sound.playCarrot();
      // console.log(this.onItemClick);
      this.onItemClick && this.onItemClick(ItemType.carrot);
    } else if(target.matches('.bug')) {
      this.onItemClick && this.onItemClick(ItemType.bug);
    }
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min);
}