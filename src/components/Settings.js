import React from 'react';
import { connect } from 'react-redux'
import * as settingsActions from "../context/actions/settingsActions";

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
            {console.log("settings render")}
            <select id="serverIdentifier" className="form-control mb-2" value={serverIdentifier} onChange={serverChanged}>
            <option value="" disabled hidden>Select a Server</option>
            {(resources.map((resource) => (
                <option key={resource.clientIdentifier} value={resource.clientIdentifier}>{resource.name}</option>
            )))}
            </select>
            <select id="librarySection" className="form-control mb-2" value={librarySection} onChange={libraryChanged}>
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
