
/***** 
    JavaScript for the Implicit-Association-Test custom question theme
    Copyright (C) 2020 - Tony Partner (http://partnersurveys.com)
    Licensed MIT, GPL
    Version - 1.0
    Create date - 29/04/2020
*****/

// A function to insert an IAT interface
function initIAT(thisQuestion, finishText) {
			
	var thisQuestionAnswers = $('table.subquestion-list', thisQuestion).parent();
	var startTime, endTime;
	
	var mobile = false;
	var agent = navigator.userAgent.toLowerCase();
	if(is_touch_device4() == true || /android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent)) { 
		mobile = true;
		$('.iat-mobile-button-wrapper', thisQuestion).show();
	}
	
	// Some classes
	$(thisQuestion).addClass('iat-question');
	$('tr[id^="javatbd"]', thisQuestion).addClass('unanswered');
	
	// Click and keypress events
	function iatBindEvents() {
		
		$(document).on('keypress.iatKeyPress', function(e) {
			if(e.which == 101 || e.which == 105) {
				var thisRow = $('tr.subquestion-list.unanswered:eq(0)', thisQuestion);
				$(thisRow).removeClass('unanswered');
				endTime = new Date();
				$('input[type="text"]:eq(1)', thisRow).val(endTime.valueOf() - startTime.valueOf());
				var answerValue = $.trim($('.iat-left-label', thisQuestion).text());
				if(e.which == 105) {
					answerValue = $.trim($('.iat-right-label', thisQuestion).text());
				}
				$('input[type="text"]:eq(0)', thisRow).val(answerValue).trigger('keyup');
				handleNextRow();
			}
		});
		
		$('.iat-button', thisQuestion).on('click.iat-buttonClick', function(e) {
			var thisRow = $('tr.subquestion-list.unanswered:eq(0)', thisQuestion);
			$(thisRow).removeClass('unanswered');
			endTime = new Date();
			$('input[type="text"]:eq(1)', thisRow).val(endTime.valueOf() - startTime.valueOf());
			var answerValue = $.trim($('.iat-left-label', thisQuestion).text());
			if($(this).hasClass('iat-right-button')) {
				answerValue = $.trim($('.iat-right-label', thisQuestion).text());
			}
			$('input[type="text"]:eq(0)', thisRow).val(answerValue).trigger('keyup');
			handleNextRow();
		});
	}
	
	// Move to the next item
	function handleNextRow() {
			if($('tr.subquestion-list.unanswered', thisQuestion).length > 0) {
				iatShowWord();
			}
			else {
				$('.iat-left-label, .iat-word, .iat-right-label, .iat-instructions, .iat-mobile-button-wrapper', thisQuestion).fadeOut('slow', function() {
					$('.iat-button', thisQuestion).off('click.iat-buttonClick');
					$('div.iat-word', thisQuestion).text(finishText);
					$('.iat-word', thisQuestion).addClass('done').fadeIn('slow');
				});
			}
	}
	
	// Show a word
	function iatShowWord() {
		$('div.iat-word', thisQuestion).text($('tr.subquestion-list.unanswered:first .answertext', thisQuestion).text());
		startTime = new Date();
	}
	
	// Start the IAT display
	$('.iat-button', thisQuestion).bind('click.iatStartMobile', function(e) {
		$('.iat-button', thisQuestion).unbind('click.iatStartMobile');
		$(document).off('keypress.iatStart');
		iatBindEvents();
		iatShowWord();
	});
	$(document).on('keypress.iatStart', function(e) { // Non-mobile devices
		if(e.which == 101 || e.which == 105) {
			$('.iat-button', thisQuestion).unbind('click.iatStartMobile');
			$(document).off('keypress.iatStart');
			iatBindEvents();
			iatShowWord();
		}
	});
}

// https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
function is_touch_device4() {
    
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    
    var mq = function (query) {
        return window.matchMedia(query).matches;
    }

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}

