// Custom Scripts
"use strict";
// Navbar
function burgerMenu() {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");
  const body = document.querySelector("body");
  const login = document.querySelector(".menu__login");
  const section = document.querySelectorAll("section");

  burger.addEventListener("click", () => {
    if (!menu.classList.contains("active")) {
      menu.classList.add("active");
      burger.classList.add("active-burger");
      body.classList.add("locked");
      login.classList.add("active-bottom");
      section.forEach((sect) => {
        sect.style.filter = "blur(3px)";
      });
    } else {
      menu.classList.remove("active");
      burger.classList.remove("active-burger");
      body.classList.remove("locked");
      login.classList.remove("active-bottom");
      section.forEach((sect) => {
        sect.style.filter = "blur(0)";
      });
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 991.98) {
      menu.classList.remove("active");
      burger.classList.remove("active-burger");
      body.classList.remove("locked");
      login.classList.remove("active-bottom");
      section.forEach((sect) => {
        sect.style.filter = "blur(0)";
      });
    }
  });
}
burgerMenu();

// Select language
const getTemplate = (data = [], placeholder, selectedId) => {
  let text = placeholder ?? "placeholder не указан";

  const items = data.map((item) => {
    let cls = "";
    if (item.id === selectedId) {
      text = item.value;
      cls = "selected";
    }
    return `
          <li class="select__item ${cls}" data-type="item" data-id="${item.id}" data-google-lang="${item.lang}">${item.value}</li>
      `;
  });
  return `
      <input type="hidden" class="hidden__input" >
      <div class="select__backdrop" data-type="backdrop"></div>
      <div class="select__input" data-type="input">
          <span data-type="value">${text}</span>
  <svg
  data-type="arrow"
  class="global select__arrow"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#D1D1D7"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2 12H22"
            stroke="#D1D1D7"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z"
            stroke="#D1D1D7"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          data-type="arrow"
          class="select__arrow"
          width="6"
          height="5"
          viewBox="0 0 6 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="arrow-fill"
            d="M3 5L5.59808 0.5H0.401924L3 5Z"
            fill="#D1D1D7"
          />
        </svg>
      </div>
      <div class="select__dropdown">
          <ul class="select__list">
              ${items.join("")}
          </ul>
      </div>
  `;
};

class Select {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;
    this.selectedId = options.selectedId;

    this.render();
    this.setup();
  }

  render() {
    const { placeholder, data } = this.options;
    this.$el.classList.add("select");
    this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId);
  }
  setup() {
    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener("click", this.clickHandler);
    this.$arrow = this.$el.querySelectorAll('[data-type="arrow"]');
    this.$value = this.$el.querySelector('[data-type="value"]');
  }
  clickHandler(event) {
    const { type } = event.target.dataset;
    if (type === "input") {
      this.toggle();
    } else if (type === "item") {
      const id = event.target.dataset.id;
      this.select(id);
    } else if (type === "backdrop") {
      this.close();
    }
  }

  get isOpen() {
    return this.$el.classList.contains("open");
  }

  get current() {
    return this.options.data.find((item) => item.id === this.selectedId);
  }

  select(id) {
    this.selectedId = id;
    this.$value.textContent = this.current.value;

    this.$el
      .querySelectorAll(`[data-type="item"]`)
      .forEach((el) => el.classList.remove("selected"));
    this.$el.querySelector(`[data-id="${id}"]`).classList.add("selected");

    this.options.onSelect ? this.options.onSelect(this.current) : null;
    this.close();
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.$el.classList.add("open");
    this.$arrow.forEach((item) => {
      item.classList.add("open");
    });
  }

  close() {
    this.$el.classList.remove("open");
    this.$arrow.forEach((item) => {
      item.classList.remove("open");
    });
  }

  destroy() {
    this.$el.removeEventListener("click", this.clickHandler);
    this.$el.innerHTML = "";
  }
}
const select = new Select("#select", {
  placeholder: "Eng",
  // selectedId: 1,
  data: [
    { id: "1", value: "Eng", lang: "en" },
    { id: "2", value: "Ukr", lang: "ua" },
    { id: "3", value: "Rus", lang: "ru" },
  ],
  onSelect(item) {
    // console.log(this.data[1].id);
    const allLang = ["en", "ru", "ua"];
    const input = document.querySelector(".hidden__input");
    input.value = item.lang;
    console.log(input.value);

    function changeURLLanguage() {
      let lang = input.value;
      localStorage.setItem("language", lang);
      location.href = window.location.pathname + "#" + lang;
      // location.reload();
    }
    changeURLLanguage();
    function changeLanguage() {
      let hash = window.location.hash;
      hash = hash.substring(1);
      if (!allLang.includes(hash)) {
        location.href = window.location.pathname + "#en";
        location.reload();
      }
      input.value = hash;
      for (let key in langArr) {
        let elem = document.querySelector(".lng-" + key);
        if (elem) {
          elem.innerHTML = langArr[key][hash];
        }
      }
    }
    changeLanguage();
  },
});

// Learn mouseover

function mouseover() {
  const listItem = document.querySelectorAll(".learn__list-item");
  const btnHover = document.querySelectorAll(".item__bottom-btn");
  const learnHeight = document.querySelector(".learn");

  let learnHeightClient = document.lastChild.clientWidth - 35;

  for (let i = 0; i < listItem.length; i++) {
    if (learnHeightClient > 633) {
      learnHeight.style.height = learnHeight.clientHeight + "px";
    } else {
      learnHeight.style.height = learnHeight.clientHeight - 28 + "px";
    }

    const heightStandart =
      listItem[i].clientHeight - btnHover[i].clientHeight - 28;
    let height = listItem[i].clientHeight - btnHover[i].clientHeight;
    let maxHeight = listItem[i].clientHeight + btnHover[i].clientHeight;
    let limit = 0;

    listItem[i].style.maxHeight = heightStandart + "px";

    listItem[i].addEventListener("mouseover", () => {
      if (limit === 0) {
        listItem[i].style.maxHeight = maxHeight + "px";
        btnHover[i].classList.add("active");
        limit = 1;
      }
    });

    listItem[i].addEventListener("mouseleave", () => {
      if (limit === 1) {
        height = heightStandart;
        listItem[i].style.maxHeight = height + "px";
        btnHover[i].classList.remove("active");
        limit = 0;
      }
    });
  }
}
mouseover();

