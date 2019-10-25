var request     = require('request');
var parseString = require('xml2js').parseString;

module.exports = {
  init : function (S_ID, KEY, TOKEN, EXOPHONE) {
    this.exotel_sid   = S_ID;
    this.exotel_key   = KEY;
    this.exotel_token = TOKEN;
    this.exophone     = EXOPHONE;
    this.baseURL = 'https://' + this.exotel_key + ':' + this.exotel_token + '@twilix.exotel.in/v1/Accounts/' + this.exotel_sid 
  },

  sendSMS : function(toNumber, message, callback) {
    var url = this.baseURL + '/Sms/send';

    var params = {
      From  : this.exophone,
      To    : toNumber,
      Body  : message,
    }

    makeRequest(url, params, function(error, response) {
      if (error) {
        callback(error, null);
      } else {
        callback(null, response.TwilioResponse.SMSMessage);
      }
    });
  },

  connectCall : function(firstNumber, secondNumber, callback) {
    var url = this.baseURL + '/Calls/connect';

    var params = {
      From     : firstNumber,
      To       : secondNumber,
      CallerId : this.exophone,
      CallType : 'trans',
    }

    makeRequest(url, params, function(error, response) {
      if (error) {
        callback(error, null);
      } else {
        callback(null, response.TwilioResponse.Call);
      }
    });
  },

  getCallDetails : function(id, callback) {
    var url = this.baseURL + '/Calls/' + id;
    request.get(url, function (error, response, body) {
      if (error) {
        callback(error, response);
      } else {
        parseString(response.body, {explicitArray: false}, function(err, result) {
          callback(null, result.TwilioResponse.Call);
        });
      }
    });
  }
}

function makeRequest(url, params, callback) {
  request.post(url, {form: params}, function (error, response, body) {
    if (error) {
      callback(error, response);
    } else {
      parseString(response.body, {explicitArray: false}, function(err, result) {
        callback(null, result);
      });
    }
  });
}