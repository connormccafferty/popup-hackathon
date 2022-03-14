import { fin } from 'openfin-adapter/src/mock';
import React, { useState, useEffect } from 'react';

export default function ColorPicker() {
    const [contextGroups, setContextGroups] = useState([]);
    
    useEffect(() => {
        (fin.me as any).interop.getContextGroups().then((groups) => setContextGroups(groups));
    }, []);

    return <div id="color-picker">
        {contextGroups.map(({ id, displayMetadata: { color, name } }) => 
            <button 
                key={id}
                style={{
                    width: 20,
                    height: 20,
                    border: 'none',
                    borderRadius: '50%',
                    background: color,
                    padding: 0
                }} 
                onClick={async () => await (fin.me as any).dispatchPopupResult({ color, name })}
                aria-label={name}
            >
            </button>
        )}
    </div>
}
