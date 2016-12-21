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
				var getInputSelection = function (el) {
					var start = 0,
						end = 0,
						normalizedValue, range,
						textInputRange, len, endRange;

					if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
						start = el.selectionStart;
						end = el.selectionEnd;
					} else {
						range = document.selection.createRange();
						if (range && range.parentElement() == el) {
							len = el.value.length;
							normalizedValue = el.value.replace(/\r\n/g, "\n");
							textInputRange = el.createTextRange();
							textInputRange.moveToBookmark(range.getBookmark());
							endRange = el.createTextRange();
							endRange.collapse(false);
							if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
								start = end = len;
							} else {
								start = -textInputRange.moveStart("character", -len);
								start += normalizedValue.slice(0, start).split("\n").length - 1;

								if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
									end = len;
								} else {
									end = -textInputRange.moveEnd("character", -len);
									end += normalizedValue.slice(0, end).split("\n").length - 1;
								}
							}
						}
					}

					return {
						start: start,
						end: end
					};
				};
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
					if ((/[A-Z]/g).test(element.val()) || (/[a-z]/g).test(element.val())) {
						element.focus();
						var cursorRange = getInputSelection(element[0]);
						element.val(intPart.trim().replace(/[A-Z]/g, '').replace(/[a-z]/g, '') + decPart.trim().replace(/[A-Z]/g, '').replace(/[a-z]/g, ''));
						element[0].setSelectionRange(cursorRange.start - 1, cursorRange.end - 1);
					} else {
						element.val(intPart.trim() + decPart.trim());
					}
				});

				ctrl.$formatters.push($formatters);
				ctrl.$parsers.push($parsers);
			}
		};
	});
})(window, document);
