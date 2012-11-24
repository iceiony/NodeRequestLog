var Greeter = (function () {
    function Greeter() { }
    Greeter.prototype.sayHello = function () {
        return "Hello World";
    };
    return Greeter;
})();

exports.Greeter = Greeter;