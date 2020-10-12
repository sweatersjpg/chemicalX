// Co-op game
// sweatersjpg

let DEBUG = false;

let data = { password:{ secret:"chemicalx"}}

function init_() {
  setSpriteSheet("nenesLogo");
  setNumberOfLayers(6);
  lset(1);

  pause_Button_.paused = false;
  drawFN = new Game();

  disableScroll();

}

// ------- main loops -------

function Game() {
  this.output = "booting -";

  this.input = createInput('');
  // this.input.hide();
  this.input.elt.onblur = () => { this.input.focused = false }
  this.input.elt.onfocus = () => { this.input.focused = true }

  this.input.elt.focus();
  this.input.position(-windowWidth,-windowHeight, 'fixed');
  this.input.elt.style.position = "fixed";
  this.input.elt.style.fontSize = "20px";

  this.arguments = [];

  this.setFunction = (fn, wait) => {
    this.function = fn;
    this.s = 0;
    this.wait = wait;
  }

  this.s = 0;
  this.function;
  this.wait = false;

  // functions

  this.boot = () => {
    if(this.s < 90) {
      if(frameCount%2 == 0) {
        if(this.output == "booting \\") this.output = "booting |";
        else if(this.output == "booting |") this.output = "booting /";
        else if(this.output == "booting /") this.output = "booting -";
        else if(this.output == "booting -") this.output = "booting \\";
      }
    } else if(this.s == 90) {
      this.output = "Boot successful~nLoading database~n";
    } else if(this.s <= 140) {
      this.print("_");
    } else if(this.s <= 140+30*5) {
      let str = "";
      for (var i = 0; i < 50; i++) str+=String.fromCharCode(floor(random(33,126)));
      this.print(str);
    } else if(this.s <= 290+8) {
      this.output = "";
      cls(1);
    } else if(this.s <= 290+16) {
      cls(0);
    } else {
      this.setFunction(this.getUsername, true);
      this.output = "Enter username:~n"
    }
  }
  this.getUsername = (username) => {
    console.log(username);
    if(username.toLowerCase() == "redcat") {
      cls(1);
      this.output = "Username valid.~nEnter password for redcat:~n";
      this.setFunction(this.getPassword, true);
    } else {
      cls(16);
      this.output += "ERROR: b64 cmVkY2F0~nUsername Incorrect~nEnter username:~n";
    }
  }
  this.getPassword = (password) => {
    if(password.toLowerCase() == "c8hf15o2") {
      this.setFunction(this.success, false);
    } else {
      cls(16);
      this.output += "ERROR: UEZBUyBmb3JtdWxh~nPassword not correct~n"
    }
  }
  this.success = () => {
    if(this.s < 30) {
      this.output = "LOGIN SUCCESSFUL~n";
    } else if(this.s == 30) {
      downloadImage();
    } else {
      cls(0);
      // palset([1,0,64]);
      // spr(0, 0, 0, 16, 16);
      // spr(256,256,0,16,16);

    }
  }

  this.setFunction(this.boot, false);

  // main loop

  this.draw = () => {
    cls(0);
    textc(1);

    put(this.output, 0, 0);

    if(!this.wait) {
      this.function();
      this.input.elt.value = "";
      this.s++;
    }

    if(getHeight(this.output) >= 240) this.output = trimFirst(this.output);

    if(!this.wait) return;
    put("> ", 0, getHeight(this.output));
    setInput(this.input);
    put(this.input);
  }

  this.print = (value) => {
    this.output += value;
  }

  this.println = (value) => {
    this.output += value + "~n";
  }

  this.keydown = (e) => {
    if(e.keyCode == 13) {
      this.output += "> " + this.input.value() + "~n";

      if(this.wait) {
        let args = this.input.value().split(' ');
        args.filter(x => x !== '');

        this.function(...args);
      }

      this.input.elt.value = "";
    }
  }

  this.mousedown = (e) => {
    e.preventDefault();
    this.input.elt.focus();
  }

}

function trimFirst(str) {
  let sub = "";

  for (var i = 0; i < str.length; i++) {
    sub += str.charAt(i);
    if(i > 0) {
      if(str.charAt(i) == 'n' && str.charAt(i-1) == '~') break;
    }
    if(sub.length == 50) break;
  }
  str = str.replace(sub, '');
  return str;
}

function getHeight(str, x) {
  x = x || 0;
  let count = 0;

  for (var i = 0; i < str.length; i++) {
    if(str.charAt(i) == "~") {
      if(str.charAt(i+1) == "n") {
        count += 1;
        x = 0;
        i++;
        continue;
      }
    }
    x++;
    if(x > 50) {
      x = 0;
      count++;
    }
  }

  return count * 8;

}

function downloadImage() {
  var element = document.createElement('a');
  element.setAttribute('href', 'https://cdn.discordapp.com/attachments/581184222807588865/765236152952684575/who.png');
  element.setAttribute('download', 'who.png');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
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
