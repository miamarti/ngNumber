(function () {
    'use strict';
    (angular.module('ngNumber', ['ng'])).directive('ngNumber', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '=ngModel'
            },
            link: function (scope, element, attrs, ctrl) {
                var fn = function (n, c, d, t) {
                    c = isNaN(c = Math.abs(c)) ? 2 : c;
                    d = d === undefined ? "," : d;
                    t = t === undefined ? "." : t;
                    var s = n < 0 ? "-" : "";
                    var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "";
                    var j = (j = i.length) > 3 ? j % 3 : 0;
                    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
                };
                var $formatters = function (value) {
                    if (value && value.toString().trim() !== '') {
                        return fn(parseFloat(value.toString()), 2, ',', '.');
                    } else {
                        return '';
                    }
                };
                var $parsers = function (value) {
                    if (value.trim() !== '') {
                        if (isNaN(parseFloat(value.trim().replace(/\./g, '').replace(/,/g, '.')))) {
                            var newValue = value.trim().toUpperCase().replace(/[A-Z]/g, '').replace(/[a-z]/g, '').replace(/\./g, '');
                            element.val(newValue);
                            return newValue.replace(/,/g, '.');
                        } else {
                            return parseFloat(value.trim().replace(/[A-Z]/g, '').replace(/[a-z]/g, '').replace(/\./g, '').replace(/,/g, '.'));
                        }
                    } else {
                        return '';
                    }
                };
                element.bind('propertychange blur', function () {
                    if (element.val().trim() !== '') {
                        element.val(fn(scope.ngModel, 2, ',', '.'));
                    } else {
                        element.val('');
                    }
                });

                element.bind('keyup', function (e) {
                    var field = e.target.value;
                    while (field.charAt(0) == '0') {
                        field = field.substr(1);
                    }

                    var point = field.indexOf(".");
                    if (point >= 0) {
                        field = field.slice(0, point + 3);
                    }

                    var decimalSplit = e.target.value.split(",");
                    var intPart = decimalSplit[0];
                    var decPart = decimalSplit[1];

                    intPart = intPart.replace(/[^\d]/g, '');
                    if (intPart.length > 3) {
                        var intDiv = Math.floor(intPart.length / 3);
                        while (intDiv > 0) {
                            var lastComma = intPart.indexOf(".");
                            if (lastComma < 0) {
                                lastComma = intPart.length;
                            }

                            if (lastComma - 3 > 0) {
                                intPart = intPart.split('');
                                intPart.splice(lastComma - 3, 0, '.');
                                intPart = intPart.toString().replace(/,/g, '')
                            }
                            intDiv--;
                        }
                    }

                    if (decPart === undefined) {
                        decPart = "";
                    } else {
                        decPart = "," + decPart;
                    }
                    var res = intPart.trim().replace(/[A-Z]/g, '').replace(/[a-z]/g, '') + decPart.trim().replace(/[A-Z]/g, '').replace(/[a-z]/g, '');
                    element.val(res);
                });

                ctrl.$formatters.push($formatters);
                ctrl.$parsers.push($parsers);
            }
        };
    });
})(window, document);
