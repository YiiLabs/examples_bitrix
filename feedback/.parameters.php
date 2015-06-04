<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
    die();

use Bitrix\Main\Loader;
if (!Loader::includeModule('iblock'))
    return;

// IBlock types list
$arIBlockType = array();
$arIBlockType = CIBlockParameters::GetIBlockTypes();

// IBlock list
$arIBlock = array();
$obIBlock = CIBlock::GetList(
    array('SORT' => 'ASC'),
    array(
        'SITE_ID' => $_REQUEST['site'],
        'TYPE' => !empty($arCurrentValues['IBLOCK_TYPE']) ? $arCurrentValues['IBLOCK_TYPE'] : ''
    )
);
while($arRes = $obIBlock->Fetch())
    $arIBlock[$arRes['ID']] = $arRes['NAME'];

// IBlock sections list
$arIBlockSections = array();
$obIBlockSections = CIBlockSection::GetList(
    array('SORT' => 'ASC'),
    array(
        'SITE_ID' => $_REQUEST['site'],
        'IBLOCK_TYPE' => !empty($arCurrentValues['IBLOCK_TYPE']) ? $arCurrentValues['IBLOCK_TYPE'] : '',
        'IBLOCK_ID' => !empty($arCurrentValues['IBLOCK_ID']) ? $arCurrentValues['IBLOCK_ID'] : ''
    )
);
while($arRes = $obIBlockSections->Fetch())
    $arIBlockSections[$arRes['CODE']] = $arRes['NAME'];

// IBlock properties list
$arIBlockProperty = array();
$obIBlockProperty = CIBlockProperty::GetList(
    array('sort' => 'asc', 'name' => 'asc'),
    array(
        'ACTIVE' => 'Y',
        'IBLOCK_ID' => !empty($arCurrentValues['IBLOCK_ID']) ? $arCurrentValues['IBLOCK_ID'] : ''
    )
);
while ($arRes = $obIBlockProperty->GetNext())
    $arIBlockProperty[$arRes['CODE']] = '[' . $arRes['CODE'] . '] ' . $arRes['NAME'];

// Sort Order
$arSortOrder = array('ASC' => GetMessage('ASC'), 'DESC' => GetMessage('DESC'), 'RAND' => GetMessage('RAND'));

// Sort By
$arSortBy = array(
    'ID' => GetMessage('ID'),
    'NAME' => GetMessage('NAME'),
    'DATE_ACTIVE_FROM' => GetMessage('DATE_ACTIVE_FROM'),
    'SORT' => GetMessage('SORT')
);

// Site admin email
$rsSites = CSite::GetByID("s1");
$arSite = $rsSites->Fetch();
$emailSiteAdmin = $arSite["EMAIL"];


$arComponentParameters = array(
    'PARAMETERS' => array(
        'IBLOCK_TYPE' => array(
            'PARENT' => 'BASE',
            'NAME' => GetMessage('IBLOCK_TYPE'),
            'TYPE' => 'LIST',
            'VALUES' => $arIBlockType,
            'DEFAULT' => 'news',
            'REFRESH' => 'Y',
        ),
        'IBLOCK_ID' => array(
            'PARENT' => 'BASE',
            'NAME' => GetMessage('IBLOCK_ID'),
            'TYPE' => 'LIST',
            'VALUES' => $arIBlock,
            'DEFAULT' => '={$_REQUEST["IBLOCK_ID"]}',
            'ADDITIONAL_VALUES' => 'Y',
            'REFRESH' => 'Y',
        ),
        'FORM_DATA' => array(
            'PARENT' => 'BASE',
            'NAME' => GetMessage('FORM_DATA'),
            'TYPE' => 'STRING',
            'DEFAULT' => array(),
        ),
        'CACHE_TIME' => array(
            'DEFAULT' => 3600
        )
    )
);
?>