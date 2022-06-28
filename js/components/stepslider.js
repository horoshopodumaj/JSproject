import createElement from "../create-element.js";

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.render();
    this.eventDragAndDrop();
    this.eventClick();
  }

  render() {
    this.elem = createElement(`
      <div class='slider'>
        <div class='slider__thumb' style="left:${
          (100 / (this.steps - 1)) * this.value
        }%">
          <span class='slider__value'>${this.value}</span>
        </div>
        <div class='slider__progress' style="width:${
          (100 / (this.steps - 1)) * this.value
        }%"></div>
      </div>
    `);

    let slider = document.createElement("div");
    slider.classList.add("slider__steps");
    for (let i = 0; i < this.steps; i++) {
      let step = createElement(`<span></span>`);
      if (i == this.value) {
        step.classList.add("slider__step-active");
      }
      slider.append(step);
    }
    this.elem.append(slider);
  }

  eventDragAndDrop() {
    let thumb = this.elem.querySelector(".slider__thumb");
    thumb.ondragstart = () => false;

    thumb.addEventListener("pointerdown", () => {
      thumb.style.position = "absolute";
      let sliderValue = document.querySelector(".slider__value");
      let value = sliderValue.textContent;

      function move(event) {
        let slider = document.querySelector(".slider");
        let whereIsClick = event.clientX - slider.getBoundingClientRect().left;
        let progress = document.querySelector(".slider__progress");
        let xMax = slider.offsetWidth;
        let xMin = 0;

        if (whereIsClick > xMax) {
          whereIsClick = xMax;
        } else if (whereIsClick < xMin) {
          whereIsClick = xMin;
        }

        let scaleValue = (whereIsClick * 100) / slider.offsetWidth;
        progress.style.width = `${scaleValue}%`;
        thumb.style.left = `${scaleValue}%`;

        let sliderSteps = document.querySelector(".slider__steps");
        let sliderStep = slider.offsetWidth / (sliderSteps.children.length - 1);
        let stepWidth = Math.round(whereIsClick / sliderStep);
        sliderValue.innerHTML = stepWidth;

        for (let i = 0; i < sliderSteps.children.length; i++) {
          sliderSteps.children[i].classList.remove("slider__step-active");
        }
        sliderSteps.children[stepWidth].classList.add("slider__step-active");
      }

      document.addEventListener("pointermove", move);
      let slider = document.querySelector(".slider");
      slider.classList.add("slider_dragging");

      document.onpointerup = function (event) {
        let slider = document.querySelector(".slider");
        let whereIsClick = event.clientX - slider.getBoundingClientRect().left;
        let sliderSteps = document.querySelector(".slider__steps");
        let sliderStep = slider.offsetWidth / (sliderSteps.children.length - 1);
        let stepWidth = Math.round(whereIsClick / sliderStep);

        if (stepWidth != value) {
          value = stepWidth;
          let customEvent = new CustomEvent("slider-change", {
            detail: value,
            bubbles: true,
          });
          slider.dispatchEvent(customEvent);
        }

        slider.classList.remove("slider_dragging");
        document.removeEventListener("pointermove", move);
        document.onpointerup = null;
      };
    });
  }

  eventClick() {
    this.elem.addEventListener("click", (event) => {
      let sliderStep = this.elem.offsetWidth / (this.steps - 1);
      let stepValue = Math.round(
        (event.clientX - this.elem.getBoundingClientRect().left) / sliderStep
      );

      let sliderValue = this.elem.querySelector(".slider__value");
      sliderValue.innerHTML = stepValue;

      let sliderThumb = this.elem.querySelector(".slider__thumb");
      sliderThumb.style.left = `${(100 / (this.steps - 1)) * stepValue}%`;

      let sliderProgress = this.elem.querySelector(".slider__progress");
      sliderProgress.style.width = `${(100 / (this.steps - 1)) * stepValue}%`;

      let sliderSteps = this.elem.querySelector(".slider__steps");

      for (let i = 0; i < sliderSteps.children.length; i++) {
        sliderSteps.children[i].classList.remove("slider__step-active");
      }

      sliderSteps.children[stepValue].classList.add("slider__step-active");

      if (stepValue != this.value) {
        this.value = stepValue;
        let customEvent = new CustomEvent("slider-change", {
          detail: this.value,
          bubbles: true,
        });
        this.elem.dispatchEvent(customEvent);
      }
    });
  }
}
