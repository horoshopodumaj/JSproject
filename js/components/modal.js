import createElement from "../create-element.js";

export default class Modal {
  constructor() {
    this.render();
    this.buttonClose();
    this.isOpened = false;
  }

  buttonClose() {
    let button = this.elem.querySelector(".modal__close");

    button.addEventListener("click", (event) => {
      let modal = document.querySelector(".modal");
      document.body.classList.remove("is-modal-open");
      modal.remove();
    });
  }

  render() {
    this.elem = document.createElement("div");
    this.elem.classList.add("modal");

    let modalOverlay = document.createElement("div");
    modalOverlay.classList.add("modal__overlay");
    this.elem.append(modalOverlay);

    let modalWindow = createElement(`
      <div class='modal__inner'>
        <div class='modal__header'>
          <button type='button' class='modal__close'>
            <img src="../../img/icons/cross-icon.svg" alt="close-icon" />
          </button>
          <h3 class='modal__title'>Здесь заголовок</h3>
        </div>
        <div class='modal__body'>Сюда содержимое</div>
      </div>
    `);
    this.elem.append(modalWindow);
  }

  open() {
    let body = document.querySelector("body");
    body.append(this.elem);
    document.body.classList.add("is-modal-open");
    this.isOpened = true;

    document.body.addEventListener("keydown", this.keyEscape);
  }

  keyEscape = (event) => {
    event.preventDefault();
    if (event.code === "Escape") {
      this.close();
    }
  };

  setTitle(text) {
    let modalTitle = this.elem.querySelector(".modal__title");
    modalTitle.innerHTML = text;
  }

  setBody(text) {
    let modalBody = this.elem.querySelector(".modal__body");
    modalBody.innerHTML = "";
    modalBody.append(text);
  }

  close() {
    let modal = document.querySelector(".modal");

    if (modal) {
      document.body.classList.remove("is-modal-open");
      modal.remove();
      document.body.removeEventListener("keydown", this.keyEscape);
    }
  }
}
