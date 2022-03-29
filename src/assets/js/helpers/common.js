// import Swal from 'sweetalert2/dist/sweetalert2.js';
// import 'sweetalert2/dist/sweetalert2.css'

/**
 * Gets specific query string parameter
 * For parameters not present '' will be returned
*/
export function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function getCurrentUser() {
	var user = localStorage.getItem('user');

	return user ? JSON.parse(user) : false;
}

/**
 * Converts to json if necessary
 * @param escape_unicode, boolean, to escape arabic characters etc to preserve them
 */
 export  function convertToJson (data, escapse_unicode = false){
    data = JSON.stringify(data);

    //escaping unicode characters
    if(escapse_unicode){
        data = data.replace(/[\u007F-\uFFFF]/g, function(chr) {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
        });
    }

    return data;
}

export function isJson (str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// export function deepUpdateObject(source_object, target_object) {
//     for(var key in target_object){
//         var value = target_object[key];

//         if(key != 'stream' && typeof source_object[key] === 'object' && source_object[key] !== null){
//             source_object[key] = deepUpdateObject(source_object[key], {...value});
//         }else{
//             source_object[key] = value;
//         }
//     }

//     return source_object;
// }

// export function capitalizeString(str){
//     return str && str[0].toUpperCase() + str.slice(1);
// }

// export function showAlert(params) {
//     var { title, text, icon } = params;

//     return Swal.fire({
//         title: title,
//         text: text,
//         icon: icon,
//         position: 'center',
//     });
// }

// export function showConfirmation(params) {
//     var { title, text, confirm_btn_text, cancel_btn_text } = params;

//     title = title || 'Are you sure?';
//     confirm_btn_text = confirm_btn_text || 'Yes';
//     cancel_btn_text = cancel_btn_text || 'Cancel';

//     return Swal.fire({
//         title: title,
//         text: text,
//         position: 'top',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: confirm_btn_text,
//         cancelButtonText: cancel_btn_text,
//         buttonsStyling: false
//     });
// }

// export function checkNetworkSpeed() {
//     // var file_url = process.env.REACT_APP_SERVER_URL + '/images/system/network_speed_test_1mb.jpg';
//     // var file_size_bytes = 1000000;
//     var file_url = "https://upload.wikimedia.org/wikipedia/commons/a/a6/Brandenburger_Tor_abends.jpg";
//     var file_size_bytes = '2707459';
//     var file_size_bits = file_size_bytes * 8;
//     var start_time = (new Date()).getTime(); 
//     var end_time;
    
//     return new Promise((resolve, reject) => {
//         var download = new Image();
//         download.src = file_url + "?v=" + start_time;
        
//         download.onload = () => {
//             end_time = (new Date()).getTime();

//             var duration = (end_time - start_time) / 1000;
//             var speed_bps = (file_size_bits / duration).toFixed(2);
//             var speed_kbps = (speed_bps / 1024).toFixed(2);
//             var speed_mbps = (speed_kbps / 1024).toFixed(2);

//             resolve({
//                 duration,
//                 speed_bps,
//                 speed_kbps,
//                 speed_mbps
//             });
//         }
        
//         download.onerror = (err, msg) => {
//             reject({
//                 error: err,
//                 error_msg: msg
//             });
//         }
//     });
// }

// // an alternative timing loop which can work event when tab is inactive, based on AudioContext's clock
// export function setBackgroundInterval(callback, interval_ms) {
//     // AudioContext time parameters are in seconds
//     var ac_interval = interval_ms / 1000;
//     var audio_context = new AudioContext();
    
//     // chrome needs our oscillator node to be attached to the destination
//     // so we create a silent Gain Node
//     var silence = audio_context.createGain();
//     silence.gain.value = 0;
//     silence.connect(audio_context.destination);

//     onOSCend();

//     // A flag to know when we'll stop the loop
//     var stopped = false;
    
//     function onOSCend() {
//         var osc = audio_context.createOscillator();
//         osc.onended = onOSCend; // so we can loop
//         osc.connect(silence);
//         osc.start(0); // start it now
//         osc.stop(audio_context.currentTime + ac_interval); // stop it next frame
        
//         callback(audio_context.currentTime); // one frame is done
        
//         // user broke the loop
//         if (stopped) {
//             osc.onended = function() {
//                 audio_context.close();
//                 return;
//             };
//         }
//     };
    
//     return {
//         stop: function() {
//             stopped = true;
//         }
//     }
// }

// export function decryptIt(string){
//     //removing first character
//     string = string.substring(1);
//     //removing last character
//     string = string.slice(0, -1);
    
//     try {
//         return atob(string);
//     } catch (err) {
//         return false;
//     }
// }