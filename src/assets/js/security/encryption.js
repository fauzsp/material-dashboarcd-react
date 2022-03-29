import axios from 'axios';
import * as common from '../helpers/common';

var forge = require('node-forge');
var rsa = forge.rsa;
var pki = forge.pki;
var cipher_algo = 'AES-CTR';

console.log('forge');
console.log(forge);

var handshake_promise = false;

//encrypted
var raw_keys = {
	'public_key': '',
	'private_key': '',
	'server_public_key': '',
	'encryption_key': ''
};

//read to use
var ready_keys = {
	'public_key': '',
	'private_key': '',
	'server_public_key': '',
	'encryption_key': ''
};

//Generates RSA keys
function generateKeys(){
	return rsa.generateKeyPair({workers: 2}, function(err, key_pair) {
		var public_key = key_pair.publicKey;
		var private_key_pkcs1 = key_pair.privateKey;
		
		//converting pkcs1 to pkcs8
		var private_key_asn1 = pki.privateKeyToAsn1(private_key_pkcs1);
		var private_key_pkcs8 = pki.wrapRsaPrivateKey(private_key_asn1);
		var private_key = private_key_pkcs8;

		//converting keys to pem format, exportable format
		var public_key_pem = pki.publicKeyToPem(public_key);
		var private_key_pem = pki.privateKeyInfoToPem(private_key);

		raw_keys.public_key = public_key_pem;
		raw_keys.private_key = private_key_pem;

		return raw_keys;
	});
}

//prepare raw keys to use for encryption, decryption
function prepareKeys(){
	var keys = fetchKeys();

	if(!keys)
		return false;

	raw_keys = keys;

	var public_key_pem = raw_keys.public_key;
	var private_key_pem = raw_keys.private_key;
	var server_public_key_pem = raw_keys.server_public_key;
	var encryption_key_encrypted = raw_keys.encryption_key;

	ready_keys.public_key = pki.publicKeyFromPem(public_key_pem);
	ready_keys.private_key = pki.privateKeyFromPem(private_key_pem);
	ready_keys.server_public_key = pki.publicKeyFromPem(server_public_key_pem);
	ready_keys.encryption_key = metaDecrypt(encryption_key_encrypted);

	console.log('ready_keys');
	console.log(ready_keys);

	return ready_keys;
}

//save keys in local storage
function saveKeys(){
	localStorage.setItem('keys', JSON.stringify(raw_keys));
	prepareKeys();
}

//remove from local storage
function removeKeys(){
	localStorage.removeItem("keys");
	
	//DESKTOP SPECIFIC
	//resetting things
	handshake_promise = false;
}

//fetch keys from local storage
function fetchKeys(){
	var keys = localStorage.getItem('keys');
	var keys = JSON.parse(keys);

	if(!keys || (!keys.server_public_key && !keys.encryption_key))
		return false;

	return keys;
}

//encrypt data using RSA
function metaEncrypt(data){
	var encrypted = ready_keys.server_public_key.encrypt(data, 'RSA-OAEP');

	//need to convert bytes to hex to transfer over the network
	return forge.util.bytesToHex(encrypted);
}

//decrypt data using RSA
function metaDecrypt(data){
	//hex to byte conversion, as it was converted to hex during encryption
	data = forge.util.hexToBytes(data);

	return ready_keys.private_key.decrypt(data, 'RSA-OAEP');
}

//encrypt data using AES
function dataEncrypt(data){
	//converting to json, escaping unicode characters to preserve arabic etc
	if(typeof data === 'object'){
		data = common.convertToJson(data, true);
	}

	var iv = forge.random.getBytesSync(16);

	var cipher = forge.cipher.createCipher(cipher_algo, ready_keys.encryption_key);
	cipher.start({iv: iv});
	cipher.update(forge.util.createBuffer(data));
	cipher.finish();
	
	var encrypted = cipher.output;
	var encrypted_data = encrypted.data;
	var encoded_encrypted_data = forge.util.encode64(encrypted_data);
		
	console.log('dataEncrypt');
	console.log('iv');
	console.log(iv);
	console.log(data);
	console.log(encrypted);
	console.log('dataEncrypt');

	return {
		'data': encoded_encrypted_data,
		'iv': metaEncrypt(iv)
	};
}

//decrypt data using AES
function dataDecrypt(data, options){
	//hex to byte conversion, as it was converted to hex during encryption
	data = forge.util.decode64(data);

	var iv = metaDecrypt(options['iv']);
	
	var decipher = forge.cipher.createDecipher(cipher_algo, ready_keys.encryption_key);
	decipher.start({iv: iv});
	decipher.update(forge.util.createBuffer(data));
	var result = decipher.finish();
	var decrypted = decipher.output.data;
	var json_decoded = common.isJson(decrypted);

	console.log(result);
	console.log(decrypted);
	console.log(json_decoded);

	if(json_decoded)
		decrypted = json_decoded;

	return decrypted;
}

//do handshake if needed
function mayBeHandshake(){
	return new Promise(async function(resolve, reject) {
		//no need of handshake
		if(fetchKeys()){
			prepareKeys();
			resolve();

			return;
		}

		//wait for handshake
		await handshake();
		resolve();
	});
}

//do handshake for keys exchange
async function handshake(){
	// to stop multiple handshake request from happening when multiple requests are fired concurrently
	// first handshake promise is returned to other concurrent requests hence no multiple handshake
	// requests issue
	if(handshake_promise)
		return handshake_promise;

	handshake_promise = new Promise(async function(resolve, reject) {
		await generateKeys();

		return axios.post('encryption/handshake', { 
			'public_key': raw_keys.public_key,
			'ignore_encryption': true,
			'type': 'handshake'
		})
	    .then(resp => {
	    	var data = resp.data.data;

	        if(!data)
	        	return false;

	        raw_keys.server_public_key = data.server_public_key;
	        raw_keys.encryption_key = data.encryption_key;

	        saveKeys();
	        resolve();
	    });
	});

	return handshake_promise;
}

export {
	metaEncrypt,
	metaDecrypt,
	dataEncrypt,
	dataDecrypt,
	mayBeHandshake,
	prepareKeys,
	removeKeys,
	raw_keys
};