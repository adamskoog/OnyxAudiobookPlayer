import React from 'react';
import LibraryItem from '../library/LibraryItem';

//https://webdevtrick.com/horizontal-scroll-navigation/
function Hub(props) {
    return (
        <React.Fragment>
        <div className="font-bold mb-2">{props.title}</div>
        <div className="w-screen overflow-x-scroll overflow-y-hidden mb-6">
            <div className="flex flex-row w-max gap-4">            
                {props.items.map((item) => (
                    <LibraryItem key={item.ratingKey} baseUrl={props.baseUrl} userInfo={props.userInfo} albumInfo={item} />
                ))}
            </div>
        </div>
        </React.Fragment>
    ); 
}

export default Hub;
