import { fin } from 'openfin-adapter/src/mock';
import React from 'react';

const handleclick = async (e) => {
    await (fin.me as any).dispatchPopupResult(e.target.innerHTML);
}

export default function PopupWindow() {
    const actions = [
        { topic: 'allow', icon: '✔️' }, 
        { topic: 'deny', icon: '❌' },
        { topic: 'smile', icon: '🙂' }
    ];

    return <div id="popup">
        <ul>
            {actions.map(({ topic, icon }) => <li key={topic}><span>{topic}</span><button id={topic} onClick={handleclick}>{icon}</button></li>)}
        </ul>
    </div>
}
