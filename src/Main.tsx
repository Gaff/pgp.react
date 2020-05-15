import React, { Fragment } from 'react';
import { Form, Collapse, Button } from 'react-bootstrap';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import openpgp, { key, crypto, message, signature }  from 'openpgp'

const selectAllText = (event: any) => {
    event.target.select();
    event.target.scrollTo(0,0);
}

interface KeyInfo {
    keyResult: key.KeyResult;
    onChange: Function;
}


function KeyInfo(props: KeyInfo) {
    
    const getKey = props.keyResult;
    const onKeyChange = props.onChange;
    
    const [showKeyDetails, setShowKeyDetails] = React.useState(false);
    
    const getPrimaryUserCheaply = (pgpkey: key.Key) => {
        //The real implementation does a bunch of still to do with validation and whatnot, but who has time for that?
        
        return pgpkey.getUserIds()[0]
    }
    
    const shouldShowKeyDetails = showKeyDetails || getKey.keys.length === 0;
    
    return (
        <Fragment>
            {
                getKey.keys.map((pgpkey,i) => 
                    <div className="form-group row" key={i}>
                        <label className="col-lg-2 control-label">Username</label>
                        <div className="col-lg-5 controls">
                            <Form.Control type="text" readOnly value={getPrimaryUserCheaply(pgpkey)}/>
                        </div>
                        <label className="col-lg-2 control-label">Key ID</label>
                        <div className="col-lg-3 controls">
                            <Form.Control type="text" readOnly value={
                                //The typescript definition seems to be missing a type for this!
                                (pgpkey.getKeyId() as any).toHex()
                            }/>
                        </div>
                    </div>
                )
            }

            {
                getKey.keys.length !== 0 &&
                <div className="form-group row">
                    <Button className="col-lg-10 col-lg-offset-2" variant='link' onClick={()=>setShowKeyDetails(!showKeyDetails)}>
                    {showKeyDetails ? 'Hide' : 'Show'} key details
                        <span className="pull-left">
                            <i className="glyphicon glyphicon-chevron-down"/>
                        </span>
                    </Button>
                </div>
            } 
            <Collapse in={shouldShowKeyDetails}>
                <div>
                    {
                        getKey.keys.map((pgpkey,i) => 
                            <div className="form-group row" key={i}>
                                <label className="col-lg-2 control-label">Fingerprint</label>
                                <div className="col-lg-10 controls">
                                    <Form.Control type="text" readOnly value={pgpkey.getFingerprint()}/>
                                </div>
                            </div>
                        )
                    }
                    <div className="form-group row">
                        <label className="col-lg-2 control-label">Public Key</label>
                        <div className="col-lg-10 controls">
                            <Form.Control as="textarea" className="form-control" rows={4} spellCheck='false' placeholder="Paste PGP key here." 
                                isInvalid={getKey.err != null}
                                onBlur={selectAllText}
                                onFocus={selectAllText} 
                                onChange={e=>onKeyChange(e.target.value)}
                            />
                        {getKey.err && getKey.err.map((e,i) =>
                            <div className="invalid-feedback" role="alert" key={i}>
                                <strong>Error:</strong> {e.message}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </Collapse>


        </Fragment>
    )
}


export function Main(props : any) {
    const emptyKey = {'err':null, 'keys':[]}
    const [getMessage, setMessage] = React.useState("");
    const [getKey, setKey] = React.useState<key.KeyResult>(emptyKey);
    
    
    const onMessageChangeDebounced = AwesomeDebouncePromise(e=>e, 500);
    const onMessageChange = async (text: string) => {
        const result = await onMessageChangeDebounced(text);
        if (result === "") {
            setMessage("")
            return
        }
        if (getKey.keys.length === 0) return;
        const data = await openpgp.encrypt({
            message: message.fromText(result),
            publicKeys: getKey.keys[0]
        })
        
        setMessage(data.data)
        
    }
    
    const onKeyChange = async (keyText: string)=>{
        if(keyText === "") {
            setKey(emptyKey);
        } else {
            const mykey = await key.readArmored(keyText);
            setKey(mykey)
        }            
    }
    
    return (
        <Form className="form-horizontal">
            <Form.Label as="legend">Encrypt Message</Form.Label>
            <KeyInfo keyResult={getKey} onChange={onKeyChange}/>
            <hr/>
            <div className="form-group row">
                <label className="col-lg-2 control-label">Message</label>
                <div className="col-lg-10 controls">
                    <Form.Control as="textarea" className="form-control" rows={8} placeholder="Type your message here" onChange={e=>onMessageChange(e.target.value)}/>
                </div>
            </div>
            <div className="form-group row"> 
                <label className="col-lg-2 control-label">Result</label>
                <div className="col-lg-10 controls">
                    <Form.Control as="textarea" className="form-control autoselectall" rows={8} readOnly spellCheck='false' 
                        placeholder="Encrypted text will appear here"
                        onFocus={selectAllText}
                        onBlur={selectAllText}
                        value={getMessage}
                    />
                </div>
            </div>
        </Form> 
    )
}


