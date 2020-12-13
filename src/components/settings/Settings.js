import React from 'react';
import { connect } from 'react-redux'
import * as settingsActions from "../../context/actions/settingsActions";

const mapStateToProps = state => {
    return { 
        serverIdentifier: state.settings.serverIdentifier,
        librarySection: state.settings.librarySection,
        resources: state.settings.servers,
        libraries: state.settings.libraries
    };
};

const mapDispatchToProps = dispatch => {
    return {
      setServer: serverId => dispatch(settingsActions.setSettingServer(serverId)),
      setLibrary: libraryId => dispatch(settingsActions.setSettingLibrary(libraryId))
    };
};

function ConnectedSettings({ serverIdentifier, librarySection, resources, libraries, setServer, setLibrary }) {
  
    const serverChanged = (e) => {
        setServer(e.target.value);
    }

    const libraryChanged = (e) => {
        setLibrary(e.target.value);
    }

    return (
        <div>
            <select id="serverIdentifier" className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={serverIdentifier} onChange={serverChanged}>
            <option value="" disabled hidden>Select a Server</option>
            {(resources.map((resource) => (
                <option key={resource.clientIdentifier} value={resource.clientIdentifier}>{resource.name}</option>
            )))}
            </select>
            <select id="librarySection" className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={librarySection} onChange={libraryChanged}>
            <option value="" disabled hidden>Select a Library</option>
            {(libraries.map((library) => (
                <option key={library.key} value={library.key}>{library.title}</option>
            )))}
            </select>
        </div>
    );
}

const Settings = connect(mapStateToProps, mapDispatchToProps)(ConnectedSettings);

export default Settings;
