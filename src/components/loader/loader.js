import React from 'react';
import { Button, Loader, Message } from 'rsuite';
import './loader.css';

function CustomLoader(props) {
    return (
        <div className="loader_container">
           {props.error && <Message showIcon full type="error" description={props.errorMessage} />}
            <div className="loader_logo_container">
            <div className="loader_logo_corner_container">
                <div className="loader_corner_one"></div>
                <div className="loader_corner_two"></div>
                <div className="loader_corner_three"></div>
                <div className="loader_corner_four"></div>
               {!props.error && <Loader style={{position: "absolute", top: '79px', left: '39px'}} size="lg"/>}
            </div>
                <div className="loader_logo_name">Teamily</div>
            </div>
            {props.error &&  <div className="error_icon_container">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                {props.error}
                <Button onClick={()=> window.location.reload()}>Reload</Button>
            </div>}
        </div>
    )
}

export default CustomLoader
