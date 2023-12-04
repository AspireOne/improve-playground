import { applyMarkdown } from "./applyMarkdown";
import { genRandomId } from "./utils";

const msgList = {};
let noChangeCount = 12;
let speed = "slow";
let interval = null;

export function runAppLoop() {
  if (!interval) interval = setInterval(runAppLoop, 2000);
  console.log("checking for new textareas");
  let somethingChanged = false;

  // biome-ignore lint: off
  document.querySelectorAll(".text-input-with-focus textarea").forEach((area) => {
    if (area.dataset.id) {
      if (msgList[area.dataset.id].length === area.value.length) return;

      msgList[area.dataset.id] = area.value;
      somethingChanged = true;
      console.log("applying");
      if (document.activeElement !== area) applyMarkdown(area);
      return;
    }

    if (area.getAttribute("header") === "user") {
      return;
    }

    area.dataset.id = genRandomId();
    msgList[area.dataset.id] = area.value;

    console.log("applying");
    somethingChanged = true;
    if (document.activeElement !== area) applyMarkdown(area);

    area.addEventListener("focus", () => {
      console.log("focus event");
      //applyMarkdown(area);
    });

    area.addEventListener("blur", () => {
      applyMarkdown(area);
    });
  });

  if (somethingChanged) {
    noChangeCount = 0;
    if (speed === "slow") {
      console.log("speeding up interval");
      speed = "fast";
      clearInterval(interval);
      interval = setInterval(runAppLoop, 200);
    }
  }
  // if nothing changed
  else {
    ++noChangeCount;
    if (noChangeCount >= 12 && speed === "fast") {
      console.log("slowing down interval");
      speed = "slow";
      clearInterval(interval);
      interval = setInterval(runAppLoop, 2000);
    }
  }
}
