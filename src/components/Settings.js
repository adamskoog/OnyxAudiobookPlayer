import { Component } from 'react';
import PlexRequest from '../plex/PlexRequest';
import SettingsUtils from '../utility/settings';

class Settings extends Component {
    state = {
        userInfo: this.props.userInfo,
        serverIdentifier: "",
        librarySection: "",
        resources: []
    }

    serverChanged = (e) => {
        // call code to update library items.
        this.loadLibraries(e.target.value);

        // call default submit handle to update state.
        this.handleChange(e);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        let settings = { serverIdentifier: this.state.serverIdentifier, librarySection: this.state.librarySection };
        SettingsUtils.saveSettingsToStorage(settings);

        this.props.updateSettingsState(settings);
    }

    handleChange = (e) => {
        const {id , value} = e.target;
        this.setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    clearList = (ctrl) => {
        var i, L = ctrl.options.length - 1;
        for(i = L; i >= 0; i--) {
            ctrl.remove(i);
        }
    }

    loadLibraries = (serverIdentifier) => {
        this.clearList(this.librarySelect);

        let resource = null;
        for (let i = 0; i < this.state.resources.length; i++) {
            if (serverIdentifier === this.state.resources[i].clientIdentifier) {
                resource = this.state.resources[i];
                break;
            }
        }

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
                
                for (let i = 0; i < sections.length; i++) {
                    if (sections[i].type === "artist") {
                        let opt = new Option(sections[i].title, sections[i].key);
                        if (this.state.librarySection && this.state.librarySection === sections[i].key) {
                            opt.selected = true;
                        }
                        this.librarySelect.appendChild(opt);
                    }
                }
            });
    }

    loadServers = () => {
        PlexRequest.getResources(this.state.userInfo.authToken)
            .then(resources => {
                //console.log("resources", resources);
                // Get currently saved server id if available to set in the list.
                // If not set, default to empty string to match empty item in drop down.
                let serverIdentifier = (this.state.serverIdentifier) ? this.state.serverIdentifier : "";

                // Filter for only media servers.
                let servers = resources.filter((resource) => {
                    return resource.provides === "server";
                });

                // Create option items, including empty option.
                if (serverIdentifier === "") {
                    let opt = new Option("", "");
                    this.serverSelect.appendChild(opt);
                }

                for (let i = 0; i < servers.length; i++) {
                    let opt = new Option(servers[i].name, servers[i].clientIdentifier);
                    if (serverIdentifier && serverIdentifier === servers[i].clientIdentifier) {
                        opt.selected = true;
                    }
                    this.serverSelect.appendChild(opt);
                }

                // Load found resources into state to avoid more calls.
                this.setState({ resources: resources }, () => {
                    if (serverIdentifier !== "")
                        this.loadLibraries(serverIdentifier);
                });
            });
    }

    componentDidMount() {       
        let settings = SettingsUtils.loadSettingsFromStorage();
        this.setState(settings, () => { 
            this.loadServers();
        });
    }

    render = () =>{
        return (
            <div>
                <select id="serverIdentifier" ref={ref => this.serverSelect = ref} className="form-control mb-2" value={this.state.serverIdentifier} onChange={this.serverChanged}></select>
                <select id="librarySection" ref={ref => this.librarySelect = ref} className="form-control mb-2" value={this.state.librarySection} onChange={this.handleChange}></select>
                <button className="btn btn-primary" type="submit" onClick={this.handleSubmit}>Save</button>
            </div>
        );
    }
}

export default Settings;
