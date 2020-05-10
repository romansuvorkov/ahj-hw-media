import coordValidation from '../../coordValidation';

test.each([
  ['true', '51.50851, −0.12572', '51.50851, −0.12572'],
  ['true', '51.50851,−0.12572', '51.50851, −0.12572'],
  ['true', '[51.50851, −0.12572]', '51.50851, −0.12572'],
  ['null', '51.50678851,−012572', false],
])(('%s'), (_, coordinates, expected) => {
  const received = coordValidation(coordinates);
  expect(received).toBe(expected);
});
