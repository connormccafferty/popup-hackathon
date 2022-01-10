import React, { useEffect } from 'react';
import Link from 'next/link';
import { fin } from 'openfin-adapter/src/mock';
import { Popup } from 'popup-client';

export default function app() {
    useEffect(() => {
        (async () => {
            await fin.Platform.init();
            await Popup.init();
        })();
    }, []);
    return <div>
        <Link href="platform-window" >Custom Window (for prefetch)</Link>
    </div>;
};
