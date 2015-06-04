<?
/**
 * Помошник для работы
 * Class Helper
 */
class Helper {

	const CATALOG_SMALL_PHOTO_WIDTH = 96;
	const CATALOG_SMALL_PHOTO_HEIGHT = 76;
	const CATALOG_BIG_PHOTO_WIDTH = 450;
	const CATALOG_BIG_PHOTO_HEIGHT = 400;

	public static $cityIblockID = 3;
	public static $readyIblockID = 10;
	public static $defaultCity = array('ID'=>'3', 'NAME'=>'Екатеринбург');

	/**
	 * Dump
	 * @param $var
	 */
	public static function dump($var) {
		global $USER;
		if ($USER->IsAdmin()) {
			echo "<pre>";
			print_r($var);
			echo "</pre>";
		}
	}

	/**
	 * @param $url
	 * @return bool
	 */
	public static function getYoutubeVideoID($url) {
		$pattern = '#^(?:https?://)?'; # Optional URL scheme. Either http or https.
		$pattern .= '(?:www\.)?'; #  Optional www subdomain.
		$pattern .= '(?:'; #  Group host alternatives:
		$pattern .= 'youtu\.be/'; #    Either youtu.be,
		$pattern .= '|youtube\.com'; #    or youtube.com
		$pattern .= '(?:'; #    Group path alternatives:
		$pattern .= '/embed/'; #      Either /embed/,
		$pattern .= '|/v/'; #      or /v/,
		$pattern .= '|/watch\?v='; #      or /watch?v=,
		$pattern .= '|/watch\?.+&v='; #      or /watch?other_param&v=
		$pattern .= ')'; #    End path alternatives.
		$pattern .= ')'; #  End host alternatives.
		$pattern .= '([\w-]{11})'; # 11 characters (Length of Youtube video ids).
		$pattern .= '(?:.+)?$#x'; # Optional other ending URL parameters.
		preg_match($pattern, $url, $matches);
		return (isset($matches[1])) ? $matches[1] : false;
	}

	public static function getVideoImg($url){
		if (!$url) return false;
		$videoId = Helper::getYoutubeVideoID($url);

		return "http://img.youtube.com/vi/" . $videoId . "/mqdefault.jpg";
	}

	public static function getVideoName($url){
		if (!$url) return false;
		$videoId = Helper::getYoutubeVideoID($url);

		$gdataUrl = 'https://gdata.youtube.com/feeds/api/videos/' . $videoId . '?alt=json&v=2';

		return file_get_contents($gdataUrl);
	}

	public static function groupBySection($IBLOCK_ID){
		CModule::IncludeModule("iblock");
		$arResult = array();

		$obCache = \Bitrix\Main\Data\Cache::createInstance();
		$cache_time = "864000";
		$cache_id = "staffsections";

		if( $obCache->initCache($cache_time,$cache_id) )
		{
			$arResult = $obCache->GetVars();
		}elseif( $obCache->startDataCache()){
			$arFilter = Array('IBLOCK_ID'=>$IBLOCK_ID, 'GLOBAL_ACTIVE'=>'Y');
			$arResSection = CIBlockSection::GetList(Array("SORT"=>"ASC"), $arFilter);
			while ($arSection = $arResSection->Fetch()){
				$arResult[$arSection['ID']] = array(
					'NAME'=>$arSection['NAME']);
			}
			if($arResult){
				$obCache->endDataCache($arResult);
			}else{
				$obCache->abortDataCache();
			}
		}
		return $arResult;
	}

	public static function is(&$value, $default = false, $show_value = false){
		if(isset($value) && $value) {
			if(isset($show_value) && $show_value) {
				return $show_value;
			}
			return $value;
		}

		return $default;
	}

	public static function is_set(&$value, $default = null) {
		if(isset($value) && $value) {
			return $value;
		}

		return $default;
	}

