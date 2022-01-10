import React, { useEffect, useState } from 'react';
import useLayouts from '../hooks/layouts';
import { fin } from 'openfin-adapter/src/mock';


export default function LayoutForm({ toggleVisibility }) {
    const initialState = { name: 'New Layout' };
    const [state, setState] = useState(initialState);
    const updateState = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name);
        setState({ ...state, [e.target.name]: e.target.value });
    };
    const { add } = useLayouts();
    const saveAsTemplate = async () => {
        const layout = await fin.Platform.Layout.getCurrentSync().getConfig();
        add({ name: state.name, layout });
        toggleVisibility();
    };
    return <div className="center-form">
        <fieldset>
            <legend>Save the current Views in this Window as a Layout template</legend>
            <input type={"text"} className={"template-name"} size={50} name={"name"} value={state.name} onChange={updateState} /> <br />
            <button onClick={saveAsTemplate}>Save Layout</button>
            <button onClick={toggleVisibility}>Cancel</button>
        </fieldset>
    </div >;
}