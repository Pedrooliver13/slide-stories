import { SlideNav } from "./module/slide.js";

const slide = new SlideNav('[data-slide="slide"]', '[data-slide="container"]');
slide.init();
slide.addControls('[data-slide="prev"]', '[data-slide="next"]');