	/**
	 * @return bool
	 */
	public static function isAjax() {
		if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
			return true;
		}
		return false;
	}

	/**
	 * @return string
	 */
	public static function getMainClassName() {
		$currentDir = Bitrix\Main\Application::getInstance()->getContext()->getRequest()->getRequestedPageDirectory();
		$dir=explode('/',$currentDir);
		$class = '';
		if ((strstr($currentDir, 'stores'))){
			$class = 'c-block clearfix';
		} elseif($currentDir=='') {
			$class = '';
		} else {
			$class = 'w-block';
		}

		return $class;
		//(strstr($currentDir, 'stores')) ? 'c-block clearfix' : 'l-block';
	}

	/**
	 * @return array
	 */
	public static function getCityList() {
		CModule::IncludeModule('iblock');

		$arFilter = Array(
			'IBLOCK_ID' => self::$cityIblockID,
			'GLOBAL_ACTIVE' => 'Y'
		);

		$arSelect = array('ID','NAME','CODE','PROPERTY_ROD');

		$dbCityList = CIBlockElement::GetList(Array('NAME'=>'ASC'), $arFilter, false, false, $arSelect);

		$result = array();

		$currentCity = Location::getInstance()->getCity();
		$currentCityExist = false;
		$Selected = false;

		while($arCity = $dbCityList->GetNext()) {

			$result[$arCity['ID']] = array(
				'ID' => $arCity['ID'],
				'NAME' => $arCity['NAME'],
				'CODE' => $arCity['CODE'],
				'ROD' => $arCity['PROPERTY_ROD_VALUE'],
				'SELECTED' => ''
			);
			if ($arCity['NAME'] == $currentCity && !$currentCityExist && !isset($_COOKIE['accept_city'])) {
				$currentCityExist = true;
				$result[$arCity['ID']]['SELECTED'] = 'selected';
				$Selected = true;
				Location::getInstance()->setCityId($arCity['ID']);
			}
			if (isset($_COOKIE['accept_city']) && $_COOKIE['city_id'] == $arCity['ID']) {
				$result[$arCity['ID']]['SELECTED'] = 'selected';
				$Selected = true;
				Location::getInstance()->setCityId($arCity['ID']);
			}
		}
		if($Selected==false){
			$result[Helper::$defaultCity['ID']]['SELECTED'] = 'selected';
			Location::getInstance()->setCityId(Helper::$defaultCity['ID']);
		}
		if (false === $currentCityExist && !isset($_COOKIE['accept_city'])) {
			/*$result[0] = array(
				'NAME' => $currentCity,
				'SELECTED' => 'selected'
			);*/
		}

		return $result;
	}

	public static function getSectionList($IBLOCK_ID) {
		$arResult = array();

		$arFilter = Array('IBLOCK_ID'=>$IBLOCK_ID, 'GLOBAL_ACTIVE'=>'Y');
		$arResSection = CIBlockSection::GetList(Array("SORT"=>"ASC"), $arFilter);

		while ($arSection = $arResSection->Fetch()){
			$arResult[$arSection['ID']] = array(
				'NAME' => $arSection['NAME']);
		}

		return $arResult;
	}

	public static function getIblockTags() {
		CModule::IncludeModule('search');
		$rsTags = CSearchTags::GetList(
			array(),
			array(
				"MODULE_ID" => "iblock",
			),
			array(
				"CNT" => "DESC",
			),
			5
		);
		while($arTag = $rsTags->Fetch()) {
			$arResult[] = $arTag;
		}

		return $arResult;
	}

	/**
	 * @param $imageID
	 * @param $width
	 * @param $height
	 * @return mixed
	 */
	public static function getResizeImageSrc($imageID, $width, $height)
	{
		$pic = Image::contain(
			$imageID,
			array(
				'height' => $height,
				'width' => $width
			));
		//Helper::dump($pic);
		/*$file = CFile::ResizeImageGet($imageID, array(
				'width' => $width,
				'height' => $height),
			BX_RESIZE_IMAGE_PROPORTIONAL);*/
		return $pic['SRC'];
	}



	/**
	 * GetCurPageParam с поддержкой многомерных массивов и любых URI.
	 * Хорошо использовать в фильтре
	 * @param string $strParam
	 * @param array $arParamKill
	 * @param null $get_index_page
	 * @param bool $uri
	 * @return string
	 */
	public static function getCurPageParam($strParam = '', $arParamKill = array(), $get_index_page = NULL, $uri = FALSE ){

		if( NULL === $get_index_page ){
			if( defined( 'BX_DISABLE_INDEX_PAGE' ) )
				$get_index_page = !BX_DISABLE_INDEX_PAGE;
			else
				$get_index_page = TRUE;
		}

		$sUrlPath = GetPagePath( $uri, $get_index_page );
		$strNavQueryString = self::deleteParam( $arParamKill, $uri );

		if( $strNavQueryString != '' && $strParam != '' )
			$strNavQueryString = '&'.$strNavQueryString;

		if( $strNavQueryString == '' && $strParam == '' )
			return $sUrlPath;
		else
			return $sUrlPath.'?'.$strParam.$strNavQueryString;
	}

	/**
	 * @param $arParam
	 * @param bool $uri
	 * @return mixed|string
	 */
	public static function deleteParam( $arParam, $uri = FALSE ){

		$get = array();
		if( $uri && ( $qPos = strpos( $uri, '?' ) ) !== FALSE ){
			$queryString = substr( $uri, $qPos + 1 );
			parse_str( $queryString, $get );
			unset( $queryString );

		}

		if( sizeof( $get ) < 1 )
			$get = $_GET;

		if( sizeof( $get ) < 1 )
			return '';

		if( sizeof( $arParam ) > 0 ){
			foreach( $arParam as $param ){
				$search    = &$get;
				$param     = (array)$param;
				$lastIndex = sizeof( $param ) - 1;

				foreach( $param as $c => $key ){
					if( array_key_exists( $key, $search ) ){
						if( $c == $lastIndex )
							unset( $search[$key] );
						else
							$search = &$search[$key];
					}
				}
			}
		}

		return str_replace(
			array( '%5B', '%5D' ),
			array( '[', ']' ),
			http_build_query( $get )
		);
	}

	public static function getReadySystem($sectionId) {
		CModule::IncludeModule("iblock");
		$arResult = array();

		$obCache = \Bitrix\Main\Data\Cache::createInstance();
		$cache_time = "864000";
		$cache_id = "readylist";

		if( $obCache->initCache($cache_time,$cache_id) )
		{
			$arResult = $obCache->GetVars();
		}elseif( $obCache->startDataCache()){
			$arFilter = Array('IBLOCK_ID'=>10, 'ACTIVE'=>'Y');
			$arResSection = CIBlockSection::GetList(
				array("SORT"=>"ASC"),
				$arFilter,
				false,
				array('ID', 'NAME', 'DESCRIPTION','PICTURE','UF_CATALOG_SECTION','UF_CATALOG_TEXT'));
			while ($arSection = $arResSection->Fetch()){
				$arResult[$arSection['ID']] = $arSection;
			}
			if($arResult){
				$obCache->endDataCache($arResult);
			}else{
				$obCache->abortDataCache();
			}
		}
		if ($sectionId>0){
			foreach($arResult as $arSection) {
				if (in_array($sectionId, $arSection['UF_CATALOG_SECTION'])){
					$arSection['PROPERTIES'] = Helper::getPropertiesBySectionId($sectionId);
					return $arSection;
				}
			}
		}


		return $arResult;
	}

	public static function getPropertiesBySectionId($sectionId){
		foreach(CIBlockSectionPropertyLink::GetArray(Helper::$readyIblockID, $sectionId) as $PID => $arLink)
		{
			if($arLink["SMART_FILTER"] !== "Y")
				continue;

			$rsProperty = CIBlockProperty::GetByID($PID);
			$arProperty = $rsProperty->Fetch();
			if($arProperty)
			{
				$values = array();
				if ($arProperty['PROPERTY_TYPE']=="L") {
					$rsEnum = CIBlockPropertyEnum::GetList(array("SORT" => "ASC", "VALUE" => "ASC"), array("PROPERTY_ID" => $arProperty["ID"]));
					while ($enum = $rsEnum->Fetch())
						$values[$enum["ID"]] = $enum;
				}
				$items[$arProperty["ID"]] = array(
					"ID" => $arProperty["ID"],
					"IBLOCK_ID" => $arProperty["IBLOCK_ID"],
					"CODE" => $arProperty["CODE"],
					"NAME" => $arProperty["NAME"],
					"PROPERTY_TYPE" => $arProperty["PROPERTY_TYPE"],
					"USER_TYPE" => $arProperty["USER_TYPE"],
					"USER_TYPE_SETTINGS" => $arProperty["USER_TYPE_SETTINGS"],
					"VALUES" => $values,
				);

				if($arProperty["PROPERTY_TYPE"] == "N")
				{
					$minID = 'filter'.'_'.$arProperty['ID'].'_MIN';
					$maxID = 'filter'.'_'.$arProperty['ID'].'_MAX';
					$items[$arProperty["ID"]]["VALUES"] = array(
						"MIN" => array(
							"CONTROL_ID" => $minID,
							"CONTROL_NAME" => $minID,
						),
						"MAX" => array(
							"CONTROL_ID" => $maxID,
							"CONTROL_NAME" => $maxID,
						),
					);
				}
			}
		}
		return $items;
	}

	/**
	 * Ex: (42, array('арбуз', 'арбуза', 'арбузов'))
	 * @param int $n
	 * @param array $forms
	 * @return mixed
	 */
	public static function plural($n, $forms) {
		return $n%10==1&&$n%100!=11?$forms[0]:($n%10>=2&&$n%10<=4&&($n%100<10||$n%100>=20)?$forms[1]:$forms[2]);
	}

	/**
	 * @param $id
	 */
	public static function getProductInfo($id) {
		CModule::IncludeModule("iblock");
		$arProd = CCatalogSku::GetProductInfo($id);
		if (is_array($arProd)){
			$arFilter = Array("IBLOCK_ID"=>IBLOCK_CATALOG_ID, "ACTIVE_DATE"=>"Y", "ACTIVE"=>"Y","ID"=>$arProd['ID']);
		}
		else{
			$arFilter = Array("IBLOCK_ID"=>IBLOCK_CATALOG_ID, "ACTIVE_DATE"=>"Y", "ACTIVE"=>"Y","ID"=>$id);
		}
		//$arSelect = Array("ID", "NAME", "PREVIEW_PICTURE");
		$res = CIBlockElement::GetList(Array(), $arFilter);
		$arRes = $res->Fetch();
		//Helper::dump($arRes);
		$arRes['PREVIEW_PICTURE'] = CFile::ResizeImageGet($arRes['PREVIEW_PICTURE'], array(
				'width' => 120,
				'height' => 120),
			BX_RESIZE_IMAGE_PROPORTIONAL, true);

		return $arRes;
	}
	/**
	 * @param $id
	 */
	public static function getProductMainSection($id) {
		CModule::IncludeModule("iblock");
		// Определяем раздел товара
		$arProductsList = CCatalogSku::GetProductInfo($id);
		$arFilter = array('ID'=>$arProductsList['ID']);
		$arOrder = array();
		$arSelectFields = array('ID','IBLOCK_SECTION_ID');
		$rsEl = CIBlockElement::GetList($arOrder, $arFilter, false, false, $arSelectFields);
		$arCurEl = $rsEl->GetNext();
		$rsSect = CIBlockSection::GetNavChain(false,$arCurEl['IBLOCK_SECTION_ID']);
		$arSect = $rsSect->GetNext();
		
		return $arSect['ID'];
		
	}
	public static function updatePrice() {
		if(CModule::IncludeModule("iblock") && CModule::IncludeModule("sale") && CModule::IncludeModule("catalog"))
		{
			$arInfo = CCatalogSKU::GetInfoByProductIBlock(IBLOCK_CATALOG_ID);
			$arSelect = Array("ID", "NAME");
			$arFilter = Array("IBLOCK_ID"=>IBLOCK_CATALOG_ID, "ACTIVE_DATE"=>"Y", "ACTIVE"=>"Y");
			$res = CIBlockElement::GetList(Array(), $arFilter, false, false, $arSelect);
			$i = 0;
			$bFirstOffer = true;
			while($arFields = $res->Fetch())
			{
				$ID = $arFields['ID'];
				$rsOffers = CIBlockElement::GetList(
					array(),
					array('IBLOCK_ID' => $arInfo['IBLOCK_ID'], 'PROPERTY_'.$arInfo['SKU_PROPERTY_ID'] => $ID, 'ACTIVE' => "Y"),
					false,
					false,
					array("ID")
				);

				$bFirstOffer = true;
				while ($arOffer = $rsOffers->GetNext()){
					$arPrice = CCatalogProduct::GetOptimalPrice($arOffer["ID"]);
					//print_r($arPrice);
					if ($arPrice["DISCOUNT_PRICE"] < $arPrice["PRICE"]['PRICE']) {
						$arOffer["PRICE"] = FormatCurrency($arPrice["PRICE"]['PRICE'], $arPrice["PRICE"]["CURRENCY"]);
						$arOffer["DISCOUNT_PRICE"] = FormatCurrency($arPrice["DISCOUNT_PRICE"], $arPrice["PRICE"]["CURRENCY"]);
						$minPrice = $arPrice["DISCOUNT_PRICE"];
					} else {
						$arOffer["PRICE"] = FormatCurrency($arPrice["PRICE"]['PRICE'], $arPrice["PRICE"]["CURRENCY"]);
						$arOffer["DISCOUNT_PRICE"] = "";
						$minPrice = $arPrice["PRICE"]['PRICE'];
					}
					if($bFirstOffer){
						$arResult[$i]["MIN_PRICE"] = $minPrice;
						$bFirstOffer = false;
					}
					$arResult[$i]["MIN_PRICE"] = ($arResult[$i]["MIN_PRICE"] >= $minPrice) ? $minPrice : $arResult[$i]["MIN_PRICE"];

				}
				//echo $arResult[$i]["MIN_PRICE"]."<br>";
				//CIBlockElement::SetPropertyValueCode($ID, $arResult[$i]["MIN_PRICE"],"fil_models_price");
				CIBlockElement::SetPropertyValuesEx($ID, IBLOCK_CATALOG_ID, $arResult[$i]["MIN_PRICE"], "MIN_PRICE");
				//if ($i>100) exit;
				$i++;
			}
			//echo 'Elements = '.$i;
}

	}

	public static function checkProfSection($sectionId) {
		$resNav = CIBlockSection::GetNavChain(false, $sectionId);
		while($arNav = $resNav->Fetch()) {
			if ($arNav['ID'] == SECTION_PROF_ID) return true;
		}
		return false;
	}

	public static function dateDiff ($interval,$date1,$date2) {
		// получает количество секунд между двумя датами
		$timedifference = $date2 - $date1;

		switch ($interval) {
			case 'w':
				$retval = bcdiv($timedifference,604800);
				break;
			case 'd':
				$retval = bcdiv($timedifference,86400);
				break;
			case 'h':
				$retval =bcdiv($timedifference,3600);
				break;
			case 'n':
				$retval = bcdiv($timedifference,60);
				break;
			case 's':
				$retval = $timedifference;
				break;
    	}
		return $retval;
	}

	public static function userInfo(){
		global $USER;
		$result = array();
		if ($USER->IsAuthorized()) {
			$arFilter = array(
				"ID" => $USER->GetID()
			);
			$arParams = array(
				'SELECT' => array('UF_*')
			);
			$rsUsers = CUser::GetList(($by="timestamp_x"), ($order="desc"), $arFilter, $arParams);
			$arUser = $rsUsers->Fetch();
			//Helper::dump($arUser);
			$result = $arUser;
		}
		return $result;
	}
}

?>