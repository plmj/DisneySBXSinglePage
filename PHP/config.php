<?php

//Operating Mode
$operational_mode = 'SBX';

if ($operational_mode == 'SBX') {
	//SBX
	define("CreateSessionEndpoint", "https://services.sbx1.cdops.net/Subscriber/CreateSession");
	define("CreateHouseholdEndpoint", "https://services.sbx1.cdops.net/Subscriber/CreateHousehold");
	define("CreateSubscriberEndpoint", "https://services.sbx1.cdops.net/Subscriber/CreateSubscriber");
	define("RetrieveHouseholdEndpoint", "https://services.sbx1.cdops.net/Subscriber/RetrieveHouseholds");
	define("RetrieveSubscriptionEndpoint", "https://services.sbx1.cdops.net/Subscriber/RetrieveSubscription");
	define("RetrieveProductContextEndpoint", "https://services.sbx1.cdops.net/Subscriber/RetrieveProductContext");
	define("UpdateHouseholdEndpoint", "https://services.sbx1.cdops.net/Subscriber/UpdateHouseholdMembers");
	define("UpdateContentProgressEndpoint", "https://services.sbx1.cdops.net/Subscriber/UpdateContentProgress");
	define("RetrieveAddressesEndpoint", "https://services.sbx1.cdops.net/Subscriber/RetrieveAddresses");
	define("RetrieveSubscriberEndpoint", "https://services.sbx1.cdops.net/Subscriber/RetrieveSubscriber");
	define("UpdateSubscriberEndpoint", "https://services.sbx1.cdops.net/Subscriber/UpdateSubscriber");
	define("SubmitOrderEndpoint", "https://services.sbx1.cdops.net/Subscriber/SubmitOrder");
	define("SubmitCSROrderEndpoint", "https://services.sbx1.cdops.net/SubscriberManagement/SubmitOrder");
	define("SubmitRemoveOrderEndpoint", "https://services.sbx1.cdops.net/Subscriber/SubmitRemoveOrder");
	define("RetrieveWalletEndpoint", "https://services.sbx1.cdops.net/Subscriber/RetrieveWallet");
	define("RetrievePaymentInstrumentEndpoint", "https://services.sbx1.cdops.net/Subscriber/RetrievePaymentInstrument");
	define("CreatePaymentInstrumentEndpoint", "https://services.sbx1.cdops.net/Subscriber/CreatePaymentInstrument");
	define("ValidatePaymentInstrumentEndpoint", "https://services.sbx1.cdops.net/Subscriber/ValidatePaymentInstrument");
	define("SubmitGiftOrderEndpoint", "https://services.sbx1.cdops.net/Subscriber/SubmitGiftOrder");
	define("SubmitGiftRedemptionOrderEndpoint", "https://services.sbx1.cdops.net/Subscriber/SubmitGiftRedemptionOrder");
	define("SearchSubscriptionsEndpoint", "https://services.sbx1.cdops.net/Subscriber/SearchSubscriptions");
	define("UpdateSubscriptionEndpoint", "https://services.sbx1.cdops.net/Subscriber/UpdateSubscription");
	define("SubmitModifyOrderEndpoint", "https://services.sbx1.cdops.net/Subscriber/SubmitModifyOrder");
	define("ApplyCouponEndpoint", "https://services.sbx1.cdops.net/Subscriber/ApplyCoupon");
	define("CalculateOrderQuote", "https://services.sbx1.cdops.net/Subscriber/CalculateOrderQuote");
	define("SearchProductsByCouponEndpoint", "https://services.sbx1.cdops.net/Subscriber/SearchProductsByCoupon");
	define("ViewContentEndpoint", "https://services.sbx1.cdops.net/Subscriber/ViewContent");
	define("SearchDiscountsEndpoint", "https://services.sbx1.cdops.net/Catalog/SearchDiscounts");
	define("SearchCouponsEndpoint", "https://services.sbx1.cdops.net/Catalog/SearchCoupons");
	define("RetrieveDiscountEndpoint", "https://services.sbx1.cdops.net/Catalog/RetrieveDiscount");
	define("RetrieveCouponEndpoint", "https://services.sbx1.cdops.net/Catalog/RetrieveCoupon");
	define("CreateCouponRedemptionCodeEndpoint", "https://services.sbx1.cdops.net/Catalog/CreateCouponRedemptionCode");
	define("RemoveDiscountEndpoint", "https://services.sbx1.cdops.net/SubscriberManagement/RemoveDiscount");
	define("RetrieveActiveSessionsEndpoint", "https://services.sbx1.cdops.net/SubscriberManagement/RetrieveActiveSessions");
	define("RetrieveOrderEndpoint", "https://services.sbx1.cdops.net/SubscriberManagement/RetrieveOrder");
	define("RetrieveOverviewEndpoint", "https://services.sbx1.cdops.net/SubscriberManagement/RetrieveOverview");
	define("SearchSubscriptionsManagementEndpoint", "https://services.sbx1.cdops.net/SubscriberManagement/SearchSubscriptions");
	define("CSRUpdateSubscriptionEndpoint", "https://services.sbx1.cdops.net/SubscriberManagement/UpdateSubscription");
	define("EmailLoginEndpoint", "https://services.sbx1.cdops.net/SubscriberManagement/EmailLogin");
	define("GeneratePasswordEndpoint", "https://services.sbx1.cdops.net/SubscriberManagement/GeneratePassword");
	define("SystemID", "02c62e64-6528-49e1-8800-8b52a97274a6");
	define("ChannelID", "e777708b-f758-4d91-aaec-170755b9ed7e");
	define("SaltValue", "DisneyHorizonSBX2014");
}


?>