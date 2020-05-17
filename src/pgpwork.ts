import openpgp, { key, message }  from 'openpgp'


const emptyKey : key.KeyResult = {'err':null, 'keys':[]}

export async function parseKey(keyText: string) : Promise<key.KeyResult> {
    if(keyText === "") {
        return emptyKey;
    } else {
        return await key.readArmored(keyText);
    }            
}

export interface WorkResult {
    message: string;
    err?: Array<Error>;
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