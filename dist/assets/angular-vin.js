
(function(window, angular, undefined) {


angular.module('angular-vin', []);


function vinValidatorService() {

  var response = {};
  var vinLength = response.vinLength = 17;
  var checkDigitIdx = response.checkDigitIndex = 8;
  var invalidChars = response.invalidChars = 'OQI';
  var regEx = response.regEx = "[A-HJ-NPR-Z0-9]{17}";
  var replaceRegEx = response.replaceRegEx = "[^A-HJ-NPR-Z0-9]";
  var characterMap = response.characterMap = {
    'A': 1,
    'B': 2,
    'C': 3,
    'D': 4,
    'E': 5,
    'F': 6,
    'G': 7,
    'H': 8,
    'J': 1,
    'K': 2,
    'L': 3,
    'M': 4,
    'N': 5,
    'P': 7,
    'R': 9,
    'S': 2,
    'T': 3,
    'U': 4,
    'V': 5,
    'W': 6,
    'X': 7,
    'Y': 8,
    'Z': 9
  };
  var weights = response.weights = [
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    10,
    // Check digit does not have weight
    null,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2
  ];

  function validate(vin) {

    if (!vin) {
      return {
        valid: false,
        error: 'VIN cannot be empty',
        errCode: 'emptyvin'
      };
    }

    if (vin.length !== vinLength) {
      return {
        valid: false,
        error: 'VIN must be ' + vinLength + ' characters',
        errCode: 'invalidlength'
      };
    }

    vin = vin.toUpperCase();

    if (!(new RegExp(regEx, 'g').test(vin))) {
      return {
        valid: false,
        error: 'VIN must be alphanumeric and cannot contain ' +
          ' any of the following: ' + invalidChars.split('').join(', '),
        errCode: 'invalidchars'
      };
    }

    var vinList = vin.split('');
    var sum = 0;
    var i;

    for (i = 0; i < vinLength; ++i) {
      if (i === checkDigitIdx) {
        continue;
      }

      if (isNaN(vinList[i])) {
        sum += (characterMap[vinList[i]] * weights[i]);
      } else {
        sum += (vinList[i] * weights[i]);
      }
    }

    var checkDigit = sum % 11;

    if (checkDigit === 10) {
      checkDigit = "X";
    }

    if (checkDigit != vinList[checkDigitIdx]) {
      return {
        valid: false,
        error: 'VIN is invalid',
        errCode: 'invalidcheckdigit'
      };
    }

    return { valid: true };
  }

  response.validate = validate;

  return response;
}

angular.module('angular-vin')
       .factory('vinValidatorService', vinValidatorService);


function vinInputDirective(vinValidatorService) {

  function vinInputController(scope, el, attrs, ctrl) {
    // Set max length attribute
    el.attr('maxlength', vinValidatorService.vinLength);

    /**
     * Prevent bad chars
     */
    function checkChars(val) {
      if (!val) {
        return val;
      }
      var replace = new RegExp(vinValidatorService.replaceRegEx, 'g');
      var newVal = val.replace(replace, '');
      if (newVal !== val) {
        ctrl.$setViewValue(newVal);
        ctrl.$render();
      }
      return newVal;
    }

    /**
     * Upper case the input
     */
    function upperCase(val) {
      if (val) {
        var upper = val.toUpperCase();
        if (upper !== val) {
          ctrl.$setViewValue(upper);
          ctrl.$render();
        }
        return upper;
      }
      return val;
    }

    /**
     * Check our validity
     */
    function onInput(vin) {
      // Clear these for now
      ctrl.$setValidity('emptyvin', true);
      ctrl.$setValidity('invalidlength', true);
      ctrl.$setValidity('invalidchars', true);
      ctrl.$setValidity('invalidcheckdigit', true);
      var check = vinValidatorService.validate(vin);
      if (check.valid) {
        ctrl.$setPristine();
        if (scope.vinIsValid) {
          scope.vinIsValid(vin);
        }
        return vin;
      }
      ctrl.$setValidity(check.errCode, false);
      return vin;
    }
    ctrl.$parsers.unshift(onInput);
    ctrl.$parsers.unshift(checkChars);
    ctrl.$parsers.unshift(upperCase);
  }

  return {
    scope: {
      'ngModel': '=ngModel',
      'vinIsValid': '=vinIsValid'
    },
    restrict: 'A',
    require: 'ngModel',
    link: vinInputController
  };
}

angular.module('angular-vin')
       .directive('vinInput', vinInputDirective);


}(window, angular));
