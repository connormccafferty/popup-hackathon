import { fin } from "openfin-adapter/src/mock";
import { CHANNEL_PREFIX } from "./constants";

class PopupProvider {
    #bus?: OpenFin.ChannelProvider;

    public async init(): Promise<void> {
        if (!this.#bus) {
            this.#bus = await fin.InterApplicationBus.Channel.create(`${CHANNEL_PREFIX}_${fin.me.identity.uuid}`);

            this.#bus.register('get-popup-parent-id', async () => {
                try {
                    const results = await Promise.all(this.#bus!.publish('is-popup-open', ''));
                    return results.filter(result => result !== null)[0];
                } catch (e) {
                    console.log(e);
                }
            });
        }
    }
}

export async function initPopupProvider(): Promise<void>  {
    try {
        const provider = new PopupProvider();
        await provider.init();
    } catch {
        // provider already running
    }
}
