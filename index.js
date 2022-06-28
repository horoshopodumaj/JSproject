import Carousel from "./js/components/carousel.js";
import slides from "./js/components/slides.js";

import RibbonMenu from "./js/components/ribbonmenu.js";
import categories from "./js/components/categories.js";

import StepSlider from "./js/components/stepslider.js";
import ProductsGrid from "./js/components/productsgrid.js";

import CartIcon from "./js/components/carticon.js";
import Cart from "./js/components/cart.js";

export default class Main {
  constructor() {
    this.ribbonMenu;
    this.stepSlider;
    this.cart;
    this.productsGrid;
  }

  async render() {
    let containerElement = document.querySelector("[data-carousel-holder]");
    let carousel = new Carousel(slides);
    containerElement.append(carousel.elem);

    this.ribbonMenu = new RibbonMenu(categories);
    let container = document.querySelector("[data-ribbon-holder]");
    container.append(this.ribbonMenu.elem);

    let holder = document.querySelector("[data-slider-holder]");
    this.stepSlider = new StepSlider({
      steps: 5,
      value: 3,
    });
    holder.append(this.stepSlider.elem);

    let cartIcon = new CartIcon();
    let cartIconHolder = document.querySelector("[data-cart-icon-holder]");
    cartIconHolder.append(cartIcon.elem);

    this.cart = new Cart(cartIcon);

    let url = "./products.json";

    let response = await fetch(url);
    let products = await response.json();
    let productsGridHolder = document.querySelector(
      "[data-products-grid-holder]"
    );
    this.productsGrid = new ProductsGrid(products);
    productsGridHolder.innerHTML = "";
    productsGridHolder.append(this.productsGrid.elem);

    this.productsGrid.updateFilter({
      noNuts: document.getElementById("nuts-checkbox").checked,
      vegeterianOnly: document.getElementById("vegeterian-checkbox").checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value,
    });

    document.body.addEventListener("product-add", (event) => {
      let productToAdd = this.productsGrid.products.find(
        (product) => product.id === event.detail
      );

      if (productToAdd) {
        this.cart.addProduct(productToAdd);
      }
    });

    holder.addEventListener("slider-change", (event) =>
      this.productsGrid.updateFilter({ maxSpiciness: event.detail })
    );

    container.addEventListener("ribbon-select", (event) =>
      this.productsGrid.updateFilter({ category: event.detail })
    );

    let noNuts = document.getElementById("nuts-checkbox");
    noNuts.addEventListener("change", () =>
      this.productsGrid.updateFilter({ noNuts: noNuts.checked })
    );

    let vegeterianOnly = document.getElementById("vegeterian-checkbox");
    vegeterianOnly.addEventListener("change", () =>
      this.productsGrid.updateFilter({ vegeterianOnly: vegeterianOnly.checked })
    );
  }
}
