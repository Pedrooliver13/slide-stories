export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.activeClass = "active";
  }

  slideConfig() {
    this.slideArray = [...this.slide.children].map((item) => {
      return { item };
    });
  }

  slideIndexNav(index) {
    const last = this.slideArray.length - 1;

    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    this.slideArray[index];
    this.slideIndexNav(index);
    this.changeActiveClass();
    this.autoSlide();
    this.activeLoad();
  }

  changeActiveClass() {
    this.slideArray.forEach(({ item }) =>
      item.classList.remove(this.activeClass),
    );

    const { item } = this.slideArray[this.index.active];
    item.classList.add(this.activeClass);
  }

  activePrevSlide() {
    if (this.index.prev != undefined) {
      this.changeSlide(this.index.prev);
    }
  }

  activeNextSlide() {
    if (this.index.next != undefined) {
      return this.changeSlide(this.index.next);
    }

    return this.changeSlide(0); 
  }

  autoSlide(time) {
    clearTimeout(this.autoTime);
    this.totalTime = time || 5000;
    this.autoTime = setTimeout(this.activeNextSlide, this.totalTime);
  }

  addLoadChangeSlide() {
    this.divElement = document.createElement("div");
    this.divElement.classList.add("slide__thumb");

    this.slideArray.forEach(
      () => (this.divElement.innerHTML += `<span><div></div></span>`),
    );
    return this.wrapper.appendChild(this.divElement);
  }

  activeLoad() {
    this.divArray = [...this.divElement.children];
    this.divArray.forEach((item, index) => {
      if (index < this.index.active) item.firstChild.style.width = "100%";
      if (index > this.index.active) item.firstChild.style.width = "0%";
    });

    this.progressBar();
  }

  progressBar(widthIntial = 0) {
    const total = "100%";
    const insertTurbo = 0.5; // (totalTime / timeInterval) * 100;
    this.progressChild = this.divArray[this.index.active].firstChild;

    let start = widthIntial;

    clearTimeout(this.timeBarProgress);
    this.progressChild.style.width = widthIntial;

    this.timeBarProgress = setInterval(() => {
      start += insertTurbo;
      this.progressChild.style.width = `${start}%`;

      if (start > total) {
        this.progressChild.style.width = `${total}`;
        clearTimeout(this.timeBarProgress);
      }
    }, 25);
  }

  pauseSlide(event) {
    event.preventDefault();
    
    clearInterval(this.timeBarProgress);
    clearTimeout(this.autoTime);
    this.messagePause(true);
  }

  messagePause(message = false) {
    const messageTarget = document.createElement("div");
    messageTarget.innerHTML = "Pausado";
    messageTarget.classList.add("slide__message");

    if (message) {
      return this.wrapper.appendChild(messageTarget);
    }
    
    return this.wrapper.removeChild(this.wrapper.lastChild);
  }

  restartSlide() {
    const widthInitial = this.progressChild.style.width;
    const clearWidht = +widthInitial.replace("%", "");
    const missingTime = 100 - clearWidht;
    const totalTime = Math.floor((this.totalTime * missingTime) / 100);

    this.progressBar(clearWidht);
    this.autoSlide(totalTime);
    this.messagePause(false);
  }

  addSlideEvent() {
    this.wrapper.addEventListener("mousedown", this.pauseSlide);
    this.wrapper.addEventListener("touchstart", this.pauseSlide);
    this.wrapper.addEventListener("mouseup", this.restartSlide);
    this.wrapper.addEventListener("touchend", this.restartSlide);
  }

  onBind() {
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
    this.activeLoad = this.activeLoad.bind(this);

    this.pauseSlide = this.pauseSlide.bind(this);
    this.restartSlide = this.restartSlide.bind(this);
  }

  init() {
    this.onBind();
    this.slideConfig();
    this.addSlideEvent();
    this.addLoadChangeSlide();
    this.changeSlide(0);

    return this;
  }
}

// controls;
export class SlideNav extends Slide {
  constructor(slide, wrapper) {
    super(slide, wrapper);
  }

  addControls(prev, next) {
    this.prev = document.querySelector(prev);
    this.next = document.querySelector(next);
    this.addControlsEvent();
  }

  addControlsEvent() {
    this.prev.addEventListener("click", this.activePrevSlide);
    this.next.addEventListener("click", this.activeNextSlide);
  }
}
