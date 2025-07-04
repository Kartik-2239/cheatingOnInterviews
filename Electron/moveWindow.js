import { globalShortcut } from "electron";

export default function registerShortcuts(window) {
    
    const pixelDistanceHorizontal = 75
    const pixelDistanceVertical = 50

    globalShortcut.register('CommandOrControl+Left', () => {
        const [x, y] = window.getPosition();
        window.setPosition(x - pixelDistanceHorizontal, y)
    });

    globalShortcut.register('CommandOrControl+Right', () => {
        const [x, y] = window.getPosition();
        window.setPosition(x + pixelDistanceHorizontal, y)
    });

    globalShortcut.register('CommandOrControl+Up', () => {
        const [x, y] = window.getPosition();
        window.setPosition(x, y - pixelDistanceVertical)
    });

    globalShortcut.register('CommandOrControl+Down', () => {
        const [x, y] = window.getPosition();
        window.setPosition(x, y + pixelDistanceVertical)
    });
}

