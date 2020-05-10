import coordValidation from './coordValidation';

export default class GetGeolocation {
  constructor(targetContainer) {
    this.popup = null;
    this.popupContainer = targetContainer;
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve(`${latitude}, ${longitude}`);
          }, (error) => { // eslint-disable-line no-unused-vars
            this.createPopup();
            this.input = document.querySelector('.popup_input');
            this.confirm = document.querySelector('.popup_ok');
            this.reset = document.querySelector('.popup_reset');
            this.confirm.addEventListener('click', () => {
              const isValid = coordValidation(this.input.value);
              if (isValid) {
                this.popupContainer.removeChild(this.popupContainer.firstChild);
                resolve(isValid);
              } else {
                this.input.style.borderColor = 'red';
              }
            });
            this.reset.addEventListener('click', () => {
              reject('Отменена геолокация'); // eslint-disable-line prefer-promise-reject-errors
              this.popupContainer.removeChild(this.popupContainer.firstChild);
            });
          },
        );
      } else {
        this.createPopup();
        this.input = document.querySelector('.popup_input');
        this.confirm = document.querySelector('.popup_ok');
        this.reset = document.querySelector('.popup_reset');
        this.confirm.addEventListener('click', () => {
          const isValid = coordValidation(this.input.value);
          if (isValid) {
            this.popupContainer.removeChild(this.popupContainer.firstChild);
            resolve(isValid);
          } else {
            this.input.style.borderColor = 'red';
          }
        });
        this.reset.addEventListener('click', () => {
          reject('Отменена геолокация'); // eslint-disable-line prefer-promise-reject-errors
          this.popupContainer.removeChild(this.popupContainer.firstChild);
        });
      }
    });
  }

  createPopup() {
    this.popup = document.createElement('div');
    this.popup.classList.add('popup_location');
    this.popup.innerHTML = `
            <span class="popup_header">Что-то пошло не так</span>
            <p class="popup_text">
              К сожалению нам не удалось определить Ваше местоположение,
              пожалуйста, дайте разрешение на использование геолокации, 
              либо введите координаты в ручную.
            </p>
            <span class="popup_input_header">Широта и долгота через запятую</span>
            <input class="popup_input">
            <div class="btn_container">
            <span class="popup_reset">Отмена</span>
            <span class="popup_ok">ОК</span>
            </div>
          `;
    this.popupContainer.append(this.popup);
  }
}
