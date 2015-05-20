
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
      ctrl.$setValidity('invalidlength', true);
      ctrl.$setValidity('invalidchars', true);
      ctrl.$setValidity('invalidcheckdigit', true);
      if (!vin) {
        return vin;
      }
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
