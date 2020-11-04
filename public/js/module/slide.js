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
    const maxWidth = 100;
    const timeInterval = 25;
    const insertTurbo = (timeInterval * maxWidth) / this.totalTime; 

    let startWidth = widthIntial;
    clearInterval(this.timeBarProgress);
    
    this.progressChild = this.divArray[this.index.active].firstChild;
    this.progressChild.style.width = widthIntial;

    this.timeBarProgress = setInterval(() => {
      startWidth += insertTurbo;
      this.progressChild.style.width = `${startWidth}%`;
      
      if (startWidth > maxWidth) {
        this.progressChild.style.width = `${maxWidth}%`;
        clearInterval(this.timeBarProgress);
      }
    }, timeInterval);
  }

  pauseSlide(event) {
    if (event.type === "mousedown") event.preventDefault();

    clearTimeout(this.autoTime);
    clearInterval(this.timeBarProgress);
    this.messagePause(true);
  }

  messagePause(message = false) {
    this.messageTarget = document.createElement("div");
    this.messageTarget.innerHTML = "Pausado";
    this.messageTarget.classList.add("slide__message");

    if (message) 
      this.wrapper.appendChild(this.messageTarget);

    if (!message)
      this.removeMessage();
  }

  removeMessage() {
    const messageClass = this.messageTarget.getAttribute('class'); 
    const itemRemove = this.wrapper.querySelector(`.${messageClass}`);

    if(this.wrapper.contains(itemRemove))
      this.wrapper.removeChild(itemRemove);
  }

  restartSlide(event) {
    if (event.type === "mouseup") event.preventDefault();
    
    const widthInitial = this.progressChild.style.width;
    const clearWidth = Number(widthInitial.replace("%", ""));
    const missingWidth = Number(100 - clearWidth);
    this.missingTime = (this.totalTime * missingWidth) / 100;

    this.progressBar(clearWidth);
    this.autoSlide(this.missingTime);
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
