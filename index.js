/**
 * canvas Polar Clock
 */
(function() {
  //--------------------------------------------------------------------------
  //  Entry Point
  //--------------------------------------------------------------------------
  window.onload = function(e){
    var canvas = document.getElementById("canvas");
    
    var point = new Point(200, 200, 180);
    var clock = new PolarClock(canvas, point, 15, 2);
    clock.color = ["#444", "#555", "#666", "#777", "#888", "#999"];
    clock.start(25);

    startTime();
  };
  
  
  //--------------------------------------------------------------------------
  //  Point
  //--------------------------------------------------------------------------
  /**
   *
   * @param {Number} x canvas
   * @param {Number} y canvas
   * @param {Number} radius
   */
  var Point = function(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  };
  
  //--------------------------------------------------------------------------
  //  Polar Clock
  //--------------------------------------------------------------------------
  /**
   *
   * @param {Object} canvas
   * @param {Point} point
   * @param {Number} line
   * @param {Number} margin
   * @param {Array.<String>} color
   */
  var PolarClock = function (canvas, point, line, margin, color) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.point = point;
    this.line = line;
    this.margin = margin;
    this.color = color || ["#333", "#555", "#777", "#999", "#BBB", "#DDD"];
  };
  
  /**
   *
   * @param {Number} interval (ms)
   */
  PolarClock.prototype.start = function(interval) {
    var self = this;
    var point = this.getPoint();
    
    setInterval(function() {
      self.step(point);
    }, interval);
  };
  
  /**
   * clear
   */
  PolarClock.prototype.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  
  /**
   *
   * @return {Point}
   */
  PolarClock.prototype.getPoint = function() {
    return new Point(this.point.x, this.point.y, this.point.radius);
  };
  
  /**
   *
   * @param {Point} point
   */
  PolarClock.prototype.step = function(point) {
    var now = getTimeRadian();
    var line = this.line;
    var margin = this.margin;
    var color = this.color;
    // console.log(point);
    this.clear();
    if (color[0]) this.draw(0, point, now.second);
    if (color[1]) this.draw(1, point, now.minute);
    if (color[2]) this.draw(5, point, 7); // circle
    // if (color[2]) this.draw(2, point, now.hour);
    // if (color[3]) this.draw(3, point, now.weekday);
    // if (color[4]) this.draw(4, point, now.date);
    // if (color[5]) this.draw2(5, point, now.month);
  };
  
  /**
   *
   * @param {Number} index
   * @param {Point} point
   * @param {Number} radian
   */
  PolarClock.prototype.draw = function(index, point, radian) {
    this.point = new Point(
      point.x,
      point.y,
      point.radius - (this.line + this.margin) * index
    );
    
    this.arc(this.color[index], this.line, 0, radian);
  };

  PolarClock.prototype.draw2 = function(index, point, radian) {
    this.point = new Point(
      point.x,
      point.y,
      point.radius - (this.line + this.margin) * index
    );
    
    this.arc(this.color[index], this.line, 0, radian);
  };
  
  /**
   *
   * @param {String} color
   * @param {Number} width
   * @param {Number} start
   * @param {Number} end
   */
  PolarClock.prototype.arc = function(color, width, start, end) {
    var context = this.context;
    var point = this.point;
    var x = -point.y;
    var y = point.x;
    var r = point.radius-width;
    
    context.save();
    context.rotate(-Math.PI/2);
    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.arc(x, y, r, start, end, false);
    context.stroke();
    // context.font = "10px Arial";
    // context.strokeText("Big smile!",-200,-9);

    context.restore();
  };
  
  //--------------------------------------------------------------------------
  //  Private methods
  //--------------------------------------------------------------------------
  /**
   * time radian
   */
  var getTimeRadian = function() {
    var now = new Date();
    var eom = getEndOfMonth(now);
    
    var second = (now.getSeconds() + now.getMilliseconds() / 1000) * Math.PI / 30;
    var minute = (now.getMinutes() * Math.PI / 30) + second / 60;
    var hour = (now.getHours() * Math.PI / 12) + minute / 24;
    var weekday = (now.getDay() * Math.PI / 3.5) + hour / 7;
    var date = ((now.getDate() - 1) * Math.PI / (eom/2)) + hour / eom;
    var month = (now.getMonth() * Math.PI / 6) + date / 12;
    
    return {
      second: second,
      minute: minute,
      hour: hour,
      weekday: weekday,
      date: date,
      month: month
    };
  };
  
  /**
   * end of months for feb
   */
  var getEndOfMonth = function(date) {
    var eom;
    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var year = date.getYear();
    var month = date.getMonth();
    
    if (month == 1 && year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
      return 29;
    } else {
      return days[month];
    }
  };
  
  /* digital clock */
  function startTime() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var date = today.getDate();
    var d = today.getDay();

    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    month = checkTime(month);
    date = checkTime(date);
    m = checkTime(m);
    s = checkTime(s);

    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    document.getElementById('day').innerHTML = weekday[d];
    document.getElementById('time').innerHTML = h+":"+m;
    document.getElementById('date').innerHTML = year+" "+month+" "+date;
    var t = setTimeout(function(){startTime()},500);
  }

  function checkTime(i) {
    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

})();