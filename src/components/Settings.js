import React, { useState, useEffect } from 'react';
import { connect , useDispatch } from 'react-redux'
import PlexRequest from '../plex/PlexRequest';
import * as settingsActions from "../context/actions/settingsActions";

const mapStateToProps = state => {
    return { 
        user: state.application.user, 
        authToken: state.application.authToken,
        baseUrl: state.application.baseUrl,
        serverIdentifier: state.settings.serverIdentifier,
        librarySection: state.settings.librarySection
    };
  };

function ConnectedSettings(reduxprops) {
  
    const dispatch = useDispatch();

    const [resources, setResources] = useState([]);
    const [sections, setSections] = useState([]);

    const serverChanged = (e) => {
        dispatch(settingsActions.setSettingServer(e.target.value));
        dispatch(settingsActions.setSettingLibrary(""));

        loadLibraries(e.target.value);
    }

    const libraryChanged = (e) => {
        dispatch(settingsActions.setSettingLibrary(e.target.value));
    }

    const loadLibraries = (currentServer) => {
        // Find the server resource, can bypass this by just storing the entire
        let resource = null;
        for (let i = 0; i < resources.length; i++) {
            if (currentServer === resources[i].clientIdentifier) {
                resource = resources[i];
                break;
            }
        }

        if (!resource) return;

        let connection = null;
        for (let j = 0; j < resource.connections.length; j++) {
            if (resource.connections[j].local === false && resource.connections[j].relay === false) {
                connection = resource.connections[j];
                break;
            }
        }

        PlexRequest.getSections(connection.uri, resource.accessToken)
            .then(mediaContainer => {
                let sections = mediaContainer.MediaContainer.Directory;
                
                sections.unshift({ title: "", key: "" });
                // set the resources to the state.
                setSections(sections);
            });
    }

    const loadServers = () => {
        return new Promise((resolve, reject) => {
        PlexRequest.getResources(reduxprops.authToken)
            .then(newResources => {

                // Filter for only media servers.
                let servers = newResources.filter((resource) => {
                    return resource.provides === "server";
                });
                servers.unshift({ name: "", clientIdentifier: "" });

                // set the resources to the state.
                setResources(servers);

                resolve();
            });
        });
    }

    useEffect(() => {
        if (!reduxprops.user) return;

        loadServers();
    }, [reduxprops.user]);


    useEffect(() => {
        if (reduxprops.serverIdentifier !== "")
            loadLibraries(reduxprops.serverIdentifier);
    }, [resources]);

    return (
        <div>
            <select id="serverIdentifier" className="form-control mb-2" value={reduxprops.serverIdentifier} onChange={serverChanged}>
            {(resources.map((resource) => (
                <option key={resource.clientIdentifier} value={resource.clientIdentifier}>{resource.name}</option>
            )))}
            </select>
            <select id="librarySection" className="form-control mb-2" value={reduxprops.librarySection} onChange={libraryChanged}>
            {(sections.map((section) => (
                <option key={section.key} value={section.key}>{section.title}</option>
            )))}
            </select>
        </div>
    );
}

const Settings = connect(mapStateToProps)(ConnectedSettings);

export default Settings;
