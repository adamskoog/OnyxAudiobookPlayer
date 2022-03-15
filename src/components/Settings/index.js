import React, { useEffect, useState } from 'react';
//import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux';
import { setServerSetting, setLibrarySetting, setApplicationTheme } from "../../context/actions/settingsActions";

import { ToggleSwitch, Combobox } from '../util/controls';

const Settings = () => {
    const dispatch = useDispatch();
   
    const serverIdentifier = useSelector(state => state.settings.serverIdentifier);
    const librarySection = useSelector(state => state.settings.librarySection);
    const resources = useSelector(state => state.settings.servers);
    const libraries = useSelector(state => state.settings.libraries);
    const isDarkMode = useSelector(state => state.settings.isDarkMode);

    // Local state for option arrays.
    const [serverOptions, setServerOptions] = useState([]);
    const [libraryOptions, setLibraryOptions] = useState([]);

    useEffect(() => {    
        if (resources && resources.length > 0) {
            setServerOptions(resources.map((resource) => ({
                displayValue: resource.name, value: resource.clientIdentifier
            })));
        } else setServerOptions([]);

    }, [resources]);

    useEffect(() => {    
        if (libraries && libraries.length > 0) {
            setLibraryOptions(libraries.map((library) => ({
                displayValue: library.title, value: library.key
            })));
        } else setLibraryOptions([]);

    }, [libraries]);

    return (
        <>
            <Combobox value={serverIdentifier} options={serverOptions} callback={(option) => dispatch(setServerSetting(option.value))} defaultLabel={'Select a Server...'} noOptionsLabel={'No servers found.'}/>
            <Combobox value={librarySection} options={libraryOptions} callback={(option) => dispatch(setLibrarySetting(option.value))} defaultLabel={'Select a Library...'} noOptionsLabel={'No libraries found.'} />
            <ToggleSwitch label={'Dark Mode'} srLabel={'Enable Dark Mode'} value={isDarkMode} callback={() => dispatch(setApplicationTheme(!isDarkMode))} />
        </>
    );
}

export default Settings;
