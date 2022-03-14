import React, { useEffect, useState } from 'react';
import useTheme from '../hooks/theme';
import { fin } from 'openfin-adapter/src/mock';
// import { Popup } from 'popup-client';

const maxOrRestore = async () => {
    if (!fin.me.isWindow) {
        throw new Error('This should only be used in an OpenFin Window');
    }

    if (await fin.me.getState() === 'normal') {
        return await fin.me.maximize();
    }

    return fin.me.restore();
};

const toggleLockedLayout = async () => {
    const oldLayout = await fin.Platform.Layout.getCurrentSync().getConfig();
    const { settings, dimensions } = oldLayout;
    if (settings.hasHeaders && settings.reorderEnabled) {
        fin.Platform.Layout.getCurrentSync().replace({
            ...oldLayout,
            settings: {
                ...settings,
                hasHeaders: false,
                reorderEnabled: false
            }
        });
    } else {
        fin.Platform.Layout.getCurrentSync().replace({
            ...oldLayout,
            settings: {
                ...settings,
                hasHeaders: true,
                reorderEnabled: true
            },
            dimensions: {
                ...dimensions,
                headerHeight: 25
            }
        });
    }
};

const close = () => fin.me.isWindow && fin.me.close();
const minimize = () => fin.me.isWindow &&  fin.me.minimize();

export default function TitleBar({ toggleMenu }) {
    const [popupResult, setPopupResult] = useState('🔽');
    const [activeColor, setActiveColor] = useState('gray');

    useEffect(() => {
        // fin.Platform.getCurrentSync().getWindowContext().then(initialContext => {
        //     if (initialContext && initialContext.theme) {
        //         setTheme(initialContext.theme);
        //     }
        // });

        // fin.Platform.getCurrentSync().on('window-context-changed', async (evt) => {
        //     const context = await fin.Platform.getCurrentSync().getWindowContext();
        //     //we only want to react to events that include themes
        //     if (evt.context.theme && evt.context.theme !== context.theme) {
        //         setTheme(evt.context.theme);
        //     }
        // });
        if (!fin.me.isWindow) {
            throw new Error('This should only be used in an OpenFin Window');
        }

        fin.me.on('layout-ready', async () => {
            // Whenever a new layout is ready on this window (on init, replace, or applyPreset)
            const { settings } = await fin.Platform.Layout.getCurrentSync().getConfig();
            // determine whether it is locked and update the icon
            if (settings.hasHeaders && settings.reorderEnabled) {
                document.getElementById('lock-button').classList.remove('layout-locked');
            } else {
                document.getElementById('lock-button').classList.add('layout-locked');
            }
        });
    });
    
    const { toggleTheme } = useTheme();

    const toggleColorPickerMenu = async (e) => {
        const { width, height } = await (fin.me as OpenFin.Window).getBounds();
        const x = Math.round(width / 2) - 150;
        const y = Math.round(height / 2) - 50;
        const opts = {
            name: `color-picker-${fin.me.name}`,
            width: 300,
            height: 50,
            x,
            y,
            hideOnClose: true,
            resultDispatchBehavior: 'none',
            onPopupResult: async (result) => {
                if (result.data) {
                    setActiveColor(result.data.color);
                    // await (fin.me as any).interop.joinContextGroup(result.data.name);
                }
            }
        }
        await (fin.me as any).showPopupWindow(opts);
    }

    const toggleDropDown = async (e) => {
        const { left, bottom, width } = e.target.getBoundingClientRect();
        const x = (left + Math.round(width / 2)) - 150;
        const y = bottom + 3;
        const opts = {
            name: `popup-${fin.me.name}`,
            width: 300,
            height: 142,
            x, 
            y,
            hideOnClose: true
        }

        const result = await (fin.me as any).showPopupWindow(opts);
        
        if (result.data) {
            setPopupResult(result.data);
        } else {
            setPopupResult('🔽');
        }
    };

    return <div id="title-bar">
        <div className="title-bar-draggable">
            <div id="title"></div>
        </div>
        <div id="buttons-wrapper">
            <div className="button" title="Color Picker" id="color-picker-button" onClick={toggleColorPickerMenu} style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ 
                    borderRadius: '50%',
                    background: activeColor,
                    height: '60%',
                    width: '60%'
                }}></div>
            </div>
            <div className="button" title="Popup Menu" id="popup-button" onClick={toggleDropDown}>{popupResult}</div>
            <div className="button" title="Toggle Theme" id="theme-button" onClick={toggleTheme}></div>
            <div className="button" title="Toggle Sidebar" id="menu-button" onClick={toggleMenu}></div >
            <div className="button" title="Toggle Layout Lock" id="lock-button" onClick={toggleLockedLayout}></div >
            <div className="button" title="Minimize Window" id="minimize-button" onClick={minimize}></div >
            <div className="button" title="Maximize Window" id="expand-button" onClick={maxOrRestore}></div >
            <div className="button" title="Close Window" id="close-button" onClick={close}></div >
        </div >
    </div>;

}