import { PopupOptions } from ".";
import { v4 as uuidv4 } from 'uuid';
import { fin } from "openfin-adapter/src/mock";

const DEFAULT_WINDOW_OPTIONS = {
    waitForPageLoad: true,
    autoShow: false,
    alwaysOnTop: true,
    frame: false,
    resizable: false
};

export class PopupContentWindow {
    #openfinWindow?: OpenFin.Window;
    #options?: PopupOptions;
    #initialBounds: Partial<OpenFin.Bounds>;
    #actionMap?: Map<string, () => any>;

    constructor(
        options: PopupOptions,
        initialBounds: Partial<OpenFin.Bounds>
    ) {
        this.#options = options;
        this.#initialBounds = initialBounds;
        if (!this.#options.actions) {
            this.#options.actions = [];
        }
        this.#options.actions.forEach(({ action, listener }) => {
            this.#actionMap?.set(action, listener);
        });
    }
    
    private getOpenfinWindow(): OpenFin.Window {
        if (!this.#openfinWindow) {
            throw new Error('PopupContentWindow not found.')
        }

        return this.#openfinWindow;
    }

    public async initialize(onClose: () => any): Promise<OpenFin.MenuResult> {
        this.#openfinWindow = await this.createPopupWindow(this.#options!);
        await this.setLoadListener(async () => await this.show());
        await this.setClosedListener(onClose);
        this.getOpenfinWindow().once('blurred', async () => {
            await this.close();
        });

        const closingPromise = new Promise((resolve) => {
            this.getOpenfinWindow().once('closing', async () => {
                this.getOpenfinWindow().removeAllListeners('blurred');
                resolve({ result: 'closed' });
            });
        });

        const actionPromise = this.register();

        return await Promise.race<any>([closingPromise, actionPromise]);
    }

    public async setClosedListener(listener: () => any): Promise<void> {
        await this.getOpenfinWindow().once('closed', listener);
    }

    public async setLoadListener(listener: () => any): Promise<void> {
        (await this.getOpenfinWindow().getWebWindow()).addEventListener('load', listener);
    }

    private async createPopupWindow(options: PopupOptions): Promise<OpenFin.Window> {
        const {
            url, 
            height, 
            width, 
            autoShow,
            modal
        } = options;
        const { top, left } = this.#initialBounds; 
        const guid = `POPUP_WINDOW_${uuidv4()}`;
        async function getParentIdentity(modal: boolean = false): Promise<OpenFin.Identity | undefined>  {
            if (!modal) {
                return;
            } 
            return fin.me.isView ? (await fin.me.getCurrentWindow()).identity : fin.me.identity
        } 
        const popupOptions: any = {
            ...DEFAULT_WINDOW_OPTIONS,
            name: guid,
            uuid: guid,
            url,
            autoShow,
            height,
            defaultWidth: width, 
            defaultTop: top, 
            defaultLeft: left,
            defaultHeight: height,
        };
        const modalParentIdentity = await getParentIdentity(modal);

        if (modalParentIdentity) {
            popupOptions.modalParentIdentity = modalParentIdentity;
        }

        const popupWindow = await fin.Window.create(popupOptions);
        await popupWindow.focus();
        return popupWindow;
    }

    public async show(): Promise<void> {
        return this.getOpenfinWindow().show();
    }

    public async hide(): Promise<void> {
        return this.getOpenfinWindow().hide();
    }

    public async close(): Promise<void> {
        await this.getOpenfinWindow().close(true);
    }

    public async register(): Promise<OpenFin.MenuResult> {
        return new Promise(async resolve => {
            await fin.InterApplicationBus.subscribe(this.getOpenfinWindow().identity, 'action', async (payload: any) => {
                const { action } = payload;
                if (this.#actionMap?.has(action)) {
                    this.#actionMap.get(action)!();
                }
                this.getOpenfinWindow().removeAllListeners('closing');
                this.getOpenfinWindow().removeAllListeners('blurred');
                await this.close();
                resolve({ result: 'clicked', data: payload })
            });
        })
    }
}
