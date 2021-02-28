"use strict";

/**
 * @property {Object} settings Объект с настройками галереи.
 * @property {string} settings.previewSelector Селектор обертки для миниатюр галереи.
 * @property {string} settings.openedImageWrapperClass Класс для обертки открытой картинки.
 * @property {string} settings.openedImageClass Класс открытой картинки.
 * @property {string} settings.openedImageScreenClass Класс для ширмы открытой картинки.
 * @property {string} settings.openedImageCloseBtnSrc Путь до картинки кнопки закрыть.
 * @property {string} settings.openedImageCloseBtnClass Класс для картинки кнопки закрыть.
 * @property {string} settings.openedImageNotFoundSrc Путь до картинки-заглушки.
 * @property {string} settings.openedImageNextImgSrc Путь до картинки кнопки перехода на следующую картинку.
 * @property {string} settings.openedImageNextImgClass Класс для картинки перехода на следующую картинку.
 * @property {string} settings.openedImageBackImgSrc Путь до картинки кнопки перехода на предыдущую картинку.
 * @property {string} settings.openedImageBackImgClass Класс для картинки перехода на предыдущую картинку.
 */
const gallery = {
    openedImageEl: null,
  settings: {
      previewSelector: '.mySuperGallery',
      openedImageWrapperClass: 'galleryWrapper',
      openedImageClass: 'galleryWrapper__image',
      openedImageScreenClass: 'galleryWrapper__screen',
      openedImageCloseBtnClass: 'galleryWrapper__close',
      openedImageCloseBtnSrc: 'img/settingsImg/close.png',
      openedImageNotFoundSrc: 'img/settingsImg/404.png',
      openedImageNextImgSrc: 'img/settingsImg/next.png',
      openedImageNextImgClass: 'galleryWrapper__next',
      openedImageBackImgSrc: 'img/settingsImg/back.png',
      openedImageBackImgClass: 'galleryWrapper__back',
  },

  /**
   * Инициализирует галерею, ставит обработчик события.
   * @param {Object} userSettings Объект настроек для галереи.
   */
  init(userSettings = {}) {
    Object.assign(this.settings, userSettings);
    document.querySelector(this.settings.previewSelector)
            .addEventListener('click', event => this.containerClickHandler(event));
  },

  /**
   * Обработчик события клика для открытия картинки.
   * @param {MouseEvent} event Событие клики мышью.
   * @param {HTMLElement} event.target Целевой объект, куда был произведен клик.
   */
  containerClickHandler(event) {
      if (event.target.tagName !== 'IMG') {
          return;
        }
      this.openedImageEl = event.target;
      this.openImage(event.target.dataset.full_image_url);
  },

  /**
   * Открывает картинку.
   * @param {string} src Ссылка на картинку, которую надо открыть.
   */
  openImage(src) {
     this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`).src = src;
  },

  /**
   * Возвращает контейнер для открытой картинки, либо создает такой контейнер, если его еще нет.
   * @returns {Element}
   */
  getScreenContainer() {
    const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);
    if (galleryWrapperElement) {
      return galleryWrapperElement;
    }
    return this.createScreenContainer();
  },

  /**
   * Создает контейнер для открытой картинки.
   * @returns {HTMLElement}
   */
  createScreenContainer() {
      const galleryWrapperElement = document.createElement('div');
      galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);

      const backImageElement = new Image();
      backImageElement.classList.add(this.settings.openedImageBackImgClass);
      backImageElement.src = this.settings.openedImageBackImgSrc;
      galleryWrapperElement.appendChild(backImageElement);
      backImageElement.addEventListener('click', () => {
          this.openedImageEl = this.getPreviousImage();
          this.openImage(this.openedImageEl.dataset.full_image_url);
      });

      const nextImageElement = new Image();
      nextImageElement.classList.add(this.settings.openedImageNextImgClass);
      nextImageElement.src = this.settings.openedImageNextImgSrc;
      galleryWrapperElement.appendChild(nextImageElement);
      nextImageElement.addEventListener('click', () => {
          this.openedImageEl = this.getNextImage();
          this.openImage(this.openedImageEl.dataset.full_image_url);
      });

      const galleryScreenElement = document.createElement('div');
      galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
      galleryWrapperElement.appendChild(galleryScreenElement);

      const closeImageElement = new Image();
      closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
      closeImageElement.src = this.settings.openedImageCloseBtnSrc;
      closeImageElement.addEventListener('click', () => this.close());
      galleryWrapperElement.appendChild(closeImageElement);

      const image = new Image();
      image.onerror = () => image.src = this.settings.openedImageNotFoundSrc;
      image.classList.add(this.settings.openedImageClass);
      galleryWrapperElement.appendChild(image);
      document.body.appendChild(galleryWrapperElement);
      return galleryWrapperElement;
  },

    /**
     * Возвращает предыдущую картинку от открытой или последнюю в контейнере если текущая картинка первая.
     * @returns {Element} Возвращает предыдущую картинку от открытой.
     */
    getPreviousImage() {
        const previousImage = this.openedImageEl.previousElementSibling;
        return previousImage ? previousImage : this.openedImageEl.parentNode.lastElementChild;
    },

    /**
     * Возвращает следующую картинку от открытой или первую в контейнере если текущая картинка последняя.
     * @returns {Element} Возвращает следующую картинку от открытой.
     */
    getNextImage() {
        const nextImage = this.openedImageEl.nextElementSibling;
        return nextImage ? nextImage : this.openedImageEl.parentNode.firstElementChild;
    },

  /**
   * Закрывает (удаляет) контейнер для открытой картинки.
   */
  close() {
    document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
  }
};

window.onload = () => gallery.init({previewSelector: '.pictureContainer'});