import openpgp, { key, message }  from 'openpgp'

export interface WorkResult {
    message: string;
    err?: Array<Error>;
}

// We want to track the original armored key
export interface KeyResult extends key.KeyResult {
    armoredkey: string;
    stored: boolean;
}

export const emptyKey : KeyResult = {'err':null, 'keys':[], armoredkey: '', stored: false}

export async function parseKey(keyTextIn: string) : Promise<KeyResult> {
    
    if(keyTextIn === "") {
        return emptyKey;
    }
    
    //[\s\S] to workaround the fact that `.` will match newlines.
    const armorFind = keyTextIn.match(/-----BEGIN[\s\S]*?END.*?-----/m);
    
    if(!armorFind) {
        return {
            keys: [],
            err: [Error("Could not find armored text")],
            armoredkey: keyTextIn,
            stored: false
        }
    }
    
    //Chomp any blankspace at the start of each line. Not strictly kosher but solves a lot of issues when cutting and pasting.
    //Remove leading and trailing spaces:
    //NB: Double negative regex: not((not whitespace), newline)+
    const keyText = armorFind[0].replace(/^[^\S\n]+/gm, '') 
                                .replace(/[^\S\n]+$/gm, '');

    //Now get pgp to parse the key
    const result = await key.readArmored(keyText);
    
    return {...result, armoredkey: keyText, stored: false}
}


export async function doPgpWork(text: string, keys: key.KeyResult) : Promise<WorkResult> {
    if (text === "") {
        return { message: "" }
    }
    if (keys.keys.length === 0) return { message: ""};
    const publicKey = keys.keys[0];
    publicKey.getKeyId()
    try {
        const data = await openpgp.encrypt({
            message: message.fromText(text),
            publicKeys: publicKey
        })
        return { message: data.data }
    } catch (err) {
        return {
            message: "",
            err: [err]
        }
    }
}