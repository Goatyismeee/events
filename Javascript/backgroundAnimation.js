// --------- TUNABLES -----------
const sizes = [0.25, 0.5, 1, 2];
const starCount = 75;
// ------------------------------

//get random position between 1 - 100;
function randomPosition(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const body = document.querySelector("body");

for (let i = 0; i < starCount; i++) {
  const div = document.createElement('div');
  div.classList.add('stars');
  div.style.backgroundColor = "#FFFFFF";
  div.style.borderRadius = '50%';

  // randomised duration of twinkle for each star, between 3 - 10 seconds.
  const randomDuration = (Math.random() * 9 + 3).toFixed(2) + 's';
  div.style.setProperty('--duration', randomDuration);

  // randomised position of stars on the screen, in %.
  const top = randomPosition(1,100);
  const left = randomPosition(1,100);
  div.style.position = 'absolute';
  div.style.top = top +'%';
  div.style.left = left + '%';

  // randomised size of stars, in px.
  const random = Math.floor(Math.random() * sizes.length);
  const randomSize = sizes[random];
  div.style.height = randomSize +'px';
  div.style.width = randomSize +'px';
  
  document.body.appendChild(div);
}

