import React from 'react';
import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux'
import { setServerSetting, setLibrarySetting } from "../../context/actions/settingsActions";

import Subheader from '../Header/Subheader';
import { ScrollContent  } from '../util/container';
import * as Colors from '../util/colors';

// Original tailwind styles.
/* <select className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> */

// Styling below was pulled from Tailwind classes.
const SelectControl = styled.select`
    font-size: 0.875rem;
    line-height: 1.25rem;

    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;

    background-color: ${Colors.LIGHT_SETTINGS_CONTROL_BG};
    border: solid 1px ${Colors.LIGHT_SETTINGS_CONTROL_BORDER};
    border-radius: 0.375rem;
`;

const Settings = () => {
    const dispatch = useDispatch();
   
    const serverIdentifier = useSelector(state => state.settings.serverIdentifier);
    const librarySection = useSelector(state => state.settings.librarySection);
    const resources = useSelector(state => state.settings.servers);
    const libraries = useSelector(state => state.settings.libraries);

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
            </ScrollContent>
        </>
    );
}

export default Settings;
