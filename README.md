angular-vin
===========

VIN (vehicle identification number) validator and input directive.
See [VIN Wikipedia](http://en.wikipedia.org/wiki/Vehicle_identification_number) for information on VIN

Vehicle VINs use a check digit system to determine if the VIN is
valid.  VINs past 1980 must have 17 digits, and they must be
alphanumeric and NOT contain the letters I, Q, or O (likely to
avoid confusion with numbers).

Usage
==============

First, you can add to your bower.json if you want to use that:

    "angular-vin": "rfink/angular-vin"

Or simply run

    bower install angular-vin

Angular-vin only requires angular (in production).
To use in your angular app, add "angular-vin" to your dependencies:

```javascript
    var myApp = angular.module('myApp', ['angular-vin']);
```

Then, you can add "vin-input" directive inside your html.
You can also specify a callback from scope to call when the
VIN is successfully input and validate.  Also, the module sets
4 different validity properties depending on what is invalid (see below)

```html
    <input vin-input vin-is-valid="onValid" name="vin" ng-model="vin" />
    <div ng-show="form.vin.$error.emptyvin">Empty vin</div>
    <div ng-show="form.vin.$error.invalidlength">Vin too short</div>
    <div ng-show="form.vin.$error.invalidchars">Invalid characters</div>
    <div ng-show="form.vin.$error.invalidcheckdigit">Check digit does not match</div>
```

The directive prevents invalid characters, adds a max length to the
input element, and automatically converts input to upper-case.

Controller code:

```javascript
    myApp.controller('MyCtrl', function MyCtrl($scope) {
        $scope.onValid = function(vin) {
            console.log(vin + ' is a valid VIN');
        };
    });
```

You can opt out of using the directive and simply use the service.

```javascript
    myApp.controller('MyCtrl', function MyCtrl($scope, vinValidatorService) {
        var result = vinValidatorService.validate('11111111111111111');
        if (result.valid) {
            // Do things
        }
    });
```

For the sake of completeness, the vinValidatorService exports additional
properties relating to VIN validation.  These are:
+ vinLength - equal to 17
+ checkDigitIndex - equal to 8 (9th position in the VIN)
+ invalidChars - 'OQI'
+ regEx - "[A-HJ-NPR-Z0-9]{17}"
+ replaceRegEx - "[^A-HJ-NPR-Z0-9]"
+ characterMap - map of alphabet characters to numeric value
+ weights - weights based on index position
