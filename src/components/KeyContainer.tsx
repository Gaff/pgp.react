import React from 'react';
import { Route } from 'react-router-dom';

import { Main } from './Main'
import { Intro } from './Intro'
import { Sidebar } from './Sidebar'
import { KeyResult, emptyKey, parseKey } from '../pgpwork';
import { ListGroup, Card } from 'react-bootstrap';
import { useLocalStorage } from '../useLocalStorage'

export function KeyContainer() {
    const [ storedKeys, setStoredKeys ] = useLocalStorage('keys', []);
    const [ keyList, setKeyList ] = React.useState<Array<KeyResult>>(storedKeys);
    const [ activeKey, setActiveKey ] = React.useState<KeyResult>(emptyKey);

    const setKey = async(newKey: string) => {
        const parsedKey = await(parseKey(newKey));
        
        //If it's an error, set it as active but don't save.
        if(parsedKey.err || parsedKey.keys.length === 0) {
            setActiveKey(parsedKey);
            return;
        }
        
        //Otherwise: 
        //Change the active key if the text has changed.
        if(activeKey.armoredkey !== parsedKey.armoredkey) {
            setActiveKey(parsedKey);
        } //else... we probably had this key already and could skip - but fall-through just to be certain:
        
        //Add to the list
        const existing = keyList.findIndex(el=>el.armoredkey===parsedKey.armoredkey)
        const newKeys = [...keyList];
        if(existing >= 0) {
            newKeys[existing] = parsedKey;
            
        } else {
            newKeys.push(parsedKey)
        }
        setKeyList(newKeys)
    }
    
    const storeKey = async(key: KeyResult, shouldStore: boolean) => {
        const newKey = {...key, stored: shouldStore};
        setActiveKey(newKey)
    }
    
    const activateKey = (key : any) => {
        const thing = keyList.find(el=>el.keys.includes(key))
        if(thing) {
            setActiveKey(thing);
        } else {
            console.log("Could not activate key: " + key)
        }
        
    }
    
    const activeFingerprint = activeKey.keys.length > 0 ? activeKey.keys[0].getFingerprint() : "";
    
    
    
    return(
        <div className="row">
            <div className="col-lg-3 order-2">
                <Sidebar/>
                <Card className="mb-3">
                    <Card.Header as="h5">Keys</Card.Header>
                    <ListGroup>
                    {
                      keyList.flatMap(elx=>elx.keys).map((el,i)=>
                        <ListGroup.Item key={i} action className="text-left"
                           active={el.getFingerprint() === activeFingerprint}
                           onClick={()=>activateKey(el)}
                           >{el.getUserIds()[0]}</ListGroup.Item>
                      )
                    }
                    <ListGroup.Item action active={activeKey.keys.length === 0} variant="secondary" onClick={()=>setActiveKey(emptyKey)}>Import key...</ListGroup.Item>
                    <ListGroup.Item action variant="light" onClick={()=>setActiveKey(emptyKey)}>Create key pair...</ListGroup.Item>
                    </ListGroup>
                </Card>
            </div>
            <div className="col-lg-9 order-1 active">
              <Route exact path="/" render={(props)=><Main {...props} keyResult={activeKey} onChange={setKey} storeKey={storeKey}/>}/>
              <Route path="/about" component={Intro}/>
            </div>
        </div>
    )

}
