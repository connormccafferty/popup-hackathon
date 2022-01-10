import React from 'react';
import useLayouts from '../hooks/layouts'
import useSnapshots from '../hooks/snapshots'
import { fin } from 'openfin-adapter/src/mock';

export default function LeftMenu({ showLayoutForm, showSnapshotForm }) {
    const { layouts: layoutTemplates, remove: removeLayout } = useLayouts();
    const { snapshots: snapshotTemplates, remove: removeSnapshot } = useSnapshots();

    return <div className="left-menu">
        <span>Applications</span>
        <ul>
            {appList.map((item) => <li>
                <button onClick={() => addView(item.printName)}>{item.printName}</button>
            </li>)}

        </ul>
        <span>Windows</span>
        <ul>
            <li><button onClick={() => layoutWindow().catch(console.error)}>Platform Window</button></li>
            <li><button onClick={() => nonLayoutWindow().catch(console.error)}>OF Window</button></li>
        </ul>
        <span>Layouts</span>
        <ul>
            <li><button onClick={() => toGrid().catch(console.error)}>Grid</button></li>
            <li><button onClick={() => toTabbed().catch(console.error)}>Tab</button></li>
            {(layoutTemplates ?? []).map((item) => <li onContextMenu={async e => {
                e.preventDefault();
                const template = [{label: 'delete', data: 'delete'}]
                if (fin.me.isWindow) fin.me.showPopupMenu({ template, x: e.pageX, y: e.pageY }).then((r) => {
                    if (r.result === 'clicked') {
                        removeLayout(item);
                    }
                })
            }}>
                <button onClick={() => replaceLayoutFromTemplate(item)}>{item.name}</button>
            </li >)}
            <li><button onClick={() => cloneWindow().catch(console.error)}>Clone</button></li>
            <li><button className="layout-button" onClick={showLayoutForm}>Save Layout</button></li>
        </ul>
        <span>Snapshots</span>
        <ul>
            {(snapshotTemplates ?? []).map((item) => <li onContextMenu={async e => {
                e.preventDefault();
                const template = [{ label: 'Delete', data: 'delete' }];
                if (fin.me.isWindow) fin.me.showPopupMenu({ template, x: e.pageX, y: e.pageY }).then((r) => {
                    if (r.result === 'clicked') {
                        removeSnapshot(item);
                    }
                });
            }}><button onClick={() =>
                applySnapshotFromTemplate(item)}>{item.name}</button></li >)}
            <li><button className="snapshot-button" onClick={showSnapshotForm}>Save Snapshot</button></li>
            <li><button onClick={() => share()}>Share</button></li>
        </ul>
    </div>;
}

const CHART_URL = 'https://cdn.openfin.co/embed-web/chart.html';


//List of apps available in the menu.
const appList = [
    {
        url: CHART_URL,
        printName: 'OF Chart',
        processAffinity: 'ps_1'
    },
    {
        url: 'https://www.tradingview.com/chart/?symbol=NASDAQ:AAPL',
        printName: 'TradeView',
        processAffinity: 'tv_1'
    },
    {
        url: 'https://www.google.com/search?q=INDEXDJX:+.DJI&stick=H4sIAAAAAAAAAONgecRozC3w8sc9YSmtSWtOXmNU4eIKzsgvd80rySypFBLjYoOyeKS4uDj0c_UNkgsry3kWsfJ5-rm4Rrh4RVgp6Ll4eQIAqJT5uUkAAAA&source=lnms&sa=X&ved=0ahUKEwii_NWT9fzoAhU3mHIEHWy3AWIQ_AUIDSgA&biw=1280&bih=1366&dpr=1',
        printName: 'News',
        processAffinity: 'mw_1'
    },
    {
        url: 'color-view',
        printName: 'Colors',
        processAffinity: 'cv_1'
    }
];
// const clickHandler = (e) => {
//     const target = e.target;

//     if (target.className === 'snapshot-button' || target.className === 'layout-button') {
//         if (!layoutContainer.classList.contains('hidden')) {
//             layoutContainer.classList.toggle('hidden');
//         }
//     }

//     if (target.className === 'snapshot-button') {
//         snapshotForm.showElement();
//         layoutForm.hideElement();
//     } else if (target.className === 'layout-button') {
//         layoutForm.showElement();
//         snapshotForm.hideElement();
//     } else {
//         layoutForm.hideElement();
//         snapshotForm.hideElement();

