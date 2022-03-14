import React, { useEffect, useState } from 'react';
import TitleBar from '../../components/title-bar';
import LeftMenu from '../../components/left-menu';
import LayoutForm from '../../components/layout-form'
import SnapshotForm from '../../components/snapshot-form'
import { fin } from 'openfin-adapter/src/mock';


export default function PlatformWindow() {
    useEffect(() => {
        fin.Platform.Layout.init();
    }, []); // Data ensures this only runs once

    // setup popup windows
    useEffect(() => {
        (async () => {
            await fin.Window.create({
                frame: false,
                name: `popup-${fin.me.name}`,
                url: `${location.origin}/popup`,
                autoShow: false
            });
            
            await fin.Window.create({
                frame: false,
                name: `color-picker-${fin.me.name}`,
                url: `${location.origin}/color-picker`,
                autoShow: false
            });
        })();
    }, [])

    const [contentToShow, setContent] = useState('layout');
    const hideForm = () => setContent('layout')

    const [showMenu, setShowMenu] = useState(false);

    return <div id={"of-frame-main"}>
        <TitleBar toggleMenu={() => setShowMenu(() => !showMenu)}></TitleBar>
        <div id={"body-container"}>
            {showMenu && <LeftMenu showSnapshotForm={() => setContent('snapshot-form')} showLayoutForm={() => setContent('layout-form')}></LeftMenu>}
            <div className={"two-sided-container"}>
                <div id={"layout-container"} className={"face" + (contentToShow === 'layout' ? '' : ' hidden')}></div>
                {contentToShow === 'layout-form' && <LayoutForm className={"face"} toggleVisibility={hideForm}></LayoutForm>}
                {contentToShow === 'snapshot-form' && <SnapshotForm className={"face"} toggleVisibility={hideForm}></SnapshotForm>}
            </div>
        </div>
    </div>;
}