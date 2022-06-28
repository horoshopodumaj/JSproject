import createElement from "../create-element.js";
import ProductCard from "./productcard.js";

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};

    this.elem = createElement(`
    <div class="products-grid">
    </div>
    `);

    let prod = document.createElement("div");
    prod.classList.add("products-grid__inner");
    this.elem.append(prod);

    for (let product of products) {
      let card = new ProductCard(product);
      prod.append(card.elem);
    }
  }

  updateFilter(filters) {
    let cards = document.querySelectorAll(".card");
    let arrayOfProducts = [];
    let container = document.querySelector(".products-grid__inner");

    if (filters.noNuts) {
      for (let product of this.products) {
        if (product.nuts === false || product.nuts === undefined) {
          arrayOfProducts.push(product);
        }
      }
      container.innerHTML = "";
    } else {
      for (let product of this.products) {
        arrayOfProducts.push(product);
      }
      container.innerHTML = "";
    }

    Object.assign(this.filters, filters);

    if (this.filters.vegeterianOnly) {
      arrayOfProducts = arrayOfProducts.filter(
        (item) => item.vegeterian === true
      );
      container.innerHTML = "";
    } else {
      container.innerHTML = "";
    }

    if (this.filters.category) {
      arrayOfProducts = arrayOfProducts.filter(
        (item) => item.category === `${this.filters.category}`
      );
      container.innerHTML = "";
    } else {
      container.innerHTML = "";
    }

    if (this.filters.maxSpiciness) {
      arrayOfProducts = arrayOfProducts.filter(
        (item) => item.spiciness <= `${this.filters.maxSpiciness}`
      );
      container.innerHTML = "";
    } else {
      container.innerHTML = "";
    }

    for (let product of arrayOfProducts) {
      let card = new ProductCard(product);
      container.append(card.elem);
    }
  }
}
