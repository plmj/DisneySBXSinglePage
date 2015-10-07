// Apply discount by passing in code with submitOrder
// Use searchProductsByCoupon to determine if price is valid


/* TODO:
 * Use retrieve discounts/ search discounts to front-validate coupon code
 * Build purchase product JSON
 * Retrieve subscriptions
 * Apply discount to existing subscription
 * Figure out subscription plans
 */ 

//Check for and override outgoing AJAX call with XDomainRequest if on IE Browser
/*(function( jQuery ) {
  if ( window.XDomainRequest && !jQuery.support.cors ) {
    jQuery.ajaxTransport(function( s ) {
    	if ( s.crossDomain && s.async ) {
        if ( s.timeout ) {
          s.xdrTimeout = s.timeout;
          delete s.timeout;
        }
        var xdr;
        return {
        	send: function( _, complete ) {
            function callback( status, statusText, responses, responseHeaders ) {
              xdr.onload = xdr.onerror = xdr.ontimeout = xdr.onprogress = jQuery.noop;
              xdr = undefined;
              jQuery.event.trigger( "ajaxStop" );
              complete( status, statusText, responses, responseHeaders );
            }
            xdr = new XDomainRequest();
            xdr.open( s.type, s.url );
            xdr.onload = function() {
              var status = 200;
              var message = xdr.responseText;
              //var r = JSON.parse(xdr.responseText);
              //if (r.StatusCode && r.Message) {
              //status = r.StatusCode;
              //message = r.Message;
              //}
              callback( status , message, { text: message }, "Content-Type: " + xdr.contentType );
            };
            xdr.onerror = function() {
              callback( 500, "Unable to Process Data" );
            };
            xdr.onprogress = function() {};
            if ( s.xdrTimeout ) {
              xdr.ontimeout = function() {
                callback( 0, "timeout" );
              };
              xdr.timeout = s.xdrTimeout;
            }
            xdr.send( ( s.hasContent && s.data ) || null );
        	},
          abort: function() {
            if ( xdr ) {
              xdr.onerror = jQuery.noop();
              xdr.abort();
            }
          }
        };
      }
  	});
  }
})( jQuery );*/

