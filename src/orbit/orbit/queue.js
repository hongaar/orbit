import Orbit from 'orbit/core';

var Queue = function() {
  this.queue = [];
  this.processing = false;
};

Queue.prototype = {
  constructor: Queue,

  push: function(fn, binding) {
    var _this = this;

    binding = binding || this;

    if (this.processing) {
      debugger;
      var response = new Orbit.Promise(function(resolve) {
        _this.queue.push(function() {
          resolve(fn.call(binding));
        });
      });

      _this.process();

    } else {
      return fn.call(binding);
    }

    return response;
  },

  process: function() {
    if (!this.processing) {
      var _this = this;

      var settleEach = function() {
        if (_this.queue.length === 0) {
          _this.processing = false;

        } else {
          var fn = _this.queue.shift();
          var response = fn.call(_this);

          if (response) {
            return response.then(
              function(success) {
                settleEach();
              },
              function(error) {
                settleEach();
              }
            );
          } else {
            settleEach();
          }
        }
      };

      settleEach();
    }
  }
};

export default Queue;