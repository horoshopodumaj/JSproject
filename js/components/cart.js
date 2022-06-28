import createElement from "../create-element.js";
import escapeHtml from "../escape-html.js";

import Modal from "./modal.js";

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (product === null || product === undefined) {
      return;
    } else {
      if (this.isEmpty()) {
        let productAdd = Object.assign({}, { product }, { count: 1 });
        this.cartItems.push(productAdd);
      } else {
        let productFind = this.cartItems.find(
          (cartItem) => cartItem.product.id === product.id
        );
        if (productFind) {
          productFind.count += 1;
        } else {
          let productAdd = Object.assign({}, { product }, { count: 1 });
          this.cartItems.push(productAdd);
        }
      }
    }

    this.onProductUpdate(this.cartItems);
  }

  updateProductCount(productId, amount) {
    let productFind = this.cartItems.find(
      (item) => item.product.id === productId
    );

    if (amount == 1 && productFind) {
      productFind.count += 1;
    } else if (amount == -1 && productFind) {
      if (productFind.count > 1) {
        productFind.count += amount;
      } else if (productFind.count == 1) {
        productFind.count += amount;
        if (productFind.count === 0) {
          document.querySelector(`[data-product-id="${productId}"]`).innerHTML =
            "";
        }
        this.cartItems = this.cartItems.filter(
          (cartItem) => cartItem.count > 0
        );
      } else {
        this.cartItems = this.cartItems.filter(
          (cartItem) => cartItem.count > 0
        );
      }
    }
    this.onProductUpdate(this.cartItems);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce(
      (totalCount, cartItem) => totalCount + cartItem.count,
      0
    );
  }

  getTotalPrice() {
    return this.cartItems.reduce(
      (totalPrice, cartItem) =>
        totalPrice + cartItem.product.price * cartItem.count,
      0
    );
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="../../img/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="../../img/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="../../img/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(
            2
          )}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    let modal = new Modal();
    modal.setTitle("Your order");
    modal.setBody(
      createElement(
        `<div>${this.cartItems
          .map(
            (cartItem) =>
              this.renderProduct(cartItem.product, cartItem.count).outerHTML
          )
          .join("")}${this.renderOrderForm().outerHTML}</div>`
      )
    );
    modal.open();

    let buttonMinus = document.querySelectorAll(".cart-counter__button_minus");
    for (let minus of buttonMinus) {
      minus.addEventListener("click", () => {
        let productId = minus.closest("[data-product-id]").dataset.productId;
        this.cartItems.map((cartItem) =>
          cartItem.product.id === productId
            ? this.updateProductCount(cartItem.product.id, -1)
            : cartItem.count
        );
        this.cartItems = this.cartItems.filter(
          (cartItem) => cartItem.count > 0
        );
        if (this.cartItems.length === 0) {
          modal.close();
        }
      });
    }

    let buttonPlus = document.querySelectorAll(".cart-counter__button_plus");
    for (let plus of buttonPlus) {
      plus.addEventListener("click", () => {
        let productId = plus.closest("[data-product-id]").dataset.productId;
        this.cartItems.map((cartItem) =>
          cartItem.product.id === productId
            ? this.updateProductCount(cartItem.product.id, 1)
            : cartItem.count
        );
      });
    }

    let form = document.querySelector(".cart-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.onSubmit(event);
    });
  }

  onProductUpdate(cartItems) {
    this.cartIcon.update(this);

    let bodyIsModalOpen = document.querySelector(".is-modal-open");
    if (bodyIsModalOpen) {
      for (let cartItem of this.cartItems) {
        let productId = cartItem.product.id;
        let modalBody = document.querySelector(".modal");
        let productCount = modalBody.querySelector(
          `[data-product-id="${productId}"] .cart-counter__count`
        );
        let productPrice = modalBody.querySelector(
          `[data-product-id="${productId}"] .cart-product__price`
        );
        let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

        productCount.innerHTML = cartItem.count;
        productPrice.innerHTML = `€${(
          cartItem.product.price * cartItem.count
        ).toFixed(2)}`;
        infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
      }
    }
  }

  onSubmit(event) {
    let buttonOrder = document.querySelector('[type="submit"]');
    buttonOrder.classList.add("is-loading");
    let form = document.querySelector(".cart-form");
    let data = new FormData(form);
    let response = fetch(`https://httpbin.org/post`, {
      method: "POST",
      body: data,
    });

    response.then((response) => {
      if (response.status === 200) {
        let modalTitle = document.querySelector(".modal__title");
        let modalBody = document.querySelector(".modal__body");
        modalTitle.innerHTML = "Success!";
        this.cartItems = this.cartItems.splice(this.cartItems.length);
        this.onProductUpdate(this.cartItems);
        modalBody.innerHTML = createElement(`<div class="modal__body-inner">
          <p>
            Order successful! Your order is being cooked :) <br>
            We’ll notify you about delivery time shortly.<br>
            <img src="../../img/delivery.gif">
          </p>
        </div>`).outerHTML;
      }
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}
