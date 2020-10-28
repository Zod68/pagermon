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

            var pushPri = 0; // default
            if (pConf.priority) {
              pushPri = pConf.priority.value;
            }

            var pushSound = 0; // default
            if (pConf.sound) {
              pushSound = pConf.sound.value;
            }
            
            var msg = {
                m: data.message,                            // Message (required)
                t: data.agency+' - '+data.alias,            // Title (optional)
                d: 'a',                                     // Device or Device Group id (optional)
                s: pushSound,                               // Sound (value 0-28) (optional)
                v: '2',                                     // Vibration (empty or value 1-3) (optional)
                i: '83',                                    // Icon (value 1-98) (optional)
                l: '10',                                    // Time to Live (optional)
                pr: pushPri,                                // Priority (optional: -2, -1, 0, 1, 2)
                re: '60',                                   // Retry (optional: 60-10800 seconds)
                ex: '60',                                   // Expire (optional: 60-10800 seconds)
                a: '0',                                     // Answer
                onerror: function(err) {
                    logger.main.error('Pushsafer:', err);
                    }				                        	
            };

            p.send(msg, function (err, result) {
              if (err) { logger.main.error('Pushsafer:' + err); }
              logger.main.debug('Pushsafer:' + result);
              console.log('RESULT', result );
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