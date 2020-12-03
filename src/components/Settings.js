import React, { useState, useEffect, useRef } from 'react';
import PlexRequest from '../plex/PlexRequest';
import SettingsUtils from '../utility/settings';

function Settings(props) {
  
    const [resources, setResources] = useState([]);
    const [sections, setSections] = useState([]);
    const [settingServer, setSettingServer] = useState("");
    const [settingLibrary, setSettingLibrary] = useState("");

    const serverChanged = (e) => {
        setSettingServer(e.target.value);
        setSettingLibrary("");

        loadLibraries(e.target.value);
    }

    const libraryChanged = (e) => {
        setSettingLibrary(e.target.value);
    }

    const saveSettings = (e) => {
        e.preventDefault();
        
        let settings = { serverIdentifier: settingServer, librarySection: settingLibrary };
        SettingsUtils.saveSettingsToStorage(settings);

        props.updateSettingsState(settings);
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
        PlexRequest.getResources(props.userInfo.authToken)
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
        if (!props.userInfo) return;

        setSettingServer(props.settings.serverIdentifier);
        setSettingLibrary(props.settings.librarySection);

        loadServers();
    }, [props.userInfo]);


    useEffect(() => {
        if (settingServer !== "")
            loadLibraries(props.settings.serverIdentifier);
    }, [resources]);

    return (
        <div>
            <select id="serverIdentifier" className="form-control mb-2" value={settingServer} onChange={serverChanged}>
            {(resources.map((resource) => (
                <option key={resource.clientIdentifier} value={resource.clientIdentifier}>{resource.name}</option>
            )))}
            </select>
            <select id="librarySection" className="form-control mb-2" value={settingLibrary} onChange={libraryChanged}>
            {(sections.map((section) => (
                <option key={section.key} value={section.key}>{section.title}</option>
            )))}
            </select>
            <button className="btn btn-primary" type="submit" onClick={saveSettings}>Save</button>
        </div>
    );
}

export default Settings;
