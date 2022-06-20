// Custom Scripts
"use strict";
window.addEventListener("DOMContentLoaded", () => {
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
    let hash = window.location.hash;
    hash = hash.substring(1);
    localStorage.setItem("language", hash);
    let change = localStorage.getItem("language");
    const allLang = ["en", "ru", "ua"];

    const items = data.map((item) => {
      function changeURLLanguage() {
        let lang = change;
        location.href = window.location.pathname + "#" + lang;
      }
      changeURLLanguage();
      function changeLanguage() {
        if (!allLang.includes(hash)) {
          location.href = window.location.pathname + "#en";
          location.reload();
        }
        change = hash;
        for (let key in langArr) {
          let elem = document.querySelector(".lng-" + key);
          if (elem) {
            elem.innerHTML = langArr[key][hash];
          }
        }
      }
      changeLanguage();

      if (hash === "eu") {
        placeholder = "Eng";
        selectedId = "1";
      } else if (hash === "ua") {
        placeholder = "Ukr";
        selectedId = "2";
      } else if (hash === "ru") {
        placeholder = "Rus";
        selectedId = "3";
      }

      let cls = "";
      if (item.id === selectedId) {
        cls = "selected";
      }
      return `
      <li class="select__item ${cls}" data-type="item" data-id="${item.id}" data-google-lang="${item.lang}">${item.value}</li>`;
    });
    return `
      <input type="hidden" class="hidden__input" >
      <div class="select__backdrop" data-type="backdrop"></div>
      <div class="select__input" data-type="input">
          <span data-type="value">${placeholder}</span>
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
    selectedId: "1",
    data: [
      { id: "1", value: "Eng", lang: "en" },
      { id: "2", value: "Ukr", lang: "ua" },
      { id: "3", value: "Rus", lang: "ru" },
    ],
    onSelect(item) {
      const allLang = ["en", "ru", "ua"];
      localStorage.setItem("language Placeholder", item.value);
      localStorage.setItem("language ID", item.id);
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
    // mouseoverBtn
    const listItem = document.querySelectorAll(".learn__list-item");
    const btnHover = document.querySelectorAll(".item__bottom-btn");
    for (let i = 0; i < listItem.length; i++) {
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

    // learn
    function heightLearn() {
      const learnHeight = document.querySelector(".learn");
      const learnHeightTop = document.querySelector(".learn__top");
      const learnHeightList = document.querySelector(".learn__list");
      const learnHeightBtn = document.querySelector(".learn__btn-bottom");
      const NORMALIZE = 30;
      let height =
        learnHeightTop.clientHeight +
        learnHeightList.clientHeight +
        learnHeightBtn.clientWidth -
        NORMALIZE;
      learnHeight.style.height = height + "px";
    }
    window.addEventListener("resize", () => heightLearn());
    heightLearn();
  }
  mouseover();

  // VideoAdd
  const videoInner = document.querySelector(".webinar__slider-wrapper");
  let countVideo = 0;

  class Video {
    constructor(src, name, id) {
      this.src = src;
      this.name = name;
      this.id = id;
      this.selector = videoInner;
    }

    addResult() {
      const element = document.createElement("div");
      element.classList.add("player", "swiper-slide");

      element.setAttribute("data-video-id", ++countVideo);
      element.innerHTML = `
        <video class="player__video" src="${this.src}"></video>
        <div class="player__items">
          <p class="player__name">${this.name}</p>
          <div class="player__play-pause">
            <svg
              class="pause"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="512"
              height="512"
              viewBox="0 0 512 512"
            >
              <title>pause</title>
              <g id="icomoon-ignore"></g>
              <path d="M96 64l320 192-320 192z"></path>
            </svg>
            <svg
              class="play"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <title>pause</title>
              <path d="M4 4h10v24h-10zM18 4h10v24h-10z"></path>
            </svg>
          </div>
          <div class="player__bottom">
            <input
              class="styled-slider slider-progress player__progress"
              type="range"
              value="0"
              min="0"
              max="100"
            />
            <div class="player__use">
              <div class="player__time">
                <span class="player__time-current">00:00</span>
                <span class="player__time-total">/ 00:00</span>
              </div>
              <div class="player__volMx">
                <div class="player__volume">
                  <input
                    class="player__volume-progress styled-slider-vol slider-progress-vol"
                    type="range"
                    min="0"
                    max="100"
                  />
                  <div class="volume__on-off">
                    <svg
                      class="player__volume-high"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="544"
                      height="512"
                      viewBox="0 0 544 512"
                    >
                      <title></title>
                      <g id="icomoon-ignore"></g>
                      <path
                        d="M445.020 461.020c-6.143 0-12.283-2.343-16.971-7.028-9.372-9.373-9.372-24.568 0-33.941 43.819-43.821 67.952-102.080 67.952-164.050 0-61.969-24.133-120.229-67.952-164.049-9.372-9.373-9.372-24.569 0-33.941s24.569-9.372 33.941 0c52.885 52.886 82.011 123.2 82.011 197.99s-29.126 145.104-82.011 197.99c-4.686 4.686-10.828 7.029-16.97 7.029zM359.765 415.765c-6.143 0-12.283-2.343-16.971-7.028-9.372-9.372-9.372-24.568 0-33.941 65.503-65.503 65.503-172.085 0-237.588-9.372-9.373-9.372-24.569 0-33.941 9.372-9.371 24.569-9.372 33.941 0 40.797 40.795 63.265 95.037 63.265 152.733s-22.468 111.938-63.265 152.735c-4.686 4.687-10.828 7.030-16.97 7.030v0zM274.51 370.51c-6.143 0-12.284-2.343-16.971-7.029-9.373-9.373-9.373-24.567 0-33.94 40.55-40.55 40.55-106.529 0-147.078-9.373-9.373-9.373-24.569 0-33.941s24.568-9.372 33.941 0c59.265 59.265 59.265 155.696 0 214.961-4.686 4.684-10.828 7.027-16.97 7.027z"
                      ></path>
                      <path
                        d="M208.003 480c-4.164 0-8.256-1.625-11.317-4.687l-123.313-123.313h-57.373c-8.836 0-16-7.163-16-16v-160c0-8.836 7.164-16 16-16h57.373l123.313-123.314c4.577-4.577 11.458-5.945 17.437-3.468s9.877 8.311 9.877 14.782v416c0 6.472-3.898 12.306-9.877 14.782-1.979 0.82-4.059 1.218-6.12 1.218z"
                      ></path>
                    </svg>
                    <svg
                      class="player__volume-mute"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="512"
                      height="512"
                      viewBox="0 0 512 512"
                    >
                      <title></title>
                      <g id="icomoon-ignore"></g>
                      <path
                        d="M480 309.574v42.426h-42.426l-53.574-53.574-53.574 53.574h-42.426v-42.426l53.574-53.574-53.574-53.574v-42.426h42.426l53.574 53.574 53.574-53.574h42.426v42.426l-53.574 53.574 53.574 53.574z"
                      ></path>
                      <path
                        d="M208.003 480c-4.164 0-8.256-1.625-11.317-4.687l-123.313-123.313h-57.373c-8.836 0-16-7.163-16-16v-160c0-8.836 7.164-16 16-16h57.373l123.313-123.314c4.577-4.577 11.458-5.945 17.437-3.468s9.877 8.311 9.877 14.782v416c0 6.472-3.898 12.306-9.877 14.782-1.979 0.82-4.059 1.218-6.12 1.218z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div class="player__maximize">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.5048 3.1642H21.3698V9.02926"
                      stroke="#BFBFC7"
                      stroke-width="1.95484"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.64082 20.7583H3.77576V14.8932"
                      stroke="#BFBFC7"
                      stroke-width="1.95484"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      this.selector.append(element);
    }
  }
  new Video(
    "video/videoKei.mp4",
    "How To Build Portofolio as A Designer"
  ).addResult();
  new Video(
    "video/videoStock.mp4",
    "User Interface Disign Fundamental"
  ).addResult();
  new Video("video/videoSwiss.mp4", "HTML CSS Fundamental").addResult();

  // Video
  const video = document.querySelectorAll("video");
  const progress = document.querySelectorAll(".player__progress");
  const progressTime = document.querySelectorAll(".player__time-current");
  const progressTotalTime = document.querySelectorAll(".player__time-total");
  const playBtn = document.querySelectorAll(".player__play-pause");
  const volumeProgress = document.querySelectorAll(".player__volume-progress");
  const volumeToggle = document.querySelectorAll(".volume__on-off");
  const volumeOn = document.querySelectorAll(".player__volume-high");
  const volumeOff = document.querySelectorAll(".player__volume-mute");
  const maximize = document.querySelectorAll(".player__maximize");

  // Play & Pause
  for (let i = 0; i < video.length; i++) {
    function toggleVideo() {
      if (video[i].paused) {
        play[i].style.cssText = "display: block";
        pause[i].style.cssText = "display: none";
        video[i].play();
      } else {
        play[i].style.cssText = "display: none";
        pause[i].style.cssText = "display: block";
        video[i].pause();
      }
    }
    const play = document.querySelectorAll(".player .play");
    const pause = document.querySelectorAll(".player .pause");
    playBtn[i].addEventListener("click", toggleVideo);
    playBtn[i].addEventListener("touchstart", toggleVideo);
    playBtn[i].addEventListener("touchend", toggleVideo);

    // updateProgress
    function updateProgress() {
      progress[i].value = (video[i].currentTime / video[i].duration) * 100;

      // Minutes
      let minites = Math.floor(video[i].currentTime / 60);
      if (minites < 10) {
        minites = "0" + minites;
      }
      let minitesTotal = Math.floor(video[i].duration / 60);
      if (minitesTotal < 10) {
        minitesTotal = "0" + minitesTotal;
      }

      // Seconds
      let seconds = Math.floor(video[i].currentTime % 60);
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      let secondsTotal = Math.floor(video[i].duration % 60);
      if (secondsTotal < 10) {
        secondsTotal = "0" + secondsTotal;
      }
      progressTime[i].innerHTML = `${minites}:${seconds}`;
      progressTotalTime[i].innerHTML = `/ ${minitesTotal}:${secondsTotal}`;
      progressInput();
    }
    video[i].addEventListener("timeupdate", updateProgress);

    // progressInput
    function progressInput() {
      for (let e of document.querySelectorAll(
        'input[type="range"].slider-progress'
      )) {
        e.style.setProperty("--value", e.value);
        e.style.setProperty("--min", e.min == "" ? "0" : e.min);
        e.style.setProperty("--max", e.max == "" ? "100" : e.max);
        e.addEventListener("click", () =>
          e.style.setProperty("--value", e.value)
        );
      }
    }
    progressInput();

    // setProgress
    function setProgress() {
      video[i].currentTime = (progress[i].value * video[i].duration) / 100;
    }
    progress[i].addEventListener("change", setProgress);

    // openFullscreen
    function openFullscreen() {
      if (video[i].requestFullscreen) {
        video[i].requestFullscreen();
      } else if (video[i].webkitRequestFullscreen) {
        video[i].webkitRequestFullscreen();
      } else if (video[i].msRequestFullscreen) {
        video[i].msRequestFullscreen();
      }
    }
    maximize[i].addEventListener("click", openFullscreen);

    // progressVolume
    function progressVolume() {
      for (let e of document.querySelectorAll(
        'input[type="range"].slider-progress-vol'
      )) {
        e.style.setProperty("--value", e.value);
        e.style.setProperty("--min", e.min == "" ? "0" : e.min);
        e.style.setProperty("--max", e.max == "" ? "100" : e.max);
        e.addEventListener("input", () =>
          e.style.setProperty("--value", e.value)
        );
      }
    }
    progressVolume();

    // volumeChange
    function volumeChange() {
      lastVolume = volumeProgress[i].value / 100;
      video[i].volume = volumeProgress[i].value / 100;
      volumeOn[i].style.display = "block";
      volumeOff[i].style.display = "none";
      if (volumeProgress[i].value < 1) {
        volumeOn[i].style.display = "none";
        volumeOff[i].style.display = "block";
      }
      progressVolume();
    }
    let lastVolume = 0;
    video[i].volume = 0.5;
    volumeProgress[i].addEventListener("change", volumeChange);
    volumeChange();

    // volumeDisplayToggle
    function volumeDisplayToggle() {
      if (
        volumeOn[i].style.display === "none" &&
        volumeOff[i].style.display === "block"
      ) {
        volumeProgress[i].value = lastVolume * 100;
        video[i].volume = lastVolume;
        volumeOn[i].style.display = "block";
        volumeOff[i].style.display = "none";
      } else {
        volumeProgress[i].value = 0;
        video[i].volume = 0;
        volumeOn[i].style.display = "none";
        volumeOff[i].style.display = "block";
      }
      progressVolume();
    }
    volumeOn[i].style.display = "block";
    volumeOff[i].style.display = "none";
    volumeToggle[i].addEventListener("click", volumeDisplayToggle);
  }

  // Swiper
  const swiper = new Swiper(".swiper", {
    // Optional parameters
    direction: "horizontal",
    loop: true,

    // // Navigation arrows
    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev",
    // },
  });
});

