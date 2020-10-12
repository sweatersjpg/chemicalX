
let putInput = false;

function setInput(input) {
  putInput = input;
}

function put(s, x, y, c) {
  if(typeof x === 'undefined') x = pointer_.x;
  else pointer_.ox = x;
  if(typeof y === 'undefined') y = pointer_.y;
  c = c || pointer_.c;
  if(typeof c == 'string') c = parseInt(c, 16);
  // else s = String(s);
  let input = false;
  if(typeof s === "object") {
    input = s;
    s = input.value();
  } else s = String(s);

  let dy = 0;
  let dx = 0;
  let sw = 8;
  let dw = sw*D.S;
  let oldC = c;
  for (var i = 0; i <= s.length; i++) {
    if(input && input.focused) {
      c = oldC;
      if(i >= input.elt.selectionStart && i < input.elt.selectionEnd) {
        c = 0;
        palset([1,1,1,1,1]);
        spr(0, x+dx, y+dy, 1, 1, false, 0, 8, 8);
      } else if(i == input.elt.selectionStart && frameCount % 5 > 5/2) {
        c = 0;
        palset([1,1,1,1,1]);
        spr(0, x+dx, y+dy, 1, 1, false, 0, 8, 8);
      }
    }
    if(i == s.length) continue;

    let ch = s.charCodeAt(i) - 32;
    if(ch == -1) continue;
    let sy = floor(ch/32)*8;
    let sx = (ch%32)*8;
    if(s.charAt(i) == "~"){
      if(s.charAt(i+1) == 'n') {
        dx=0;
        x=pointer_.ox;
        dy+=sw;
        i += 1;
        continue;
      }
    }
    temp = {img:font[c],w:dw,h:dw,sx:sx,sy:sy,sw:sw,sh:sw,camera: Object.assign({}, camera)};
    temp.x = floor(x+dx)*D.S;
    temp.y = floor(y+dy)*D.S;
    layer[currentLayer].push(temp);
    dx+=sw;
    if(dx+x > 400-8){
      dx = 0;
      dy += sw;
    }
  }
  pointer_.x = dx + pointer_.ox;
  pointer_.y = dy + y;
  pointer_.c = c;
  putInput = false;
}
