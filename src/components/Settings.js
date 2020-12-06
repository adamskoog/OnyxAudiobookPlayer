import React, { useState, useEffect, useRef } from 'react';
import { connect , useDispatch } from 'react-redux'
import PlexRequest from '../plex/PlexRequest';
import SettingsUtils from '../utility/settings';
import * as appActions from "../context/actions/actions";

const mapStateToProps = state => {
    return { 
        user: state.application.user, 
        authToken: state.application.authToken,
        baseUrl: state.application.baseUrl,
        settings: state.application.settings
    };
  };

function ConnectedSettings(reduxprops) {
  
    const dispatch = useDispatch();

    const [resources, setResources] = useState([]);
    const [sections, setSections] = useState([]);
    const [settingServer, setSettingServer] = useState("");
    const [settingLibrary, setSettingLibrary] = useState("");

    const serverChanged = (e) => {
        dispatch(appActions.setSettingServer(e.target.value));
        dispatch(appActions.setSettingLibrary(""));

        loadLibraries(e.target.value);
    }

    const libraryChanged = (e) => {
        console.log("test", e);
        dispatch(appActions.setSettingLibrary(e.target.value));
    }

    // const saveSettings = (e) => {
    //     e.preventDefault();
        
    //     let settings = { serverIdentifier: settingServer, librarySection: settingLibrary };
    //     dispatch(appActions.setSettingsValues(settings));
    // }

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
        if (reduxprops.settings.serverIdentifier !== "")
            loadLibraries(reduxprops.settings.serverIdentifier);
    }, [resources]);

    return (
        <div>
            <select id="serverIdentifier" className="form-control mb-2" value={reduxprops.settings.serverIdentifier} onChange={serverChanged}>
            {(resources.map((resource) => (
                <option key={resource.clientIdentifier} value={resource.clientIdentifier}>{resource.name}</option>
            )))}
            </select>
            <select id="librarySection" className="form-control mb-2" value={reduxprops.settings.librarySection} onChange={libraryChanged}>
            {(sections.map((section) => (
                <option key={section.key} value={section.key}>{section.title}</option>
            )))}
            </select>
            {/* <button className="btn btn-primary" type="submit" onClick={saveSettings}>Save</button> */}
        </div>
    );
}

const Settings = connect(mapStateToProps)(ConnectedSettings);

export default Settings;
