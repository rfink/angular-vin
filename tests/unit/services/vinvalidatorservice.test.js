
describe('The VIN Validator Service', function() {

  var vinService;

  beforeEach(module('angular-vin'));
  beforeEach(inject(function(vinValidatorService) {
    vinService = vinValidatorService;
  }));

  it('should invalidate empty vins', function() {
    var result = vinService.validate('');
    expect(result.valid).toEqual(false);
    expect(result.errCode).toEqual('emptyvin');
  });

  it('should invalidate too short vins', function() {
    var result = vinService.validate('1');
    expect(result.valid).toEqual(false);
    expect(result.errCode).toEqual('invalidlength');
  });

  it('should invalidate too long vins', function() {
    var result = vinService.validate(new Array(19).join('1'));
    expect(result.valid).toEqual(false);
    expect(result.errCode).toEqual('invalidlength');
  });

  it('should invalidate with non alphanumeric chars', function() {
    var result = vinService.validate('-' + new Array(17).join('1'));
    expect(result.valid).toEqual(false);
    expect(result.errCode).toEqual('invalidchars');
  });

  it('should invalidate I,Q, and O', function() {
    var rest = new Array(17).join('1');
    var result;
    result = vinService.validate('I' + rest);
    expect(result.valid).toEqual(false);
    expect(result.errCode).toEqual('invalidchars');
    result = vinService.validate('Q' + rest);
    expect(result.valid).toEqual(false);
    expect(result.errCode).toEqual('invalidchars');
    result = vinService.validate('O' + rest);
    expect(result.valid).toEqual(false);
    expect(result.errCode).toEqual('invalidchars');
  });

  it('should invalidate an incorrect vin', function() {
    var result = vinService.validate(new Array(17).join('1') + '2');
    expect(result.valid).toEqual(false);
    expect(result.errCode).toEqual('invalidcheckdigit');
  });

  it('should validate a correct vin', function() {
    // A string of 17 1s actually does validate correctly
    var result = vinService.validate(new Array(18).join('1'));
    expect(result.valid).toEqual(true);
  });

  it('should validate a correct, but lowercased vin', function() {
    var result = vinService.validate('5gzcz43d13s812715');
    expect(result.valid).toEqual(true);
  });
});
