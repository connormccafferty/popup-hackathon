import React, { useState } from 'react';
import useSnapshots from '../hooks/snapshots';
import { fin } from 'openfin-adapter/src/mock';


export default function SnapshotForm({ toggleVisibility }) {
    const initialState = { name: 'New Snapshot', close: true };
    const [state, setState] = useState(initialState);
    const updateState = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name);
        setState({ ...state, [e.target.name]: e.target.value });
    };
    const {add} = useSnapshots();
    const saveAsTemplate = async () => {
        const snapshot = await fin.Platform.getCurrentSync().getSnapshot();
        add({ name: state.name, snapshot, close: state.close });
        toggleVisibility();
    };
    return <div className="center-form">
        <fieldset>
            <legend>Save all current Platform Windows as a Snapshot</legend>
            <input type={"text"} className={"template-name"} size={50} name={"name"} value={state.name} onChange={updateState} />
            <input type="checkbox" id="close" name="close"
                checked={state.close} onChange={updateState} />
            <label>Close Platform before restoring Snapshot</label> <br />
            <button onClick={saveAsTemplate}>Save Snapshot</button>
            <button onClick={toggleVisibility}>Cancel</button>
        </fieldset>
    </div >;
}