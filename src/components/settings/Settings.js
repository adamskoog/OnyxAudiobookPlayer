import React from 'react';
import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux'
import { setSettingServer, setSettingLibrary } from "../../context/actions/settingsActions";

// Original tailwind styles.
/* <select className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> */

// Styling below was pulled from Tailwind classes.
const SelectControl = styled.select`
    font-size: 0.875rem;
    line-height: 1.25rem;

    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;

    background-color: rgba(255, 255, 255, 1);

    box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px rgba(209, 213,219, 1);
    border-radius: 0.375rem;
`;

const Settings = () => {
    const dispatch = useDispatch();
   
    const serverIdentifier = useSelector(state => state.settings.serverIdentifier);
    const librarySection = useSelector(state => state.settings.librarySection);
    const resources = useSelector(state => state.settings.servers);
    const libraries = useSelector(state => state.settings.libraries);

    const serverChanged = (e) => {
        dispatch(setSettingServer(e.target.value));
    }

    const libraryChanged = (e) => {
        dispatch(setSettingLibrary(e.target.value));
    }

    return (
        <div>
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
        </div>
    );
}

export default Settings;