$(function() {
	// New tab reference
	var newtab;
	var filePath = window.location.href;
	var fileName = filePath.substr(filePath.lastIndexOf("/") + 1);
	if (fileName == '') {
		fileName = 'index.html';
	}
	if (fileName.indexOf('#') >= 0) {
		fileName = fileName.substr(0, fileName.indexOf('#'));
	}
	if (fileName.indexOf('?') >= 0) {
		fileName = fileName.substr(0, fileName.indexOf('?'));
	}
	switch (fileName) {
		// Normal Purchase Flow
		case "index.html":				
			$('#PlanCountry').prop('selectedIndex',0);
			$('#PlanCountry').prop('selectedIndex',0);
			$(document).on('change','#PlanCountry',function(){
				$('.selectPricingPlans').empty();
				$('.selectPricingPlans').hide();
				var country = $('#PlanCountry').val();
				var productExternalReference  = '';
				switch(country) {
					case "SHORT":
						productExternalReference = 'UKHorizonSubscriptionShort';
					break;
					case "GBR":
						productExternalReference = 'UKHorizon';
					break;
					case "FRA":
						productExternalReference = 'FranceHorizonSubscription';
					break;
					case "ITA":
						productExternalReference = 'ItalyHorizonSubscription';
					break;
					case "DEU":
						productExternalReference = 'GermanyHorizonSubscription';
					break;
					case "ESP":
						productExternalReference = 'SpainHorizonSubscription';
					break;
				}
				// Retrieve available pricing plans to this subscriber
				retrieveAvailableProductsForCountry('',productExternalReference,false);
			});
			
			$("#CreditCardNumber").inputmask("mask", {
				"mask" : "9999 9999 9999 9999"
			});
			//specifying fn & options
			$(document).on('click', '.form-subtitle', function(event) {
				if ($('.validate').length == 0) {
					$('.btn-primary').toggleClass('validate');
					$('.form-group-coupon').animate({
						opacity : 1
					});
					$('.form-subtitle span').animate({
						opacity : 0
					}, function() {
						$(this).text("- Remove Coupon").animate({
							opacity : 1
						});
					});
					$('.btn-primary span').animate({
						opacity : 0
					}, function() {
						$(this).text("Validate Coupon").animate({
							opacity : 1
						});
					});
				} else {
					$('.error').animate({
						opacity : 0
					});
					$('.btn-primary').toggleClass('validate');
					$('.form-group-coupon').animate({
						opacity : 0
					});
					$('.form-subtitle span').animate({
						opacity : 0
					}, function() {
						$(this).text("+ Coupon").animate({
							opacity : 1
						});
					});
					$('.btn-primary span').animate({
						opacity : 0
					}, function() {
						$(this).text("Check Out!").animate({
							opacity : 1
						});
					});
				}
			});
			$(document).on('click', '#Submit', function(event) {
				event.preventDefault();
				if ($('.validate').length == 0 && $('.selectedPricingPlan').attr('cdppid') != undefined) {
					var inputObject = $('form').serializeArray();
					var name = inputObject[0].value;
					var email = inputObject[1].value;
					var swid = inputObject[2].value;
					var address = inputObject[3].value;
					var city = inputObject[4].value;
					var country = inputObject[5].value;
					var creditCardNumber = inputObject[6].value;
					creditCardNumber = creditCardNumber.replace(/ /g, '');
					var cvv = inputObject[7].value;
					var month = inputObject[8].value;
					var year = inputObject[9].value;
					var couponCode = inputObject[10].value;
					var sessionId = '';
					var pricingPlanId = $('.selectedPricingPlan').attr('cdppid');
					var productId = $('.selectedPricingPlan').attr('cdid');
					var purchaseCountry = '';
					/*if($('#selfCertifySubmit').attr('cdcountry') == undefined){
						purchaseCountry = $('#PlanCountry').val();
					}
					else {
						purchaseCountry = $('#selfCertifySubmit').attr('cdcountry');
					}
					switch(purchaseCountry){
						case "GBR":
							productId = 217621;
						break;
						case "FRA":
							productId = 217622;
						break;
						case "ITA":
							productId = 217623;
						break;
						case "DEU":
							productId = 217624;
						break;
						case "ESP":
							productId = 217493;
						break;
					}*/
					$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
						result = JSON.parse(createSessionOutput);
						sessionId = result.SessionId;
						return service.submitOrder(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, couponCode, productId, pricingPlanId);
					}).then(function(submitOrderOutput) {
						var result = submitOrderOutput;
						if (result.Fault != undefined && result.Fault != 'undefined' && result.Fault.Code == 920) {
							var country = $('#PlanCountry').val();
							var residence = $('#Country').val();
							var text = 'Based on your billing address you are not entitled for the {country} plan. Please confirm your country of residence is {residenceCountry} to see your updated quote.';
							var selfCertify = '';
							text = text.replace('{country}',country);
							text = text.replace('{residenceCountry}',residence);
							$('.purchaseDetails').hide();
							$('form').hide();
							$('.selfCertifyText').text(text);
							$('#selfCertifySubmit').attr('cdcountry',residence);
							$('#selfCertifySubmit').text('Yes! I\'m from ' + residence + '.');
							$('.selfCertify').show();
							$('.selectPricingPlans').hide();
							$('.pricingPlanSelect').hide();
							$('.selectPricingPlans').empty();
							var productExternalReference  = '';
							switch(residence) {
								case "GBR":
									productExternalReference = 'UKHorizon';
									selfCertify = 'UK';
								break;
								case "FRA":
									productExternalReference = 'FranceHorizonSubscription';
									selfCertify = 'France';
								break;
								case "ITA":
									productExternalReference = 'ItalyHorizonSubscription';
									selfCertify = 'Italy';
								break;
								case "DEU":
									productExternalReference = 'GermanyHorizonSubscription';
									selfCertify = 'Germany';
								break;
								case "ESP":
									productExternalReference = 'SpainHorizonSubscription';
									selfCertify = 'Spain';
								break;
							}
							$(document).on('click','#selfCertifySubmit',function(){
								/*$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
										result = JSON.parse(createSessionOutput);
										sessionId = result.SessionId;
										return service.updateSubscriber(sessionId,swid,email,selfCertify);
									}).then(function(updateSubscriberOutput){
										setTimeout(function(){
												retrieveAvailableProductsForCountry(sessionId,productExternalReference);
												$('.purchaseDetails').show();
												$('form').show();
												$('.selfCertify').hide();
										},5000);					
									});
								});*/
								$.when(service.createSessionWithUpdate(swid, email, selfCertify)).then(function(createSessionOutput) {
									var result = JSON.parse(createSessionOutput);
									var sessionId = result.SessionId;
									console.log(productExternalReference);
									//api.retrieveProductContextWithSession(sessionId, productExternalReference );
									$('.selfCertify').hide();
									retrieveAvailableProductsForCountry(sessionId,productExternalReference,false);
									//setTimeout(function(){
										//retrieveAvailableProductsForCountry(sessionId,productExternalReference);
										//$('.purchaseDetails').show();
										//$('form').show();
										//$('.selfCertify').hide();
									//},15000);					
									/*$('#selfCertifySubmit').text('Submit');
									$('#selfCertifySubmit').unbind('click');
									$(document).on('click','#selfCertifySubmit',function(){
										retrieveAvailableProductsForCountry(sessionId,productExternalReference);
										$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
											result = JSON.parse(createSessionOutput);
											sessionId = result.SessionId;
											subscriberId = result.SessionSummary.SubscriberId;
											retrieveAvailableProductsForCountryWithSubscriberId(subscriberId,productExternalReference);
											//retrieveAvailableProductsForCountry(sessionId,productExternalReference);
											$('.purchaseDetails').show();
											$('form').show();
											$('.selfCertify').hide();
										});
									});*/
								});
							});
						}
						else if(result.Fault != undefined && result.Fault != 'undefined'){
							$('.purchaseDetails').hide();
							$('form').hide();
							$('.orderCompletedError').text(result.fault.Message);
							$('.orderCompletedError').show();
							$('.selectPricingPlans').hide();
							$('.pricingPlanSelect').hide();
						} 
						else {
							$('.purchaseDetails').hide();
							$('form').hide();
							$('.orderCompleted').show();
							$('.selectPricingPlans').hide();
							$('.pricingPlanSelect').hide();
						}
					});
				}
				else if ($('.selectedPricingPlan').attr('cdppid') == undefined){
					alert('Pick a pricing plan!');
				}
				else {
					var couponCode = $('#CouponCode').val();
					php.searchProductsByCoupon(couponCode);
				}
			});
			
		break;
		case "paypal.html":				
			$('#PlanCountry').prop('selectedIndex',0);
			$('#paymentMethod').prop('selectedIndex',0);
			$(document).on('change','#PlanCountry',function(){
				$('.selectPricingPlans').empty();
				$('.selectPricingPlans').hide();
				var country = $('#PlanCountry').val();
				var productExternalReference  = '';
				switch(country) {
					case "GBR":
						productExternalReference = 'UKHorizonSubscription';
					break;
					case "FRA":
						productExternalReference = 'FranceHorizonSubscription';
					break;
					case "ITA":
						productExternalReference = 'ItalyHorizonSubscription';
					break;
					case "DEU":
						productExternalReference = 'GermanyHorizonSubscription';
					break;
					case "ESP":
						productExternalReference = 'SpainHorizonSubscription';
					break;
				}
				retrieveAvailableProductsForCountry('',productExternalReference );
			});
			$(document).on('change','#paymentMethod',function(){
				var paymentMethod = $('#paymentMethod').val();
				switch(paymentMethod) {
					case "CreditCard":
						$('.creditCardSection').show();
						$('.payPalSection').hide();
					break;
					case "PayPal":
						$('.creditCardSection').hide();
						$('.payPalSection').show();
					break;
				}
			});
			$("#CreditCardNumber").inputmask("mask", {
				"mask" : "9999 9999 9999 9999"
			});
			//specifying fn & options
			$(document).on('click', '.form-subtitle', function(event) {
				if ($('.validate').length == 0) {
					$('.btn-primary').toggleClass('validate');
					$('.form-group-coupon').animate({
						opacity : 1
					});
					$('.form-subtitle span').animate({
						opacity : 0
					}, function() {
						$(this).text("- Remove Coupon").animate({
							opacity : 1
						});
					});
					$('.btn-primary span').animate({
						opacity : 0
					}, function() {
						$(this).text("Validate Coupon").animate({
							opacity : 1
						});
					});
				} else {
					$('.error').animate({
						opacity : 0
					});
					$('.btn-primary').toggleClass('validate');
					$('.form-group-coupon').animate({
						opacity : 0
					});
					$('.form-subtitle span').animate({
						opacity : 0
					}, function() {
						$(this).text("+ Coupon").animate({
							opacity : 1
						});
					});
					$('.btn-primary span').animate({
						opacity : 0
					}, function() {
						$(this).text("Check Out!").animate({
							opacity : 1
						});
					});
				}
			});
			// Retrieve PayPal Token
			$(document).on('click','#PayPalSubmit',function(event){
				var inputObject = $('form').serializeArray();
				var name = inputObject[0].value;
				var email = inputObject[1].value;
				var swid = inputObject[2].value;
				$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
					result = JSON.parse(createSessionOutput);
					sessionId = result.SessionId;
					return service.retrievePayPalToken(sessionId);
				}).then(function(retrievePayPalTokenOutput) {
					var result = retrievePayPalTokenOutput;
					console.log(result);
					newtab = window.open( '', '_blank');
					newtab.location = result.PayPalUrl;
					
					// Listen for confirmation
					var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
					var eventer = window[eventMethod];
					var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
				
					// MJ: Listen to message from child window
					eventer(messageEvent, function(e) {
						var token = e.data;
						$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
							result = JSON.parse(createSessionOutput);
							sessionId = result.SessionId;
							return service.createPaypalPaymentInstrument(sessionId, token);
						}).then(function(createPaypalPaymentInstrumentOutput) {
							var result = createPaypalPaymentInstrumentOutput;
							var paymentInstrumentId = result.PaymentInstrument.Id;
							$('#PayPalSubmit').hide();
							$('#PayPalAuthorized').show();
							$('#PayPalCheckout').show();
							console.log(result);
							$(document).on('click','#PayPalCheckout',function(){
								var pricingPlanId = $('.selectedPricingPlan').attr('cdppid');
								var productId = '';
								switch($('#PlanCountry').val()){
									case "GBR":
										productId = 217621;
									break;
									case "FRA":
										productId = 217622;
									break;
									case "ITA":
										productId = 217623;
									break;
									case "DEU":
										productId = 217624;
									break;
									case "ESP":
										productId = 217493;
									break;
								}
								$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
									result = JSON.parse(createSessionOutput);
									sessionId = result.SessionId;
									return service.submitPayPalOrder(sessionId,paymentInstrumentId,'',productId,pricingPlanId);
								}).then(function(submitPayPalOrderOutput) {
									var result = submitPayPalOrderOutput;
									if (result.Fault != undefined && result.Fault != 'undefined') {
										$('.purchaseDetails').hide();
										$('form').hide();
										$('.orderCompletedError').text(result.fault.Message);
										$('.orderCompletedError').show();							
										$('.selectPricingPlans').hide();
										$('.pricingPlanSelect').hide();
									} else {
										$('.purchaseDetails').hide();
										$('form').hide();
										$('.orderCompleted').show();
										$('.selectPricingPlans').hide();
										$('.pricingPlanSelect').hide();
									}
								});
							});
						});
					}, false);
				});
			});
			$(document).on('click', '#Submit', function(event) {
				event.preventDefault();
				if ($('.validate').length == 0 && $('.selectedPricingPlan').attr('cdppid') != undefined) {
					var inputObject = $('form').serializeArray();
					var name = inputObject[0].value;
					var email = inputObject[1].value;
					var swid = inputObject[2].value;
					var address = inputObject[4].value;
					var city = inputObject[5].value;
					var country = inputObject[6].value;
					var creditCardNumber = inputObject[7].value;
					creditCardNumber = creditCardNumber.replace(/ /g, '');
					var cvv = inputObject[8].value;
					var month = inputObject[9].value;
					var year = inputObject[10].value;
					var couponCode = inputObject[11].value;
					var sessionId = '';
					var pricingPlanId = $('.selectedPricingPlan').attr('cdppid');
					var productId = '';
					switch($('#PlanCountry').val()){
						case "GBR":
							productId = 217621;
						break;
						case "FRA":
							productId = 217622;
						break;
						case "ITA":
							productId = 217623;
						break;
						case "DEU":
							productId = 217624;
						break;
						case "ESP":
							productId = 217493;
						break;
					}
					$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
						result = JSON.parse(createSessionOutput);
						sessionId = result.SessionId;
						return service.submitOrder(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, couponCode, productId, pricingPlanId);
					}).then(function(submitOrderOutput) {
						var result = submitOrderOutput;
						if (result.Fault != undefined && result.Fault != 'undefined') {
							$('.purchaseDetails').hide();
							$('form').hide();
							$('.orderCompletedError').text(result.fault.Message);
							$('.orderCompletedError').show();
							$('.selectPricingPlans').hide();
							$('.pricingPlanSelect').hide();
						} else {
							$('.purchaseDetails').hide();
							$('form').hide();
							$('.orderCompleted').show();
							$('.selectPricingPlans').hide();
							$('.pricingPlanSelect').hide();
						}
					});
				}
				else if ($('.selectedPricingPlan').attr('cdppid') == undefined){
					alert('Pick a pricing plan!');
				}
				else {
					var couponCode = $('#CouponCode').val();
					php.searchProductsByCoupon(couponCode);
				}
			});
			
		break;
		case "confirmation.html":				
			var token = window.location.href.split('?')[1].split('&')[2].split('=')[1];
			window.opener.postMessage(token, "*");
			setTimeout(function(){
				window.close();
			},1000);
		break;
		case "giveGift.html":
			retrieveAvailableProductsForCountry('','UKHorizon',true);
			$("#CreditCardNumber").inputmask("mask", {
				"mask" : "9999 9999 9999 9999"
			});
			$(document).on('click', '#Submit', function(event) {
				event.preventDefault();
				if ($('.selectedPricingPlan').attr('cdppid') != undefined) {			
					var inputObject = $('form').serializeArray();
					var name = inputObject[0].value;
					var email = inputObject[1].value;
					var uniqueID = email + new Date().getTime();
					var address = inputObject[2].value;
					var city = inputObject[3].value;
					var country = inputObject[4].value;
					var creditCardNumber = inputObject[5].value;
					creditCardNumber = creditCardNumber.replace(/ /g, '');
					var cvv = inputObject[6].value;
					var month = inputObject[7].value;
					var year = inputObject[8].value;
					var recipientName = inputObject[9].value;
					var recipientEmail = inputObject[10].value;
					var sessionId = '';
					var pricingPlanId = $('.selectedPricingPlan').attr('cdppid');
					var productId = $('.selectedPricingPlan').attr('cdid');
					$.when(service.createSessionWithUpdate(uniqueID, email, 'Gift')).then(function(createSessionOutput) {
						var result = JSON.parse(createSessionOutput);
						sessionId = result.SessionId;
						return service.submitGiftOrder(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, productId, pricingPlanId, recipientEmail, recipientName, email, name);
					}).then(function(submitGiftOrderOutput) {
						var result = submitGiftOrderOutput;
						if (result.Fault != undefined && result.Fault != 'undefined') {
							$('.purchaseDetails').hide();
							$('form').hide();
							$('.selectPricingPlans').hide();
							$('.orderCompletedError').text(result.Fault.Message);
							$('.orderCompletedError').show();
						} else {
							$('.purchaseDetails').hide();
							$('form').hide();
							$('.selectPricingPlans').hide();
							$('.orderCompleted').show();
						}
					});
				}
				else if ($('.selectedPricingPlan').attr('cdppid') == undefined){
					alert('Pick a pricing plan!');
				}
				
			});			
		break;
		case "giveKnownGift.html":
			retrieveAvailableProductsForCountry('','UKHorizon',true);
			$("#CreditCardNumber").inputmask("mask", {
				"mask" : "9999 9999 9999 9999"
			});
			$(document).on('click', '#Submit', function(event) {
				event.preventDefault();
				if ($('.selectedPricingPlan').attr('cdppid') != undefined) {			
					var inputObject = $('form').serializeArray();
					var name = inputObject[0].value;
					var email = inputObject[1].value;
					var swid = inputObject[2].value;
					var address = inputObject[3].value;
					var city = inputObject[4].value;
					var country = inputObject[5].value;
					var creditCardNumber = inputObject[6].value;
					creditCardNumber = creditCardNumber.replace(/ /g, '');
					var cvv = inputObject[7].value;
					var month = inputObject[8].value;
					var year = inputObject[9].value;
					var recipientName = inputObject[10].value;
					var recipientEmail = inputObject[11].value;
					var sessionId = '';
					var pricingPlanId = $('.selectedPricingPlan').attr('cdppid');
					var productId = $('.selectedPricingPlan').attr('cdid');
					$.when(service.createSessionWithUpdate(swid, email, 'Gift')).then(function(createSessionOutput) {
						var result = JSON.parse(createSessionOutput);
						sessionId = result.SessionId;
						return service.submitGiftOrder(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, productId, pricingPlanId, recipientEmail, recipientName, email, name);
					}).then(function(submitGiftOrderOutput) {
						var result = submitGiftOrderOutput;
						if (result.Fault != undefined && result.Fault != 'undefined') {
							$('.purchaseDetails').hide();
							$('form').hide();
							$('.selectPricingPlans').hide();
							$('.orderCompletedError').text(result.Fault.Message);
							$('.orderCompletedError').show();
						} else {
							$('.purchaseDetails').hide();
							$('form').hide();
							$('.selectPricingPlans').hide();
							$('.orderCompleted').show();
						}
					});
				}
				else if ($('.selectedPricingPlan').attr('cdppid') == undefined){
					alert('Pick a pricing plan!');
				}
				
			});			
		break;
		case "redeemGift.html":					
			$("#CreditCardNumber").inputmask("mask", {
				"mask" : "9999 9999 9999 9999"
			});
			//specifying fn & options
			$(document).on('click', '.form-subtitle', function(event) {
				if ($('.validate').length == 0) {
					$('.btn-primary').toggleClass('validate');
					$('.form-group-coupon').animate({
						opacity : 1
					});
					$('.form-subtitle span').animate({
						opacity : 0
					}, function() {
						$(this).text("- Remove Coupon").animate({
							opacity : 1
						});
					});
					$('.btn-primary span').animate({
						opacity : 0
					}, function() {
						$(this).text("Validate Coupon").animate({
							opacity : 1
						});
					});
				} else {
					$('.error').animate({
						opacity : 0
					});
					$('.btn-primary').toggleClass('validate');
					$('.form-group-coupon').animate({
						opacity : 0
					});
					$('.form-subtitle span').animate({
						opacity : 0
					}, function() {
						$(this).text("+ Coupon").animate({
							opacity : 1
						});
					});
					$('.btn-primary span').animate({
						opacity : 0
					}, function() {
						$(this).text("Check Out!").animate({
							opacity : 1
						});
					});
				}
			});
			$(document).on('click', '#Submit', function(event) {
				event.preventDefault();
				if ($('#RedemptionCode').val() != '') {
					var inputObject = $('form').serializeArray();
					var name = inputObject[0].value;
					var email = inputObject[1].value;
					var swid = inputObject[2].value;
					var address = inputObject[3].value;
					var city = inputObject[4].value;
					var country = inputObject[5].value;
					var creditCardNumber = inputObject[6].value;
					creditCardNumber = creditCardNumber.replace(/ /g, '');
					var cvv = inputObject[7].value;
					var month = inputObject[8].value;
					var year = inputObject[9].value;
					var couponCode = inputObject[10].value;
					var sessionId = '';
					$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
						result = JSON.parse(createSessionOutput);
						sessionId = result.SessionId;
						return service.previewGiftRedemptionOrder(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, couponCode);
					}).then( function(previewGiftRedemptionOrderOutput) {
						var result = previewGiftRedemptionOrderOutput;
						console.log(result);
						if(result.Fault != undefined && result.Fault != 'undefined'){
							$('.purchaseDetails').hide();
							$('form').hide();
							$('.orderCompletedError').text(result.Fault.Message);
							$('.orderCompletedError').show();
							$('.selectPricingPlans').hide();
							$('.pricingPlanSelect').hide();
						}
						else {
							var productId = result.Subscriptions[0].Items[0].Product.Id;
							return service.retrieveProductContextWithProductIdAndSession(sessionId,productId);
						}
					}).then( function(rPCWPIASOutput){
						var result = rPCWPIASOutput;
						if(result.ProductContext.OrderablePricingPlans != undefined){
							console.log('Eligible!');
							//$.when(service.submitGiftRedemptionOrder(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, couponCode)).then(function(submitGiftRedemptionOrderOutput){
							$.when(service.submitGiftRedemptionOrderWithExisting(sessionId, couponCode)).then(function(submitGiftRedemptionOrderOutput){
								var result = submitGiftRedemptionOrderOutput;
								console.log(result);
								$('.purchaseDetails').hide();
								$('form').hide();
								$('.selectPricingPlans').hide();
								$('.orderCompleted').show();
							});
						}
						else {
							$('.purchaseDetails').hide();
							$('form').hide();
							$('.orderCompletedError').text('You can not redeem this gift. Sorry!');
							$('.orderCompletedError').show();
							$('.selectPricingPlans').hide();
							$('.pricingPlanSelect').hide();
						}
					});
				}
				else if ($('#RedemptionCode').val() == ''){
					alert('Enter a gift code!');
				}
			});
			
		break;
		case "accountManagement.html":
			$(document).on('click', '#Submit', function(event) {
				event.preventDefault();
				var inputObject = $('form').serializeArray();
				var email = inputObject[0].value;
				var swid = inputObject[1].value;
				var sessionId = '';
				$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
					var result = JSON.parse(createSessionOutput);
					sessionId = result.SessionId;
					retrievePaymentProfilesWithSession(sessionId);
					retrieveActiveSubscriptionsWithSession(sessionId);
				});
			});		
			$(document).on('click', '.currentSubscriptionRenewalToggle', function(){
				var inputObject = $('form').serializeArray();
				var email = inputObject[0].value;
				var swid = inputObject[1].value;
				var sessionId = '';
				var subscriptionId = $('.currentSubscription div').attr('SubscriptionId');
				if($('.currentSubscription div').attr('autorenew') === "false"){					
					$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
						var result = JSON.parse(createSessionOutput);
						sessionId = result.SessionId;
						service.toggleOnAutorenewal(sessionId,subscriptionId);					
					}).then(function(toggleAutorenewOutput){
						//console.log(toggleAutorenewOutput);
						retrieveActiveSubscriptionsWithSession(sessionId);
					});
				}
				else {
					$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
						var result = JSON.parse(createSessionOutput);
						sessionId = result.SessionId;
						service.toggleOffAutorenewal(sessionId,subscriptionId);					
					}).then(function(toggleAutorenewOutput){
						//console.log(toggleAutorenewOutput);
						retrieveActiveSubscriptionsWithSession(sessionId);
					});
				}
			});
			$(document).on('click', '.cancelSubscription', function(){
				var inputObject = $('form').serializeArray();
				var email = inputObject[0].value;
				var swid = inputObject[1].value;
				var sessionId = '';
				var subscriptionId = $('.currentSubscription div').attr('SubscriptionId');
				$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
					var result = JSON.parse(createSessionOutput);
					sessionId = result.SessionId;
					service.submitRemoveOrder(sessionId,subscriptionId);					
				}).then(function(removeOutput){
					console.log(removeOutput);
					retrieveActiveSubscriptionsWithSession(sessionId);
				});
				
			});
		break;
		// Toggle auto renew on
		case "toggle.html":				
			$(document).on('click', '.submitFile', function() {
				var file = $('#toggle')[0].files[0];
				var reader = new FileReader();
				reader.readAsText(file);
				reader.onload = function(event) {
					var csv = event.target.result;
					var allTextLines = csv.split(/\r\n|\n/);
					var lines = [];
					for (var i = 0; i < allTextLines.length; i++) {
						var data = allTextLines[i].split(';');
						var tarr = [];
						for (var j = 0; j < data.length; j++) {
							tarr.push(data[j]);
						}
						lines.push(tarr);
					}
					console.log(lines);
					for (var i = 1; i < lines.length - 1; i++) {
						var current = lines[i][0].split(',');
						var subscriptionId = current[0];
						php.toggleOnAutorenewal(subscriptionId);
					}
				};
			});
		break;
		case "purchase.html":				
			$(document).on('click', '.submitFile', function() {
				var file = $('#purchase')[0].files[0];
				var reader = new FileReader();
				reader.readAsText(file);
				reader.onload = function(event) {
					var csv = event.target.result;
					var allTextLines = csv.split(/\r\n|\n/);
					var lines = [];
					for (var i = 0; i < allTextLines.length; i++) {
						var data = allTextLines[i].split(';');
						var tarr = [];
						for (var j = 0; j < data.length; j++) {
							tarr.push(data[j]);
						}
						lines.push(tarr);
					}
					console.log(lines);
					for (var i = 1; i < lines.length - 1; i++) {
						var current = lines[i][0].split(',');
						var swid = current[0];
						php.submitCSROrderWithSubscriberId(188925,25386,swid);
					}
				};
			});
		break;
		case "createAccount.html":				
			$(document).on('click', '.submitJSON', function() {
				var JSONObject = JSON.parse($('#JSON').val());
			});
		break;
	}
});
retrieveAvailableProducts = function(sessionId) {
	var availablePricingPlanObject = {"PricingPlans":[]};
	var pricingTemplate = '<li cdppid="{Id}" cdid="{Pid}">{Iteration} {Unit} - {Charge}</li>';
	var html = '';
	if(sessionId != ''){
		$.when(service.retrieveProductContextWithSession(sessionId)).then(function(retrieveProductContextOutput) {
			var orderablePricingPlans = retrieveProductContextOutput.ProductContext.OrderablePricingPlans;
			for(var i = 0; i < orderablePricingPlans.length; i++) {
				availablePricingPlanObject.PricingPlans.push({"Id":orderablePricingPlans[i].Id});
			}
			return service.retrieveProduct();
		}).then(function(retrieveProductOutput) {
			var allPricingPlanObject = retrieveProductOutput.Product.PricingPlans;
			for(var j = 0; j < availablePricingPlanObject.PricingPlans.length; j++){
				var currentObject = availablePricingPlanObject.PricingPlans[j];
				var currentPricingPlan = currentObject.Id;
				for(var k = 0; k < allPricingPlanObject.length; k++) {			
					// Iterate through all configured pricing plans to retrieve relevant metadata AND remove gift products
					if(currentPricingPlan == allPricingPlanObject[k].Id && allPricingPlanObject[k].Giftable === false){
						currentObject.Unit = allPricingPlanObject[k].ExternalReferences[3].Value;
						currentObject.Iteration = allPricingPlanObject[k].ExternalReferences[2].Value;			
						currentObject.Currency = allPricingPlanObject[k].Currency;
						if (allPricingPlanObject[k].ExternalReferences[0].Value=="true"){
							currentObject.Charge = '10';
						}
						else {
						currentObject.Charge = allPricingPlanObject[k].ExternalReferences[0].Value;
						}
					}
				}
			}		
		}).done(function(){
			for(var l = 0; l < availablePricingPlanObject.PricingPlans.length;l++){
				var current = availablePricingPlanObject.PricingPlans[l];
				var tempHtml = pricingTemplate;
				// Only add template if charge is available
				if(typeof current.Charge != 'undefined'){
					tempHtml = tempHtml.replace('{Id}',current.Id);		
					tempHtml = tempHtml.replace('{Iteration}',current.Iteration);		
					if(current.Unit == "monthly"){
						tempHtml = tempHtml.replace('{Unit}','Month');
					}
					tempHtml = tempHtml.replace('{Charge}',current.Charge);
					html += tempHtml;
				}
			}
			$('.selectPricingPlans').append(html);
			$(document).on('click','.selectPricingPlans li',function(){
				$('.selectPricingPlans li').removeClass('selectedPricingPlan');
				$(this).addClass('selectedPricingPlan');
			});
		});
	}
	else {
		$.when(service.retrieveProductContext()).then(function(retrieveProductContextOutput) {
			var orderablePricingPlans = retrieveProductContextOutput.ProductContext.OrderablePricingPlans;
			for(var i = 0; i < orderablePricingPlans.length; i++) {
				availablePricingPlanObject.PricingPlans.push({"Id":orderablePricingPlans[i].Id});
			}
			return service.retrieveProduct();
		}).then(function(retrieveProductOutput) {
			var allPricingPlanObject = retrieveProductOutput.Product.PricingPlans;
			for(var j = 0; j < availablePricingPlanObject.PricingPlans.length; j++){
				var currentObject = availablePricingPlanObject.PricingPlans[j];
				var currentPricingPlan = currentObject.Id;
				for(var k = 0; k < allPricingPlanObject.length; k++) {			
					// Iterate through all configured pricing plans to retrieve relevant metadata AND remove gift products
					if(currentPricingPlan == allPricingPlanObject[k].Id && allPricingPlanObject[k].Giftable === false){
						currentObject.Unit = allPricingPlanObject[k].ExternalReferences[3].Value;
						currentObject.Iteration = allPricingPlanObject[k].ExternalReferences[2].Value;			
						currentObject.Currency = allPricingPlanObject[k].Currency;
						currentObject.Charge = allPricingPlanObject[k].ExternalReferences[0].Value;
					}
				}
			}		
		}).done(function(){
			console.log(availablePricingPlanObject);
			for(var l = 0; l < availablePricingPlanObject.PricingPlans.length;l++){
				var current = availablePricingPlanObject.PricingPlans[l];
				var tempHtml = pricingTemplate;
				// Only add template if charge is available
				if(typeof current.Charge != 'undefined'){
					tempHtml = tempHtml.replace('{Id}',current.Id);		
					tempHtml = tempHtml.replace('{Iteration}',current.Iteration);		
					if(current.Unit == "monthly"){
						tempHtml = tempHtml.replace('{Unit}','Month');
					}
					tempHtml = tempHtml.replace('{Charge}',current.Charge);
					html += tempHtml;
				}			
			}
			$('.selectPricingPlans').append(html);
			$('.selectPricingPlans').show();
			$(document).on('click','.selectPricingPlans li',function(){
				$('.selectPricingPlans li').removeClass('selectedPricingPlan');
				$(this).addClass('selectedPricingPlan');
			});
		});
	}
	
};
retrieveAvailableProductsForCountry = function(sessionId, productExternalReference, isGift ) {
	var availablePricingPlanObject = {"PricingPlans":[]};
	var pricingTemplate = '<li cdppid="{Id}" cdid="{Pid}">{Iteration} {Unit} - {Charge}</li>';
	var html = '';
	if(sessionId != ''){
		$.when(service.retrieveProductContextWithSession(sessionId, productExternalReference)).then(function(retrieveProductContextOutput) {
			// Retrieve Product Context Based On Session Info
			console.log(retrieveProductContextOutput);
			if(retrieveProductContextOutput.Fault == undefined) {
				var orderablePricingPlans = retrieveProductContextOutput.ProductContext.OrderablePricingPlans;
				for(var i = 0; i < orderablePricingPlans.length; i++) {
					availablePricingPlanObject.PricingPlans.push({"Id":orderablePricingPlans[i].Id});
				}
				return service.retrieveProductWithExternalReference(productExternalReference);
			}
			else {
				alert('Liar liar!');
			}
		}).then(function(retrieveProductOutput) {
			// Retrieve All Pricing Plans
			var allPricingPlanObject = retrieveProductOutput.Product.PricingPlans;
			for(var j = 0; j < availablePricingPlanObject.PricingPlans.length; j++){
				var currentObject = availablePricingPlanObject.PricingPlans[j];
				var currentPricingPlan = currentObject.Id;
				for(var k = 0; k < allPricingPlanObject.length; k++) {			
					// Iterate through all configured pricing plans to retrieve relevant metadata AND filter based on gift flag
					if(currentPricingPlan == allPricingPlanObject[k].Id && allPricingPlanObject[k].Giftable === isGift){
						currentObject.Pid = retrieveProductOutput.Product.Id;
						currentObject.Unit = allPricingPlanObject[k].ExternalReferences[2].Value;
						currentObject.Iteration = allPricingPlanObject[k].ExternalReferences[1].Value;			
						currentObject.Currency = allPricingPlanObject[k].Currency;
						currentObject.Charge = allPricingPlanObject[k].ExternalReferences[0].Value;
					}
				}
			}		
		}).done(function(){
			for(var l = 0; l < availablePricingPlanObject.PricingPlans.length;l++){
				var current = availablePricingPlanObject.PricingPlans[l];
				var tempHtml = pricingTemplate;
				// Only add template if charge is available
				if(typeof current.Charge != 'undefined'){
					tempHtml = tempHtml.replace('{Id}',current.Id);		
					tempHtml = tempHtml.replace('{Pid}',current.Pid);	
					tempHtml = tempHtml.replace('{Iteration}',current.Iteration);		
					if(current.Unit == "monthly"){
						tempHtml = tempHtml.replace('{Unit}','Month');
					}
					tempHtml = tempHtml.replace('{Charge}',current.Charge);
					html += tempHtml;
				}	
			}
			$('.selectPricingPlans').append(html);
			$('.selectPricingPlans').show();
			$('#Submit').show();
			$(document).on('click','.selectPricingPlans li',function(){
				$('.selectPricingPlans li').removeClass('selectedPricingPlan');
				$(this).addClass('selectedPricingPlan');
			});
			$('form').show();
		});
	}
	else {
		$.when(service.retrieveProductContext(productExternalReference)).then(function(retrieveProductContextOutput) {
			// Retrieve Product Context Based On Session Info
			if(retrieveProductContextOutput.Fault == undefined) {
				var orderablePricingPlans = retrieveProductContextOutput.ProductContext.OrderablePricingPlans;
				for(var i = 0; i < orderablePricingPlans.length; i++) {
					availablePricingPlanObject.PricingPlans.push({"Id":orderablePricingPlans[i].Id});
				}
				return service.retrieveProductWithExternalReference(productExternalReference);
			}
			else {
				alert('Liar liar!');
			}
		}).then(function(retrieveProductOutput) {
			// Retrieve All Pricing Plans
			var allPricingPlanObject = retrieveProductOutput.Product.PricingPlans;
			for(var j = 0; j < availablePricingPlanObject.PricingPlans.length; j++){
				var currentObject = availablePricingPlanObject.PricingPlans[j];
				var currentPricingPlan = currentObject.Id;
				for(var k = 0; k < allPricingPlanObject.length; k++) {			
					// Iterate through all configured pricing plans to retrieve relevant metadata AND filter based on gift flag
					if(currentPricingPlan == allPricingPlanObject[k].Id && allPricingPlanObject[k].Giftable === isGift){
						currentObject.Pid = retrieveProductOutput.Product.Id;
						currentObject.Unit = allPricingPlanObject[k].ExternalReferences[2].Value;
						currentObject.Iteration = allPricingPlanObject[k].ExternalReferences[1].Value;			
						currentObject.Currency = allPricingPlanObject[k].Currency;
						currentObject.Charge = allPricingPlanObject[k].ExternalReferences[0].Value;
					}
				}
			}		
		}).done(function(){
			console.log(availablePricingPlanObject);
			for(var l = 0; l < availablePricingPlanObject.PricingPlans.length;l++){
				var current = availablePricingPlanObject.PricingPlans[l];
				var tempHtml = pricingTemplate;
				// Only add template if charge is available
				if(typeof current.Charge != 'undefined'){
					tempHtml = tempHtml.replace('{Id}',current.Id);		
					tempHtml = tempHtml.replace('{Pid}',current.Pid);	
					tempHtml = tempHtml.replace('{Iteration}',current.Iteration);		
					if(current.Unit == "monthly"){
						tempHtml = tempHtml.replace('{Unit}','Month');
					}
					tempHtml = tempHtml.replace('{Charge}',current.Charge);
					html += tempHtml;
				}	
			}
			$('.selectPricingPlans').append(html);
			$('.selectPricingPlans').show();
			$('#Submit').show();
			console.log(html);
			$(document).on('click','.selectPricingPlans li',function(){
				$('.selectPricingPlans li').removeClass('selectedPricingPlan');
				$(this).addClass('selectedPricingPlan');
			});
			$('form').show();
		});
	}
};
retrieveAvailableProductsForCountryWithSubscriberId = function(subscriberId, productExternalReference ) {
	var availablePricingPlanObject = {"PricingPlans":[]};
	var pricingTemplate = '<li cdppid="{Id}" cdid="{Pid}">{Iteration} {Unit} - {Charge}</li>';
	var html = '';
	var productExternalReference = productExternalReference;
		$.when(service.retrieveProductContextWithSubscriberId(subscriberId, productExternalReference)).then(function(retrieveProductContextOutput) {
			// Retrieve Product Context Based On Session Info
			if(retrieveProductContextOutput.Fault == undefined) {
				var orderablePricingPlans = retrieveProductContextOutput.ProductContext.OrderablePricingPlans;
				for(var i = 0; i < orderablePricingPlans.length; i++) {
					availablePricingPlanObject.PricingPlans.push({"Id":orderablePricingPlans[i].Id});
				}
				return service.retrieveProductWithExternalReference(productExternalReference);
			}
			else {
				alert('Liar liar!');
			}
		}).then(function(retrieveProductOutput) {
			// Retrieve All Pricing Plans
			var allPricingPlanObject = retrieveProductOutput.Product.PricingPlans;
			for(var j = 0; j < availablePricingPlanObject.PricingPlans.length; j++){
				var currentObject = availablePricingPlanObject.PricingPlans[j];
				var currentPricingPlan = currentObject.Id;
				for(var k = 0; k < allPricingPlanObject.length; k++) {			
					// Iterate through all configured pricing plans to retrieve relevant metadata AND remove gift products
					if(currentPricingPlan == allPricingPlanObject[k].Id && allPricingPlanObject[k].Giftable === false){
						currentObject.Pid = retrieveProductOutput.Product.Id;
						currentObject.Unit = allPricingPlanObject[k].ExternalReferences[2].Value;
						currentObject.Iteration = allPricingPlanObject[k].ExternalReferences[1].Value;			
						currentObject.Currency = allPricingPlanObject[k].Currency;
						currentObject.Charge = allPricingPlanObject[k].ExternalReferences[0].Value;
					}
				}
			}		
		}).done(function(){
			console.log(availablePricingPlanObject);
			for(var l = 0; l < availablePricingPlanObject.PricingPlans.length;l++){
				var current = availablePricingPlanObject.PricingPlans[l];
				var tempHtml = pricingTemplate;
				// Only add template if charge is available
				if(typeof current.Charge != 'undefined'){
					tempHtml = tempHtml.replace('{Id}',current.Id);		
					tempHtml = tempHtml.replace('{Pid}',current.Pid);	
					tempHtml = tempHtml.replace('{Iteration}',current.Iteration);		
					if(current.Unit == "monthly"){
						tempHtml = tempHtml.replace('{Unit}','Month');
					}
					tempHtml = tempHtml.replace('{Charge}',current.Charge);
					html += tempHtml;
				}	
			}
			$('.selectPricingPlans').append(html);
			$('.selectPricingPlans').show();
			$('#Submit').show();
			console.log(html);
			$(document).on('click','.selectPricingPlans li',function(){
				$('.selectPricingPlans li').removeClass('selectedPricingPlan');
				$(this).addClass('selectedPricingPlan');
			});
		});
	
};
retrieveActiveSubscriptions = function(swid,email) {
	var sessionId = '';
	var subscriptionPlan = '';
	var subscriptionId = '';
	$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
		var result = JSON.parse(createSessionOutput);
		sessionId = result.SessionId;
		return service.searchSubscriptions(sessionId);
	}).then(function(searchSubscriptionsOutput) {
		console.log(searchSubscriptionsOutput);
		if(searchSubscriptionsOutput.Subscriptions!= undefined){
			for(i = 0; i < searchSubscriptionsOutput.Subscriptions.length; i++) {
				var _this = searchSubscriptionsOutput.Subscriptions[i];
				subscriptionId = _this.Id;
				if (_this.Status = 1 && _this.Items[0].ChangePricingPlan != undefined){			
					subscriptionPlan = _this.Items[0].ChangePricingPlan.Id;
				}
				else {
					subscriptionPlan = _this.Items[0].PricingPlan.Id;
				}
			}
			$('li[cppid="' + subscriptionPlan +'"]').addClass('selectedPricingPlan');
			$.when(service.retrieveSubscription(sessionId,subscriptionId)).then(function(retrieveSubscriptionOutput){
				console.log(retrieveSubscriptionOutput);
			});
		}
		else {
			console.log('No Active Subscriptions!');
		}
		
	});
};
retrieveActiveSubscriptionsWithSession = function(sessionId) {
	var subscriptionPlan = '';
	var subscriptionId = '';
	var template = '<div subscriptionId="{SubscriptionId}" autorenew="{Autorenew}" cdppid="{Id}" cdid="{Pid}">{Iteration} {Unit} - {Charge}. {AutomaticRenewal}</div>';
	var html = '';
	$.when(service.searchSubscriptions(sessionId)).then(function(searchSubscriptionsOutput) {
		console.log(searchSubscriptionsOutput);
		// If there's an active subscription'
		if(searchSubscriptionsOutput.Subscriptions!= undefined){
			for(i = 0; i < searchSubscriptionsOutput.Subscriptions.length; i++) {
				var _this = searchSubscriptionsOutput.Subscriptions[i];
				subscriptionId = _this.Id;
				if (_this.Status = 1 && _this.Items[0].ChangePricingPlan != undefined){			
					subscriptionPlan = _this.Items[0].ChangePricingPlan.Id;
				}
				else {
					subscriptionPlan = _this.Items[0].PricingPlan.Id;
				}
			}
			$.when(service.retrieveSubscription(sessionId,subscriptionId)).then(function(retrieveSubscriptionOutput){
				//$('li[cdppid="' + subscriptionPlan +'"]').addClass('selectedPricingPlan');
				console.log(retrieveSubscriptionOutput);
				var current = retrieveSubscriptionOutput.Subscription;
				var tempHtml = template;
				tempHtml = tempHtml.replace('{Id}',current.Items[0].PricingPlan.Id);		
				tempHtml = tempHtml.replace('{Pid}',current.Items[0].Id);	
				tempHtml = tempHtml.replace('{SubscriptionId}',current.Id);	
				tempHtml = tempHtml.replace('{Iteration}',current.Items[0].PricingPlan.SubscriptionBillingCycleIterations);		
				//if(current.PricingPlan.Unit == "monthly"){
				//	tempHtml = tempHtml.replace('{Unit}','Month');
				//}
				tempHtml = tempHtml.replace('{Unit}',current.Items[0].PricingPlan.SubscriptionBillingCycleName);
				tempHtml = tempHtml.replace('{Charge}',current.RenewAmount);
				if(current.Renew == true) {
					tempHtml = tempHtml.replace('{AutomaticRenewal}',' [Automatic Renewal]');
					tempHtml = tempHtml.replace('{Autorenew}','true');
				}
				else {
					tempHtml = tempHtml.replace('{AutomaticRenewal}','');
					tempHtml = tempHtml.replace('{Autorenew}','false');
				}
				$('.currentSubscription').empty();
				$('.currentSubscription').append(tempHtml);
				if(current.Items[0].ChangePricingPlan != undefined){
					$('.newSubscriptionHeader').show();
					$('.newSubscription').show();
					var tempHtml = template;
					tempHtml = tempHtml.replace('{Id}',current.Items[0].ChangePricingPlan.Id);		
					tempHtml = tempHtml.replace('{Iteration}',current.Items[0].ChangePricingPlan.SubscriptionBillingCycleIterations);		
					//if(current.PricingPlan.Unit == "monthly"){
					//	tempHtml = tempHtml.replace('{Unit}','Month');
					//}
					tempHtml = tempHtml.replace('{Unit}',current.Items[0].ChangePricingPlan.SubscriptionBillingCycleName);
					tempHtml = tempHtml.replace('{Charge}',current.Items[0].ChangePricingPlan.RenewalChargeAmount);
					tempHtml = tempHtml.replace('{AutomaticRenewal}','');
					$('.newSubscription').append(tempHtml);
				}
				
				$('.subscription').show();
				$('form').hide();
			});
		}
		// No active subscriptions
		else {
			$('.subscription').show();
			$('.currentSubscription').empty();
			$('.currentSubscription').append('<div>No Active Subscriptions</div>');
			console.log('No Active Subscriptions.');
			retrieveAvailableProductsForCountry(sessionId,'UKHorizon');
			//retrieveAvailableProductsForCountry(sessionId,'UKHorizon');
			//retrieveAvailableProductsForCountry('','UKHorizon');
		}
		
	});
};
retrievePaymentProfiles = function(swid, email) {
	var availablePaymentInstrumentObject = {"PaymentInstruments":[]},
			availablePaymentInstrumentDeferredArray = [];
			sessionId = "";
	$.when(service.createSession(swid, email)).then(function(createSessionOutput) {
		var result = JSON.parse(createSessionOutput);
		sessionId = result.SessionId;
		return service.retrieveWallet(sessionId);
	}).then(function(retrieveWalletOutput) {
		console.log(retrieveWalletOutput);
		for(var i = 0; i < retrieveWalletOutput.PaymentInstruments.length; i++){
			var currentPaymentInstrumentId = retrieveWalletOutput.PaymentInstruments[i].Id;
			availablePaymentInstrumentDeferredArray.push(addPaymentInstrument(sessionId, currentPaymentInstrumentId));
		}
		$.when.apply($, availablePaymentInstrumentDeferredArray).then(function(){
			console.log(availablePaymentInstrumentObject);
		}); 
		
	});
};
// Put somewhere in your scripting environment
if (jQuery.when.all===undefined) {
    jQuery.when.all = function(deferreds) {
        var deferred = new jQuery.Deferred();
        $.when.apply(jQuery, deferreds).then(
            function() {
                deferred.resolve(Array.prototype.slice.call(arguments));
            },
            function() {
                deferred.fail(Array.prototype.slice.call(arguments));
            });

        return deferred;
    };
};
retrievePaymentProfilesWithSession = function(sessionId) {
	var availablePaymentInstrumentObject = {"PaymentInstruments":[]};
	var	availablePaymentInstrumentDeferredArray = [];
	var html = '';
	var template = 
		'<li class="creditCardListEntry" cdid="{paymentId}">' +
			'<div class="creditCardListEntryHeader clearfix">' +
				'Visa - {cardNumber} : Expires {expirationMonth}/{expirationYear}' +
			'</div>' +
			'<div class="creditCardListEntryDetails clearfix">' +
				'<ul class="creditCardListEntryDetailsAddress">' +
					'<li class="creditCardListEntryDetailsAddressName">{addressName}</li>' +
					'<li class="creditCardListEntryDetailsAddressStreet">{cardStreet}</li>' +
					'<li class="creditCardListEntryDetailsAddressCity">{cardCity}</li>' +
				'</ul>' +
				'<ul class="creditCardListEntryDetailsAction">' +
					'<li class="creditCardListEntryDetailsAction">Make Default</li>' +
					'<li class="creditCardListEntryDetailsAction">Edit</li>' +
					'<li class="creditCardListEntryDetailsActionDelete">Delete</li>' +
				'</ul>' +
			'</div>' +
		'</li>'; 
	$.when(service.retrieveWallet(sessionId)).then(function(retrieveWalletOutput) {
		console.log(retrieveWalletOutput);
		for(var i = 0; i < retrieveWalletOutput.PaymentInstruments.length; i++){
			var currentPaymentInstrumentId = retrieveWalletOutput.PaymentInstruments[i].Id;
			availablePaymentInstrumentDeferredArray.push(service.retrievePaymentInstrument(sessionId, currentPaymentInstrumentId));
		}
		$.when.apply($, availablePaymentInstrumentDeferredArray).then(function(){
			for(var i = 0; i < arguments.length; i++){
				if(arguments[i].PaymentInstrument != undefined){
					console.log(arguments[i].PaymentInstrument);
					var current = arguments[i].PaymentInstrument;
					var tempHtml = template;
					tempHtml = tempHtml.replace('{paymentId}',current.Id);	
					tempHtml = tempHtml.replace('{cardNumber}',current.CreditCard.AccountNumber.slice(-4));		
					tempHtml = tempHtml.replace('{expirationMonth}',current.CreditCard.ExpirationMonth);		
					tempHtml = tempHtml.replace('{expirationYear}',current.CreditCard.ExpirationYear);			
					tempHtml = tempHtml.replace('{addressName}',current.BillingAddress.ShipToName);			
					tempHtml = tempHtml.replace('{cardStreet}',current.BillingAddress.LineOne);		
					tempHtml = tempHtml.replace('{cardCity}',current.BillingAddress.City + ' ' + current.BillingAddress.State + ' ' + current.BillingAddress.PostalCode);						
					html += tempHtml;
					if(current.Unit == "monthly"){
						tempHtml = tempHtml.replace('{Unit}','Month');
					}
				}
				else if(typeof arguments[i] == "object" && arguments[i][0] != undefined){
					console.log(arguments[i][0].PaymentInstrument);
					var current = arguments[i][0].PaymentInstrument;
					var tempHtml = template;
					tempHtml = tempHtml.replace('{paymentId}',current.Id);
					tempHtml = tempHtml.replace('{cardNumber}',current.CreditCard.AccountNumber.slice(-4));		
					tempHtml = tempHtml.replace('{expirationMonth}',current.CreditCard.ExpirationMonth);		
					tempHtml = tempHtml.replace('{expirationYear}',current.CreditCard.ExpirationYear);			
					tempHtml = tempHtml.replace('{addressName}',current.BillingAddress.ShipToName);			
					tempHtml = tempHtml.replace('{cardStreet}',current.BillingAddress.LineOne);		
					tempHtml = tempHtml.replace('{cardCity}',current.BillingAddress.City + ' ' + current.BillingAddress.State + ' ' + current.BillingAddress.PostalCode);						
					html += tempHtml;
					if(current.Unit == "monthly"){
						tempHtml = tempHtml.replace('{Unit}','Month');
					}
				}
				
			}
			$('.creditCardList').append(html);
			$('form').hide();
			$('.creditCards').show();
		}); 
		
	});
	
	$(document).on('click','creditCardListEntryDetailsActionDelete',function(){
		
	});
};

