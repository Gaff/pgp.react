import React, { Fragment, DOMAttributes } from 'react';
import { Form, Collapse, Button } from 'react-bootstrap';
import { key }  from 'openpgp'
import { doPgpWork, WorkResult, KeyResult } from '../pgpwork'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

const selectAllText = async (event: any) => {
    const target = event.target;
    //await target.select();
    target.setSelectionRange(0, target.value.length);
}

const allSelection: Partial<DOMAttributes<HTMLElement>> = {
    //onSelect : (e:any) => e.target.scrollTo(0,0), //Doesn't seem to work.
    onClick : (e:any) => selectAllText(e)
}

interface KeyManager {
    keyResult: KeyResult;
    onChange: Function;
    storeKey: Function;
}


function KeyInfo(props: KeyManager) {
    
    const getKey = props.keyResult;
    const onKeyChange = props.onChange;
    const storeKey = props.storeKey;
    
    const [showKeyDetails, setShowKeyDetails] = React.useState(false);
    
    const getPrimaryUserCheaply = (pgpkey: key.Key) => {
        //The real implementation does a bunch of still to do with validation and whatnot, but who has time for that?
        
        return pgpkey.getUserIds()[0]
    }
    
    const shouldShowKeyDetails = showKeyDetails || getKey.keys.length === 0;
    
    const publicKey = () => {
        const privKey = getKey.keys.find(el=>el.isPrivate());
        if(!privKey) {
            return getKey.armoredkey;
        }
        return privKey.toPublic().armor();
    }
    
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
                    </div>
                )
            }
            {getKey.keys.length !== 0 &&
            <Fragment>
                <div className="form-group row">
                    <label htmlFor="buttonCollapseDetails" className="col-sm-2 control-label"></label>
                    <div className="col-sm-7 controls">
                    {   
                        //Bit of a dirty hack, but let's not show a save-load for the magic pgp.help key!
                        getKey.keys[0].getFingerprint() !== "1dfa77312bac1781f699e78223fd9f3e9b067569" &&
                            <Form.Check
                                type="switch"
                                id="myswitch"
                                label="Remember this key"
                                checked={getKey.stored}
                                onChange={(e:React.ChangeEvent<HTMLInputElement>)=>storeKey(getKey, e.target.checked)}
                            />
                    }
                    </div>
                    <div className="col-sm-3 controls">
                        <Button as="a" className="text-left href btn-link" variant='link' bsPrefix="xxx" id="buttonCollapseDetails" onClick={()=>setShowKeyDetails(!showKeyDetails)}>
                        <FontAwesomeIcon className="d-inline-block align-center" icon={showKeyDetails ? faChevronUp : faChevronDown}/>
                        {showKeyDetails ? 'Hide' : 'Show'} key details
                        </Button>
                    </div>
                </div>
            </Fragment>
            }

            <Collapse in={shouldShowKeyDetails}>
                <div>
                    {
                        getKey.keys.map((pgpkey,i) => 
                            <div className="form-group row" key={i}>
                                <label className="col-sm-2 control-label" htmlFor={"fingerprint"+i}>Fingerprint</label>
                                <div className="col-sm-10 controls">
                                    <Form.Control id={"fingerprint"+i} type="text" readOnly value={pgpkey.getFingerprint()}/>
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
                                {...allSelection}
                                isInvalid={getKey.err != null}
                                onChange={e=>onKeyChange(e.target.value)}
                                value={publicKey()}
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
export function Main(props : KeyManager) {
    
    const [getInput, setInput] = React.useState("");
    const [getMessage, setMessage] = React.useState<WorkResult>(emptyWork);
    const getKey = props.keyResult
    
    
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
            <KeyInfo {...props}/>
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
                        {...allSelection}
                        value={getMessage.message}
                    />
                </div>
            </div>
        </Form> 
    )
}


