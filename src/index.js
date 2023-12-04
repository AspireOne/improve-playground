import { injectStyles } from "./styles";
import { log, logErr } from "./utils";
import {runAppLoop} from "./appLoop";

const actions = [
  [injectStyles, "Injected global styles."],
  [() => prefillSystemPrompt("You are an expert programmer."), "Prefilled system prompt."],
  //[() => prefillTemperature(0.75), "Prefilled temperature."],
  //[setOutputTokensToMax, "Set output tokens to max."],
  [addCopyHookToPre, "Added copy hook to pre tags."],
  [addTextboxRefocusHook, "Added textbox refocus hook."],
  //[overwriteScrollToBehavior, "Overwrote scroll behavior."],
  [runAppLoop, "Started the main app loop."],
];

let initialized = false;
function initialize() {
  if (initialized) return;
  initialized = true;

  log("Initializing...");
  for (const [action, msg] of actions) {
    try {
      action();
      log(msg);
    } catch (e) {
      logErr(`Failed to execute action '${msg}': ${e}`);
    }
  }
}

/** Initialize the playground when the page is loaded. */
document.addEventListener("DOMContentLoaded", () => setTimeout(initialize, 2000));
window.addEventListener("load", () => setTimeout(initialize, 2000));

/** Sets the output tokens slider to the max value. */
function setOutputTokensToMax() {
  // Select based on valuemax 4096 of gpt-3.5.
  const slider = document.querySelector('.rc-slider-handle[aria-valuemax="4096"]');
  if (!slider) throw new Error("Slider not found");

  const maxValue = slider.getAttribute("aria-valuemax");
  slider.setAttribute("aria-valuenow", maxValue);
}

/** Prefills the temperature slider with the given value. */
function prefillTemperature(value) {
  const slider = document.querySelector('.rc-slider-handle[aria-valuemax="2"]');
  if (!slider) throw new Error("Slider not found");
  slider.setAttribute("aria-valuenow", `${value}`);
  const sliderHandle = document.querySelector(".rc-slider-handle");
}

/** Prefills the system prompt with the given text. */
function prefillSystemPrompt(prompt) {
  const promptDiv = document.querySelector(".chat-pg-instructions");
  const promptTextarea = promptDiv.querySelector("textarea");
  promptTextarea.value = prompt;
  for (const ev of ["input", "keydown", "keypress", "keyup", "onchange"]) {
    promptTextarea.dispatchEvent(new Event(ev, { bubbles: true }));
  }
}

/** Adds a hook to focus on input textbox when switching back to playground. */
function addTextboxRefocusHook() {
  window.addEventListener("focus", () => {
    const all = document.querySelectorAll(".text-input-with-focus textarea");
    const last = all[all.length - 1];

    if (last && last.getAttribute("header") === "user") {
      last.focus();
      // move the cursor to the end.
      last.setSelectionRange(last.value.length, last.value.length);
    }
  });
}

/** Adds a hook to all pre tags to copy their content to clipboard when clicked. */
function addCopyHookToPre() {
  document.addEventListener("click", async (e) => {
    if (e.target.tagName === "PRE" || e.target.matches("pre")) {
      e.stopPropagation();
      const pre = e.target;
      const content = pre.textContent;
      await navigator.clipboard.writeText(content);
    }
  });
}

/** Overwrites the default scroll behavior to only scroll when the user is near the bottom. */
function overwriteScrollToBehavior() {
  const element = document.querySelector(".chat-pg-exchange-container");

  const originalScrollTopDescriptor = Object.getOwnPropertyDescriptor(
    Element.prototype,
    "scrollTop",
  );

  const isNearBottom = (element) => {
    const currY = element.scrollTop;
    const maxY = element.scrollHeight - element.clientHeight - 1;
    return maxY - currY < 100;
  };

  Object.defineProperty(element, "scrollTop", {
    set: (value) => {
      if (isNearBottom(element)) {
        //originalScrollTopDescriptor.set.call(this, value);
        // make the scroll smooth
        element.scrollTo({
          top: value,
          behavior: "smooth",
        });
      }
    },
    get: () => {
      return originalScrollTopDescriptor.get.call(this);
    },
  });
}