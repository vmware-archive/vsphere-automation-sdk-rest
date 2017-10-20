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
  
  console.log(`Logging in: ${req.body.user} on ${req.body.host}`);

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
    if (error) {
      res.render('home', { error: error.message });
      return;
    } else {
      if (response.statusCode < 400) {
        // Save the vmware-api-session and host to cookies on the client
        if (response.headers['set-cookie'] && response.headers['set-cookie'][0].startsWith('vmware-api-session')) {
          res.cookie(apiCookie, response.headers['set-cookie'][0], { maxAge: 900000, httpOnly: true });
          res.cookie(hostCookie, req.body.host, { maxAge: 900000, httpOnly: true });      
        }
        // Now that we're authenticated redirect to render the inventory page
        if (req.query.redirect)
          res.redirect(`/inventory?path=${req.query.redirect}`);
        else
          res.redirect('/inventory');
      } else {
        var msg = `Error: ${response.statusCode}: ${response.statusMessage}`
        console.log(msg);
        res.redirect('/', 301, { 
          error: msg, 
          title: process.env.TITLE, 
          host: process.env.HOST, 
          user: process.env.USERID, 
          pwd: process.env.PASS
        });
      }
    }
  });
}

var splitPath = function (str) {
  return str.split('\\').pop().split('/').pop();
}

/**
 * Handles vSphere REST API requests and by default returns /vcenter/host results. If a "path" query param
 * is provided it will be used to call the endpoint with that route returning the results. In the event
 * the user is not logged in they are redirected to the home page. Only includes basic error handling.
 */
exports.getApi = async function(req, res, next) {
  // Use either default API request or "path" queryparam
  var path = Object.keys(req.query).length > 0 ? req.query.path : '/rest/vcenter/host';

  console.log(`API request: ${path} on ${req.cookies.host}`);
  
  request = require('request');
  
  // If there is no api-session cookie, redirect to the login page
  if (req.cookies[apiCookie] === undefined || req.cookies[hostCookie] === undefined) {
    res.redirect(`/?redirect=${path}`);
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
      try {
        if(response && response.statusCode >= 400) {
          console.log(`Error: ${response.statusCode} ${response.statusMessage}`);
          error = `${response.statusCode}: ${response.statusMessage}`;
        }
        var data = JSON.parse(body).value;
      } catch(exception) {
        error = exception.message;
      }
      res.render('inventory', {
        host: req.cookies.host,
        error: error,
        path: path,
        // The following "id" is the key within the response that corresponds to the resource identifier.
        // If the last portion of the id contains a "-" we convert it to "_" as resource identifier use "_".
        id: splitPath(path).replace('-', '_'),
        data: data,
        raw: JSON.stringify(JSON.parse(body), null, '\t')
      });
    }
  );
}

/**
 * Handle logout clearing the vSphere REST API session and delete the client side cookies
 */
exports.getLogout = function(req, res, next) {
  request = require('request');

  console.log(`Logging out: ${req.cookies.host}`);

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