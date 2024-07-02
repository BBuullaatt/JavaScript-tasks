const cols = document.querySelectorAll(".col");

document.addEventListener("keydown", (event) => {
  event.preventDefault();
  if (event.code.toLowerCase() === "space") {
    setRandomColors();
  }
});

document.addEventListener("click", (event) => {
  const type = event.target.dataset.type;

  if (type === "lock") {
    const node =
      event.target.tagName.toLowerCase() === "i"
        ? event.target
        : event.target.children[0];

    node.classList.toggle("fa-lock-open");
    node.classList.toggle("fa-lock");
  } else if (type === "copy") {
    copyToClickboard(event.target.textContent);

    note({
      content: "Color copied to clipboard",
      type: "succsess ",
      time: 0.5,
    });
  }
});

function copyToClickboard(text) {
  return navigator.clipboard.writeText(text);
}

function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];

  cols.forEach((col, index) => {
    const isLocked = col.querySelector("i").classList.contains("fa-lock");
    const text = col.querySelector("h2");
    const button = col.querySelector("button");

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random();

    if (!isInitial) {
      colors.push(color);
    }

    text.textContent = color;
    col.style.background = color;

    setTextColor(text, color);
    setTextColor(button, color);
  });

  updateColorsHash(colors);
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? "black" : "white";
}

function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join("-");
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}

setRandomColors(true);

/**
 * Анонимная самовызывающаяся функция-обертка
 * @param {document} d - получает документ
 */
!(function (d) {
  "use strict";

  /**
   * Основная функция.
   * @param {Object} [settings] - предвартиельные настройки
   */
  window.note = function (settings) {
    /**
     * Настройки по умолчанию
     */
    settings = Object.assign(
      {},
      {
        callback: false,
        content: "",
        time: 4.5,
        type: "info",
      },
      settings
    );

    if (!settings.content.length) return;

    /**
     * Функция создания элементов
     * @param {String} name - название DOM-элемента
     * @param {Object} attr - объект с атрибутами
     * @param {Object} append - DOM-элемент, в который будет добавлен новый узел
     * @param {String} [content] - контент DOM-элемента
     */
    var create = function (name, attr, append, content) {
      var node = d.createElement(name);
      for (var val in attr) {
        if (attr.hasOwnProperty(val)) node.setAttribute(val, attr[val]);
      }
      if (content) node.insertAdjacentHTML("afterbegin", content);
      append.appendChild(node);
      if (node.classList.contains("note-item-hidden"))
        node.classList.remove("note-item-hidden");
      return node;
    };

    /**
     * Генерация элементов
     */
    var noteBox =
      d.getElementById("notes") || create("div", { id: "notes" }, d.body);
    var noteItem = create(
        "div",
        {
          class: "note-item",
          "data-show": "false",
          role: "alert",
          "data-type": settings.type,
        },
        noteBox
      ),
      noteItemText = create(
        "div",
        { class: "note-item-text" },
        noteItem,
        settings.content
      ),
      noteItemBtn = create(
        "button",
        {
          class: "note-item-btn",
          type: "button",
          "aria-label": "Скрыть",
        },
        noteItem
      );

    /**
     * Функция проверки видимости алерта во viewport
     * @returns {boolean}
     */
    var isVisible = function () {
      var coords = noteItem.getBoundingClientRect();
      return (
        coords.top >= 0 &&
        coords.left >= 0 &&
        coords.bottom <=
          (window.innerHeight || d.documentElement.clientHeight) &&
        coords.right <= (window.innerWidth || d.documentElement.clientWidth)
      );
    };

    /**
     * Функция удаления алертов
     * @param {Object} [el] - удаляемый алерт
     */
    var remove = function (el) {
      el = el || noteItem;
      el.setAttribute("data-show", "false");
      window.setTimeout(function () {
        el.remove();
      }, 250);
      if (settings.callback) settings.callback(); // callback
    };

    /**
     * Удаление алерта по клику на кнопку
     */
    noteItemBtn.addEventListener("click", function () {
      remove();
    });

    /**
     * Визуальный вывод алерта
     */
    window.setTimeout(function () {
      noteItem.setAttribute("data-show", "true");
    }, 250);

    /**
     * Проверка видимости алерта и очистка места при необходимости
     */
    if (!isVisible()) remove(noteBox.firstChild);

    /**
     * Автоматическое удаление алерта спустя заданное время
     */
    window.setTimeout(remove, settings.time * 1000);
  };
})(document);
