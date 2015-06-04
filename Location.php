<?php
/**
 * Определение местоположения
 */
class Location {
    const DEFAULT_CITY = 'Екатеринбург';
    private $filename = '/SxGeo/SxGeoCity.dat';

    private static $instance;  // экземпляра объекта

    /*
     * @var array
     * [IP_ADDR] = [TITLE, VALUE~, VALUE]
     * COUNTRY_CODE
     * COUNTRY_NAME
     * REGION_NAME
     * CITY_NAME
     */
    private $location;

    /*
     * ip адрес
     */
    private $ipAddress;

    /**
     * Список городов
     * @var array
     */
    private $cityList = array();

    /**
     * @var int
     */
    private $cityId;

    /**
     * Код по КЛАДРу
     * @var string
     */
    private $cityCode;

    /**
     *
     */
    private function __construct(){
        //$this->location = new SxGeo(dirname(__FILE__) . $this->filename);
        //$this->setIpAddress($_SERVER['REMOTE_ADDR']);
        if(CModule::IncludeModule('statistic')) {
            $city = new CCity;
            $this->location = $city->GetFullInfo();
            $this->setIpAddress($this->location['IP_ADDR']['VALUE']);
        }
    }

    /**
     * @return int
     */
    public function getCityId()
    {
        return $this->cityId;
    }

    /**
     * @param int $cityId
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
    }

    /**
     * @return string
     */
    public function getCityCode()
    {
        return $this->cityCode;
    }

    /**
     * @param string $cityCode
     */
    public function setCityCode($cityCode)
    {
        $this->cityCode = $cityCode;
    }

    private function __clone() {}

    /**
     * @return static
     */
    public static function getInstance() {    // Возвращает единственный экземпляр класса.
        if ( empty(self::$instance) ) {
            self::$instance = new static();
        }
        return self::$instance;
    }

    /**
     * @param string|null $ip
     * @return mixed
     */
    public function getCity() {
        return (!empty($this->location['CITY_NAME']['VALUE']))
            ? $this->location['CITY_NAME']['VALUE']
            : Location::DEFAULT_CITY;
    }

    public function getCityList($code = ''){
        $parameters = array(
            'filter' => array(
                'LANGUAGE_ID' => LANGUAGE_ID)
        );
        if (isset($code) && !empty($code)) {
            $parameters['filter']['CODE'] = $code;
        }
        $res = \Bitrix\Sale\Location\LocationTable::getListFast($parameters);

        $result = array();
        while($item = $res->fetch()) {
            if ($item['NAME']==$this->getCity()) {
                $this->setCityCode($item['ID']);
            }
            $result[] = $item;
        }
        return $result;
    }

    /**
     * @return array
     */
    public function getLocation(){
        return $this->location;
    }

    /**
     * @return mixed
     */
    public function getIpAddress()
    {
        return $this->ipAddress;
    }

    /**
     * @param mixed $ipAddress
     */
    public function setIpAddress($ipAddress)
    {
        $this->ipAddress = $ipAddress;
    }

}