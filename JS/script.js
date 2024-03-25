const popupModal = document.querySelector(".popup");
const popupOverlay = document.querySelector(".pop-overlay");
const game = document.querySelector(".game");
const playButton = document.querySelector(".game .cardContainer .play");
const cardWrapper = document.querySelector(".game .cardContainer");
const body = document.querySelector(".body");
const pencilSizeButtons = document.querySelectorAll(".size-btn");
const pencilSizes = document.querySelector(".pencil .sizes");
const pencil = document.querySelector(".pencil .pencil-item");
const eraser = document.querySelector(".eraser .eraser-item");
const eraserSizes = document.querySelector(".eraser .eraser-sizes");
const eraserSizeButtons = document.querySelectorAll(
  ".eraser .eraser-sizes .eraser-size"
);
const brush = document.querySelector(".brush");
const colorsContainer = document.querySelector(".colors");
const colors = document.querySelectorAll(".color");
const undoButton = document.querySelector(".option.undo");
const clearButton = document.querySelector(".option.repeat");
const saveButton = document.querySelector(".option.save");
const infoIcon = document.querySelector(".info.icon");
const arrows = document.querySelectorAll(".game .body .arrow");
const pauseButton = document.querySelector(".game .pause.icon");
const iconsArr = [...arrows, pauseButton];
const successButton = document.querySelector(".option.success");
const successModal = document.querySelector(".success-wrapper");
const overlay = document.querySelector(".overlay");
let currentColor, currentSize, eraserSize;
const canvas = document.querySelector(".draw-canvas");
let context = canvas.getContext("2d");
let isDrawing = false;
let restore_array = [];
let start_index = -1;
let currentTool = "pencil";
const animateInfo = () => {
  infoIcon.classList.add("show");
  infoIcon.addEventListener("animationend", () => {
    setTimeout(() => {
      infoIcon.classList.remove("show");
      infoIcon.classList.add("hide");
    }, 1000);
  });
};
infoIcon.addEventListener("click", () => {
  infoIcon.classList.remove("hide");
  animateInfo();
});
playButton.addEventListener("click", () => {
  document.querySelector("#start-audio").play();
  cardWrapper.classList.add("hide");
  cardWrapper.addEventListener("animationend", () => {
    cardWrapper.classList.remove("hide");
    cardWrapper.style.visibility = "hidden";
    game.style.backgroundImage = `url(${
      document.querySelector(".game-background").textContent
    })`;
    body.classList.add("show");
    pauseButton.style.visibility = "visible";
  });
});
pauseButton.addEventListener("click", () => {
  const hiddenIcon = pauseButton.querySelector("i.hide");
  const shownIcon = pauseButton.querySelector("i:not(.hide)");
  hiddenIcon.classList.remove("hide");
  shownIcon.classList.add("hide");
});
pencilSizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const size = button.dataset.size;
    currentSize = size;
    currentTool = "pencil";
    const selectedColor = document.querySelector(".color.selected");
    if (selectedColor) {
      currentColor = selectedColor.dataset.color;
    } else {
      currentColor = "#000";
    }
    pencilSizes.classList.remove("show");
  });
});
pencil.addEventListener("click", (event) => {
  if (pencilSizes.classList.contains("show")) {
    pencilSizes.classList.remove("show");
  } else {
    pencilSizes.classList.add("show");
  }
});
eraserSizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const size = button.dataset.size;
    eraserSize = size;
    currentTool = "eraser";
    currentColor = "#ffff";
    eraserSizes.classList.remove("show");
  });
});
eraser.addEventListener("click", () => {
  if (eraserSizes.classList.contains("show")) {
    eraserSizes.classList.remove("show");
  } else {
    eraserSizes.classList.add("show");
  }
});
brush.addEventListener("click", () => {
  brush.classList.add("active");
  colorsContainer.classList.add("show");
  eraser.classList.remove("active");
});
colors.forEach((color) => {
  color.addEventListener("click", () => {
    const colorValue = color.dataset.color;
    currentColor = colorValue;
    let previouslySelectedColor = document.querySelector(".color.selected");
    if (previouslySelectedColor) {
      previouslySelectedColor.classList.remove("selected");
    }
    color.classList.add("selected");
    currentTool = "pencil";
  });
});
const resizeCanvas = () => {
  const container = document.querySelector(".body-wrapper");
  const width = container.clientWidth;
  const height = container.clientHeight;
  canvas.width = width;
  canvas.height = height;
  draw();
};
const draw = () => {
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
};
const start = (event) => {
  event.preventDefault();
  isDrawing = true;
  context.beginPath();
  context.moveTo(getX(event), getY(event));
};
const paint = (event) => {
  event.preventDefault();
  if (isDrawing) {
    context.lineTo(getX(event), getY(event));
    context.strokeStyle = currentColor;
    context.lineWidth = currentTool === "pencil" ? currentSize : eraserSize;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
  }
};
const stop = (event) => {
  event.preventDefault();
  if (isDrawing) {
    context.stroke();
    context.closePath();
    isDrawing = false;
  }
  if (
    event.type !== "mouseup" &&
    event.type !== "touchend" &&
    event.type !== "mouseout"
  )
    return;
  restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
  start_index += 1;
};
const getX = (event) => {
  if (event.pageX == undefined) {
    return event.targetTouches[0].pageX - canvas.offsetLeft;
  } else {
    return event.pageX - canvas.offsetLeft;
  }
};
const getY = (event) => {
  if (event.pageY == undefined) {
    return event.targetTouches[0].pageY - canvas.offsetTop;
  } else {
    return event.pageY - canvas.offsetTop;
  }
};
clearButton.addEventListener("click", () => {
  clear();
});
undoButton.addEventListener("click", (event) => {
  if (start_index <= 0) {
    clear();
  } else {
    start_index += -1;
    restore_array.pop();
    if (event.type != "mouseout") {
      context.putImageData(restore_array[start_index], 0, 0);
    }
  }
});
saveButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.setAttribute("download", "paint.png");
  link.setAttribute(
    "href",
    canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
  );
  link.click();
});
successButton.addEventListener("click", () => {
  successModal.style.visibility = "visible";
  overlay.classList.add("show");
  successModal.classList.add("show");
  document.querySelector(`audio[id="success"]`).play();
});
const clear = () => {
  context.fillStyle = "white";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
  restore_array = [];
  start_index = -1;
};
function undo() {
  if (start_index <= 0) return clear();
  start_index--;
  context.putImageData(restore_array[start_index], 0, 0);
}
const restore = (event) => {
  if (start_index <= 0) {
    clear();
  } else {
    start_index -= 1;
    restore_array.pop();
    if (event.type != "mouseout") {
      context.putImageData(restore_array[start_index], 0, 0);
    }
  }
};
canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", paint, false);
canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", paint, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);
const hideItems = () => {
  iconsArr.forEach((item) => {
    item.style.opacity = 0;
  });
};
let timer;
const resetTimer = () => {
  clearTimeout(timer);
  iconsArr.forEach((item) => {
    item.style.opacity = 1;
  });
  timer = setTimeout(hideItems, 3000);
};
document.addEventListener("mousemove", resetTimer);
document.addEventListener("touchstart", resetTimer);
const checkScreen = () => {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const isMobile = window.innerWidth < 768 && isPortrait;
  return isMobile;
};
window.addEventListener("load", () => {
  animateInfo();
  const is_mobile = checkScreen();
  if (is_mobile) {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  } else {
    game.style.visibility = "visible";
  }
  currentColor = "#000";
  currentSize = 4;
  eraserSize = 4;
  resizeCanvas();
});
window.addEventListener("resize", resizeCanvas);
document.addEventListener("contextmenu", function (event) {
  var target = event.target;
  if (target.tagName === "IMG") {
    event.preventDefault();
  }
  return false;
});
window.addEventListener("orientationchange", function () {
  const is_mobile = checkScreen();
  if (window.orientation === 90 || window.orientation === -90) {
    if (is_mobile) {
      game.style.visibility = "visible";
      popupModal.style.visibility = "hidden";
      popupOverlay.style.visibility = "hidden";
    } else {
      popupModal.style.visibility = "visible";
      popupOverlay.style.visibility = "visible";
    }
  } else {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  }
});
