import React from 'react';
import { Switch } from '@headlessui/react';
import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux';
import { setServerSetting, setLibrarySetting, setApplicationTheme } from "../../context/actions/settingsActions";

import Subheader from '../Header/Subheader';
import { ScrollContent  } from '../util/container';
import { SrOnly } from '../util/common';

// Original tailwind styles.
/* <select className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> */

// Styling below was pulled from Tailwind classes.
const SelectControl = styled.select`
    font-size: 0.875rem;
    line-height: 1.25rem;

    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;

    background-color: ${({ theme }) => theme.SETTINGS_CONTROL_BG};
    border: solid 1px ${({ theme }) => theme.SETTINGS_CONTROL_BORDER};
    border-radius: 0.375rem;
    
`;

const SwitchContainer = styled.div`
    margin: 0.5rem 0;   
`;
const ToggleSwitch = styled(Switch)` 
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 2.75rem;
    border-radius: 9999px;
    height: 1.5rem;
    background-color: ${props => (props.checked) ? 'rgba(31, 41, 55, 1)' : 'rgba(75, 85, 99, 1)'};
`;
const ToggleLabel = styled.span`
    margin-right: 1rem;
`;

const ToggleButton = styled.span`
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-color: #fff;
    border-radius: 9999px;
    transform: ${props => (props.checked) ? 'translate(1.5rem, 0)' : 'translate(0.3rem, 0)'};
`;



const Settings = () => {
    const dispatch = useDispatch();
   
    const serverIdentifier = useSelector(state => state.settings.serverIdentifier);
    const librarySection = useSelector(state => state.settings.librarySection);
    const resources = useSelector(state => state.settings.servers);
    const libraries = useSelector(state => state.settings.libraries);
    const isDarkMode = useSelector(state => state.settings.isDarkMode);

    const serverChanged = (e) => {
        dispatch(setServerSetting(e.target.value));
    }

    const libraryChanged = (e) => {
        dispatch(setLibrarySetting(e.target.value));
    }

    return (
        <>
            <Subheader hideServer={true}></Subheader>
            <ScrollContent>
                <SelectControl value={serverIdentifier} onChange={serverChanged}>
                    <option value="" disabled hidden>Select a Server</option>
                    {(resources.map((resource) => (
                        <option key={resource.clientIdentifier} value={resource.clientIdentifier}>{resource.name}</option>
                    )))}
                </SelectControl>

                <SelectControl value={librarySection} onChange={libraryChanged}>
                    <option value="" disabled hidden>Select a Library</option>
                    {(libraries.map((library) => (
                        <option key={library.key} value={library.key}>{library.title}</option>
                    )))}
                </SelectControl>

                <SwitchContainer> 
                    <ToggleLabel>Dark Mode:</ToggleLabel>
                    <ToggleSwitch checked={isDarkMode} onChange={() => dispatch(setApplicationTheme(!isDarkMode))}>
                        <SrOnly>Enable notifications</SrOnly>
                        <ToggleButton checked={isDarkMode} />
                    </ToggleSwitch>
                </SwitchContainer>
            </ScrollContent>
        </>
    );
}

export default Settings;
