<?php
/**
 * Created by PhpStorm.
 * User: flasher007
 * Date: 23.12.2014
 * Time: 20:37
 Тест!!!
 */

class Order {
    private static $defaultEmail = 'avolkov05@gmail.com';
    private static $defaultPersonTypeId = '1';
    private static $defaultDelivery = '2';
    private static $defaultPaySystem = '1';
    private static $defaultUserId = '2';
	private static $def = '2';

    public static function createOrder1Click($name, $phone) {
        $arBasketItems = array();
        $arErrors = array();
        $arAdditionalFields = array();
        $arCupon = array();
        $dbBasketItems = null;
        $isDefaultUser = false;

        global $USER;
        if (!$USER->IsAuthorized()) {
            $USER->Authorize(self::$defaultUserId);
            $isDefaultUser = true;
        }

        $arAdditionalFields = array(
            "LID" => SITE_ID,
            "STATUS_ID" => "N",
            "PAYED" => "N",
            "CANCELED" => "N",
            "USER_DESCRIPTION" => "Заказ в один клик",
        );

        $arShoppingCart = CSaleBasket::DoGetUserShoppingCart(
            SITE_ID,
            intval($USER->GetID()),
            intval(CSaleBasket::GetBasketUserID()),
            $arErrors,
            $arCupon);
        
        $arBasketItems = CSaleOrder::DoCalculateOrder(
            SITE_ID,
            $USER->GetID(),
            $arShoppingCart,
            self::$defaultPersonTypeId,
            array(),
            self::$defaultDelivery,
            self::$defaultPaySystem,
            array(),
            $arErrors,
            $arWarnings
        );
        $arBasketItems['ORDER_PROP'][1] = $name;
        $arBasketItems['ORDER_PROP'][3] = $phone;
//         echo "<pre>";
//         print_r($arBasketItems);
//         echo "</pre>";
//  		exit();
        $ORDER_ID = CSaleOrder::DoSaveOrder($arBasketItems, $arAdditionalFields, 0, $arErrors);
		if($ORDER_ID>0){
			global $DB,$APPLICATION;
			$arFields = array(
				'EMAIL' => $USER->GetEmail(),
				"TITLE" => 'Быстрый заказ',
				'SALE_EMAIL' => COption::GetOptionString("sale", "order_email"),
				'ORDER_DATE' => Date($DB->DateFormatToPHP(CLang::GetDateFormat("SHORT", SITE_ID))),
				'PAY_SYSTEM' => '',
				'DELIVERY' => '',
				'DELIVERY_DATE' => '',
				'DELIVERY_TIME' => '',
				'DELIVERY_ADDRESS' => '',
				'DELIVERY_WERE' => '',
				'ORDER_DESCRIPTION' => '',
				'ORDER_ID' => $ORDER_ID, 
				'PRICE' => number_format($arBasketItems['ORDER_PRICE'],0, ',',' ').' руб.',
				'ORDER_LIST' => '',
				'ORDER_USER' => $name,
				'USER_PHONE' => 'Ваш телефон: '.$phone,'<br>',
			);
			
			/*foreach(GetModuleEvents("sale", "OnOrderNewSendEmail", true) as $arEvent)
				ExecuteModuleEventEx($arEvent, Array($ORDER_ID, $arFields));*/
			
			$eventName = "SALE_NEW_ORDER";
			
			$bSend = true;
			foreach(GetModuleEvents("sale", "OnOrderNewSendEmail", true) as $arEvent)
				if (ExecuteModuleEventEx($arEvent, array($ORDER_ID, &$eventName, &$arFields))===false)
				$bSend = false;
			
			if($bSend)
			{
				$event = new CEvent;
				$event->Send($eventName, SITE_ID, $arFields);
			}
		}
		        
        if (true === $isDefaultUser) $USER->Logout();
        $APPLICATION->RestartBuffer();
        return ($ORDER_ID && empty($arErrors)) ? 1 : 0;
    }

    public static function getFullOrder($orderId, $all=true){
        //use Bitrix\Sale\Location;
        if (true === $all) {
            $arOrder = CSaleOrder::GetByID($orderId);
        }

        $dbProps = CSaleOrderPropsValue::GetList(array("SORT" => "ASC"),array("ORDER_ID" => $orderId));

        while ($arProps = $dbProps->Fetch()) {

            if ($arProps['CODE']=='TIME') {
                $arTimeVal = CSaleOrderPropsVariant::GetByValue($arProps["ORDER_PROPS_ID"], $arProps['VALUE']);
                $arProps['VALUE'] = $arTimeVal['NAME'];
            }
            $arOrder['PROPERTIES'][$arProps['CODE']] = $arProps['VALUE'];
        }
        $arOrder['PROPERTIES']['LOCATION'] = Bitrix\Sale\Location\Admin\LocationHelper::getLocationPathDisplay($arOrder['PROPERTIES']['ADDRESS']);
        //CSaleLocation::GetByID($arOrder['PROPERTIES']['ADDRESS']);

        return $arOrder;
    }

