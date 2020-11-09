'use-strict';
const https = require('https');

/**
 * Class that performs an HTTP request
 *
 * @method apiRequest - Prepares HTTP request object
 * @method httpRequest - Performs HTTP request
 */
class HTTPClient {

  constructor(protocol = 'https:') {
    this.protocol = protocol;
  }

  /**
   * Prepares HTTP request object
   *
   * @param {string} method - HTTP request method 
   * @param {object} req
   * @param {string} [req.host] - Hostname of the target URL
   * @param {string} [req.path] - Pathname of the target URL
   * @param {object} [req.headers] - HTTP headers. Includes Bearer token.
   * @param {string} [req.body] - HTTP POST body string.
   * @param {string} [req.query] - Query params string
   */
  apiRequest(method, req) {

    let {host, path, headers = {}, body, query} = req;    
    path = query ? `${path}?${query}` : path;

    return this.httpRequest({
      'method': method,
      'protocol': this.protocol,
      'hostname': req.host,
      'path': path,
      'headers': headers,
      'body': body
    });
  }

  /**
   * Performs HTTP request
   *
   * @param {object} r
   * @param {string} [r.method] - HTTP request method 
   * @param {string} [r.protocol] - HTTP Protocol - HTTPS by default.
   * @param {string} [req.hostname] - Hostname of the target URL
   * @param {string} [req.path] - Pathname + query parameters of the target
   * @param {object} [req.headers] - HTTP headers. Includes Bearer token.
   * @param {string} [req.body] - HTTP POST body string.
   */
  httpRequest(r) {
    return new Promise((resolve, reject) => {
      const req = https.request(r, (res) => {       
        let body = '';

        res.on(
          'data', 
          (data) => {
            body += data;
          }
        );

        res.on(
          'end',
          () => {
            resolve({
              body, 
              status: res.statusCode
            })
          }
        );

        res.on(
          'error',
          (err) => {
            reject(new Error(err))
          }
        );
      });

      req.on(
        'error', 
        (err) => {
          reject(new Error(err))
        }
      );

      if (r.body) { req.write(r.body) }
      
      req.end();
    
    });
  }
}

module.exports = HTTPClient;
