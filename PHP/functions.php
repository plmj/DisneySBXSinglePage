<?php
	require_once('config.php');

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
	header('Access-Control-Max-Age: 1000');
	header('Access-Control-Allow-Headers: Content-Type');

	if(isset($_POST['action']) && !empty($_POST['action'])) {
		$action = $_POST['action'];
		if(isset($_POST['swid'])){
			 $swid = $_POST['swid'];
		}
		if(isset($_POST['email'])){
			 $email = $_POST['email'];
		}
		if(isset($_POST['login'])){
			 $login = $_POST['login'];
		}
		if(isset($_POST['fName'])){
			 $fName = $_POST['fName'];
		}
		if(isset($_POST['lName'])){
			 $lName = $_POST['lName'];
		}
		if(isset($_POST['birthDate'])){
			 $birthDate = $_POST['birthDate'];
		}
		if(isset($_POST['gender'])){
			 $gender = $_POST['gender'];
		}
		if(isset($_POST['device'])){
			 $device = $_POST['device'];
		}
		if(isset($_POST['language'])){
			 $language = $_POST['language'];
		}
		if(isset($_POST['sessionId'])){
			 $sessionId = $_POST['sessionId'];
		}
		if(isset($_POST['productId'])){
			 $productId = $_POST['productId'];
		}
		if(isset($_POST['planId'])){
			 $planId = $_POST['planId'];
		}
		if(isset($_POST['progressSeconds'])){
			 $progressSeconds = $_POST['progressSeconds'];
		}
		if(isset($_POST['householdInfo'])){
			 $householdInfo = $_POST['householdInfo'];
		}
		if(isset($_POST['subscriberInfo'])){
			 $subscriberInfo = $_POST['subscriberInfo'];
		}
		if(isset($_POST['subscriptionId'])){
			 $subscriptionId = $_POST['subscriptionId'];
		}
		if(isset($_POST['productList'])){
			 $productList = $_POST['productList'];
		}
		if(isset($_POST['productId'])){
			 $productId = $_POST['productId'];
		}
		if(isset($_POST['subscriberId'])){
			 $subscriberId = $_POST['subscriberId'];
		}
		if(isset($_POST['householdId'])){
			 $householdId = $_POST['householdId'];
		}
		if(isset($_POST['restrictUsage'])){
			 $restrictUsage = $_POST['restrictUsage'];
		}
		if(isset($_POST['ratings'])){
			 $ratings = $_POST['ratings'];
		}
		if(isset($_POST['redemptionCode'])){
			 $redemptionCode = $_POST['redemptionCode'];
		}
		if(isset($_POST['subscriptionId'])){
			 $subscriptionId = $_POST['subscriptionId'];
		}
		if(isset($_POST['couponCode'])){
			 $couponCode = $_POST['couponCode'];
		}
		if(isset($_POST['orderNumber'])){
			$orderNumber = $_POST['orderNumber'];
		}
		if(isset($_POST['selfCertify'])){
			$selfCertify = $_POST['selfCertify'];
		}
		//Triage the request based on ACTION
		switch($action) {
			// Function to either create a user or create a session if exists
			case 'createSession': 
				createSession($swid, $email, $login, $fName, $lName, $device);
			break;
			case 'createSessionWithToken': 
				createSessionWithToken($swid, $email, $login, $fName, $lName, $device);
			break;
			case 'createSessionWithUpdate':
				createSessionWithUpdate($swid, $email, $login, $fName, $lName, $device, $selfCertify);
			break;
			// Function to update content progress
			case 'createHousehold':
				createHousehold($sessionId, $swid);
			break; 
			case 'retrieveHousehold':
				retrieveHousehold($sessionId);
			break;
			case 'addToHousehold':
				addToHousehold($sessionId, $email, $swid, $householdId, $restrictUsage, $ratings);
			break;
			case 'removeFromHousehold':
				removeFromHousehold($sessionId, $subscriberId, $householdId);
			break;
			case 'updateContentProgress':
				updateContentProgress($sessionId, $productId, $planId, $progressSeconds);
			break;
			// Function to retrieve susbcriber
			case 'retrieveSubscriber':
				retrieveSubscriber($sessionId);
			break;
			case 'retrieveSubscriptionInfo':
				retrieveSubscriptionInfo($sessionId, $subscriptionId);
			break;
			case 'retrieveProductContext':
				retrieveProductContext($productList, $subscriberId);
			break;
			case 'retrieveProductPricingContext':
				retrieveProductPricingContext($productId, $subscriberId);
			break;
			case 'suspendUser':
				suspendUser($sessionId);
			break;
			case 'submitOrder':
				submitOrder($sessionId, $couponCode);
			break;
			case 'submitCSROrder':
				submitCSROrder($productId, $planId, $swid);
			break;
			case 'submitCSROrderWithSubscriberId':
				submitCSROrderWithSubscriberId($productId, $planId, $subscriberId);
			break;
			case 'calculateOrderQuote':
				calculateOrderQuote($sessionId, $couponCode);
			break;
			case 'submitRemoveOrder':
				submitRemoveOrder($sessionId, $subscriptionId);
			break;
			case 'submitGiftOrder':
				submitGiftOrder($sessionId);
			break;
			case 'submitGiftRedemptionOrder':
				submitGiftRedemptionOrder($sessionId,$redemptionCode);
			break;
			case 'retrieveWallet':
				retrieveWallet($sessionId);
			break;
			case 'retrievePaymentInstrument':
				retrievePaymentInstrument($sessionId);
			break;
			case 'createPaymentInstrument':
				createPaymentInstrument($sessionId);
			break;
			case 'validatePaymentInstrument':
				validatePaymentInstrument($sessionId);
			break;
			case 'updateSubscriber':
				updateSubscriber($sessionId);
			break;
			case 'searchSubscriptions':
				searchSubscriptions($sessionId);
			break;
			case 'updateSubscription':
				updateSubscription($sessionId, $subscriptionId);
			break;
			case 'modifyOrder':
				modifyOrder($sessionId, $subscriptionId);
			break;
			case 'applyCoupon':
				applyCoupon($sessionId, $subscriptionId);
			break;
			case 'searchProductsByCoupon':
				searchProductsByCoupon($couponCode);
			break;
			case 'searchDiscounts':
				searchDiscounts();
			break;
			case 'searchCoupons':
				searchCoupons();
			break;
			case 'retrieveDiscount':
				retrieveDiscount();
			break;
			case 'retrieveCoupon':
				retrieveCoupon();
			break;
			case 'createCouponRedemptionCode':
				createCouponRedemptionCode();
			break;
			case 'removeDiscount':
				removeDiscount();
			break;
			case 'retrieveActiveSessions':
				retrieveActiveSessions($subscriberId);
			break;
			case 'retrieveOrder':
				retrieveOrder($orderNumber);
			break;
			case 'retrieveOverview':
				retrieveOverview($swid);
			break;
			case 'searchSubscriptionsManagement':
				searchSubscriptionsManagement($swid);
			break;
			case 'toggleOnAutorenewal':
				toggleOnAutorenewal($subscriptionId);
			break;
			case 'emailLogin':
				emailLogin($email);
			break;
			case 'generatePassword':
				generatePassword($swid);
			break;
		}
	}
	
	function createSession($swid, $email, $login, $fName, $lName, $device){
		$url = CreateSessionEndpoint; 
		$ssoToken = generateSsoToken($swid);
		$SSORequest = array(   
			"JoinExistingSession" => True,
			"Login" => $login, 
			"SsoCredentials" => array(
				"Subscriber" => array(
					"Email" => $email,
					"ExternalReference" => $swid,
					"FirstName" => $fName,
					"LastName" => $lName
					//"BirthDate" => $birthDate //UTC date formatted as 'Y-m-d H:i:s\Z'
					),
				"Token" => $ssoToken
				)
		);
		//$updateRatingsRequest = '{"HouseholdMembersToUpdate" : [{"Privileges" :{"CreatePaymentInstrumentEnabled" : true, "EnforceAccessPrivileges" : true, "EnforceUsagePrivileges" : true, "MemberManagementEnabled" : true,"RatingPrivileges" : [1,10],},"SubscriberId" : 118535 }],"Id" : 550}';
		$content = json_encode($SSORequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-DistributionChannel:'.ChannelID,
      'CD-DeviceType:'.$device,
      'CD-Language:en-GB'
    ));
        
		$json_response = curl_exec($curl);		
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);
		$response = json_decode($json_response, true);
	}
	function createSessionWithToken($swid, $email, $login, $fName, $lName, $device){
		$url = CreateSessionEndpoint; 
		$ssoToken = generateSsoToken($swid);
		$jsonToken = generateJsonToken();
		//echo($jsonToken);
		$SSORequest = array(   
			"JoinExistingSession" => True,
			"Login" => $login, 
			"SsoCredentials" => array(
				"Subscriber" => array(
					"Email" => $email,
					"ExternalReference" => $swid,
					"FirstName" => $fName,
					"LastName" => $lName
					//"BirthDate" => $birthDate //UTC date formatted as 'Y-m-d H:i:s\Z'
					),
				"Token" => $ssoToken
				)
		);
		//$updateRatingsRequest = '{"HouseholdMembersToUpdate" : [{"Privileges" :{"CreatePaymentInstrumentEnabled" : true, "EnforceAccessPrivileges" : true, "EnforceUsagePrivileges" : true, "MemberManagementEnabled" : true,"RatingPrivileges" : [1,10],},"SubscriberId" : 118535 }],"Id" : 550}';
		$content = json_encode($SSORequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-DistributionChannel:'.ChannelID,
      'CD-DeviceType:'.$device,
      'CD-Language:en-GB',
      'CD-AlternateCountry:CAN',
      'CD-Jwt:'.$jsonToken
    ));
        
		$json_response = curl_exec($curl);		
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);
		$response = json_decode($json_response, true);
	}
	function generateJsonToken(){
		// JWT Example: header.payload.signature
		// Header Example: {'typ':'JWT','alg':'HS256'}
		// Payload Example: {'iss': 'self', 'iat': 1440631178, 'exp': 1440634682, 'role': 'GeoOverride'}
		// More Info: https://scotch.io/tutorials/the-anatomy-of-a-json-web-token
		// Online generator: http://jwtbuilder.jamiekurtz.com/
		$header = base64_encode(json_encode(array('typ' => 'JWT', 'alg' => 'HS256')));
		$currentTime = time();
		$expTime = time() + 3600;
		$payload = base64_encode(json_encode(array('iss' => 'self' , 'iat' => $currentTime, 'exp' => $expTime , 'role' => 'GeoOverride')));
		$encodedString = $header . "." . $payload;
		$signature = str_replace('=', '', strtr(base64_encode(hash_hmac('SHA256',$encodedString, SaltValue, true)), '+/', '-_'));
		$jsonToken = $header . '.' . $payload . '.' . $signature;
		return $jsonToken;
	}
	function generateJsonTokenTest(){
		// JWT Example: header.payload.signature
		// Header Example: {'typ':'JWT','alg':'HS256'}
		// Payload Example: {'iss': 'self', 'iat': 1440631178, 'exp': 1440634682, 'role': 'GeoOverride'}
		// More Info: https://scotch.io/tutorials/the-anatomy-of-a-json-web-token
		// Online generator: http://jwtbuilder.jamiekurtz.com/
		$header = base64_encode(json_encode(array('typ' => 'JWT', 'alg' => 'HS256')));
		$currentTime = time();
		$expTime = time() + 3600;
		$payload = base64_encode(json_encode(array('iss' => 'self' , 'iat' => $currentTime, 'exp' => $expTime , 'role' => 'GeoOverride')));
		$encodedString = $header . "." . $payload;
		//$signature = str_replace('=', '', strtr(base64_encode(hash_hmac('SHA256',$encodedString, SaltValue, true)), '+/', '-_'));
		$signature = base64_encode(hash_hmac('SHA256',$encodedString, SaltValue, true));
		$jsonToken = $header . '.' . $payload . '.' . $signature;
		return $signature;
	}
	function createSessionWithUpdate($swid, $email, $login, $fName, $lName, $device, $selfCertify){
		$url = CreateSessionEndpoint; 
		$ssoToken = generateSsoToken($swid);
		$SSORequest = array(   
			//"JoinExistingSession" => True,
			"Login" => $login, 
			"SsoCredentials" => array(
				"Subscriber" => array(
					"Email" => $email,
					"ExternalReference" => $swid,
					"FirstName" => $fName,
					"LastName" => $lName,
					"AdditionalProperties"=>array(array(
						"ExternalReference"=> "SelfCertify",
						"Values"=> array($selfCertify)
					))
					//"BirthDate" => $birthDate //UTC date formatted as 'Y-m-d H:i:s\Z'
					),
				"Token" => $ssoToken
				)
		);
		//var_dump($SSORequest);
		//$updateRatingsRequest = '{"HouseholdMembersToUpdate" : [{"Privileges" :{"CreatePaymentInstrumentEnabled" : true, "EnforceAccessPrivileges" : true, "EnforceUsagePrivileges" : true, "MemberManagementEnabled" : true,"RatingPrivileges" : [1,10],},"SubscriberId" : 118535 }],"Id" : 550}';
		$content = json_encode($SSORequest);
		
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-DistributionChannel:'.ChannelID,
      'CD-DeviceType:'.$device
    ));
        
		$json_response = curl_exec($curl);		
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);
		$response = json_decode($json_response, true);
	}
	// Utility function to generate SSO Token
	function generateSsoToken($ssoLogin, $ssoNonce = null){
		if ($ssoLogin == ''){
    	$ssoLogin = ''; 
  	}
		if ($ssoNonce == '') {
			$ssoNonce = '';
		}
    $currDate = gmdate("Y-m-d H:i:s\Z");
	  // create the sso token hash
	  $ssoToken = $ssoNonce . ";" . $currDate . ";" . sha1(SaltValue . ";" . SystemID . ";" . $ssoLogin . ";" . $ssoNonce . ";" . $currDate . ";" . SaltValue);  
	  return $ssoToken; 
  }
	
	function createHousehold($sessionId, $swid){
		$url = CreateHouseholdEndpoint; 
		$createHouseholdRequest = array(   
			"Household" => array(
				"AutomaticallyShareEntitlements" => true,
				"Name" => $swid
			)
		);
		$content = json_encode($createHouseholdRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");	
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function retrieveHousehold($sessionId){
		$url = RetrieveHouseholdEndpoint; 
		$retrieveHouseholdRequest = array();
		$content = json_encode($retrieveHouseholdRequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function addToHousehold($sessionId, $email, $swid, $householdId, $restrictUsage, $ratings){
		$url = CreateSubscriberEndpoint; 
		$createSubscriberRequest;
		if($restrictUsage == '1'){
			$createSubscriberRequest = array(   
				"Credentials" => array(
					"Login" => $swid
				),
				"HouseholdId" => intval($householdId),
				"Privileges" => array(
					"CreatePaymentInstrumentEnabled" => true,
					"DayAndTimePrivileges" => array(
						array(
							"DayOfWeek" => 0,
							"DurationMinutes" => 720,
							"StartingHour" => 12,
							"StartingMinute" => 0
						),
						array(
							"DayOfWeek" => 1,
							"DurationMinutes" => 720,
							"StartingHour" => 12,
							"StartingMinute" => 0
						),
						array(
							"DayOfWeek" => 2,
							"DurationMinutes" => 720,
							"StartingHour" => 12,
							"StartingMinute" => 0
						),
						array(
							"DayOfWeek" => 3,
							"DurationMinutes" => 720,
							"StartingHour" => 12,
							"StartingMinute" => 0
						),
						array(
							"DayOfWeek" => 4,
							"DurationMinutes" => 720,
							"StartingHour" => 12,
							"StartingMinute" => 0
						),
						array(
							"DayOfWeek" => 5,
							"DurationMinutes" => 720,
							"StartingHour" => 12,
							"StartingMinute" => 0
						),
						array(
							"DayOfWeek" => 6,
							"DurationMinutes" => 720,
							"StartingHour" => 12,
							"StartingMinute" => 0
						)
					),
					"EnforceAccessPrivileges" => true,
					"EnforceUsagePrivileges" => true,
					"ProductSearchEnabled" => true,
					"MemberManagementEnabled" => true,
					"PurchaseEnabled" => true,
				  "RatingPrivileges" => $ratings,
				  "Timezone" => 11
				),
				"Subscriber" => array(			
					"Email" => $email,
					"FirstName" => $swid,
					"LastName" => $swid,
					"BirthDate" => "2014-10-27T23:01:23.923Z"
				)
			);
		}
		else {
			$createSubscriberRequest = array(   
				"Credentials" => array(
					"Login" => $swid
				),
				"HouseholdId" => intval($householdId),
				"Privileges" => array(
					"CreatePaymentInstrumentEnabled" => true,
					"EnforceAccessPrivileges" => true,
					"ProductSearchEnabled" => true,
					"MemberManagementEnabled" => true,
					"PurchaseEnabled" => true,
				  "RatingPrivileges" => $ratings
				),
				"Subscriber" => array(			
					"Email" => $email,
					"FirstName" => $swid,
					"LastName" => $swid,
					"BirthDate" => "2014-10-27T23:01:23.923Z"
				)
			);
		}		
		$content = json_encode($createSubscriberRequest);
		var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");		
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function removeFromHousehold($sessionId, $subscriberId, $householdId){
		$url = UpdateHouseholdEndpoint; 
		$removeSubscriberRequest = array(   
		
			"Id" => $householdId,
			//"Id" => 7062,
			"HouseholdMembersToRemove" => array(
				$subscriberId
				//274958, 274959
				//274949, 274960, 274961
			)
		);
		//$removeSubscriberRequest = {'Id':7062,'HouseholdMembersToRemove':[274958]}";
		$content = json_encode($removeSubscriberRequest);
		var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");		
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function updateContentProgress($sessionId, $productId, $planId, $progressSeconds){
		$url = UpdateContentProgressEndpoint; 
		$updateContentProgressRequest = array(   
			"PricingPlanId" => $planId,
			"ProductId" => $productId,
			"ProgressSeconds" => $progressSeconds
		);
		$content = json_encode($updateContentProgressRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		//curl_setopt($curl, CURLOPT_HTTPHEADER,$curl['header']);		
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function retrieveSubscriber($sessionId){
		$url = RetrieveSubscriberEndpoint; 
		$retrieveSubscriberRequest = array();
		$content = json_encode($retrieveSubscriberRequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function retrieveSubscriptionInfo($sessionId, $subscriptionId){
		$url = RetrieveSubscriptionEndpoint; 
		$retrieveSubscriptionRequest = array('Id' => $subscriptionId);
		$content = json_encode($retrieveSubscriptionRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function retrieveProductContext($productList, $subscriberId){
		$url = RetrieveProductContextEndpoint;
		$retrieveProductContextRequest = array(   
			"IncludeEntitlementContext" => true,
			"IncludeViewingContext" => true,
			"ProductExternalReferenceType" => "DisneyCoreID",
			"ProductExternalReferences" => $productList			
		);
		
		$content = json_encode($retrieveProductContextRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SubscriberId:'.$subscriberId
      //'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function retrieveProductPricingContext($productId, $subscriberId){
		$url = RetrieveProductContextEndpoint;
		$retrieveProductContextRequest = array(   
			"IncludeEntitlementContext" => true,
			"IncludeOrderablePricingPlans" => true,
			"ProductExternalReferenceType" => "DisneyCoreID",
			"ProductExternalReference" => $productId
		);
		
		$content = json_encode($retrieveProductContextRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SubscriberId:'.$subscriberId
      //'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function suspendUser($sessionId){
		$url = UpdateSubscriberEndpoint;
		$suspendUserRequest = array(   
			"Subscriber" => array(
				"Status" => "2"//,
				//"Language" => "en-US"
			)		
		);
		
		$content = json_encode($suspendUserRequest);
		var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function submitOrder($sessionId, $couponCode){
		$url = SubmitOrderEndpoint;
		$submitOrderRequest = array(
			"ShoppingCart" => array(
				"Items" => array(array(
					"PricingPlanId" => 25386,
					"ProductId" => 188925
				))
			),
			"RedemptionCodes" => array($couponCode)
		);
		if ($couponCode == ''){
			unset($submitOrderRequest["RedemptionCodes"]);
		}
		$content = json_encode($submitOrderRequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function submitCSROrder($productId, $planId, $swid){
		$url = SubmitCSROrderEndpoint;
		$submitOrderRequest = array(
			"ShoppingCart" => array(
				"Items" => array(array(
					"PricingPlanId" => $planId,
					"ProductId" => $productId
				))
			)
		);
		$content = json_encode($submitOrderRequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SubscriberExternalReference:'.$swid,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!'
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function submitCSROrderWithSubscriberId($productId, $planId, $subscriberId){
		$url = SubmitCSROrderEndpoint;
		$submitOrderRequest = array(
			"ShoppingCart" => array(
				"Items" => array(array(
					"PricingPlanId" => $planId,
					"ProductId" => $productId
				))
			)
		);
		$content = json_encode($submitOrderRequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SubscriberId:'.$subscriberId,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!'
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	// Calculate order with redemption
	function calculateOrderQuote($sessionId, $couponCode){
		$url = CalculateOrderQuote;
		$calculateOrderQuoteRequest = array(
			"ShoppingCart" => array(
				"Items" => array(array(
					"PricingPlanId" => 25386,
					"ProductId" => 188925
				))
			),
			"RedemptionCodes" => array($couponCode)
		);
		$content = json_encode($calculateOrderQuoteRequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function submitRemoveOrder($sessionId, $subscriptionId){
		$url = SubmitRemoveOrderEndpoint;
		$submitOrderRequest = array(
			//"SubscriptionId" => 36236,
			"SubscriptionId" => $subscriptionId,
			"RemoveReasonCode" => 0
			//"SubscriptionId" => 175263
			//"SubscriptionId" => 175264
		);
		$content = json_encode($submitOrderRequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function submitGiftOrder($sessionId){
		$url = SubmitGiftOrderEndpoint;
		$submitGiftOrderRequest = array(
			"RecipientEmail"=>"horizon.catalog@disney.com",
			"RecipientName"=>"Michael Jan",
			"SendNotification"=>TRUE,
			"SenderEmail"=>"mikeyjan@gmail.com",
			//"SenderMessage"=>"Hello!",
			"SenderName"=>"Michael Jan",
			"ShoppingCart" => array(
				"Items" => array(array(
					"PricingPlanId" => 25356,
					"ProductId" => 188861
				))
			)
		);
		$content = json_encode($submitGiftOrderRequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function submitGiftRedemptionOrder($sessionId,$redemptionCode){
		$url = SubmitGiftRedemptionOrderEndpoint;
		$submitGiftRedemptionOrderRequest = array(
			"RedemptionCode"=>$redemptionCode,
		);
		$content = json_encode($submitGiftRedemptionOrderRequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function retrieveWallet($sessionId){
		$url = RetrieveWalletEndpoint; 
		$retrieveWalletRequest = array(
		);
		$content = json_encode($retrieveWalletRequest);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function retrievePaymentInstrument($sessionId){
		$url = RetrievePaymentInstrumentEndpoint; 
		$retrievePaymentInstrument = array(
			"Id" => 50081
		);
		$content = json_encode($retrievePaymentInstrument);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function validatePaymentInstrument($sessionId){
		$url = ValidatePaymentInstrumentEndpoint; 
		$validatePaymentInstrument = array(
			"PaymentInstrument" => array(
				"CreditCard" => array(
					"Type" => 1
				),
				"Id" => 50081,
				"Type" => 0
			)		
		);
		$content = json_encode($validatePaymentInstrument);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function createPaymentInstrument($sessionId){
		$url = CreatePaymentInstrumentEndpoint; 
		$createPaymentInstrument = array(
			
			"PaymentInstrument" => array(
				"BillingAddress" => array(
					    "City" => "Chicago",
					    "Country" => "USA",
					    "LineOne" => "1212 N Lasalle",
					    "Name" => "1212 N Lasalle",
					    "PostalCode" => "60610",
					    "ShipToName" => "Michael Jan",
					    "State" => "IL",
				),
				"CreditCard" => array(
					"AccountNumber" => "4111111111111111",    
			    "Cvv" => "123",    
			    "ExpirationMonth" => "02",    
			    "ExpirationYear" => "2014",    
			    "NameOnCard" => "Michael",        
			    "Type" => 1
				),			
		    "Name" => "Test"
		   )
		   
		);
		$content = json_encode($createPaymentInstrument);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function updateSubscriber($sessionId){
		$url = UpdateSubscriberEndpoint; 
		$updateSubscriber = array(
			"Subscriber" => array (
				"AdditionalProperties" => array(array(
					"ExternalReference" => "SelfCertify",
					"Values" => array("Check") 
				)),
				"Language" => "en-US"
			)	   
		);
		$content = json_encode($updateSubscriber);
		//var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function searchSubscriptions($sessionId){
		$url = SearchSubscriptionsEndpoint;
		$searchSubscriptionsRequest = "";
		
		$content = json_encode($searchSubscriptionsRequest);
		var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	// Control renewal state and payment instrument
	function updateSubscription($sessionId, $subscriptionId){
		$url = UpdateSubscriptionEndpoint;
		$updateSubscriptionRequest = array(
			"Id" => $subscriptionId,
			"Renew" => false,
			"TerminationReason" => 0
		);
		
		$content = json_encode($updateSubscriptionRequest);
		var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	// Change pricing plan
	function modifyOrder($sessionId, $subscriptionId){
		$url = SubmitModifyOrderEndpoint;
		$modifyOrderRequest = array(
			"SubscriptionId" => $subscriptionId,
			"ChangeImmediately" => false,
			"ChangeItems" => array(array(
				"PricingPlanId" => 25389,
				"SubscriptionItemId" => 175806
			))
		);
		
		$content = json_encode($modifyOrderRequest);
		var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	// Apply coupon to current subscription
	function applyCoupon($sessionId, $subscriptionId){
		$url = ApplyCouponEndpoint;
		$applyCouponRequest = array(
			"SubscriptionId" => $subscriptionId,
			"RedemptionCodes" => array("disney20test")
		);
		
		$content = json_encode($applyCouponRequest);
		var_dump($content);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-SessionID:'.$sessionId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);		
		$response = json_decode($json_response, true);	
	}
	function searchProductsByCoupon($couponCode) {
		$url = SearchProductsByCouponEndpoint; 
		$searchProductsByCouponRequest = array('RedemptionCode' => $couponCode);
		$content = json_encode($searchProductsByCouponRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function searchDiscounts() {
		$url = SearchDiscountsEndpoint; 
		$searchProductsByCouponRequest = array('SearchString' => '20% Coupon');
		$content = json_encode($searchProductsByCouponRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!'
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function searchCoupons() {
		$url = SearchCouponsEndpoint; 
		$searchProductsByCouponRequest = array('SearchString' => '20% Coupon');
		$content = json_encode($searchProductsByCouponRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!'
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function retrieveDiscount() {
		$url = RetrieveDiscountEndpoint; 
		$searchProductsByCouponRequest = array('Id' => array( 'Value' => 483));
		$content = json_encode($searchProductsByCouponRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!'
    ));       
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function retrieveCoupon() {
		$url = RetrieveCouponEndpoint; 
		$searchProductsByCouponRequest = array('Id' => array( 'Value' => 3216));
		$content = json_encode($searchProductsByCouponRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!'
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function createCouponRedemptionCode() {
		$url = CreateCouponRedemptionCodeEndpoint; 
		$createCouponRedemptionCodeRequest = 
		array('CouponRedemptionCode'=>
			array(
			'CouponId'=>
				array(
					'Value'=>3216
				),
				'RedemptionCode'=>'disney20test1'
			)
			
		);  
		$content = json_encode($createCouponRedemptionCodeRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!'
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function removeDiscount() {
		$url = RemoveDiscountEndpoint; 
		$removeDiscountRequest = 
		array(
			'Id' => 39392,
			'Reason' => 1
		);  
		$content = json_encode($removeDiscountRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!'
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function retrieveActiveSessions($subscriberId) {
		$url = RetrieveActiveSessionsEndpoint; 
		$retrieveActiveSessionsRequest =  '';  
		$content = json_encode($retrieveActiveSessionsRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!',
      'CD-SubscriberId:'.$subscriberId
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function retrieveOrder($orderNumber) {
		$url = RetrieveOrderEndpoint; 
		$retrieveOrderRequest = array('OrderNumber' => $orderNumber);
		$content = json_encode($retrieveOrderRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!'
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function retrieveOverview($swid) {
		$url = RetrieveOverviewEndpoint; 
		$retrieveOverviewRequest = '';
		$content = json_encode($retrieveOverviewRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!',
      'CD-SubscriberExternalReference:'.$swid,
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function searchSubscriptionsManagement($swid) {
		$url = SearchSubscriptionsManagementEndpoint; 
		$searchSubscriptionsRequest = '';
		$content = json_encode($searchSubscriptionsRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!',
      'CD-SubscriberExternalReference:'.$swid,
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function toggleOnAutorenewal($subscriptionId) {
		//jsonRequest = '{"Id":"' + subscriptionId +'","Renew":1}';
		$url = CSRUpdateSubscriptionEndpoint; 
		$updateSubscriptionRequest = array('Id' => $subscriptionId, 'Renew' => true, 'RenewalType' => 2);
		$content = json_encode($updateSubscriptionRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!',
      //'CD-SubscriberExternalReference:'.$swid,
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
	function emailLogin($email) {
		//jsonRequest = '{"Id":"' + subscriptionId +'","Renew":1}';
		$url = EmailLoginEndpoint; 
		$emailLoginRequest = array('Email' => $email);
		$content = json_encode($emailLoginRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!'
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	}
	function generatePassword($swid) {
		//jsonRequest = '{"Id":"' + subscriptionId +'","Renew":1}';
		$url = GeneratePasswordEndpoint; 
		$generatePasswordRequest = array('Login' => $swid);
		$content = json_encode($generatePasswordRequest);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,"0");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,"0");
    curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,"true");
		curl_setopt($curl, CURLOPT_ENCODING,"gzip,deflate");
		curl_setopt($curl, CURLOPT_POSTFIELDS,$content);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'CD-SystemID:'.SystemID,
      'CD-User:horizon.catalog@disney.com',
      'CD-Password:H0rizon!'
    ));
        
		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);		
		curl_close($curl);		
		$response = json_decode($json_response, true);
	};
?>