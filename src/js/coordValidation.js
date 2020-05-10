export default function coordValidation(input) {
  let data = input;
  if (data.includes('[') && data.includes(']')) {
    data = data.slice(data.indexOf('[') + 1, data.indexOf(']'));
  }
  if (data.includes(' ')) {
    if (/^[0-9]{1,2}\.[0-9]{5}, [-—–−-]?[0-9]{1,2}\.[0-9]{5}/.test(data)) {
      return data;
    }
    return false;
  }
  const latitude = data.slice(0, data.indexOf(','));
  const longitude = data.slice(data.indexOf(',') + 1);
  data = `${latitude}, ${longitude}`;
  if (/^[0-9]{1,2}\.[0-9]{5}, [-—–−-]?[0-9]{1,2}\.[0-9]{5}/.test(data)) {
    return data;
  }
  return false;
}
