var push = require('pushsafer-notifications');
var logger = require('../log');

function run(trigger, scope, data, config, callback) {
    var pConf = data.pluginconf.Pushsafer;
    if (pConf && pConf.enable) {
        //ensure ID has been entered before trying to push
        logger.main.debug('Pushsafer enabled');
        if (pConf.device == 0 || pConf.device == '0' || !pConf.device) {
          logger.main.error('Pushsafer: ' + data.address + ' No Device/Group ID set. Please enter User/Group ID.');
            callback();
          } else {
            var p = new push({
              k: config.pushsaferKey,
              debug: true
            });

            var pushPri = 0;                          // default priority
            var pushIcon = 1;                         // default icon 
            var pushSound = 0;                        // default sound (silent)
            var pushTTL = 10;                         // default message time to live (purged)
            var pushRetry = 60;                       // default retry period (optional: 60-10800 seconds)
            var pushExpire = 120;                     // default expire period (optional: 60-10800 seconds)

            var pushAlertSound = 62;                   // default alert message sound
            if (pConf.alertsound) {
              pushAlertSound = pConf.alertsound.value;
            }

            var pushInfoSound = 22;                    // default info message sound
            if (pConf.infosound) {
              pushInfoSound = pConf.infosound.value;
            }            

            var pushVibration = 0;                    // default vibration seeting (off)
            if (pConf.vibration) {
              pushVibration = pConf.vibration.value;
            }            


            // Alert Messages
            if(data.source == "alert") { 
              pushPri = 2;
              pushSound = pushAlertSound;
              pushIcon = 83;
              logger.main.debug('Pushsafer: Alert Message');
            }

            // Information Messages
            if(data.source == "info") {
              pushPri = 0;
              pushSound = pushInfoSound;
              pushIcon = 4;
              logger.main.debug('Pushsafer: Information Message');
            }
            
            var msg = {
                m: data.message,                            // Message (required)
                t: data.agency+' - '+data.alias,            // Title (optional)
                s: pushSound,                               // Sound (value 0-62) (optional)
                v: pushVibration,                           // Vibration (empty or value 1-3) (optional)
                i: pushIcon,                                // Icon (value 1-98) (optional)
                l: pushTTL,                                 // Time to Live (in minutes)
                pr: pushPri,                                // Priority (optional: -2, -1, 0, 1, 2)
                re: pushRetry,                              // Retry (optional: 60-10800 seconds)
                ex: pushExpire,				                      // Expire (optional: 60-10800 seconds)
	    	        a: '0',                                     // Answer
		            d: pConf.device	                        	
            };

            p.send(msg, function (err, result) {
              if (err) { logger.main.error('Pushsafer:' + err); }
              logger.main.debug('Pushsafer:' + result);
              console.log('RESULT', result );
		          console.log('VARIABLE : ', msg );
              callback();
            });
          }
    } else {
        callback();
    }     
}

module.exports = {
    run: run
}
