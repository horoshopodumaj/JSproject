import createElement from "../create-element.js";

export default class ProductCard {
  constructor(product) {
    this.name = product.name;
    this.price = product.price;
    this.category = product.category;
    this.image = product.image;
    this.id = product.id;

    this.elem = document.createElement("div");
    this.elem.classList.add("card");

    let cardTop = createElement(`
    <div class="card__top">
      <img src="../../img/products/${
        this.image
      }" class="card__image" alt="product">
      <span class="card__price">€${this.price.toFixed(2)}</span
    </div>
    `);
    this.elem.append(cardTop);

    let cardBody = createElement(`
    <div class="card__body">
      <div class="card__title">${this.name}</div>
      <button class="card__button" type="button">
        <img src="../../img/icons/plus-icon.svg" alt="icon"></img>
      </button>
    </div>
    `);

    this.elem.append(cardBody);

    this.elem
      .querySelector(".card__button")
      .addEventListener("click", this.onClick);
  }

  onClick = (event) => {
    let customEvent = new CustomEvent("product-add", {
      detail: this.id,
      bubbles: true,
    });
    this.elem.dispatchEvent(customEvent);
  };
}

document.body.addEventListener("product-add", (event) =>
  console.log(event.detail)
);
