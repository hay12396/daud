﻿import Cookies from "js-cookie";
import nipplejs from "nipplejs";
import { setInterval, setTimeout } from "timers";
import { Settings } from "./settings";
import { Ship } from "./models/ship";

const autofCon = document.getElementById("autofireContainer");
const autofTgg = document.getElementById("autofireToggle");

export const nipple = nipplejs.create({
    zone: document.getElementById("nipple-zone"),
    resetJoystick: false
});
const isMobile = "ontouchstart" in document.documentElement;
if (!isMobile) {
    nipple.destroy();
    document.getElementById("nipple-controls").style.display = "none";
}

const shipSelectorSwitch = document.getElementById("shipSelectorSwitch");

const refreshSelectedStyle = function() {
    const options = Array.from(document.getElementById("shipSelectorSwitch").children);

    for (const option of options) {
        if (option.getAttribute("data-color") == Controls.ship) option.classList.add("selected");
        else option.classList.remove("selected");
    }
};

shipSelectorSwitch.addEventListener("click", function(e) {
    Controls.ship = e.srcElement.getAttribute("data-color");
    save();
    refreshSelectedStyle();
});

const nick = document.querySelector("#nick");
nick.addEventListener("change", e => {
    Controls.nick = nick.value;
    if (Controls && Controls.canvas) Controls.canvas.focus();

    save();
});

export var Controls = {
    left: false,
    up: false,
    right: false,
    down: false,
    boost: false,
    shoot: false,
	autofire: false,
    downSince: false,
    registerCanvas(canvas) {
        const getMousePos = (canvas, { clientX, clientY }) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };
        if (isMobile) {
            nipple.on("move", (e, { angle, force }) => {
                Controls.angle = angle.radian;
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                Controls.mouseX = Math.cos(angle.radian) * force * window.innerHeight + cx;
                Controls.mouseY = Math.sin(-angle.radian) * force * window.innerHeight + cy;
            });
            document.getElementById("shoot").addEventListener("touchstart", e => {
                Controls.shoot = true;
            });
            document.getElementById("shoot").addEventListener("touchend", e => {
				if (!Controls.autofire) {
					Controls.shoot = false;
				}
            });
            document.getElementById("boost").addEventListener("touchstart", e => {
                Controls.boost = true;
            });
            document.getElementById("boost").addEventListener("touchend", e => {
                Controls.boost = false;
            });
        } else {
            window.addEventListener("mousemove", e => {
                const pos = getMousePos(canvas, e);
                Controls.mouseX = pos.x;
                Controls.mouseY = pos.y;
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                const dy = pos.y - cy;
                const dx = pos.x - cx;

                Controls.angle = Math.atan2(dy, dx);
            });
            window.addEventListener("mousedown", ({ button }) => {
                if (button == 2)
                    //right click
                    Controls.boost = true;
                else {
                    if (Settings.mouseOneButton > 0) {
                        Controls.downSince = new Date().getTime();
                    } else {
                        Controls.shoot = true;
                    }
                }
            });

            window.addEventListener("mouseup", ({ button }) => {
                if (button == 2)
                    //right click
                    Controls.boost = false;
                else {
                    if (Settings.mouseOneButton > 0) {
                        const timeDelta = new Date().getTime() - Controls.downSince;
                        Controls.downSince = false;
                        if (timeDelta < Settings.mouseOneButton) {
                            Controls.shoot = true;
                            setTimeout(function() {
								if (!Controls.autofire) {
									Controls.shoot = false;
								}
                            }, 100);
                        } else {
                            Controls.boost = true;
                            setTimeout(function() {
                                Controls.boost = false;
                            }, 100);
                        }
                    } else if (!Controls.autofire) {
						Controls.shoot = false;
					}
                }
            });
            document.getElementById("gameArea").addEventListener("contextmenu", e => {
                e.preventDefault();
                return false;
            });
        }
        Controls.canvas = canvas;
    },
    initializeWorld: function(world) {
        const colors = world.allowedColors;
        const selector = document.getElementById("shipSelectorSwitch");
        while (selector.firstChild) selector.removeChild(selector.firstChild);

        for (let i = 0; i < colors.length; i++) {
            const selectorImage = Ship.getSelectorImage(colors[i]);

            if (selectorImage) {
                selector.appendChild(selectorImage);
                selectorImage.setAttribute("data-color", colors[i]);
                selectorImage.classList.add("circle");
            }
        }

        const shipIndex = Math.floor(Math.random() * colors.length);

        Controls.ship = colors[shipIndex];
        refreshSelectedStyle();
    },
    ship: "ship_green"
};

window.addEventListener(
    "keydown",
    ({ keyCode }) => {
        switch (keyCode) {
            case 37: // left arrow
                Controls.left = true;
                break;
            case 38: // up arrow
                Controls.up = true;
                break;
            case 39: // right arrow
                Controls.right = true;
                break;
            case 40: // down arrow
                Controls.down = true;
                break;
            case 83: // s
                Controls.boost = true;
                break;
            case 32: // space
                Controls.shoot = true;
                break;
			case 69: // e
				// Autofire
				if (!Controls.autofire) {
					Controls.autofire = true;
					Controls.shoot = true;
					autofTgg.innerHTML = "ON";
					autofCon.style.color = "#fff";
					console.log("Autofire enabled!");
				} else {
					Controls.autofire = false;
					Controls.shoot = false;
					autofTgg.innerHTML = "OFF";
					autofCon.style.color = "";
					console.log("Autofire disabled!");
				}
				break;
        }
    },
    false
);

window.addEventListener(
    "keyup",
    ({ keyCode }) => {
        switch (keyCode) {
            case 37: // left arrow
                Controls.left = false;
                break;
            case 38: // up arrow
                Controls.up = false;
                break;
            case 39: // right arrow
                Controls.right = false;
                break;
            case 40: // down arrow
                Controls.down = false;
                break;
            case 83: // s
                Controls.boost = false;
                break;
            case 32: // space
				if (!Controls.autofire) {
					Controls.shoot = false;
				}
				break;
        }
    },
    false
);

function save() {
    const cookieOptions = { expires: 300 };

    if (Controls.nick) Cookies.set("nick", Controls.nick, cookieOptions);
    Cookies.set("color", Controls.color, cookieOptions);
}

const savedNick = Cookies.get("nick");
const savedColor = Cookies.get("color");

if (savedNick !== undefined) {
    Controls.nick = savedNick;
    nick.value = savedNick;
}

if (savedColor !== undefined) {
    Controls.color = savedColor;
    refreshSelectedStyle();
}
