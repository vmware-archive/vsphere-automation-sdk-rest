const apiCookie = 'api-session';
const hostCookie = 'host';

// DEMO: Turn on SSL cert verification
const useSSL = false;

/**
 * Process the POST request from the login page using the credentials to log into the vAPI endpoint.
 * Upon login, redirects to /api displaying the available hosts on the vSphere instance.
 */
exports.postLogin = function(req, res, next) {
  request = require('request');
  
  request({
    url : req.body.host + process.env.LOGIN_PATH,
    method: 'POST',
    strictSSL: useSSL,
    headers : {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization" : "Basic " + new Buffer(req.body.user + ":" + req.body.password).toString("base64")
    }
  }, function(error, response, body) {
    if (response.statusCode < 400) {
      // Save the vmware-api-session and host to cookies on the client
      if (response.headers['set-cookie'] && response.headers['set-cookie'][0].startsWith('vmware-api-session')) {
        res.cookie(apiCookie, response.headers['set-cookie'][0], { maxAge: 900000, httpOnly: true });
        res.cookie(hostCookie, req.body.host, { maxAge: 900000, httpOnly: true });      
      }
      // Now that we're authenticated render the API page
      res.redirect('/inventory');
    } else {
      res.redirect('/');
    }
  });
}

/**
 * Handles vSphere REST API requests and by default returns /vcenter/host results. If a "path" query param
 * is provided it will be used to call the endpoint with that route returning the results. In the event
 * the user is not logged in they are redirected to the home page. Only includes basic error handling.
 */
exports.getApi = async function(req, res, next) {
  // Use either default API request or "path" queryparam
  var path = Object.keys(req.query).length > 0 ? req.query.path : '/rest/vcenter/host';

  request = require('request');

  // If there is no api-session cookie, redirect to the login page
  if (req.cookies[apiCookie] === undefined || req.cookies[hostCookie] === undefined) {
    res.redirect('/');
    return;
  }

  request(
    {
      url : req.cookies.host + path,
      method: 'GET',
      strictSSL: useSSL,
      headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cookie': req.cookies[apiCookie]         
        }
    },
    function (error, response, body) {
      if (error || response.statusCode >= 400) {
        error = response.statusMessage
        res.render('api', { error: error });
      } else {
        try {
          var data = JSON.parse(body).value;
        } catch(exception) {
          error = exception.message;
        }
        res.render('api', {
          host: req.cookies.host,
          error: error,
          path: path,
          data: data
        });
      }
    }
  );
}

/**
 * Handle logout clearing the vSphere REST API session and delete the client side cookies
 */
exports.getLogout = function(req, res, next) {
  request = require('request');
  
  request({
    url : req.cookies.host + '/rest/com/vmware/cis/session',
    method: 'DELETE',
    strictSSL: false,
    headers: { 'Cookie': req.cookies['api-session'] }
  }, function(error, response, body) {
    res.clearCookie(apiCookie);
    res.clearCookie(hostCookie);
    res.redirect('/');
  });
}