//         if (layoutContainer.classList.contains('hidden')) {
//             layoutContainer.classList.toggle('hidden');
//         }
//     }
// // };

// const render = async ({ layoutTemplates, snapshotTemplates }) => {
//     return <div>
//         <span>Applications</span>
//         <ul>
//             {appList.map((item) => <li>
//                 <button onClick={() => addView(item.printName)}>{item.printName}</button>
//             </li>)}

//         </ul>
//         <span>Windows</span>
//         <ul>
//             <li><button onClick={() => layoutWindow().catch(console.error)}>Platform Window</button></li>
//             <li><button onClick={() => nonLayoutWindow().catch(console.error)}>OF Window</button></li>
//         </ul>
//         <span>Layouts</span>
//         <ul>
//             <li><button onClick={() => toGrid().catch(console.error)}>Grid</button></li>
//             <li><button onClick={() => toTabbed().catch(console.error)}>Tab</button></li>
//             {layoutTemplates.map((item) => <li>
//                 <button onClick={() => replaceLayoutFromTemplate(item.name)}>{item.name}</button>
//             </li >)}
//             <li><button onClick={() => cloneWindow().catch(console.error)}>Clone</button></li>
//             <li><button className="layout-button">Save Layout</button></li>
//         </ul>
//         <span>Snapshots</span>
//         <ul>
//             {snapshotTemplates.map((item) => <li><button onClick={() =>
//                 applySnapshotFromTemplate(item.name)}>{item.name}</button></li >)}
//             <li><button className="snapshot-button">Save Snapshot</button></li>
//             <li><button onClick={() => share()}>Share</button></li>
//         </ul>
//     </div>;
// };

const applySnapshotFromTemplate = async (template) => {
    return fin.Platform.getCurrentSync().applySnapshot(template.snapshot, {
        closeExistingWindows: template.close
    });

};

const replaceLayoutFromTemplate = async (template) => {
    fin.Platform.Layout.getCurrentSync().replace(template.layout);
};

const addView = async (printName) => {
    const viewOptions = appList.find(i => i.printName === printName);
    return fin.Platform.getCurrentSync().createView(viewOptions, fin.me.identity);
};

const toGrid = async () => {
    await fin.Platform.Layout.getCurrentSync().applyPreset({
        presetType: 'grid'
    });
};

const toTabbed = async () => {
    await fin.Platform.Layout.getCurrentSync().applyPreset({
        presetType: 'tabs'
    });
};
const toRows = async () => {
    await fin.Platform.Layout.getCurrentSync().applyPreset({
        presetType: 'rows'
    });
};

const cloneWindow = async () => {
    const bounds = await fin.me.getBounds();
    const layout = await fin.Platform.Layout.getCurrentSync().getConfig();
    const customContext = await fin.Platform.getCurrentSync().getWindowContext();
    const snapshot = {
        windows: [
            {
                defaultWidth: bounds.width,
                defaultHeight: bounds.height,
                layout,
                //getWindowContext actually returns the customContext option.
                customContext
            }
        ]
    };

    return fin.Platform.getCurrentSync().applySnapshot(snapshot);
};

const nonLayoutWindow = async () => {
    return fin.Platform.getCurrentSync().applySnapshot({
        windows: [{
            defaultWidth: 600,
            defaultHeight: 600,
            defaultLeft: 200,
            defaultTop: 200,
            saveWindowState: false,
            url: CHART_URL,
            contextMenu: true
        }]
    });
};

const layoutWindow = async () => {

    const viewOptions = {
        url: CHART_URL
    };
    return fin.Platform.getCurrentSync().createView(viewOptions);
};

const share = async () => {
    const { windows } = await fin.Platform.getCurrentSync().getSnapshot();
    const contentConfig = { snapshot: { windows } };
    const res = await fetch('https://jsonblob.com/api/jsonBlob', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(contentConfig), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const contentUrl = res.headers.get('Location');
    const { manifestUrl } = await fin.Application.getCurrentSync().getInfo();

    const startUrl = `https://openfin.github.io/start/?manifest=${encodeURIComponent(`${manifestUrl}?$$appManifestUrl=${contentUrl}`)}`;

    fin.System.openUrlWithBrowser(startUrl);
};
