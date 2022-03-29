import axios from 'axios';
import $ from 'jquery';
// import bus from '../../../components/bus';

var encryption = require('./encryption.js');
encryption.prepareKeys();

//intercepting request to encrypt request data
axios.interceptors.request.use(encryptAjaxRequest);

//intercepting response to decrypt response data
axios.interceptors.response.use(decryptAjaxResponse);

//need to clear keys, to have fresh handshake
removeKeysOnLogout();

async function encryptData(data) {
    console.log('request received');
    console.log('data');
    console.log(data);

    if(!shouldIgnoreEncryption(data)){
        console.log('request interceptors');

        //wait for handshake
        await encryption.mayBeHandshake();
        
        var encrypted = encryption.dataEncrypt(data);
        encrypted.encrypted = true;

        //sending public key to server if user is not logged in
        if(!$('#user_id').val())
            encrypted.enc_public_key = encryption.raw_keys.public_key;

        return encrypted;
    }
    
    return false;
}

/**
 * Prepares ajax requests
 * @return axios config
*/
async function encryptAjaxRequest(config){
    var data_key = '';

    //for get request
    if(config.params){
        data_key = 'params';
    }else if(config.data){ //for post request
        data_key = 'data';
    }

    var data_to_encrypt = config[data_key];

    //making data from FormData
    if(data_to_encrypt instanceof FormData){
        var form_data = data_to_encrypt;
        data_to_encrypt = {};

        for (var pair of form_data.entries()) {
            var key = pair[0];
            var value = pair[1];

            data_to_encrypt[key] = value; 
        }
    }

    console.log('data_to_encrypt');
    console.log(data_to_encrypt);

    await encryptData(data_to_encrypt).then(function(encrypted){
        if(encrypted){
            console.log('config data');
            console.log(config[data_key]);
            console.log(encrypted);

            config[data_key] = {};

            for (var key in encrypted) {
                config[data_key][key] = encrypted[key];
            }
        }
    });

    return config;
}

/**
 * Prepares respose, decryptes response data
 * @return axios response
*/
function decryptAjaxResponse(response) {
    var response_data = response.data.data;

    //no need to do anything
    if(!response_data)
        return response;

    var encryptedData = response_data.data;
    var iv = response_data.iv;
    var type = response_data.type;
    var is_encrypted = response_data.encrypted;
    
    //for handshake ne need to decrypt as it is not encrytped
    if(type == 'handshake')
        return response;

    //for other requests which don't need encryption no need to decrypt
    if(!is_encrypted)
        return response;

    var decrypted = encryption.dataDecrypt(encryptedData, {iv: iv});

    response.data.data = decrypted;

    return response;
}

//ignore encryption if ignore_encryption is present in data
function shouldIgnoreEncryption(data){
    var ignore_encryption = data && data.ignore_encryption;
    if(data instanceof FormData)
        ignore_encryption = data.get('ignore_encryption');

    return ignore_encryption;
}

//need to clear keys from local on logout.
function removeKeysOnLogout(){
    // bus.on('auth__logged_out', () => {
    //     //removing from local storage
    //     encryption.removeKeys();
    // });
}