var api = new function () {
	var subscriberEndpoint = 'https://services.sbx1.cdops.net/Subscriber/',
	subscriberManagementEndpoint = 'https://services.sbx1.cdops.net/SubscriberManagement/',
	metadataEndpoint = 'https://metadata.sbx1.cdops.net/',
	catalogEndpoint = 'https://services.sbx1.cdops.net/Catalog/',
	systemId = '02c62e64-6528-49e1-8800-8b52a97274a6',
	channelId = 'e777708b-f758-4d91-aaec-170755b9ed7e',
	catalogLogin = 'horizon.catalog@disney.com',
	catalogPassword = 'H0rizon!',
	retrieveProductWithExternalReference = function(productExternalReference){
		$.ajax({ url: metadataEndpoint + "/Product/systemId/" + systemId + "/distributionchannel/" + channelId + "/devicetype/4/ProductExternalReferenceType/CSGSubscriptionProduct/ProductExternalReference/" + productExternalReference,
		 	type: 'post',
			success: function(output) {
					console.log(output);
			},
			error: function(output) {
			}
		});  
	},
	retrieveProductContext = function(productExternalReference){
		jsonRequest = '{"IncludeEntitlementContext":1,"IncludeOrderablePricingPlans":1,"ProductExternalReference":"' + productExternalReference +'","ProductExternalReferenceType":"CSGSubscriptionProduct"}';
		$.ajax({ url: subscriberEndpoint + "RetrieveProductContext",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
			},
			type: 'post',
			success: function(output) {
				console.log(output);
			},
			error: function(output) {
			}
		});
	},
	retrieveProductContextWithDiscount = function(sessionId, couponCode){
		jsonRequest = '{"IncludeEntitlementContext":1,"IncludeOrderablePricingPlans":1,"ProductExternalReference":"UKHorizonSubscription","ProductExternalReferenceType":"CSGSubscriptionProduct","RedemptionCodes":["'+couponCode+'"]}';
		$.ajax({ url: subscriberEndpoint + "RetrieveProductContext",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
			},
			error: function(output) {
			}
		});
	},
	retrieveProductContextWithSession = function(sessionId, productExternalReference ){
		jsonRequest = '{"IncludeEntitlementContext":1,"IncludeOrderablePricingPlans":1,"ProductExternalReference":"' + productExternalReference  +'","ProductExternalReferenceType":"CSGSubscriptionProduct"}';
		$.ajax({ url: subscriberEndpoint + "RetrieveProductContext",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	retrieveProductContextWithProductIdAndSession = function(sessionId, productId ){
		jsonRequest = '{"IncludeEntitlementContext":1,"IncludeOrderablePricingPlans":1,"ProductId":"' + productId  +'"}';
		$.ajax({ url: subscriberEndpoint + "RetrieveProductContext",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	retrieveProductContextWithSubscriberId = function(subscriberId, productExternalReference ){
		jsonRequest = '{"IncludeEntitlementContext":1,"IncludeOrderablePricingPlans":1,"ProductExternalReference":"' + productExternalReference  +'","ProductExternalReferenceType":"CSGSubscriptionProduct"}';
		$.ajax({ url: subscriberEndpoint + "RetrieveProductContext",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SubscriberId" :  subscriberId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
			},
			error: function(output) {
				console.log(output);
			}
		});
	},
	retrieveProductContextWithSubscriberId = function(subscriberId){
		jsonRequest = '{"IncludeEntitlementContext":1,"IncludeOrderablePricingPlans":1,"ProductExternalReference":"' + productExternalReference  +'","ProductExternalReferenceType":"CSGSubscriptionProduct"}';
		$.ajax({ url: subscriberEndpoint + "RetrieveProductContext",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SubscriberId" :  subscriberId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
			},
			error: function(output) {
				console.log(output);
			}
		});
	},
	retrieveProduct = function(){
		$.ajax({ 
			url: metadataEndpoint + "Product/systemId/" + systemId + "/distributionchannel/" + channelId + "/devicetype/4/Id/188270/",
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});  
	},
	createSession = function(swid, email) {
		jsonRequest = '';
		$.ajax({ url: "PHP/functions.php",
		data: {action: 'createSession', swid: swid, email: email, login: swid, fName: swid, lName: swid, device: 16},
		type: 'post',
		success: function(output) {
			var result = JSON.parse(output);
			var sessionId = result.SessionId;
			console.log(result);
			return result;
		},
		error: function(output) {
			var result = JSON.parse(output);
			console.log(result);
		}
		});
	},
	createSessionWithToken = function(swid, email) {
		jsonRequest = '';
		$.ajax({ url: "PHP/functions.php",
		data: {action: 'createSessionWithToken', swid: swid, email: email, login: swid, fName: swid, lName: swid, device: 16},
		type: 'post',
		success: function(output) {
			var result = JSON.parse(output);
			var sessionId = result.SessionId;
			console.log(result);
			return result;
		},
		error: function(output) {
			var result = JSON.parse(output);
			console.log(result);
		}
		});
	},
	createSessionWithUpdate = function(swid, email, selfCertify) {
		jsonRequest = '';
		$.ajax({ url: "PHP/functions.php",
		data: {action: 'createSessionWithUpdate', swid: swid, email: email, login: swid, fName: swid, lName: swid, device: 4, selfCertify: selfCertify},
		type: 'post',
		success: function(output) {
			var result = JSON.parse(output);
			var sessionId = result.SessionId;
			console.log(result);
			return result;
		},
		error: function(output) {
			var result = JSON.parse(output);
			console.log(result);
		}
		});
	},
	createHousehold = function(sessionId, swid) {
		jsonRequest = '{"Household":{"AutomaticallyShareEntitlements":1,"Name":"' + swid +'"}}';
		$.ajax({ url: subscriberEndpoint + "CreateHousehold",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	retrieveWallet = function(sessionId) {
		jsonRequest = '';
		$.ajax({ url: subscriberEndpoint + "RetrieveWallet",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	retrievePaymentInstrument = function(sessionId, paymentInstrumentId) {
		jsonRequest = '{"Id":"' + paymentInstrumentId + '"}';
		$.ajax({ url: subscriberEndpoint + "RetrievePaymentInstrument",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	createPaymentInstrument = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, zip, name) {
		//jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country +'","LineOne" : "' + address + '","Name" : "' + address + '","ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default1" ,"Default" : true}],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }]}}';
		jsonRequest = '{"PaymentInstrument" :{"BillingAddress" :{"City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + "IL" + '" },"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default" ,"Default" : true}';
		$.ajax({
			url : subscriberEndpoint + "CreatePaymentInstrument",
			data : jsonRequest,
			headers : {
				"CD-SystemID" : systemId,
				"CD-SessionID" : sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	createPaypalPaymentInstrument = function(sessionId, payPalToken) {
		jsonRequest = '{"PaymentInstrument" :{"PayPalAccount" :{"PayPalToken" : "' + payPalToken + '"}, "Name" : "PayPalAccount", "Type" : 5,"Default" : true}}';
		console.log(jsonRequest);
		$.ajax({
			url : subscriberEndpoint + "CreatePaymentInstrument",
			data : jsonRequest,
			headers : {
				"CD-SystemID" : systemId,
				"CD-SessionID" : sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	updatePaymentInstrument = function(sessionId, address, city, creditCardNumber, cvv, month, year, zip, name, paymentInstrumentId) {
		jsonRequest = '{"ApplyToSubscriptions":true,"PaymentInstrument" :{"Id":"'+ paymentInstrumentId +'","BillingAddress" :{"City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + "IL" + '" },"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default" ,"Default" : true}';
		$.ajax({
			url : subscriberEndpoint + "UpdatePaymentInstrument",
			data : jsonRequest,
			headers : {
				"CD-SystemID" : systemId,
				"CD-SessionID" : sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	removePaymentInstrument = function(sessionId, paymentInstrumentId) {
		jsonRequest = '{"Id": '+ paymentInstrumentId +'}';
		$.ajax({ url: subscriberEndpoint + "RemovePaymentInstrument",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	updateSubscriber = function(sessionId,swid,email,selfCertify){
		jsonRequest =  '{"Subscriber":{"Email" : "' + email + '","ExternalReference" : "' + swid +'","FirstName" : "' + swid +'","Language" : "en-US","LastName" : "' + swid +'","AdditionalProperties":[{"ExternalReference":"SelfCertify","Values" : ["' + selfCertify +'"]}]}}';
		$.ajax({ url: subscriberEndpoint + "UpdateSubscriber",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	/*retrieveAddresses = function(sessionId) {
		jsonRequest = '';
		$.ajax({ url: subscriberEndpoint + "RetrieveAddresses",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	createAddress = function(sessionId, address, city, state, zip, name) {
		jsonRequest = '{"Address" :{"City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + state + '" }}';
		$.ajax({
			url : subscriberEndpoint + "CreateAddress",
			data : jsonRequest,
			headers : {
				"CD-SystemID" : systemId,
				"CD-SessionID" : sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	updateAddress = function(sessionId, address, city, state, zip, name, addressId) {
		jsonRequest = '{"Address" :{"Id":"' + addressId +'","City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + state + '" }}';
		$.ajax({
			url : subscriberEndpoint + "UpdateAddress",
			data : jsonRequest,
			headers : {
				"CD-SystemID" : systemId,
				"CD-SessionID" : sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	removeAddress = function(sessionId, addressId) {
		jsonRequest = '{"Id": '+ addressId +'}';
		$.ajax({ url: subscriberEndpoint + "RemoveAddress",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},*/
	searchSubscriptions = function(sessionId) {
		jsonRequest = '';
		$.ajax({ url: subscriberEndpoint + "SearchSubscriptions",
			data: jsonRequest,
			headers:{
			"CD-SystemID" : systemId,
			"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	retrieveSubscription = function(sessionId, subscriptionId) {
		jsonRequest = '{"Id" : "' + subscriptionId + '"}';
		$.ajax({ url: subscriberEndpoint + "RetrieveSubscription",
			data: jsonRequest,
			headers:{
			"CD-SystemID" : systemId,
			"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	// Toggle On Autotrenewal
	toggleOnAutorenewal = function(sessionId, subscriptionId) {
		jsonRequest = '{"Id":"' + subscriptionId +'","Renew":1}';
		$.ajax({ url: subscriberEndpoint + "UpdateSubscription",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	};
	// Toggle Off Autorenewal
	toggleOffAutorenewal = function(sessionId, subscriptionId) {
		//jsonRequest = '{"Id":"' + subscriptionId +'","Renew":False,"TerminationReason":"0"}';
		jsonRequest = '{"Id":"' + subscriptionId +'","Renew":0,"TerminationReason":"0"}';
		$.ajax({ url: subscriberEndpoint + "UpdateSubscription",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	// Change subscription plan
	submitModifyOrder = function(sessionId, subscriptionId, productId, pricingPlanId) {
		//account.submitModifyOrder('e1af7ba7-a63b-4c12-9df9-fb77e8bef803',36355,175819,25389)
		jsonRequest = '{"SubscriptionId":"' + subscriptionId +'","ChangeImmediately":0,"ChangeItems":[{"PricingPlanId" : "' + pricingPlanId +'", "SubscriptionItemId" : "' + productId +'"}]}';
		$.ajax({ url: subscriberEndpoint + "SubmitModifyOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	};
	// Remove subscription immediately
	submitRemoveOrder = function(sessionId, subscriptionId) {
		jsonRequest = '{"SubscriptionId":"' + subscriptionId +'","RemoveReasonCode":0}';
		$.ajax({ url: subscriberEndpoint + "SubmitRemoveOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	//account.submitOrder('e62aece2-842d-4af2-8918-97b6a100a1d2','1212 N Lasalle','Chicago','IL','4111111111111111','123','02','2017','60610','Michael',217621,25724)
	//api.submitOrder('d56c7057-01e4-4dcd-a1d8-42ed2e3d4e1a','1212 N Lasalle','Chicago','GBR','4111111111114321','123','02','2017','Michael','',217621,27366)
	submitOrder = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, couponCode, productId, pricingPlanId) {
		if(couponCode != ''){
			jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "' + name + ' - ' + creditCardNumber.slice(-4) + '" ,"Default" : true}],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }],"RedemptionCodes" : ["' + couponCode + '"]}}';
		}
		else {
			jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "' + name + ' - ' + creditCardNumber.slice(-4) + '" ,"Default" : true}],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }]}}';
		}
		$.ajax({
			url: subscriberEndpoint + "SubmitOrder",
			data: jsonRequest,
			contentType: "text/plain",
			headers:{
				"Content-Type" : "text/plain",
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	submitPayPalOrder = function(sessionId, paymentInstrumentId, couponCode, productId, pricingPlanId) {
		if(couponCode != ''){
			jsonRequest = '{"PaymentInstrumentIds":['+paymentInstrumentId+'],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }],"RedemptionCodes" : ["' + couponCode + '"]}}';
		}
		else {
			jsonRequest = '{"PaymentInstrumentIds":['+paymentInstrumentId+'],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }]}}';
		}
		$.ajax({
			url: subscriberEndpoint + "SubmitOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	//api.calculateOrderQuote('e869d28c-f51d-4f63-9c55-d6c24c1e3048','1212 N Lasalle','Madrid','SPAIN','4111111111111111','123','02','2017','Michael',217624,27369)
	calculateOrderQuote = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, productId, pricingPlanId) {
		jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country +'","LineOne" : "' + address + '","Name" : "' + address + '","ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default1" ,"Default" : true}],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }]}}';
		$.ajax({
			url: subscriberEndpoint + "CalculateOrderQuote",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	//api.submitGiftOrder('722cd68d-b20b-492e-a47e-66fe5fbb908c','1212 N Lasalle','Chicago','IL','4111111111111111','123','02','2017','60610','Michael',217621,25724,'michael.jan@csgi.com','michael jan', 'michael.jan@csgi.com', 'michael jan')
	submitGiftOrder = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, zip, name, productId, pricingPlanId, recipientEmail,recipientName,senderEmail,senderName) {
		jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "' + name + ' - ' + creditCardNumber.slice(-4) + '" ,"Default" : true}], "RecipientEmail":"'+ recipientEmail +'","RecipientName":"'+ recipientName +'","SendNotification":0,"SenderEmail":"'+ senderEmail +'","SenderName":"'+ senderName +'","ShoppingCart" : {"Items" : [{"PricingPlanId" : '+ pricingPlanId +',"ProductId" : '+ productId +'}]}}';
		console.log(jsonRequest);
		$.ajax({
			url: subscriberEndpoint + "SubmitGiftOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	//api.submitGiftOrder('52573e3f-24bc-4c83-9c05-abbd995f0894','michael.jan@csgi.com','michael jan', 'michael.jan@csgi.com', 'michael jan', '217621', '25724')
	submitGiftOrderAsExisting = function(sessionId,recipientEmail,recipientName,senderEmail,senderName,productId,pricingPlanId) {
		jsonRequest = '{"RecipientEmail":"'+ recipientEmail +'","RecipientName":"'+ recipientName +'","SendNotification":0,"SenderEmail":"'+ senderEmail +'","SenderName":"'+ senderName +'","ShoppingCart" : {"Items" : [{"PricingPlanId" : '+ pricingPlanId +',"ProductId" : '+ productId +'}]}}';
		$.ajax({
			url: subscriberEndpoint + "SubmitGiftOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	// api.submitAnonymousGiftOrder('michael.jan@csgi.com','michael jan', 'mikeyjan@gmail.com', 'michael jan', 'Custom Message!', '19315 SW 66 St','SW Ranches','FL','4111111111111111','123','09','2015','33332','Test','331229', '28405')
	// UK - api.submitAnonymousGiftOrder('michael.jan@csgi.com','michael jan', 'mikeyjan@gmail.com', 'michael jan', 'Custom Message!', '19315 SW 66 St','SW Ranches','FL','4111111111111111','123','09','2015','33332','Test','331229', '28405')
	submitAnonymousGiftOrder = function(recipientEmail,recipientName,senderEmail,senderName, senderMessage, address, city, state, creditCardNumber, cvv, month, year, zip, name, productId,pricingPlanId) {
		jsonRequest = '{"Email":"' + senderEmail + '","RecipientEmail":"'+ recipientEmail +'","RecipientName":"'+ recipientName +'","SenderMessage":"' + senderMessage + '","SenderEmail":"'+ senderEmail +'","SenderName":"'+ senderName +'",{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + state + '" },"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default" ,"Default" : true}],"ShoppingCart" : {"Items" : [{"PricingPlanId" : '+ pricingPlanId +',"ProductId" : '+ productId +'}]}}';
		$.ajax({
			url: subscriberEndpoint + "SubmitAnonymousGiftOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	previewGiftRedemptionOrder = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, name) {
		jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "' + name + ' - ' + creditCardNumber.slice(-4) + '" ,"Default" : true}],"RedemptionCode" : "' + couponCode + '"}}';
		$.ajax({
			url: subscriberEndpoint + "PreviewGiftRedemptionOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	submitGiftRedemptionOrder = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, name) {
		jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "' + name + ' - ' + creditCardNumber.slice(-4) + '" ,"Default" : true}],"RedemptionCode" : "' + couponCode + '"}}';
		$.ajax({
			url: subscriberEndpoint + "SubmitGiftRedemptionOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	// searchProductsByCoupon
	searchProductsByCoupon = function(couponCode) {
		jsonRequest = '{"RedemptionCode":"'+ couponCode +'"}';
		$.ajax({
			url: subscriberEndpoint + "SearchProductsByCoupon",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	// searchOrders
	searchOrders = function(sessionId) {
		jsonRequest = '{"PageSize" : 10,"ReturnAutomaticOrders" : true}';
		return $.ajax({
			url: subscriberEndpoint + "SearchOrders",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	
	retrievePayPalToken = function(sessionId) {
		jsonRequest = '';
		$.ajax({
			url: subscriberEndpoint + "RetrievePayPalToken",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId,
				"CD-Language" : "en-US"
				//"CD-DistributionChannel" : channelId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	searchLocker = function(sessionId){
		jsonRequest = '';
		$.ajax({
			url: subscriberEndpoint + "SearchLocker",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId,
				"CD-Language" : "en-US"
				//"CD-DistributionChannel" : channelId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	calculateRenewOrderQuote = function(sessionId, id){
		jsonRequest = '{"SubscriptionId":' + id +'}';
		$.ajax({
			url: subscriberEndpoint + "CalculateRenewOrderQuote",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId,
				"CD-Language" : "en-US"
				//"CD-DistributionChannel" : channelId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	};
	return {
		retrieveProductWithExternalReference : retrieveProductWithExternalReference,
		retrieveProductContext: retrieveProductContext,
		retrieveProductContextWithDiscount: retrieveProductContextWithDiscount,
		retrieveProductContextWithSession: retrieveProductContextWithSession, 
		retrieveProductContextWithProductIdAndSession: retrieveProductContextWithProductIdAndSession,
		retrieveProductContextWithSubscriberId: retrieveProductContextWithSubscriberId,
		retrieveProduct: retrieveProduct,
		createSession: createSession,
		createSessionWithToken: createSessionWithToken,
		createSessionWithUpdate: createSessionWithUpdate,
		createHousehold: createHousehold,
		retrieveWallet: retrieveWallet,
		retrievePaymentInstrument: retrievePaymentInstrument,
		createPaymentInstrument: createPaymentInstrument,
		createPaypalPaymentInstrument: createPaypalPaymentInstrument,
		updatePaymentInstrument: updatePaymentInstrument,
		removePaymentInstrument: removePaymentInstrument,
		updateSubscriber: updateSubscriber,
		/*retrieveAddresses: retrieveAddresses,
		createAddress: createAddress,
		updateAddress: updateAddress,
		removeAddress: removeAddress,*/
		searchSubscriptions: searchSubscriptions,
		retrieveSubscription: retrieveSubscription,
		toggleOnAutorenewal: toggleOnAutorenewal,
		toggleOffAutorenewal: toggleOffAutorenewal,
		submitModifyOrder: submitModifyOrder,
		submitRemoveOrder: submitRemoveOrder,
		submitOrder : submitOrder,
		submitPayPalOrder: submitPayPalOrder,
		calculateOrderQuote : calculateOrderQuote,
		submitGiftOrder : submitGiftOrder,
		submitGiftOrderAsExisting : submitGiftOrderAsExisting,
		submitAnonymousGiftOrder: submitAnonymousGiftOrder,
		previewGiftRedemptionOrder: previewGiftRedemptionOrder,
		submitGiftRedemptionOrder : submitGiftRedemptionOrder,
		searchProductsByCoupon : searchProductsByCoupon,
		searchOrders: searchOrders,
		retrievePayPalToken: retrievePayPalToken,
		searchLocker: searchLocker,
		calculateRenewOrderQuote : calculateRenewOrderQuote 
	};
}();
var service = new function () {
	var subscriberEndpoint = 'https://services.sbx1.cdops.net/Subscriber/',
	subscriberManagementEndpoint = 'https://services.sbx1.cdops.net/SubscriberManagement/',
	metadataEndpoint = 'https://metadata.sbx1.cdops.net/',
	systemId = '02c62e64-6528-49e1-8800-8b52a97274a6',
	channelId = 'e777708b-f758-4d91-aaec-170755b9ed7e',
	retrieveProductWithExternalReference = function(productExternalReference){
		return $.ajax({ url: metadataEndpoint + "/Product/systemId/" + systemId + "/distributionchannel/" + channelId + "/devicetype/4/ProductExternalReferenceType/CSGSubscriptionProduct/ProductExternalReference/" + productExternalReference,
		 	type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});  
	},
	retrieveProductContext = function(productExternalReference){
		jsonRequest = '{"IncludeEntitlementContext":1,"IncludeOrderablePricingPlans":1,"ProductExternalReference":"'+ productExternalReference +'","ProductExternalReferenceType":"CSGSubscriptionProduct"}';
		return $.ajax({ url: subscriberEndpoint + "RetrieveProductContext",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
			},
			type: 'post',
			success: function(output) {
				console.log(output);
			},
			error: function(output) {
				console.log(output);
			}
		});
	},
	retrieveProductContextWithSession = function(sessionId, productExternalReference ){
		jsonRequest = '{"IncludeEntitlementContext":1,"IncludeOrderablePricingPlans":1,"ProductExternalReference":"' + productExternalReference  +'","ProductExternalReferenceType":"CSGSubscriptionProduct"}';
		return $.ajax({ url: subscriberEndpoint + "RetrieveProductContext",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	retrieveProductContextWithProductIdAndSession = function(sessionId, productId ){
		jsonRequest = '{"IncludeEntitlementContext":1,"IncludeOrderablePricingPlans":1,"ProductId":"' + productId  +'"}';
		return $.ajax({ url: subscriberEndpoint + "RetrieveProductContext",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	retrieveProductContextWithSubscriberId = function(subscriberId, productExternalReference ){
		jsonRequest = '{"IncludeEntitlementContext":1,"IncludeOrderablePricingPlans":1,"ProductExternalReference":"' + productExternalReference  +'","ProductExternalReferenceType":"CSGSubscriptionProduct"}';
		return $.ajax({ url: subscriberEndpoint + "RetrieveProductContext",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SubscriberId" :  subscriberId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
			},
			error: function(output) {
				console.log(output);
			}
		});
	},
	retrieveProduct = function(){
		return $.ajax({ 
			url: metadataEndpoint + "Product/systemId/" + systemId + "/distributionchannel/" + channelId + "/devicetype/4/Id/217621/",
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});  
	},
	createSession = function(swid, email) {
		jsonRequest = '';
		return $.ajax({ url: "PHP/functions.php",
		data: {action: 'createSession', swid: swid, email: email, login: swid, fName: swid, lName: swid, device: 4},
		type: 'post',
		success: function(output) {
			var result = JSON.parse(output);
			var sessionId = result.SessionId;
		},
		error: function(output) {
			var result = JSON.parse(output);
		}
		});
	},
	createSessionWithUpdate = function(swid, email, selfCertify) {
		jsonRequest = '';
		return $.ajax({ url: "PHP/functions.php",
		data: {action: 'createSessionWithUpdate', swid: swid, email: email, login: swid, fName: swid, lName: swid, device: 4, selfCertify: selfCertify},
		type: 'post',
		success: function(output) {
			var result = JSON.parse(output);
			var sessionId = result.SessionId;
			console.log(result);
			return result;
		},
		error: function(output) {
			var result = JSON.parse(output);
			console.log(result);
		}
		});
	},
	createHousehold = function(sessionId, swid) {
		jsonRequest = '{"Household":{"AutomaticallyShareEntitlements":1,"Name":"' + swid +'"}}';
		$.ajax({ url: subscriberEndpoint + "CreateHousehold",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	retrieveWallet = function(sessionId) {
		jsonRequest = '';
		return $.ajax({ url: subscriberEndpoint + "RetrieveWallet",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	retrievePaymentInstrument = function(sessionId, paymentInstrumentId) {
		jsonRequest = '{"Id":"' + paymentInstrumentId + '"}';
		return $.ajax({ url: subscriberEndpoint + "RetrievePaymentInstrument",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	createPaymentInstrument = function(sessionId, address, city, state, creditCardNumber, cvv, month, year, zip, name) {
		jsonRequest = '{"PaymentInstrument" :{"BillingAddress" :{"City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + state + '" },"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default" ,"Default" : true}';
		return $.ajax({
			url : subscriberEndpoint + "CreatePaymentInstrument",
			data : jsonRequest,
			headers : {
				"CD-SystemID" : systemId,
				"CD-SessionID" : sessionId
			},
			type : 'post',
			success : function(output) {
			},
			error : function(output) {
			}
		});
	},
	createPaypalPaymentInstrument = function(sessionId, payPalToken) {
		jsonRequest = '{"PaymentInstrument" :{"PayPalAccount" :{"PayPalToken" : "' + payPalToken + '"}, "Name" : "PayPalAccount", "Type" : 5,"Default" : true}}';
		return $.ajax({
			url : subscriberEndpoint + "CreatePaymentInstrument",
			data : jsonRequest,
			headers : {
				"CD-SystemID" : systemId,
				"CD-SessionID" : sessionId
			},
			type : 'post',
			success : function(output) {
			},
			error : function(output) {
			}
		});
	},
	updatePaymentInstrument = function(sessionId, address, city, state, creditCardNumber, cvv, month, year, zip, name, paymentInstrumentId) {
		jsonRequest = '{"ApplyToSubscriptions":true,"PaymentInstrument" :{"Id":"'+ paymentInstrumentId +'","BillingAddress" :{"City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + state + '" },"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default" ,"Default" : true}';
		return $.ajax({
			url : subscriberEndpoint + "UpdatePaymentInstrument",
			data : jsonRequest,
			headers : {
				"CD-SystemID" : systemId,
				"CD-SessionID" : sessionId
			},
			type : 'post',
			success : function(output) {
			},
			error : function(output) {
			}
		});
	},
	removePaymentInstrument = function(sessionId, paymentInstrumentId) {
		jsonRequest = '{"Id": '+ paymentInstrumentId +'}';
		return $.ajax({ url: subscriberEndpoint + "RemovePaymentInstrument",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	updateSubscriber = function(sessionId,swid,email,selfCertify){
		jsonRequest =  '{"Subscriber":{"Email" : "' + email + '","ExternalReference" : "' + swid +'","FirstName" : "' + swid +'","Language" : "en-US","LastName" : "' + swid +'","AdditionalProperties":[{"ExternalReference":"SelfCertify","Values" : ["' + selfCertify +'"]}]}}';
		return $.ajax({ url: subscriberEndpoint + "UpdateSubscriber",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	/*retrieveAddresses = function(sessionId) {
		jsonRequest = '';
		$.ajax({ url: subscriberEndpoint + "RetrieveAddresses",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	createAddress = function(sessionId, address, city, state, zip, name) {
		jsonRequest = '{"Address" :{"City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + state + '" }}';
		$.ajax({
			url : subscriberEndpoint + "CreateAddress",
			data : jsonRequest,
			headers : {
				"CD-SystemID" : systemId,
				"CD-SessionID" : sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	updateAddress = function(sessionId, address, city, state, zip, name, addressId) {
		jsonRequest = '{"Address" :{"Id":"' + addressId +'","City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + state + '" }}';
		$.ajax({
			url : subscriberEndpoint + "UpdateAddress",
			data : jsonRequest,
			headers : {
				"CD-SystemID" : systemId,
				"CD-SessionID" : sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	removeAddress = function(sessionId, addressId) {
		jsonRequest = '{"Id": '+ addressId +'}';
		$.ajax({ url: subscriberEndpoint + "RemoveAddress",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},*/
	searchSubscriptions = function(sessionId) {
		jsonRequest = '';
		return $.ajax({ url: subscriberEndpoint + "SearchSubscriptions",
			data: jsonRequest,
			headers:{
			"CD-SystemID" : systemId,
			"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	retrieveSubscription = function(sessionId, subscriptionId) {
		jsonRequest = '{"Id" : "' + subscriptionId + '"}';
		return $.ajax({ url: subscriberEndpoint + "RetrieveSubscription",
			data: jsonRequest,
			headers:{
			"CD-SystemID" : systemId,
			"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	toggleOnAutorenewal = function(sessionId, subscriptionId) {
		jsonRequest = '{"Id":"' + subscriptionId +'","Renew":1}';
		return $.ajax({ url: subscriberEndpoint + "UpdateSubscription",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	};
	toggleOffAutorenewal = function(sessionId, subscriptionId) {
		//jsonRequest = '{"Id":"' + subscriptionId +'","Renew":False,"TerminationReason":"0"}';
		jsonRequest = '{"Id":"' + subscriptionId +'","Renew":0,"TerminationReason":"0"}';
		return $.ajax({ url: subscriberEndpoint + "UpdateSubscription",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	submitModifyOrder = function(sessionId, subscriptionId, productId, pricingPlanId) {
		//account.submitModifyOrder('e1af7ba7-a63b-4c12-9df9-fb77e8bef803',36355,175819,25389)
		jsonRequest = '{"SubscriptionId":"' + subscriptionId +'","ChangeImmediately":0,"ChangeItems":[{"PricingPlanId" : "' + pricingPlanId +'", "SubscriptionItemId" : "' + productId +'"}]}';
		return $.ajax({ url: subscriberEndpoint + "SubmitModifyOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	};
	submitRemoveOrder = function(sessionId, subscriptionId) {
		jsonRequest = '{"SubscriptionId":"' + subscriptionId +'","RemoveReasonCode":0}';
		return $.ajax({ url: subscriberEndpoint + "SubmitRemoveOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type: 'post',
			success: function(output) {
			},
			error: function(output) {
			}
		});
	},
	//account.submitOrder('e62aece2-842d-4af2-8918-97b6a100a1d2','1212 N Lasalle','Chicago','IL','4111111111111111','123','02','2017','60610','Michael',217621,25724)
	submitOrder = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, couponCode, productId, pricingPlanId) {
		if(couponCode != ''){
			jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "' + name + ' - ' + creditCardNumber.slice(-4) + '" ,"Default" : true}],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }]},"RedemptionCodes" : ["' + couponCode + '"]}';
		}
		else {
			jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "' + name + ' - ' + creditCardNumber.slice(-4) + '" ,"Default" : true}],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }]}}';
		}
		return $.ajax({
			url: subscriberEndpoint + "SubmitOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
				console.log(output);
			}
		});
	},
	submitPayPalOrder = function(sessionId, paymentInstrumentId, couponCode, productId, pricingPlanId) {
		if(couponCode != '') {
			jsonRequest = '{"PaymentInstrumentIds":['+paymentInstrumentId+'],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }],"RedemptionCodes" : ["' + couponCode + '"]}}';
		}
		else {
			jsonRequest = '{"PaymentInstrumentIds":['+paymentInstrumentId+'],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }]}}';
		}
		console.log(jsonRequest);
		return $.ajax({
			url: subscriberEndpoint + "SubmitOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	//service.submitGiftOrder('722cd68d-b20b-492e-a47e-66fe5fbb908c','1212 N Lasalle','Chicago','IL','4111111111111111','123','02','2017','60610','Michael',217621,25724,'michael.jan@csgi.com','michael jan', 'michael.jan@csgi.com', 'michael jan')
	submitGiftOrder = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, productId, pricingPlanId, recipientEmail,recipientName,senderEmail,senderName) {
		jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "' + name + ' - ' + creditCardNumber.slice(-4) + '" ,"Default" : true}], "RecipientEmail":"'+ recipientEmail +'","RecipientName":"'+ recipientName +'","SendNotification":0,"SenderEmail":"'+ senderEmail +'","SenderName":"'+ senderName +'","ShoppingCart" : {"Items" : [{"PricingPlanId" : '+ pricingPlanId +',"ProductId" : '+ productId +'}]}}';
		console.log(jsonRequest);
		return $.ajax({
			url: subscriberEndpoint + "SubmitGiftOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	//service.submitGiftOrder('52573e3f-24bc-4c83-9c05-abbd995f0894','michael.jan@csgi.com','michael jan', 'michael.jan@csgi.com', 'michael jan', '217621', '25724')
	submitGiftOrderAsExisting = function(sessionId,recipientEmail,recipientName,senderEmail,senderName,productId,pricingPlanId) {
		jsonRequest = '{"RecipientEmail":"'+ recipientEmail +'","RecipientName":"'+ recipientName +'","SendNotification":0,"SenderEmail":"'+ senderEmail +'","SenderName":"'+ senderName +'","ShoppingCart" : {"Items" : [{"PricingPlanId" : '+ pricingPlanId +',"ProductId" : '+ productId +'}]}}';
		return $.ajax({
			url: subscriberEndpoint + "SubmitGiftOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	//api.submitAnonymouseGiftOrder('michael.jan@csgi.com','michael jan', 'michael.jan@csgi.com', 'michael jan', '217493', '27364')
	submitAnonymousGiftOrder = function(recipientEmail,recipientName,senderEmail,senderName,productId,pricingPlanId) {
		jsonRequest = '{"RecipientEmail":"'+ recipientEmail +'","RecipientName":"'+ recipientName +'","SendNotification":0,"SenderEmail":"'+ senderEmail +'","SenderName":"'+ senderName +'","ShoppingCart" : {"Items" : [{"PricingPlanId" : '+ pricingPlanId +',"ProductId" : '+ productId +'}]}}';
		return $.ajax({
			url: subscriberEndpoint + "SubmitAnonymousGiftOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	/*previewGiftRedemptionOrder = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, couponCode) {
		jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "' + name + ' - ' + creditCardNumber.slice(-4) + '" ,"Default" : true}],"RedemptionCode" : "' + couponCode + '"}}';
		return $.ajax({
			url: subscriberEndpoint + "PreviewGiftRedemptionOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
			},
			error : function(output) {
			}
		});
	},*/
	previewGiftRedemptionOrder = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, couponCode) {
		jsonRequest = '{"RedemptionCode" : "' + couponCode + '"}';
		return $.ajax({
			url: subscriberEndpoint + "PreviewGiftRedemptionOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
			},
			error : function(output) {
			}
		});
	},
	submitGiftRedemptionOrder = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, couponCode) {
		jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "' + name + ' - ' + creditCardNumber.slice(-4) + '" ,"Default" : true}],"RedemptionCode" : "' + couponCode + '"}}';
		return $.ajax({
			url: subscriberEndpoint + "SubmitGiftRedemptionOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
			},
			error : function(output) {
			}
		});
	},
	submitGiftRedemptionOrderWithExisting = function(sessionId, couponCode) {
		jsonRequest = '{"RedemptionCode" : "' + couponCode + '"}';
		return $.ajax({
			url: subscriberEndpoint + "SubmitGiftRedemptionOrder",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
			},
			error : function(output) {
			}
		});
	},
	// searchProductsByCoupon
	searchProductsByCoupon = function(couponCode) {
		jsonRequest = '{"RedemptionCode":"'+ couponCode +'"}';
		return $.ajax({
			url: subscriberEndpoint + "SearchProductsByCoupon",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	// searchOrders
	searchOrders = function(sessionId) {
		jsonRequest = '{"PageSize" : 10,"ReturnAutomaticOrders" : true}';
		return $.ajax({
			url: subscriberEndpoint + "SearchOrders",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	retrievePayPalToken = function(sessionId) {
		jsonRequest = '';
		return $.ajax({
			url: subscriberEndpoint + "RetrievePayPalToken",
			data: jsonRequest,
			headers:{
				"CD-SystemID" : systemId,
				"CD-SessionID" :  sessionId,
				"CD-Language" : "en-US"
				//"CD-DistributionChannel" : channelId
			},
			type : 'post',
			success : function(output) {
				console.log(output);
			},
			error : function(output) {
			}
		});
	},
	searchLocker = function(sessionId) {
		
	};
	return {
		retrieveProductWithExternalReference: retrieveProductWithExternalReference,
		retrieveProductContext: retrieveProductContext,
		retrieveProductContextWithSession: retrieveProductContextWithSession,
		retrieveProductContextWithProductIdAndSession: retrieveProductContextWithProductIdAndSession,
		retrieveProductContextWithSubscriberId: retrieveProductContextWithSubscriberId,
		retrieveProduct: retrieveProduct,
		createSession: createSession,
		createSessionWithUpdate: createSessionWithUpdate,
		createHousehold: createHousehold,
		retrieveWallet: retrieveWallet,
		retrievePaymentInstrument: retrievePaymentInstrument,
		createPaymentInstrument: createPaymentInstrument,
		createPaypalPaymentInstrument: createPaypalPaymentInstrument,
		updatePaymentInstrument: updatePaymentInstrument,
		removePaymentInstrument: removePaymentInstrument,
		updateSubscriber: updateSubscriber,
		/*retrieveAddresses: retrieveAddresses,
		createAddress: createAddress,
		updateAddress: updateAddress,
		removeAddress: removeAddress,*/
		searchSubscriptions: searchSubscriptions,
		retrieveSubscription: retrieveSubscription,
		toggleOnAutorenewal: toggleOnAutorenewal,
		toggleOffAutorenewal: toggleOffAutorenewal,
		submitModifyOrder: submitModifyOrder,
		submitRemoveOrder: submitRemoveOrder,
		submitPayPalOrder: submitPayPalOrder,
		submitOrder : submitOrder,
		submitGiftOrder : submitGiftOrder,
		submitGiftOrderAsExisting : submitGiftOrderAsExisting,
		submitAnonymousGiftOrder: submitAnonymousGiftOrder,
		previewGiftRedemptionOrder: previewGiftRedemptionOrder,
		submitGiftRedemptionOrder : submitGiftRedemptionOrder,
		submitGiftRedemptionOrderWithExisting : submitGiftRedemptionOrderWithExisting,
		searchProductsByCoupon : searchProductsByCoupon,
		searchOrders: searchOrders,
		retrievePayPalToken: retrievePayPalToken,
		searchLocker: searchLocker
	};
}();

var php = new function () {
	var subscriberEndpoint = 'https://services.sbx1.cdops.net/Subscriber/',
	metadataEndpoint = 'https://metadata.sbx1.cdops.net/',
	systemId = '02c62e64-6528-49e1-8800-8b52a97274a6',
	channelId = 'e777708b-f758-4d91-aaec-170755b9ed7e',
	calculateQuote = function(sessionId, couponCode) {
		return $.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'calculateOrderQuote',
				sessionId : sessionId,
				couponCode : couponCode
			},
			type : 'post',
			success : function(output) {
			},
			error : function(output) {
			}
		});
	},
	searchProductsByCoupon = function(couponCode) {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'searchProductsByCoupon',
				couponCode : couponCode
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
				if (result.Fault != undefined && result.Fault != 'undefined') {
					$('.error').animate({
						opacity : 1
					});
				} else {
					$('.error').animate({
						opacity : 0
					});
					$('#CouponCode').animate({
						opacity : 0
					});
					$('.btn-primary').toggleClass('validate');
					$('.form-subtitle span').animate({
						opacity : 0
					}, function() {
						//$(this).text("A 20% discount has been applied to this order.").animate({
						//	opacity : 1
						//});
						$(this).text(result.Coupon.Name + " has been applied to this order.").animate({
							opacity : 1
						});
					});
					$('.btn-primary span').animate({
						opacity : 0
					}, function() {
						$(this).text("Check Out!").animate({
							opacity : 1
						});
					});
				}
			},
			error : function(output) {
			}
		});
	},
	searchDiscounts = function() {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'searchDiscounts'
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	searchCoupons = function() {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'searchCoupons'
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	retrieveDiscount = function() {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'retrieveDiscount'
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	retrieveCoupon = function() {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'retrieveCoupon'
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	createCouponRedemptionCode = function() {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'createCouponRedemptionCode'
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	removeDiscount = function() {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'removeDiscount'
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	retrieveActiveSessions = function(subscriberId) {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'retrieveActiveSessions',
				subscriberId: subscriberId
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	retrieveOrder = function(orderNumber) {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'retrieveOrder',
				orderNumber: orderNumber
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	retrieveOverview = function(swid) {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'retrieveOverview',
				swid: swid
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	searchSubscriptionsManagement = function(swid) {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'searchSubscriptionsManagement',
				swid: swid
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	//submitCSROrder(217621,27366,"aaaaaa8")
	submitCSROrderWithSubscriberId = function(productId, planId, subscriberId) {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'submitCSROrderWithSubscriberId',
				productId : productId,
				planId : planId,
				subscriberId : subscriberId
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	//submitCSROrderWithSubscriberId
	submitCSROrder = function(productId, planId, swid) {
		$.ajax({
			url : "PHP/functions.php",
			data : {
				action : 'submitCSROrder',
				productId : productId,
				planId : planId,
				swid : swid
			},
			type : 'post',
			success : function(output) {
				var result = JSON.parse(output);
				console.log(result);
			},
			error : function(output) {
			}
		});
	},
	toggleOnAutorenewal = function(subscriptionId) {
		//jsonRequest = '{"Id":"' + subscriptionId +'","Renew":1}';
		$.ajax({ 
			url : "PHP/functions.php",
			data : {
				action : 'toggleOnAutorenewal',
				subscriptionId : subscriptionId
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	emailLogin = function(email) {
		//jsonRequest = '{"Id":"' + subscriptionId +'","Renew":1}';
		$.ajax({ 
			url : "PHP/functions.php",
			data : {
				action : 'emailLogin',
				email : email
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	},
	generatePassword = function(swid) {
		//jsonRequest = '{"Id":"' + subscriptionId +'","Renew":1}';
		$.ajax({ 
			url : "PHP/functions.php",
			data : {
				action : 'generatePassword',
				swid : swid
			},
			type: 'post',
			success: function(output) {
				console.log(output);
				return output;
			},
			error: function(output) {
			}
		});
	};
	return {
		calculateQuote : calculateQuote, 
		searchProductsByCoupon : searchProductsByCoupon, 
		searchDiscounts : searchDiscounts, 
		searchCoupons : searchCoupons, 
		retrieveDiscount : retrieveDiscount, 
		retrieveCoupon : retrieveCoupon, 
		createCouponRedemptionCode : createCouponRedemptionCode, 
		removeDiscount : removeDiscount, 
		retrieveActiveSessions : retrieveActiveSessions,
		retrieveOrder: retrieveOrder,
		retrieveOverview: retrieveOverview,
		searchSubscriptionsManagement: searchSubscriptionsManagement,
		submitCSROrder: submitCSROrder,
		submitCSROrderWithSubscriberId: submitCSROrderWithSubscriberId,
		toggleOnAutorenewal: toggleOnAutorenewal,
		emailLogin: emailLogin,
		generatePassword: generatePassword,
		generateToken: generateToken
	};
}();


// For retrieving submit order response (tax)
submitOrder = function(sessionId, couponCode) {
	jsonRequest = '{"ShoppingCart" : {"Items" : [{"PricingPlanId" : 25461,"ProductId" : 188935 }]}}';
	$.ajax({
		url: "https://services.sbx1.cdops.net/Subscriber/SubmitOrder",
		data: jsonRequest,
		headers:{
			"CD-SystemID" : "02c62e64-6528-49e1-8800-8b52a97274a6",
			"CD-SessionID" :  sessionId
		},
		type : 'post',
		success : function(output) {
			console.log(output);
		},
		error : function(output) {
		}
	});
};
