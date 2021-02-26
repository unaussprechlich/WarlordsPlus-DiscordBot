import { google } from 'googleapis';
import Logger from "../util/Logger";

if(!process.env.GOOGLEAPI_KEYS){
    throw Error("The environment variable GOOGLEAPI_KEYS has not been specified!")
}

const GOOGLEAPI_KEYS : {
    private_key : string,
    client_email : string
}= JSON.parse(process.env.GOOGLEAPI_KEYS)


export const apiClient = new google.auth.JWT(
    GOOGLEAPI_KEYS.client_email,
    null,
    GOOGLEAPI_KEYS.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

export function init() {
    apiClient.authorize(function (err, tokens) {
        if (err) {
            Logger.error(err)
        } else {
            Logger.info("Successfully authorized with the Google API.")
        }
    })
}

export async function getBalancerSpreadSheet(){
    const sheets = google.sheets({ version: 'v4', auth: apiClient});
    const options = {
        spreadsheetId: '1R8qk5w2eOgTN3w5JhADQ8rgn8STMAI8MsO_mF-b1kjU',
        range: 'BALANCER'
    };
    return sheets.spreadsheets.values.get(options);
}
