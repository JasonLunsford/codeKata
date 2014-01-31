//--------------------------------
// Simple Calculator
// Jason Lunsford
// v1.0
// calculator.js
//
//--------------------------------

"use strict";
    
(function() {

    (function($) {
		
		// Calculator Registered
		var regFluid	 = "",
			regFixed	 = "",
			opReg		 = "",
			tempReg		 = "",
			savedReg	 = "";
			
		// Global Flags
		var numSignState = "positive",
			nukeFlag 	 = false,
			digitCount	 = "";
		
		// The Calculator Screen
		var $screen		 = $("#screen");
			
		// The Number Buttons
		var $num0 		 = $("#num0"),
			$numbers	 = $("p.num");
		
		// The Regular Buttons
		var $screenClear = $("#screenClear"),
			$add 		 = $("#add"),
			$subtract 	 = $("#subtract"),
			$multiply 	 = $("#multiply"),
			$divide 	 = $("#divide"),
			$equal 	 	 = $("#equal"),
			$toggleSign  = $("#toggleSign"),
			$decimal 	 = $("#decimal");

		// The Memory Buttons
		var $memClear 	 = $("#memClear"),
			$memPositive = $("#memPositive"),
			$memNegative = $("#memNegative"),
			$memRecall 	 = $("#memRecall");
		
		// Number Button Listeners
		$num0.click(function() {
			if ( digitCount <= 9 ) {
				if ( regFluid === "" ) {
					if ( nukeFlag ) { $screen.text(""); }
					$screen.text( processButtonPress(0) );
					digitCount++
				} else if ( regFluid === 0 ) {
					return;
				} else {
					if ( nukeFlag ) { $screen.text(""); }
					$screen.text( processButtonPress(0) );
					digitCount++
				}
			}
		});
		// Loop through remaining number buttons
		$numbers.each(function() {
			$(this).click(function() {
				if ( digitCount <= 9 ) {
					if ( nukeFlag ) { $screen.text(""); }
					$screen.text( processButtonPress(parseInt($(this).text())) );
					digitCount++
				}
			});
		});
		
		// Operator Buttons
		$add.click(function() {
			$("p.interact").removeClass("current");
			$screen.text(processButtonPress("add"));
			$(this).addClass("current");
			digitCount = "";
		});
		
		$subtract.click(function() {
			$("p.interact").removeClass("current");
			$screen.text(processButtonPress("subtract"));
			$(this).addClass("current");
			digitCount = "";
		});
		
		$multiply.click(function() {
			$("p.interact").removeClass("current");
			$screen.text(processButtonPress("multiply"));
			$(this).addClass("current");
			digitCount = "";
		});
		
		$divide.click(function() {
			$("p.interact").removeClass("current");
			$screen.text(processButtonPress("divide"));
			$(this).addClass("current");
			digitCount = "";
		});
		
		$equal.click(function() {
			$("p.interact").removeClass("current");
			var localVal = processButtonPress("equal");
			$screen.text(localVal);
			digitCount = "";
		});
		
		// Sign Toggle, Decimal, and Clear Screen Buttons
		$toggleSign.click(function() {
			$screen.text( processButtonPress("toggleSign") );
		});
		
		$decimal.click(function() {
			$screen.text( processButtonPress("decimal") );
			digitCount++;
		});
		
		$screenClear.click(function() {
			$("p.interact").removeClass("current");
			( clearScreen() ) ? $screen.text(0) : console.log("Error thrown by clearScreen function.");
		});
		
		// Memory Buttons
		$memClear.click(function() {
			$("p.interactMem").removeClass("current");
			( clearMemory() ) ? $screen.text(0) : console.log("Error thrown by clearMemory function.");
		});
		
		$memPositive.click(function() {
			if ( savedReg === "" ) {
				$("p.interactMem").removeClass("current");
				memoryPositive();
				$(this).addClass("current");
			}
		});
		
		$memNegative.click(function() {
			if ( savedReg === "" ) {
				$("p.interactMem").removeClass("current");
				memoryNegative();
				$(this).addClass("current");
			}
		});
		
		$memRecall.click(function() {
			$screen.text( recallMemory() );
		});
		
		// Core Function, handle most button clicks
		function processButtonPress (buttonPress) {
			
			// if parameter is a number type
			if ( typeof buttonPress === "number" ) {
				
				if ( regFluid === "" ) {
					regFluid = buttonPress;
					
				// here we force regFluid into a number type (redundent), and mod by 1 for a remainder. if a remainder exists we have a floating point value...
				} else if ( +regFluid === regFluid && !(regFluid % 1) ) {
					
					// ...except for if the user started their number with a decimal, so let's check for string type
					if ( typeof regFluid === "string" ) {
						regFluid += buttonPress;
					}
					
					// simple math to handle building on screen value
					else {
						if ( regFluid < 0 ) {
							regFluid = ((Math.abs(regFluid) * 10) + buttonPress) * -1;
						} else {
							regFluid = (regFluid * 10) + buttonPress;
						}
					}
					
				// if a decimal is in the mix we are treating it like a string for now, which mean character concats
				} else {
					regFluid += buttonPress;
				}
				return regFluid;
					
			} else if ( typeof buttonPress === "string" ) {

				if ( buttonPress === "toggleSign" ) {
					
					if ( regFluid === "" || regFluid === 0 ) { return; }
					
					else { regFluid *= -1; }
					
					return regFluid;
					
				} else if ( buttonPress === "decimal" ) {
					// if user tries to use a second decimal place, just ignore it
					if ( typeof regFluid === "string" && regFluid.indexOf('.') > -1 ) { return; }
					// if user starts with a decimal, we'll tweak the UI to show it
					else if ( regFluid === "" || regFluid == 0 ) { regFluid = "0."; }
					
					else { regFluid += "."; }
					
					return regFluid;
					
				} else if ( buttonPress === "add" ) {
					// use case one: user's first move is to hit an operator button, so ignore it
					if ( regFluid === "" && opReg === "" ) {
						return;
					// use case two: user has typed a number, and now they are hitting operator button for the first time
					} else if ( regFluid != "" && opReg === "" ) {
						regFixed = regFluid;
						regFluid = "";
						opReg  	 = "add";
						nukeFlag = true;
					// use case two (and a half): handling zero
					} else if ( regFluid === 0 && opReg === "" ) {
						regFixed = regFluid;
						regFluid = "";
						opReg  	 = "add";
						nukeFlag = true;
					// use case three: user has already hit the equal key, and now wants to continue using operator button on existing value
					} else if ( regFluid === "" && opReg != "" ) {
						regFixed = $screen.text();
						opReg    = "add";
						nukeFlag = true;
					// use case four: user has not hit the equal key, they just keep on trucking, hitting the operator / number / operator...
					} else {
						tempReg  = calculate(opReg);
						regFixed = tempReg;
						opReg    = "add";
						return regFixed;
					}

					
				} else if ( buttonPress === "subtract" ) {
					
					if ( regFluid === "" && opReg === "" ) {
						return;
					} else if ( regFluid != "" && opReg === "" ) {
						regFixed = regFluid;
						regFluid = "";
						opReg  	 = "subtract";
						nukeFlag = true;
					} else if ( regFluid === 0 && opReg === "" ) {
						regFixed = regFluid;
						regFluid = "";
						opReg  	 = "subtract";
						nukeFlag = true;
					} else if ( regFluid === "" && opReg != "" ) {
						regFixed = $screen.text();
						opReg    = "subtract";
						nukeFlag = true;
					} else {
						tempReg  = calculate(opReg);
						regFixed = tempReg;
						opReg    = "subtract";
						return regFixed;
					}
					
				} else if ( buttonPress === "multiply" ) {
					
					if ( regFluid === "" && opReg === "" ) {
						return;
					} else if ( regFluid != "" && opReg === "" ) {
						regFixed = regFluid;
						regFluid = "";
						opReg  	 = "multiply";
						nukeFlag = true;
					} else if ( regFluid === 0 && opReg === "" ) {
						regFixed = regFluid;
						regFluid = "";
						opReg  	 = "multiply";
						nukeFlag = true;
					} else if ( regFluid === "" && opReg != "" ) {
						regFixed = $screen.text();
						opReg    = "multiply";
						nukeFlag = true;
					} else {
						tempReg  = calculate(opReg);
						regFixed = tempReg;
						opReg    = "multiply";
						return regFixed;
					}
					
				} else if ( buttonPress === "divide" ) {
					
					if ( regFluid === "" && opReg === "" ) {
						return;
					} else if ( regFluid != "" && opReg === "" ) {
						regFixed = regFluid;
						regFluid = "";
						opReg  	 = "divide";
						nukeFlag = true;
					} else if ( regFluid === 0 && opReg === "" ) {
						regFixed = regFluid;
						regFluid = "";
						opReg  	 = "divide";
						nukeFlag = true;
					} else if ( regFluid === "" && opReg != "" ) {
						regFixed = $screen.text();
						opReg    = "divide";
						nukeFlag = true;
					} else {
						tempReg  = calculate(opReg);
						regFixed = tempReg;
						opReg    = "divide";
						return regFixed;
					}
					
				} else if ( buttonPress === "equal" ) {
					// user his the equal key without touching a number button, so ignore
					if ( regFluid === "" ) { return; }
					
					else if ( regFluid === "0." ) {
						regFluid = 0;
						return regFluid;
						
					} else if ( regFluid != "" && opReg != "" && regFixed === "" ) {
						return "Error";
						
					} else {
						nukeFlag = true;
						return calculate(opReg);
					}
				}

			} else {
				console.log("Unrecognized parameter type: "+typeof(buttonPress)+". Please check function.");
			}
		}
		
		function calculate(button) {
			
			// protect globals
			var privregFluid  = regFluid,
				privregFixed  = regFixed,
				privOpReg  	  = opReg;
			
			// convert strings to floats
			if ( typeof privregFluid === "string" ) { privregFluid = parseFloat(privregFluid); }
			if ( typeof privregFixed === "string" ) { privregFixed = parseFloat(privregFixed); }
			
			// clear the globals and return the math...
			if ( privOpReg === "add" ) {
				regFluid = "";
				regFixed = "";
				
				if ( privregFixed + privregFluid > 9999999999 ) {
					return "Too Big!";
				} else {
					return privregFixed + privregFluid;
				}
			}
			
			if ( privOpReg === "subtract" ) {
				regFluid = "";
				regFixed = "";
				
				return privregFixed - privregFluid;
			}
			
			if ( privOpReg === "multiply" ) {
				regFluid = "";
				regFixed = "";
				
				if ( privregFixed * privregFluid > 9999999999 ) {
					return "Too Big!";
				} else {
					return privregFixed * privregFluid;
				}
			}
			// ...and of course check for division by zero!
			if ( privOpReg === "divide" ) {
				regFluid = "";
				regFixed = "";
				
				if ( privregFixed === 0 ) { return 0; } // if numerator is 0 value will be 0, except when 0/0, which is a NaN - so just return 0
				
				// Arbitrary rounding to five decimal places to protect against number overflow
				return Math.round((privregFixed / privregFluid) * 100000) / 100000;
			}
		}
		
		function clearScreen() {
			regFluid   = "";
			regFixed   = "";
			opReg      = "";
			tempReg    = "";
			
			digitCount = "";

			return true;
		}
		
		// if MC pressed...
		function clearMemory() {			
			if ( clearScreen() ) {
				savedReg = "";
				
				return true;
			} else {
				console.log("Failure when attempting to clear settings. Stopping.");
			}
		}
		
		// if MR pressed...
		function recallMemory() {
			if ( savedReg ) {
				regFluid = savedReg;
				
				return regFluid;
			}
		}
		
		// if M+ pressed...
		function memoryPositive() {
			if ( regFluid ) {
				savedReg = regFluid;
			}
		}
		
		// if M- pressed...
		function memoryNegative() {
			if ( regFluid ) {
				savedReg = (regFluid * -1 );
			}
		}

		
	})(jQuery);
        
})();
