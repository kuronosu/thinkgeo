import { setupCommands } from "./command";
import setupGrid from "./grid";
import "./style.css";
import Turtle from "./turtle/turtle";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div class="panels">
  <div class="panel left-panel">
    <h3>Comandos</h3>
    <ul id="help"></ul>
  </div>
  <div class="panel center-panel">
    <canvas id="grid" width="600" height="600"></canvas>
    <canvas id="canvas" width="600" height="600"></canvas>
    <canvas id="pointer" width="600" height="600"></canvas>
  </div>
  <div class="panel right-panel">
    <ol id="history-container"></ol>
  </div>
</div>
<div class="controls">
  <input type="text" id="command-entry" />
</div>
`;

const $canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const $pointer = document.querySelector<HTMLCanvasElement>("#pointer")!;
const $commandEntry = document.getElementById(
  "command-entry"
) as HTMLInputElement;

const turtle = new Turtle($canvas, $pointer);

setupGrid(document.querySelector<HTMLCanvasElement>("#grid")!);
setupCommands(
  document.getElementById("history-container") as HTMLOListElement,
  $commandEntry,
  document.getElementById("help") as HTMLUListElement,
  turtle
);

setTimeout(() => {
  $commandEntry.focus();
  const commads = `
  xy(-10,10)
  adelante(10)
  rotar(-90)
  adelante(10)
  rotar(-90)
  adelante(10)
  rotar(-90)
  adelante(10)
  rotar(-90)
  xy(0,0)
  color(255,0,0)
  circulo(25.5)
  color(0,255,0)
  rotar(45)
  cuadrado(10)
  `;
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  (async () => {
    for (const c of commads.split("\n").filter((c) => c.trim() !== "")) {
      $commandEntry.value = c.trim();
      $commandEntry.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter" })
      );
      await sleep(41.66);
    }
  })();
}, 10);