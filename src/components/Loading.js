import { Component } from 'react';

class Loading extends Component {

    state = {
        userInfo: this.props.appState,
    }

    render = () =>{
        return (
            <main role="main" className="container">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </main>
        );
    }
}

export default Loading;
