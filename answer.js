// Co-op game
// sweatersjpg

let DEBUG = false;

function init_() {
  setSpriteSheet("spriteSheet");
  setNumberOfLayers(6);
  lset(1);

  pause_Button_.paused = false;
  drawFN = new Game();

  disableScroll();

}

// ------- main loops -------

function Game() {

  this.inputs = [
    new input("1. ", "1", 200-64, 120 - 20 * 2, 16), // De_Forest
    new input("2. ", "2", 200-64, 120 - 20 * 1, 16), // C02FOOTPRINT
    new input("3. ", "3", 200-64, 120, 16),
    new input("4. ", "4", 200-64, 120 + 20 * 1, 16)
  ]

  this.draw = () => {
    cls(0);
    textc(1);

    let count = 0;
    for (var i of this.inputs) {
      if(i.correct) count++;
    }
    if(count == this.inputs.length) {
      window.location.replace("https://sweaters.itch.io/ketris");
      noLoop();
      // return;
    }

    for (var i of this.inputs) i.draw();
  }

  this.mousedown = (e) => {
    e.preventDefault();
    for (var i of this.inputs) i.focus();

  }

}

function input(prompt, answer, x, y, dw) {
  this.input = createInput('').attribute('maxlength', dw);
  this.input.elt.onblur = () => { this.input.focused = false }
  this.input.elt.onfocus = () => { this.input.focused = true }
  this.input.position(-windowWidth,-windowHeight, 'fixed');
  this.input.elt.style.position = "fixed";
  this.input.elt.style.fontSize = "20px";

  this.x = x;
  this.y = y;
  this.w = dw*8;
  this.h = 8;

  this.isUnderMouse = () => {
    return mouseX/D.S > this.x && mouseX/D.S < this.x+this.w && mouseY/D.S > this.y && mouseY/D.S < this.y+this.h;
  }

  this.focus = () => {
    if(this.isUnderMouse()) this.input.elt.focus();
    else this.input.elt.blur();
  }

  this.draw = () => {
    this.correct = this.input.value() == answer;
    if(this.correct) palset([1,1,1,1,1]);
    else palset([16,1,1,1,1]);
    spr(0, this.x-2, this.y-2, 1, 1, false, 0, this.w+8+4, this.h+4);
    palset([0,64,64,64,64]);
    spr(0, this.x-1, this.y-1, 1, 1, false, 0, this.w+8+2, this.h+2);

    textc(1);
    put(this.input, this.x, this.y);

    textc(1);
    put(prompt, this.x - prompt.length*8, this.y);
  }

}

function changeStringRandom(str) {
  str = str.split("");
  str[floor(random(str.length))] = String.fromCharCode(floor(random(33,126)));
  return str.join("");
}

let eventsToAdd = ['keydown', 'mousedown', 'dblclick', 'blur', 'focus', 'keyup', 'keypress'];
for (let EVENT of eventsToAdd)
window.addEventListener(EVENT, e => {
  if(!pause_Button_.paused && drawFN && drawFN[EVENT]) drawFN[EVENT](e);
});

function disableScroll() {
  var keys = {37: 0, 38: 1, 39: 0, 40: 1};
  function preventDefault(e) { e.preventDefault(); }
  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }
  var supportsPassive = false;
  try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
      get: function () { supportsPassive = true; }
    }));
  } catch(e) {}
  var wheelOpt = supportsPassive ? { passive: false } : false;
  var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}
