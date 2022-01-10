import { fin } from "openfin-adapter/src/mock";
import { PopupOptions, PopupPosition } from ".";

const POSITION_PRIORITY: PopupPosition[] = ['bottom', 'left', 'top', 'right'];

export async function getInitialBounds(
    options: PopupOptions
): Promise<{ top: number, left: number }> {
    const DEFAULT_OFFSET = 5;
    let parentWindow;
    let parentViewBounds;
    if (fin.me.isView) {
        parentWindow = await fin.me.getCurrentWindow();
        parentViewBounds = await fin.me.getBounds();
    } else {
        parentWindow = fin.Window.getCurrentSync();
    }
    const { 
        top: parentWindowTop, 
        left: parentWindowLeft, 
        height: parentWindowHeight, 
        width: parentWindowWidth 
    } = await parentWindow.getBounds();
    const { 
        top: targetTop,
        left: targetLeft,
        height: targetHeight,
        width: targetWidth,
        right: targetRight,
        bottom: targetBottom
    } = options.targetElement!.getBoundingClientRect();

    switch (options.position) {
        case 'top': 
            return {
                top: 0,
                left: 0
            };
        case 'left':
            return {
                top: 0,
                left: 0
            };
        case 'bottom':
            return { 
                top: parentWindowTop + (parentViewBounds?.top ?? 0) + targetBottom + DEFAULT_OFFSET,
                left: parentWindowLeft + (parentViewBounds?.left ?? 0) + targetRight - (Math.round(options.width / 2) + Math.round(targetWidth / 2))
            };
        case 'right': 
            return {
                top: 0,
                left: 0
            };
        case 'in-bounds':
            return {
                top: 0,
                left: 0
            };
        default:
            return { 
                top: parentWindowTop + (parentViewBounds?.top ?? 0) + targetBottom + DEFAULT_OFFSET,
                left: parentWindowLeft + (parentViewBounds?.left ?? 0) + targetRight - (Math.round(options.width / 2) + Math.round(targetWidth / 2))
            };
    }
}
