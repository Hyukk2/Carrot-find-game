const range = document.querySelector('.range');
const header = document.querySelector('.option');
const optionBtn = document.querySelector('.option_btn');
const result = document.querySelector('.result');
const footer = document.querySelector('.carrot_bug');

class Random {
  itemList = null;
  itemCarrotList = null;
  itemBugList = null;
  itemUpdateCarrotList = null;
  isGamePaused = false; // 게임 일시 정지된 여부 확인
  showFailCall = false;
  // 당근, 벌레 이미지 10개 추가, 당근 개수
  randomItem() {
    const itemRange = document.createElement('div');
    itemRange.setAttribute('class', 'img_range');

    footer.appendChild(itemRange);

    let footerContent = '';

    for(let i=0; i<10; i++) {
      const carrotPosition = this.getRandomPosition(footer.offsetWidth, footer.offsetHeight);
      const bugPosition = this.getRandomPosition(footer.offsetWidth, footer.offsetHeight);

      footerContent += this.createImg('carrot', carrotPosition);
      footerContent += this.createImg('bug', bugPosition);
    }
    itemRange.innerHTML = footerContent;
    this.itemList = itemRange;

    const carrotImgList = document.querySelectorAll('.carrot');
    this.itemCarrotList = carrotImgList;
    // 당근 클릭시
    carrotImgList.forEach(carrotImg => {
      carrotImg.addEventListener('click', event => {
        if(!this.isGamePaused && event.target.className === 'carrot') {
          itemRange.removeChild(carrotImg);
          bgm.carrotBgm();
          const updateCarrotImgList = Array.from(document.querySelectorAll('.carrot'));
          carrotCnt.updateCnt(updateCarrotImgList.length);
          this.itemUpdateCarrotList = updateCarrotImgList;
        }
      })
    });

    const bugImgs = document.querySelectorAll('.bug');
    this.itemBugList = bugImgs;
    // 벌레 클릭시
    bugImgs.forEach(bugImg => {
      bugImg.addEventListener('click', () => {
        if(!this.isGamePaused) {
          resultWindow.showFail();
          timeInstance.pauseTime();
          bgm.bug();
          bgm.startStop();
          this.clearBugImages();
          this.clearCarrotImages();
        }
      })
    });
    
    return [itemRange, carrotImgList.length]
  }
  // 당근, 벌레 이미지 생성
  createImg(className, position) {
    const {x, y} = position;
    return `<img style="transform: translate(${x}px, ${y}px);" class="${className}" src="../img/${className}.png" alt="${className}">`;
  }
  // 당근, 벌레 랜덤 위치
  getRandomPosition(width, height) {
    const randomX = Math.random() * width;
    const randomY = Math.random() * height;
    return {x: randomX, y: randomY};
  }
  // 벌레 제거
  clearBugImages() {
    this.itemBugList.forEach(bugImg => {
      this.itemList.removeChild(bugImg);
    });
  }
  // 당근 제거
  clearCarrotImages() {
    if(this.itemUpdateCarrotList){
      this.itemUpdateCarrotList.forEach(carrotImg => {
        this.itemList.removeChild(carrotImg);
      });
    } else {
      this.itemCarrotList.forEach(carrotImg => {
        this.itemList.removeChild(carrotImg);
      })
    }
  }
  // 당근 목록 초기화() 
  clearCarrotUpdateList(){
    this.itemUpdateCarrotList = null;
  }
}
const random = new Random();


class Time {
  currentTime = 10;
  remainingTime = null; // 일시 정지될 때 남은 시간 저장

  updateTime() {
    const timer = document.querySelector('.option_time');
    timer.textContent = this.currentTime;
    
    if(this.currentTime === 0) {
      resultWindow.showFail();
      bgm.startStop();
      bgm.lost();
      random.clearBugImages();
      random.clearCarrotImages();
    }
  }

  // 타이머 시작 또는 재개
  startOrResumeTime() {
    if (this.leftTime) {
      clearInterval(this.leftTime);
    }
    this.leftTime = setInterval(() => {
      if (this.currentTime > 0) {
        this.currentTime--;
        this.updateTime();
      }
    }, 1000);
  }

  // 타이머 시작
  startTime() {
    this.currentTime = 10; // 현재 시간 재설정
    this.updateTime(); // 새 인터벌 시작 전에 명시적으로 타이머 표시를 업데이트
    this.startOrResumeTime();
  }

  // 타이머 일시 정지
  pauseTime() {
    clearInterval(this.leftTime);
    this.remainingTime = this.currentTime;
  }
}
const timeInstance = new Time();

class CarrotCnt {
  updateCnt(count) {
    const counter = document.querySelector('.option_count');
    counter.textContent = count;

    if(counter.textContent === '0') {
      resultWindow.showSuccess();
      bgm.startStop();
      bgm.win();
      timeInstance.pauseTime();
      random.clearBugImages();
    }
  }
}
const carrotCnt = new CarrotCnt();

// 결과창
class Result {
  isFailShow = false; // showFail()이 호출 됐는지 여부
  showSuccess() {
    if(!this.isFailShow) {
      this.isFailShow = true;
      const resultWindow = document.createElement('div');
        resultWindow.setAttribute('class', 'result_window');
        resultWindow.innerHTML = `
          <button class="return_btn"><i class="fa-solid fa-arrow-rotate-left"></i></button>
          <span>YOU WON🎉</span>
        `;
      result.appendChild(resultWindow);
    }
  }
  showFail() {
    if(!this.isFailShow) {
      this.isFailShow = true;
      const resultWindow = document.createElement('div');
        resultWindow.setAttribute('class', 'result_window');
        resultWindow.innerHTML = `
          <button class="return_btn"><i class="fa-solid fa-arrow-rotate-left"></i></button>
          <span>YOU LOST💢</span>
        `;
      result.appendChild(resultWindow);
      }
    }
  reset() {
    this.isFailShow = false;
  }
}
const resultWindow = new Result();

function onStart() {
  // 1. 랜덤으로 아이템(당근, 벌레)을 만듬
  const item = random.randomItem();
  // 2. footer 범위 안에 아이템들을 추가
  footer.appendChild(item[0]);
  // 3. 시작 버튼 중지 버튼으로 바뀜
  optionBtn.innerHTML = `<i class="fa-solid fa-stop"></i>`;
  // 4. 시간이 카운트 
  timeInstance.startTime();
  // 5. 개수 카운트 
  carrotCnt.updateCnt(item[1]);
}

range.addEventListener('click', (event)=> {
  // 시작 버튼 클릭시
  if (event.target.className === 'fa-solid fa-play' && timeInstance.currentTime === 10) {
    bgm.start();
    onStart();
  }
  // 시작 후, 중지 버튼 클릭시
  if (event.target.className === 'fa-solid fa-stop' && timeInstance.currentTime !== 0 && !resultWindow.isFailShow) {
    optionBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    timeInstance.pauseTime();
    bgm.startStop();
    random.isGamePaused = true;
  }
  // 중지 후, 시작 버튼 클릭시
  if (event.target.className === 'fa-solid fa-play' && timeInstance.remainingTime !== null) {
    optionBtn.innerHTML = `<i class="fa-solid fa-stop"></i>`;
    timeInstance.startOrResumeTime();
    bgm.start();
    random.isGamePaused = false;
  }
  // 재시작 버튼 클릭시
  if(event.target.className === 'fa-solid fa-arrow-rotate-left') {
    const resultWindow1 = document.querySelector('.result_window');
    result.removeChild(resultWindow1); 
    random.clearCarrotUpdateList();
    resultWindow.reset();
    bgm.start();
    onStart();
  }
});