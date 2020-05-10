export default class Recorder {
  constructor(geolocation) {
    this.audioRecBtn = document.querySelector('.sound_btn');
    this.videoRecBtn = document.querySelector('.camera_btn');
    this.timerField = document.querySelector('.timer');
    this.recInterface = document.querySelector('.rec_interface');
    this.postContainer = document.querySelector('.task_list');
    this.geolocation = geolocation;
    this.saveBtn = document.querySelector('.save_rec');
    this.resetBtn = document.querySelector('.cancel_rec');
    this.inputField = document.querySelector('.post_input');
    this.coordinates = null;
  }

  async init() {
    this.recTimer = document.querySelector('.timer');
    this.audioRecBtn.addEventListener('click', () => {
      this.audioRecBtn.classList.add('none');
      this.videoRecBtn.classList.add('none');
      this.recInterface.classList.remove('none');
      this.start(false);
    });

    this.videoRecBtn.addEventListener('click', () => {
      this.audioRecBtn.classList.add('none');
      this.videoRecBtn.classList.add('none');
      this.recInterface.classList.remove('none');
      this.start(true);
    });

    this.inputField.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.createElement(this.inputField.value);
        this.inputField.value = '';
      }
    });
  }

  async start(typeOfRec) {
    if (!navigator.mediaDevices) {
      this.createPopup('К сожалению Ваш браузер не поддреживает данную функцию. Используйте другой браузер');
      return;
    }
    try {
      let confirmSave = true;
      let timerValue = 0;

      if (!window.MediaRecorder) {
        this.createPopup('Пожалуйста разрешите запись');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: typeOfRec,
      });

      if (typeOfRec) {
        const videoFile = document.createElement('video');
        videoFile.controls = true;
        videoFile.classList.add('video');
        videoFile.muted = 'muted';
        document.body.appendChild(videoFile);
        videoFile.srcObject = stream;
        videoFile.play();
      }

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.start();

      let timerCycle = null;
      recorder.addEventListener('start', () => {
        timerCycle = setInterval(() => {
          this.timerField.innerText = this.timer(timerValue += 1);
        }, 1000);
      });

      recorder.addEventListener('dataavailable', (evt) => {
        chunks.push(evt.data);
      });

      recorder.addEventListener('stop', async () => {
        clearInterval(timerCycle);
        this.timerField.innerText = '00:00';
        if (confirmSave) {
          let blob = null;
          let element = null;
          if (typeOfRec) {
            element = document.createElement('video');
            blob = new Blob(chunks, { type: 'video/mp4' });
          } else {
            element = document.createElement('audio');
            blob = new Blob(chunks, { type: 'audio/mp4' });
          }
          const fileReader = new FileReader();
          fileReader.readAsDataURL(blob);
          fileReader.onload = () => {
            element.src = fileReader.result;
            element.controls = true;
            this.createElement(element.outerHTML);
          };
        }
        if (typeOfRec) {
          document.body.removeChild(document.querySelector('.video'));
        }
        this.audioRecBtn.classList.remove('none');
        this.videoRecBtn.classList.remove('none');
        this.recInterface.classList.add('none');
      });

      this.saveBtn.onclick = () => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        confirmSave = true;
      };

      this.resetBtn.onclick = () => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        confirmSave = false;
      };
    } catch (e) {
      this.createPopup('Пожалуйста разрешите запись видeо/аудио и проверьте, что оборудование подключено');
      this.audioRecBtn.classList.remove('none');
      this.videoRecBtn.classList.remove('none');
      this.recInterface.classList.add('none');
    }
  }

  timer(counter) {
    const minutes = Math.floor(counter / 60);
    const seconds = (counter - (minutes * 60));
    const outputMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const outputSec = seconds < 10 ? `0${seconds}` : seconds;
    return `${outputMinutes}:${outputSec}`;
  }


  createPopup(inputText) {
    this.popup = document.createElement('div');
    this.popup.classList.add('popup_location');
    this.popup.innerHTML = `
          <span class="popup_header">Внимание</span>
          <p class="popup_text">
            ${inputText}
          </p>
          <span class="popup_reset">Ок</span>
        `;
    this.geolocation.popupContainer.append(this.popup);
    const reset = document.querySelector('.popup_reset');
    reset.addEventListener('click', () => {
      this.geolocation.popupContainer.removeChild(this.geolocation.popupContainer.firstChild);
    });
  }

  async createElement(inputEl) {
    if (this.coordinates === null) {
      this.coordinates = await this.geolocation.getLocation();
      this.addMessage(inputEl, this.coordinates);
      this.elPopup.classList.add('hidden');
      this.elPopupInput.classList.add('hidden');
      this.elPopupCancel.classList.add('hidden');
    } else {
      this.addMessage(inputEl, this.coordinates);
    }
  }

  addMessage(inputEl, coordinates) {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minute = date.getMinutes();
    const newEl = document.createElement('div');
    newEl.classList.add('list_item');
    newEl.innerHTML = `
        <span class="item_date">${day}.${month}.${year} ${hours}:${minute}</span>        
        <div class="item_content">${inputEl}</div>
        <div class="coordinates_container">
        <span class="item_coordinates">${coordinates}</span>
        <span class="eye"></span>         
        </div>
        `;
    this.postContainer.prepend(newEl);
  }
}
