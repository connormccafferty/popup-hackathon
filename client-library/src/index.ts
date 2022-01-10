// import { fin } from 'openfin-adapter/src/mock';
import { fin } from 'openfin-adapter/src/mock';
import { CHANNEL_PREFIX } from './constants';
import { PopupContentWindow } from './popupContentWindow';
import { getInitialBounds } from './getInitialBounds';
import { initPopupProvider } from './popupProvider';

export type PopupPosition = 'top' | 'left' | 'bottom' | 'right' | 'in-bounds';

export interface PopupAction {
    action: string;
    listener: () => any;
};

export interface PopupOptions {
    url: string;
    height: number;
    width: number;
    top?: number;
    left?: number;
    autoShow?: boolean; // default false
    modal?: boolean; // default false
    focus?: boolean; // default true
    closeOnBlur?: boolean; // default true
    targetElement?: HTMLElement;
    position?: PopupPosition // default 'bottom'
    actions?: PopupAction[];
};

let currentPopup: PopupContentWindow | null = null;

export class Popup {
    static #connection?: OpenFin.ChannelClient;
    
    static async init() {
        await initPopupProvider();
    }

    private static async connect() {
        try {
            this.#connection = await fin.InterApplicationBus.Channel.connect(`${CHANNEL_PREFIX}_${fin.me.identity.uuid}`);
            this.#connection.register('is-popup-open', () => currentPopup === null ? null : fin.me.identity);
        } catch (e) {
            throw new Error('Must call Popup.init');
        }
    }

    private static async ensureConnection(): Promise<void> {
        if (!this.#connection) {
            await this.connect();
        }
    }

    static async show(options: PopupOptions): Promise<OpenFin.MenuResult> {
        await this.ensureConnection();
        if (currentPopup !== null) {
            await this.close();
        }
        const { top, left } = await getInitialBounds(options);
        const popup = new PopupContentWindow(options, { top, left });
        currentPopup = popup;
        return popup.initialize(async () => currentPopup = null);
    }

    static async trigger(action: string, data: any): Promise<void> {
        await this.ensureConnection();
        const popupParentIdentity = await this.#connection!.dispatch('get-popup-parent-id', { action, data });
        await fin.InterApplicationBus.send(popupParentIdentity, 'action', { action, data });
    }

    static async close(): Promise<void> {
        await this.ensureConnection();
        await currentPopup?.close();
        currentPopup = null;
    }
}
