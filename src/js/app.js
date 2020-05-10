import GetGeolocation from './GetGeolocation';
import Recorder from './Recorder';

const container = document.querySelector('.popup_container');
const getGeolocation = new GetGeolocation(container);
const recorder = new Recorder(getGeolocation);
recorder.init();
