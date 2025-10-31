const canvas = document.getElementById("vectorCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.55;

function drawAxes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2, cy = canvas.height / 2;
  ctx.strokeStyle = "#1e3a8a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height);
  ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy);
  ctx.stroke();
}

function drawArrow(x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 10;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

let drawn = [];

function animateVector(x1, y1, x2, y2, color, width, onDone) {
  let f = 0, frames = 60;
  function step() {
    f++;
    const t = f / frames;
    const xt = x1 + (x2 - x1) * t;
    const yt = y1 + (y2 - y1) * t;
    drawAxes();
    for (let s of drawn) drawArrow(...s);
    drawArrow(x1, y1, xt, yt, color, width);
    if (f < frames) requestAnimationFrame(step);
    else {
      drawn.push([x1, y1, x2, y2, color, width]);
      if (onDone) onDone();
    }
  }
  step();
}

function showEquation() {
  const x1 = +v("x1"), y1 = +v("y1"), x2 = +v("x2"), y2 = +v("y2");
  const k1 = +v("k1"), k2 = +v("k2");
  const eq = `R = k₁A + k₂B = ${k1}(${x1} , ${y1}) + ${k2}(${x2} , ${y2})`;
  document.getElementById("equation").textContent = eq;
  drawVectors();
}

function drawVectors() {
  const x1 = +v("x1"), y1 = +v("y1"), x2 = +v("x2"), y2 = +v("y2");
  const k1 = +v("k1"), k2 = +v("k2");
  const method = document.getElementById("method").value;
  const cx = canvas.width / 2, cy = canvas.height / 2;

  drawn = [];
  drawAxes();

  const maxVal = Math.max(Math.abs(x1 * k1), Math.abs(y1 * k1), Math.abs(x2 * k2), Math.abs(y2 * k2));
  const scale = (Math.min(canvas.width, canvas.height) / 2.5) / (maxVal || 1);

  const A = { x: x1 * k1 * scale, y: y1 * k1 * scale };
  const B = { x: x2 * k2 * scale, y: y2 * k2 * scale };
  const R = { x: A.x + B.x, y: A.y + B.y };

  const O = { x: cx, y: cy };
  const Aend = { x: O.x + A.x, y: O.y - A.y };
  const Bend = { x: O.x + B.x, y: O.y - B.y };
  const Rend = { x: O.x + R.x, y: O.y - R.y };

  animateVector(O.x, O.y, Aend.x, Aend.y, "#10b981", 3, () => {
    if (method === "triangle") {
      animateVector(Aend.x, Aend.y, Aend.x + B.x, Aend.y - B.y, "#ef4444", 3, () => {
        animateVector(O.x, O.y, Rend.x, Rend.y, "#2563eb", 4);
      });
    } else {
      animateVector(O.x, O.y, Bend.x, Bend.y, "#ef4444", 3, () => {
        drawn.push([Aend.x, Aend.y, Aend.x + B.x, Aend.y - B.y, "#ef4444", 1]);
        drawn.push([Bend.x, Bend.y, Bend.x + A.x, Bend.y - A.y, "#10b981", 1]);
        drawAxes();
        for (let s of drawn) drawArrow(...s);
        animateVector(O.x, O.y, Rend.x, Rend.y, "#2563eb", 4);
      });
    }
  });

  document.getElementById("result").textContent =
    `نتیجه جمع: (${(x1 * k1 + x2 * k2).toFixed(2)} , ${(y1 * k1 + y2 * k2).toFixed(2)})`;
}

function toggleSign(id) {
  const el = document.getElementById(id);
  el.value = el.value.startsWith("-") ? el.value.substring(1) : "-" + el.value;
}

function v(id) { return document.getElementById(id).value; }

drawAxes();