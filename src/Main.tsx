import React from 'react';
import { Form } from 'react-bootstrap';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export function Main(props : any) {
    
    const [getMessage, setMessage] = React.useState("");
    
    const handleFocus = (event: any) => event.target.select();
    
    const onMessageChangeDebounced = AwesomeDebouncePromise(e=>e, 500);
    const onMessageChange = async (text: String) => {
        const result = await onMessageChangeDebounced(text);
        setMessage(result)
    }
    
    return    (
        <Form className="form-horizontal">
            <Form.Label as="legend">Encrypt Message</Form.Label>
            <div className="form-group row">
                <label className="col-lg-2 control-label">Private Key</label>
                <div className="col-lg-10 controls">
                    <Form.Control as="textarea" className="form-control" rows={4} spellCheck='false' placeholder="Paste PGP key here." onFocus={handleFocus}/>
                </div>
            </div>
            <hr/>
            <div className="form-group row">
                <label className="col-lg-2 control-label">Private Key</label>
                <div className="col-lg-10 controls">
                    <Form.Control as="textarea" className="form-control" rows={8} placeholder="Type your message here" onChange={e=>onMessageChange(e.target.value)}/>
                </div>
            </div>
            <div className="form-group row"> 
                <label className="col-lg-2 control-label">Private Key</label>
                <div className="col-lg-10 controls">
                    <Form.Control as="textarea" className="form-control autoselectall" rows={8} readOnly spellCheck='false' 
                        placeholder="Encrypted text will appear here"
                        onFocus={handleFocus}
                        value={getMessage}
                    />
                </div>
            </div>
        </Form> 
    )
}


