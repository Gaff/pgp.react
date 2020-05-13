import React from 'react';
import { Form, FormControl } from 'react-bootstrap';

export function Main() {
    
    const [getMessage, setMessage] = React.useState("");
    
    const onMessageChange = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
        
    }
    
    return    (
        <Form className="form-horizontal">
            <Form.Label as="legend">Encrypt Message</Form.Label>
            <div className="form-group row">
                <label className="col-lg-2 control-label">Private Key</label>
                <div className="col-lg-10 controls">
                    <textarea className="form-control autoselectall" rows={4} spellCheck='false' placeholder="Paste PGP key here."/>
                </div>
            </div>
            <hr/>
            <div className="form-group row">
                <label className="col-lg-2 control-label">Private Key</label>
                <div className="col-lg-10 controls">
                    <Form.Control as="textarea" className="form-control" rows={8} placeholder="Type your message here" onChange={e=>onMessageChange(e)}/>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-lg-2 control-label">Private Key</label>
                <div className="col-lg-10 controls">
                    <textarea className="form-control autoselectall" rows={8} readOnly spellCheck='false' placeholder="Encrypted text will appear here">
                        {getMessage}
                    </textarea>
                </div>
            </div>
        </Form> 
    )
}


