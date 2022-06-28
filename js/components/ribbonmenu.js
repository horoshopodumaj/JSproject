import createElement from "../create-element.js";

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.elem = document.createElement("div");
    this.elem.classList.add("ribbon");

    let buttonLeft = createElement(`
      <button class='ribbon__arrow ribbon__arrow_left'>
        <img src="../../img/icons/angle-icon.svg" alt="icon">
      </button>
    `);

    let buttonRight = createElement(`
      <button class='ribbon__arrow ribbon__arrow_right ribbon__arrow_visible'>
        <img src="../../img/icons/angle-icon.svg" alt="icon">
      </button>
    `);

    let ribbonInner = document.createElement("nav");
    ribbonInner.classList.add("ribbon__inner");

    for (let category of categories) {
      let ribbonItem = createElement(`
      <a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>
    `);
      ribbonInner.append(ribbonItem);
    }

    this.elem.append(ribbonInner);
    this.elem.append(buttonLeft);
    this.elem.append(buttonRight);

    let items = this.elem.querySelectorAll(".ribbon__item");
    for (let i = 0; i < items.length; i++) {
      items[i].addEventListener("click", this.onClick);
    }

    this.scrollLeft();
    this.scrolLRight();
    this.scroll();
  }

  onClick = (event) => {
    event.preventDefault();
    let items = this.elem.querySelectorAll(".ribbon__item");
    let customEvent = new CustomEvent("ribbon-select", {
      detail: event.target.closest(".ribbon__item").dataset.id,
      bubbles: true,
    });

    this.elem.dispatchEvent(customEvent);
    for (let i = 0; i < items.length; i++) {
      if (
        items[i].getAttribute("class") == "ribbon__item ribbon__item_active"
      ) {
        items[i].classList.remove("ribbon__item_active");
      }
    }
    event.target.classList.add("ribbon__item_active");
  };

  scroll() {
    let ribbonInner = this.elem.querySelector(".ribbon__inner");

    ribbonInner.addEventListener("scroll", () => {
      let leftButton = this.elem.querySelector(".ribbon__arrow_left");
      let rightButton = this.elem.querySelector(".ribbon__arrow_right");
      let scrollLeft = ribbonInner.scrollLeft;
      let scrollWidth = ribbonInner.scrollWidth;
      let clientWidth = ribbonInner.clientWidth;
      let scrollRight = scrollWidth - scrollLeft - clientWidth;

      if (scrollLeft < 1) {
        leftButton.classList.remove("ribbon__arrow_visible");
        rightButton.classList.add("ribbon__arrow_visible");
      } else {
        leftButton.classList.add("ribbon__arrow_visible");
      }

      if (scrollRight < 1) {
        rightButton.classList.remove("ribbon__arrow_visible");
        leftButton.classList.add("ribbon__arrow_visible");
      } else {
        rightButton.classList.add("ribbon__arrow_visible");
      }
    });
  }

  scrollLeft() {
    let leftButton = this.elem.querySelector(".ribbon__arrow_left");
    let ribbonInner = this.elem.querySelector(".ribbon__inner");

    leftButton.addEventListener("click", () => {
      ribbonInner.scrollBy(-350, 0);
    });
  }

  scrolLRight() {
    let rightButton = this.elem.querySelector(".ribbon__arrow_right");
    let ribbonInner = this.elem.querySelector(".ribbon__inner");

    rightButton.addEventListener("click", () => {
      ribbonInner.scrollBy(350, 0);
    });
  }
}

document.body.addEventListener("ribbon-select", (event) =>
  console.log(event.detail)
);
