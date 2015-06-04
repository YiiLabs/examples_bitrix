<?php


class YandexMarket {

    const KEY = 'JHaarbFEG2tJG7BtgLGUxQHZ41xFqt';

    /**
     * @var int
     */
    protected $elementId;

    /**
     * @var array
     */
    protected $reviews;
	
    protected $pages;
    public function __construct($elementId = '', $pages = '1') {
        if (intval($elementId)>0){
            $this->setElementId($elementId);
        }
        $this->setPages($pages);
    }

    public function getResult() {
        $result = $this->prepare();

        return $result;
    }

    private function prepare() {
       $result = $this->connect();
       return $result;

    }

    private function connect() {
        $queryPage = 'https://api.content.market.yandex.ru/v1/model/'.$this->getElementId().'/opinion.json?geo_id=0&sort=date&how=desc&count=30&page='.$this->getPages();

        $headr = array();
        $headr[] = 'api.content.market.yandex.ru';
        $headr[] = 'Accept: */*';
        $headr[] = 'Authorization: '.YandexMarket::KEY;

        $options = array(
            CURLOPT_RETURNTRANSFER => true,     // return web page
            CURLOPT_HEADER         => false,    // don't return headers
            CURLOPT_FOLLOWLOCATION => false,    // don't follow redirects
            CURLOPT_ENCODING       => "",       // handle all encodings
            CURLOPT_USERAGENT      => "spider", // who am i
            CURLOPT_AUTOREFERER    => true,     // set referer on redirect
            CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
            CURLOPT_TIMEOUT        => 120,      // timeout on response
            CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTPHEADER => $headr,
        );

        
        
        $ch      = curl_init( $queryPage );
        curl_setopt_array( $ch, $options );
        $content = curl_exec( $ch );
        $err     = curl_errno( $ch );
        $errmsg  = curl_error( $ch );
        $header  = curl_getinfo( $ch );
        curl_close( $ch );
        
        $header['errno']   = $err;
        $header['errmsg']  = $errmsg;
        $header['content'] = $content;
        return $header;
    }

    /**
     * @return int
     */
    public function getElementId() {
        return $this->elementId;
    }

    /**
     * @param int $elementId
     */
    public function setElementId($elementId) {
        $this->elementId = $elementId;
    }
    
    /**
     * @return int
     */
    public function getPages() {
    	return $this->pages;
    }
    
    /**
     * @param int $elementId
     */
    public function setPages($elementId) {
    	$this->pages = $elementId;
    }
}