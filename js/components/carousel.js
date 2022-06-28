import createElement from "../create-element.js";

import slides from "./slides.js";

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.elem = document.createElement("div");
    this.elem.classList.add("carousel");
    let carouselContainer = document.createElement("div");
    carouselContainer.classList.add("carousel__inner");
    this.elem.append(carouselContainer);

    let arrowRight = createElement(`
      <div class="carousel__arrow carousel__arrow_right">
        <img src="../../img/icons/angle-icon.svg" alt="icon">
      </div> 
    `);

    let arrowLeft = createElement(`
      <div class="carousel__arrow carousel__arrow_left">
        <img src="../../img/icons/angle-left-icon.svg" alt="icon">
      </div> 
    `);

    this.elem.append(arrowRight);
    this.elem.append(arrowLeft);

    for (let slide of slides) {
      let carouselCard = createElement(`
        <div class="carousel__slide" data-id="${slide.id}">
          <img src="../../img/carousel/${
            slide.image
          }" class="carousel__img" alt="slide">
          <div class="carousel__caption">
            <span class="carousel__price">€${slide.price.toFixed(2)}</span>
            <div class="carousel__title">${slide.name}</div>
            <button class="carousel__button" type="button">
              <img src="../../img/icons/plus-icon.svg" alt="icon">
            </button>
          </div>
        </div>
      `);
      carouselContainer.append(carouselCard);
    }

    let buttons = this.elem.querySelectorAll(".carousel__button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", this.onClick);
    }

    this.initCarousel();
  }

  onClick = (event) => {
    let customEvent = new CustomEvent("product-add", {
      detail: event.target.closest(".carousel__slide").dataset.id,
      bubbles: true,
    });
    this.elem.dispatchEvent(customEvent);
  };

  initCarousel() {
    let right = this.elem.querySelector(".carousel__arrow_right");
    let left = this.elem.querySelector(".carousel__arrow_left");
    let carousel = this.elem.querySelector(".carousel__inner");
    let amountOfChildren = carousel.children.length;
    let clickClick = 0;

    if (clickClick == 0) {
      left.style.display = "none";
    }

    if (
      right.addEventListener("click", function () {
        clickClick -= 1;
        const widthCarousel = carousel.offsetWidth;
        carousel.style.transform = `translateX(${
          clickClick * widthCarousel
        }px)`;
        left.style.display = "";
        if (clickClick <= -(amountOfChildren - 1)) {
          right.style.display = "none";
        }
      })
    );

    if (
      left.addEventListener("click", function () {
        clickClick += 1;
        const widthCarousel = carousel.offsetWidth;
        carousel.style.transform = `translateX(${
          clickClick * widthCarousel
        }px)`;
        right.style.display = "";

        if (clickClick == 0) {
          left.style.display = "none";
        }
      })
    );
  }
}

document.body.addEventListener("product-add", (event) =>
  console.log(event.detail)
);
