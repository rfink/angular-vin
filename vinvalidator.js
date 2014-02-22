/**
 * THIS FUNCTION IS USED TO DETERMINE IF THE VIN NUMBER IS VALID
 * BY CALCULATING A CORRECT CHECK DIGIT USED IN EVERY VIN (9th DIGIT FROM LEFT)
 * THIS IS ONLY VALID IN VEHICLES MADE SINCE 1980
 * @author rfink
 * @since  ~01/01/2007 
 */
function validateVin(vin, year) {

	// IF THE YEAR IS IN THE CORRECT RANGE, DETERMINE THE LENGTH.
	// LENGTH MUST BE 17 DIGITS, IF LESS, alert
	if (parseInt(year) >= 1980) {
		if (vin.length < 17) {
			//alert("The vin you entered is not long enough.");
			return false;
		}
	} else {
		return true;
	}

	// START BUILDING THE ARRAY FOR THE CALCULATIONS
	vin_chars = new Array(23);
	for ( var i = 0; i < 23; ++i) {
		vin_chars[i] = new Array(2);
	}

	// THESE ARE THE CORRESPONDING VALUES GIVEN TO ALPHABETIC DIGITS IN THE VIN
	vin_chars[0][0] = "A";
	vin_chars[0][1] = 1;
	vin_chars[1][0] = "B";
	vin_chars[1][1] = 2;
	vin_chars[2][0] = "C";
	vin_chars[2][1] = 3;
	vin_chars[3][0] = "D";
	vin_chars[3][1] = 4;
	vin_chars[4][0] = "E";
	vin_chars[4][1] = 5;
	vin_chars[5][0] = "F";
	vin_chars[5][1] = 6;
	vin_chars[6][0] = "G";
	vin_chars[6][1] = 7;
	vin_chars[7][0] = "H";
	vin_chars[7][1] = 8;
	vin_chars[8][0] = "J";
	vin_chars[8][1] = 1;
	vin_chars[9][0] = "K";
	vin_chars[9][1] = 2;
	vin_chars[10][0] = "L";
	vin_chars[10][1] = 3;
	vin_chars[11][0] = "M";
	vin_chars[11][1] = 4;
	vin_chars[12][0] = "N";
	vin_chars[12][1] = 5;
	vin_chars[13][0] = "P";
	vin_chars[13][1] = 7;
	vin_chars[14][0] = "R";
	vin_chars[14][1] = 9;
	vin_chars[15][0] = "S";
	vin_chars[15][1] = 2;
	vin_chars[16][0] = "T";
	vin_chars[16][1] = 3;
	vin_chars[17][0] = "U";
	vin_chars[17][1] = 4;
	vin_chars[18][0] = "V";
	vin_chars[18][1] = 5;
	vin_chars[19][0] = "W";
	vin_chars[19][1] = 6;
	vin_chars[20][0] = "X";
	vin_chars[20][1] = 7;
	vin_chars[21][0] = "Y";
	vin_chars[21][1] = 8;
	vin_chars[22][0] = "Z";
	vin_chars[22][1] = 9;

	// HERE IS THE ARRAY FOR THE WEIGHTS GIVEN TO THE SPECIFIC DIGITS OF THE VIN
	vin_weights = new Array(17);

	// HERE ARE THE VALUES ASSOCIATED WITH THE WEIGHTS
	vin_weights[0] = 8;
	vin_weights[1] = 7;
	vin_weights[2] = 6;
	vin_weights[3] = 5;
	vin_weights[4] = 4;
	vin_weights[5] = 3;
	vin_weights[6] = 2;
	vin_weights[7] = 10;
	// (THE CHECK DIGIT IS NOT GIVEN A WEIGHT)
	vin_weights[9] = 9;
	vin_weights[10] = 8;
	vin_weights[11] = 7;
	vin_weights[12] = 6;
	vin_weights[13] = 5;
	vin_weights[14] = 4;
	vin_weights[15] = 3;
	vin_weights[16] = 2;

	// NOW WE INSERT EACH DIGIT INTO AN ARRAY
	vin_nums = new Array(17);
	for ( var i = 0; i < 17; ++i) {
		vin_nums[i] = vin.substring(i, i + 1);
	}

	// INITIALIZE SUM VARIABLE
	var sum = 0;

	// HERE, WE CYCLE THROUGH THE DIGIT ARRAY, MULTIPLYING THE ASSOCIATED VALUE
	// WITH ITS WEIGHT, AND ADDING IT TO THE SUM
	for ( var i = 0; i < 17; ++i) {
		if (i == 8) {
			continue;
		}

		if (isNaN(vin_nums[i])) {
			for ( var j = 0; j < 23; ++j) {
				if (vin_chars[j][0] == vin_nums[i]) {
					sum += (vin_chars[j][1] * vin_weights[i]);
					break;
				}
			}
		} else {
			sum += (vin_nums[i] * vin_weights[i]);
		}
	}

	// NOW TAKE THE REMAINDER OF THE SUM DIVIDED BY 11
	// IF IT EQUALS 10, THEN THE CHECK DIGIT SHOULD BE 'X'
	check_digit = sum % 11;
	if (check_digit == 10) {
		check_digit = "X";
	}

	// NOW COMPARE IT WITH THE ACTUAL CHECK DIGIT GIVEN
	// IF IT IS INCORRECT, ALERT

	if (check_digit != vin_nums[8]) {
		//alert("You have entered an incorrect vin #.  Please check and correct as necessary.  Remember that the letters 'o','q' and 'i' are not used.");
		return false;
	}

	return true;
}