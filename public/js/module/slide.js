export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.activeClass = "active";

    this.dist = { moviment: 0, startX: 0, finalPosition: 0 };
    this.changeEvent = new Event("changeEvent");
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
      this.changeSlide(this.index.next);
    }
  }

  autoSlide() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.activeNextSlide, 5000);
  }

  addLoadChangeSlide() {
    this.divElement = document.createElement("div");
    this.divElement.classList.add("slide__thumb");

    this.slideArray.forEach(
      () => (this.divElement.innerHTML += `<span></span>`),
    );
    return this.wrapper.appendChild(this.divElement);
  }

  activeLoad() {
    this.divArray = [...this.divElement.children];
   
    this.divArray.forEach((item, index) => {
      item.classList.remove('next', 'active');

      if(index > this.index.active) {
        item.classList.add('next');
      }
    });
    

    this.divArray[this.index.active].classList.add(this.activeClass);
  }

  addLoadEvent() {
    this.wrapper.addEventListener("changeEvent", () => this.activeLoad());
  }

  onBind() {
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
    this.activeLoad = this.activeLoad.bind(this);
  }

  init() {
    this.onBind();
    this.slideConfig();
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
