var api = new function () {
	var subscriberEndpoint = 'https://services.sbx1.cdops.net/Subscriber/',
	metadataEndpoint = 'https://metadata.sbx1.cdops.net/',
	systemId = '02c62e64-6528-49e1-8800-8b52a97274a6',
	channelId = 'e777708b-f758-4d91-aaec-170755b9ed7e',
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
				return output;
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
	retrieveProduct = function(id){
		$.ajax({ 
			url: metadataEndpoint + "Product/systemId/" + systemId + "/distributionchannel/" + channelId + "/devicetype/4/Id/" + id,
			type: 'post',
			success: function(output) {
				console.log(output);
			},
			error: function(output) {
			}
		});  
	},
	// Must be server-side
	createSession = function(swid, email) {
		jsonRequest = '';
		$.ajax({ url: "PHP/functions.php",
		data: {action: 'createSession', swid: swid, email: email, login: swid, fName: swid, lName: swid, device: 4},
		type: 'post',
		success: function(output) {
			var result = JSON.parse(output);
			var sessionId = result.SessionId;
			console.log(result);
		},
		error: function(output) {
			var result = JSON.parse(output);
			console.log(result);
		}
		});
	},
	// Retrieve all payment instruments tied to subscriber
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
			},
			error: function(output) {
			}
		});
	},
	// Retrieve payment instrument detail
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
			},
			error: function(output) {
			}
		});
	},
	// Set payment instrument name so that it returns info needed in retrieveWallet request
	createPaymentInstrument = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, zip, name) {
		jsonRequest = '{"PaymentInstrument" :{"BillingAddress" :{"City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + state + '" },"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default" ,"Default" : true}';
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
	// Retrieve pay pal token using retrievePaypalToken call first
	createPaypalPaymentInstrument = function(sessionId, payPalToken) {
		jsonRequest = '{"PaymentInstrument" :{"PayPalAccount" :{"PayPalToken" : "' + payPalToken + '"}, "Name" : "PayPalAccount", "Type" : 5,"Default" : true}}';
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
	updatePaymentInstrument = function(sessionId, address, city, state, creditCardNumber, cvv, month, year, zip, name, paymentInstrumentId) {
		jsonRequest = '{"ApplyToSubscriptions":true,"PaymentInstrument" :{"Id":"'+ paymentInstrumentId +'","BillingAddress" :{"City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + state + '" },"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default" ,"Default" : true}';
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
			},
			error: function(output) {
			}
		});
	},
	// Set self-certify attribute on subscriber
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
			},
			error: function(output) {
			}
		});
	},
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
			},
			error: function(output) {
			}
		});
	},
	// Retrieves subscription details (includes discount and change order) 
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
			},
			error: function(output) {
			}
		});
	},
	// Toggle Off Autorenewal
	toggleOffAutorenewal = function(sessionId, subscriptionId) {
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
			},
			error: function(output) {
			}
		});
	},
	// Change subscription pricing plan
	submitModifyOrder = function(sessionId, subscriptionId, productId, pricingPlanId) {
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
			},
			error: function(output) {
			}
		});
	},
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
			},
			error: function(output) {
			}
		});
	},
	submitOrder = function(sessionId, address, city, country, creditCardNumber, cvv, month, year, name, couponCode, productId, pricingPlanId) {
		if(couponCode != ''){
			jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default" ,"Default" : true}],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }],"RedemptionCodes" : ["' + couponCode + '"]}}';
		}
		else {
			jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "' + country + '","LineOne" : "' + address + '","Name" : "' + address + '", "ShipToName" : "' + name + '"},"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default" ,"Default" : true}],"ShoppingCart" : {"Items" : [{"PricingPlanId" : ' + pricingPlanId + ',"ProductId" : ' + productId + ' }]}}';
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
	submitGiftOrder = function(sessionId, address, city, state, creditCardNumber, cvv, month, year, zip, name, productId, pricingPlanId, recipientEmail,recipientName,senderEmail,senderName) {
		jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + state + '" },"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default" ,"Default" : true}], "RecipientEmail":"'+ recipientEmail +'","RecipientName":"'+ recipientName +'","SendNotification":0,"SenderEmail":"'+ senderEmail +'","SenderName":"'+ senderName +'","ShoppingCart" : {"Items" : [{"PricingPlanId" : '+ pricingPlanId +',"ProductId" : '+ productId +'}]}}';
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
	// Do not create payment instrument if user exists 
	submitGiftOrderAsExistingUser = function(sessionId,recipientEmail,recipientName,senderEmail,senderName,productId,pricingPlanId) {
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
	submitGiftRedemptionOrder = function(sessionId, address, city, state, creditCardNumber, cvv, month, year, zip, name, couponCode) {
		jsonRequest = '{"PaymentInstruments":[{"BillingAddress" :{"City" : "' + city + '","Country" : "USA","LineOne" : "' + address + '","Name" : "' + address + '","PostalCode" : "' + zip + '", "ShipToName" : "' + name + '", "State" : "' + state + '" },"CreditCard" : {"AccountNumber" : "' + creditCardNumber + '","Cvv" : "' + cvv + '","ExpirationMonth" : "' + month + '","ExpirationYear" : "' + year + '","NameOnCard" : "' + name + '","Type" : 1}, "Name" : "Default" ,"Default" : true}],"RedemptionCode" : "' + couponCode + '"}}';
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
	// Returns all product + pricing plan associated to coupon 
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
	// Returns order history, lots of possible parameters. See documentation for more info.
	// https://documentation.doc1.cdops.net/v6.0/method.aspx?interface=Subscriber&method=searchorders
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
	// Retrieve Pay Pal Token
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
	};
	
	return {
		retrieveProductWithExternalReference : retrieveProductWithExternalReference,
		retrieveProductContext: retrieveProductContext,
		retrieveProductContextWithDiscount: retrieveProductContextWithDiscount,
		retrieveProductContextWithSession: retrieveProductContextWithSession, 
		retrieveProduct: retrieveProduct,
		createSession: createSession,
		retrieveWallet: retrieveWallet, // Retrieve all payment instruments tied to subscriber
		retrievePaymentInstrument: retrievePaymentInstrument, // Retrieve payment instrument detail
		createPaymentInstrument: createPaymentInstrument, // Set payment instrument name so that it returns info needed in retrieveWallet request
		createPaypalPaymentInstrument: createPaypalPaymentInstrument, // Retrieve Pay Pal Token first
		updatePaymentInstrument: updatePaymentInstrument,
		removePaymentInstrument: removePaymentInstrument,
		updateSubscriber: updateSubscriber,
		searchSubscriptions: searchSubscriptions, // Retrieves subscription history (must parse results for active subscription)
		retrieveSubscription: retrieveSubscription, // Retrieves subscription details (includes discount and change order) 
		toggleOnAutorenewal: toggleOnAutorenewal,
		toggleOffAutorenewal: toggleOffAutorenewal,
		submitModifyOrder: submitModifyOrder, // Change subscription pricing plan
		submitRemoveOrder: submitRemoveOrder, // Remove subscription immediately
		submitOrder : submitOrder,
		submitPayPalOrder: submitPayPalOrder,
		calculateOrderQuote : calculateOrderQuote,
		submitGiftOrder : submitGiftOrder,
		submitGiftOrderAsExistingUser : submitGiftOrderAsExistingUser, // Do not create payment instrument if user exists 
		submitGiftRedemptionOrder : submitGiftRedemptionOrder,
		searchProductsByCoupon : searchProductsByCoupon, // Returns all product + pricing plan associated to coupon
		searchOrders: searchOrders, // Returns order history, lots of possible parameters. See documentation for more info.
		retrievePayPalToken: retrievePayPalToken
	};
}();