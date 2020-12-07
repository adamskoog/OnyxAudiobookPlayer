import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import * as settingsActions from "../context/actions/settingsActions";

const mapStateToProps = state => {
    return { 
        authToken: state.application.authToken,
        serverIdentifier: state.settings.serverIdentifier,
        librarySection: state.settings.librarySection,
        resources: state.settings.servers,
        libraries: state.settings.libraries,
        currentServer: state.settings.currentServer
    };
};

const mapDispatchToProps = dispatch => {
    return {
      setServer: serverId => dispatch(settingsActions.setSettingServer(serverId)),
      setLibrary: libraryId => dispatch(settingsActions.setSettingLibrary(libraryId)),
      setupLists: token => dispatch(settingsActions.getServers(token)),
      getLibraries: serverId => dispatch(settingsActions.getLibraries(serverId))
    };
};

function ConnectedSettings({ authToken, serverIdentifier, librarySection, resources, libraries, currentServer, setServer, setLibrary, setupLists, getLibraries }) {
  
    const serverChanged = (e) => {
        setServer(e.target.value);
        setLibrary("");

        getLibraries(e.target.value);
    }

    const libraryChanged = (e) => {
        setLibrary(e.target.value);
    }

    // TODO: Why does this run-off if we don't have some kind of a flag
    //  to determine things are loaded?
    useEffect(() => {
        if (!authToken) return;
        setupLists(authToken);
    }, [authToken, setupLists]);

    return (
        <div>
            <select id="serverIdentifier" className="form-control mb-2" value={serverIdentifier} onChange={serverChanged}>
            {(resources.map((resource) => (
                <option key={resource.clientIdentifier} value={resource.clientIdentifier}>{resource.name}</option>
            )))}
            </select>
            <select id="librarySection" className="form-control mb-2" value={librarySection} onChange={libraryChanged}>
            {(libraries.map((library) => (
                <option key={library.key} value={library.key}>{library.title}</option>
            )))}
            </select>
        </div>
    );
}

const Settings = connect(mapStateToProps, mapDispatchToProps)(ConnectedSettings);

export default Settings;
