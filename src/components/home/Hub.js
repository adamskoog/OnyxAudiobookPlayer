import React from 'react';
import LibraryItem from '../library/LibraryItem';

function Hub(props) {
    return (
        <React.Fragment>
        <div>{props.title}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">            
            {props.items.map((item) => (
                <LibraryItem key={item.ratingKey} baseUrl={props.baseUrl} userInfo={props.userInfo} albumInfo={item} />
            ))}
        </div>
        </React.Fragment>
    ); 
}

export default Hub;
