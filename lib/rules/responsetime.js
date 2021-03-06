module.exports = exports = function(payload, fn) {

  // get the data
  var data = payload.getData();

  // get the page content
  payload.getHAR(function(err, har) {

    // did we get a error ?
    if(err) {

      // debug
      payload.error('Got a error trying to get the HAR', err);

      // done
      return fn(err);

    }

    // check if har is defined
    if(!har)              return fn(null);
    if(!har.log)          return fn(null);
    if(!har.log.entries)  return fn(null);

    // loop our entries to find the first
    payload.getHAREntry(function(err, entry) {

      // check for a error
      if(err) {

        // stderr
        payload.error('Something went wrong while trying to find the current har entry', err);

        // done
        return fn(err);

      }

      // sanitize the output
      if(!entry) return fn(null);

      // get the request and response
      var waiting_time = 1 * entry.time;

      // according to the time set the rule state
      if(waiting_time > 3000) {

        // the response time from the server
        payload.addRule({

          type: 'error',
          key: 'pagespeed.slow',
          message: 'Initial request took longer than 3 seconds to load'

        })

      } else if(waiting_time > 1000) {

        // the response time from the server
        payload.addRule({

          type: 'warning',
          key: 'pagespeed.warn',
          message: 'Initial request took longer than 1 second to load'

        })

      }

      // send back all the rules
      fn(null);

    });

  });

};