    /**
     *
     * @return array
     */
    public static function getBasketForCurrentUser() {
        CModule::IncludeModule("sale");

        $arBasketItems = array();

        $dbBasketItems = CSaleBasket::GetList(
            array(
                "NAME" => "ASC",
                "ID" => "ASC"
            ),
            array(
                "FUSER_ID" => CSaleBasket::GetBasketUserID(),
                "LID" => SITE_ID,
                "ORDER_ID" => "NULL"
            ),
            false,
            false,
            array("ID", "PRODUCT_ID", "QUANTITY", "PRICE", "DELAY", "CAN_BUY")
        );
        $totalPrice = 0;
        $result['ITEMS'] = array();
        while ($arItems = $dbBasketItems->Fetch())
        {
            if ($arItems['DELAY']=='Y') {
                $arBasketItems['DELAY'][$arItems['PRODUCT_ID']] = $arItems;
            } else {
                $arBasketItems['BASKET'][$arItems['PRODUCT_ID']] = $arItems;
            }

        }
        return $arBasketItems;
    }

    /**
     * @todo добавить кеш
     * @param $productIds
     * @param array $arProperties
     */
    public static function getPropsForBasketItems($productIds, $arProperties = array('PROPERTY_*'), $isSKUCatalog = false) {
        $result = array();
        // если это торговые предложение. то берем ИД товаров
        if (true === $isSKUCatalog) {
            $arProductsList = CCatalogSKU::getProductList($productIds, IBLOCK_SKUCATALOG_ID);
            $productIds = array();
            $arBasketOffer = array();
            foreach ($arProductsList as $offerId => $productInfo) {
                $productIds[] = $productInfo['ID'];
                $arBasketOffer[$productInfo['ID']] = $offerId;
            }
        }

        $arSelect = array_merge(array("ID", "NAME", "PREVIEW_PICTURE"), $arProperties);
        $arFilter = Array("IBLOCK_ID"=>IBLOCK_CATALOG_ID, "ACTIVE_DATE"=>"Y", "ACTIVE"=>"Y","ID"=>$productIds);
        $arCatalogItemRes = CIBlockElement::GetList(Array(), $arFilter, false, false, $arSelect);
        while ($arCatalogItem = $arCatalogItemRes->Fetch()) { //список товаров
            $arGoodsId = array();
            //$arB[$arCatalogItem["ID"]] = $arCatalogItem;
            $arSelectGoods = array("ID", "NAME", "PROPERTY_GOODS");
            $arFilterGoods = Array("IBLOCK_ID"=>20, "ACTIVE_DATE"=>"Y", "ACTIVE"=>"Y","SECTION_ID"=>$arCatalogItem['PROPERTY_COMPLECT_VALUE']);
            $arGoodsRes = CIBlockElement::GetList(Array(), $arFilterGoods, false, false, $arSelectGoods);
            while ($arGoods = $arGoodsRes->Fetch()) { // список комплектов
                $arGoodsId[] = $arGoods['PROPERTY_GOODS_VALUE']; //id товаров входящих в состав комплекта
            }

            $arGoodsId = array_diff($arGoodsId, $productIds); //убираем товары которые уже есть в корзине
//Helper::dump($arGoodsId);
            if (sizeof($arGoodsId)){
                $arSelectComplect = array("ID", "NAME", "PREVIEW_PICTURE",'PROPERTY_*');
                $arFilterComplect = Array("IBLOCK_ID"=>IBLOCK_CATALOG_ID, "ACTIVE_DATE"=>"Y", "ACTIVE"=>"Y","ID"=>$arGoodsId);
                $arComplectRes = CIBlockElement::GetList(Array(), $arFilterComplect, false, false, $arSelectComplect);
                while ($arComplect = $arComplectRes->Fetch()){
                    $arComplect['PREVIEW_PICTURE'] = CFile::GetFileArray($arComplect['PREVIEW_PICTURE']);
                    //$arCMLTraitsRes = CIBlockElement::GetProperty(IBLOCK_CATALOG_ID,$arComplect['ID'],array(),array('CODE' => 'CML2_TRAITS'));
                    //$arCMLTraitsRes = CIBlockFormatProperties::GetDisplayValue(array('ID'=>$arComplect['ID']),array('CODE'=>'CML2_TRAITS'));
                    //Helper::dump($arCMLTraitsRes);
                    $result[$arBasketOffer[$arCatalogItem['ID']]][$arComplect['ID']] = $arComplect;
                    $arComplectOffer = CCatalogSKU::getOffersList(
                        array($arComplect['ID']),
                        0,
                        array(),
                        array('CATALOG_GROUP_4')
                        );
                    $result[$arBasketOffer[$arCatalogItem['ID']]][$arComplect['ID']]['OFFER'] =
                        array_shift(array_shift($arComplectOffer)); //получаем сразу массив данных
                }
            }
            //*/
        }
        // Получим привильные названия
        foreach($result as $numCom=>$arComplects){
        	foreach($arComplects as $numProd=>$prod){
        		$db_props = CIBlockElement::GetProperty(IBLOCK_CATALOG_ID,$prod['ID'],array(),array('CODE'=>'CML2_TRAITS'));
        		while($ar_props = $db_props->Fetch()){
        			if($ar_props['DESCRIPTION']=='Полное наименование'){
        				$result[$numCom][$numProd]['NAME_'] = $result[$numCom][$numProd]['NAME'];
        				$result[$numCom][$numProd]['NAME'] = $ar_props['VALUE'];
        			}
        		}
        	}
        }
        return $result;
    }
}