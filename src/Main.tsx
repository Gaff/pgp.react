import React, { Fragment } from 'react';
import { Form, Collapse, Button } from 'react-bootstrap';
import { key }  from 'openpgp'
import { doPgpWork, parseKey, WorkResult } from './pgpwork'

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
                        <label htmlFor="keyUsername" className="col-sm-2 control-label">Username</label>
                        <div className="col-sm-5 controls">
                            <Form.Control id="keyUsername" type="text" readOnly value={getPrimaryUserCheaply(pgpkey)}/>
                        </div>
                        <label className="col-sm-2 control-label">Key ID</label>
                        <div className="col-sm-3 controls">
                            <Form.Control type="text" readOnly value={
                                //The typescript definition seems to be missing a type for this!
                                (pgpkey.getKeyId() as any).toHex()
                            }/>
                        </div>
                        {
                            getKey.keys.length !== 0 &&
                                <Button className="col-sm-10 col-sm-offset-2" variant='link' onClick={()=>setShowKeyDetails(!showKeyDetails)}>
                                {showKeyDetails ? 'Hide' : 'Show'} key details
                                    <span className="pull-left">
                                        <i className="glyphicon glyphicon-chevron-down"/>
                                    </span>
                                </Button>
                        } 
                    </div>
                )
            }

            <Collapse in={shouldShowKeyDetails}>
                <div>
                    {
                        getKey.keys.map((pgpkey,i) => 
                            <div className="form-group row" key={i}>
                                <label className="col-sm-2 control-label">Fingerprint</label>
                                <div className="col-sm-10 controls">
                                    <Form.Control type="text" readOnly value={pgpkey.getFingerprint()}/>
                                </div>
                            </div>
                        )
                    }
                    <div className="form-group row">
                        <label htmlFor="keyInput" className="col-sm-2 control-label">Public Key</label>
                        <div className="col-sm-10 controls">
                            <Form.Control as="textarea" className="form-control" 
                                id="keyInput"
                                rows={4} spellCheck='false' placeholder="Paste PGP key here." 
                                isInvalid={getKey.err != null}
                                onBlur={selectAllText}
                                onFocus={selectAllText} 
                                onChange={e=>onKeyChange(e.target.value)}
                            />
                        {getKey.err && getKey.err.map((e,i) =>
                            <div aria-label="keyInputError" className="invalid-feedback" role="alert" key={i}>
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

//https://stackoverflow.com/a/61140811/5209935
function useDebouncedValue<T>(input: T, time = 500) {
  const [debouncedValue, setDebouncedValue] = React.useState(input);

  // every time input value has changed - set interval before it's actually commited
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(input);
    }, time);

    return () => {
      clearTimeout(timeout);
    };
  }, [input, time]);

  return debouncedValue;
}

const emptyWork = {message:''}
export function Main(props : any) {
    const emptyKey = {'err':null, 'keys':[]}
    
    
    const [getInput, setInput] = React.useState("");
    const [getMessage, setMessage] = React.useState<WorkResult>(emptyWork);
    const [getKey, setKey] = React.useState<key.KeyResult>(emptyKey);
    
    
    const onKeyChange = async (keyText: string)=>{
        //Chomp any blankspace at the start of each line. Not strictly kosher but solves a lot of issues when cutting and pasting.
        const str = keyText.replace(/^[^\S\n]+/gm, ''); //NB: Double negative regex: not((not whitespace), newline)+
        setKey(await parseKey(str));
    }
    
    const debouncedInput = useDebouncedValue(getInput, 500)
    React.useEffect(()=>{
        const myDoPgpWork = async (text: string) => {
            const result = await doPgpWork(text, getKey)
            
            if(result.message === "" && !result.err) {
                //https://stackoverflow.com/questions/61850396
                setMessage(emptyWork)
            } else {
                if(result.err) {
                    console.log(result.err);
                }
                setMessage(result);
            }
        }
        //https://medium.com/javascript-in-plain-english/how-to-use-async-function-in-react-hook-useeffect-typescript-js-6204a788a435
        (async function blah(){ await myDoPgpWork(debouncedInput);})();
    }, [debouncedInput, getKey])
    
    return (
        <Form className="form-horizontal">
            <Form.Label as="legend">Encrypt Message</Form.Label>
            <KeyInfo keyResult={getKey} onChange={onKeyChange}/>
            <hr/>
            <div className="form-group row">
                <label htmlFor="messageInput" className="col-sm-2 control-label">Message</label>
                <div className="col-sm-10 controls">
                    <Form.Control id="messageInput" as="textarea" className="form-control" rows={8} placeholder="Type your message here" 
                        onChange={e=>setInput(e.target.value)}
                        value={getInput}
                        isInvalid={getMessage.err != null}
                    />
                </div>
            </div>
            <div className="form-group row"> 
                <label htmlFor="messageOutput" className="col-sm-2 control-label">Result</label>
                <div className="col-sm-10 controls">
                    {  
                        getMessage.err &&
                        getMessage.err.map((e,i) =>
                            <div className="alert alert-danger" aria-label="messageInputError" key={i}>
                                <strong>Error:</strong> {e.message}
                            </div>
                        )
                    }
                    <Form.Control id="messageOutput" as="textarea" className="form-control autoselectall" rows={8} readOnly spellCheck='false' 
                        placeholder="Encrypted text will appear here"
                        onFocus={selectAllText}
                        onBlur={selectAllText}
                        value={getMessage.message}
                    />
                </div>
            </div>
        </Form> 
    )
}


