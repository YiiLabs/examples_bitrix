<?
require $_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php";
require_once $_SERVER["DOCUMENT_ROOT"]."/bitrix/php_interface/tools/include.php";  
require $_SERVER["DOCUMENT_ROOT"]."/bitrix/php_interface/libs/PHPExcel_lib/Classes/PHPExcel.php";
$uploaddir =  $_SERVER['DOCUMENT_ROOT'].'/upload/excelfiles/';
$uploadfile = $uploaddir . basename($_FILES['datafile']['name'].RandString(10).'.csv');

$answer = array();
$answer['state'] = '';
$answer['text'] = '';
		
define("LOG_FILE_PERS", $_SERVER['DOCUMENT_ROOT'].'/log.html');

if (move_uploaded_file($_FILES['datafile']['tmp_name'], $uploadfile)) 
{
	if (file_exists($uploadfile))
	{
		$fileInfo = pathinfo($_FILES['datafile']['name']);
		if($_POST['from']=='excel')
		{
			if (strtoupper($fileInfo['extension']) == 'XLS')
			{
				require_once $_SERVER["DOCUMENT_ROOT"]."/office/excelupload/src/reader.php";
				//Создаем объект для работы с xls-файлом
				$xls = new Spreadsheet_Excel_Reader();
				//	Устанавливаем кодировку
				$xls->setOutputEncoding('CP1251');
				
				//	Считываем xls-файл
				//	$xlsPath задаем в конфиге
				$xls->read($uploadfile);

				//cюда запишем все из эксель файла
				$excelData = array();
				
				foreach($xls->sheets as $arIndex)
				{
					if ($arIndex['numCols'] > 0 && $arIndex['numRows'] > 0)
					{
						for ($row = 1; $row < $arIndex['numRows']+1; $row++)
						{						
							$data = array();
							for ($col = 1; $col < $arIndex['numCols']+1; $col++)
							{								
								$data[$col] = $arIndex['cells'][$row][$col]; 
							}
							$excelData[] = $data;
						}
					}	
				}
			
				echo CUtil::PhpToJsObject($excelData);
				die();
			}
			//если это csv
			elseif (strtoupper($fileInfo['extension']) == 'CSV')
			{
				$csv = file($uploadfile);
				$excelData = array();
				foreach ($csv as $j=>$row)
				{
					$row = str_replace(',',';',$row);
					$row = explode(";",$row);
					$i=1;
					foreach($row as $cell)
					{
						$excelData[$j][$i] = trim($cell);
						$i++;	
					}
				}
				echo CUtil::PhpToJsObject($excelData);
				die();		
			}
			elseif (strtoupper($fileInfo['extension']) == 'XLSX')
			{
				$objReader = PHPExcel_IOFactory::createReader('Excel2007');
				$objReader->setReadDataOnly(true);
				$objPHPExcel = $objReader->load($uploadfile);
				$objWorksheet = $objPHPExcel->getActiveSheet();			
				$sheets = $objPHPExcel->getAllSheets();
				
				$excelData = array();
				foreach ($sheets as $sheet) 
				{
					$excel_sheet_content = $sheet->toArray();
					foreach($excel_sheet_content as $i=>$row)
					{
						$data = array();
						foreach($row as $j=>$cell)
						{
			  	  			$data[] = iconv('utf-8', 'cp1251',$cell);		  	  			
						}	
						$excelData[] = $data;
					}					
				}
				echo CUtil::PhpToJsObject($excelData);
				die();
			}
		}
		elseif (strtoupper($fileInfo['extension']) == 'CSV')
		{
			if($_POST['from']=='gmail')
			{			    			    
			    $csv = file_get_contents($uploadfile);
			    
			    //удаляем переносы строк внутри блоков, обернутых в кавычки
			    $matches = array();
			    preg_match_all('/"[^"]+"/',$csv,$matches); //находим все блоки в кавычках
			    foreach($matches[0] as $quotedRow)
			    {
					$csv = str_replace($quotedRow,str_replace("\r",'',str_replace("\n",'',$quotedRow)),$csv); //заменяем каждый блок на такой же, но с убранным символами перевода строки				
			    }
			    $csv = explode("\n",$csv);
				$data = array();
				foreach ($csv as $row)
				{
					$row = trim(str_replace(',',';',$row));
					$data[] = explode(";",$row);
				}
				
				//находим колонки с ФИО
				$fioKeys = array(
			    	'first' => 'First Name',
			    	'middle' => 'Middle Name',
			    	'last' => 'Last Name',
			    	'groups' => 'Categories'
			    );
				$fioColumns = array();
				foreach($fioKeys as $fioPart=>$fioKey)
				{
					$fioColumns[$fioPart] = array_search($fioKey,$data[0]); 
				}
				//находим колонки с телефонами
				$phoneKeys = array("Primary Phone","Home Phone","Home Phone 2","Mobile Phone");
				$phoneColumns = array();
				foreach($data[0] as $column=>$columnName)
				{
					if(in_array($columnName,$phoneKeys))
						$phoneColumns[] = $column;
				}
				
				if(empty($phoneColumns) || empty($fioColumns))
				{
					$answer['state'] = 'error';
					$answer['text'] = GetMessage('GMAIL_WRONG_FORMAT');
					echo CUtil::PhpToJsObject($answer);
					die(); 
				}
				
				unset($data[0]);
				$phones = array();
				foreach($data as $row)
				{
					$fio = array();
					foreach($fioColumns as $fioField=>$fioColumn)
					{
						$fio[$fioField] = $row[$fioColumn];
					}
					foreach($phoneColumns as $phoneColumn)
					{
						$phone = $row[$phoneColumn];
						if(!empty($phone))
							$phones[$phone] = $fio;
					}
				}
			}
			elseif($_POST['from']=='outlook')
			{			    			    
			    $csv = file_get_contents($uploadfile);
			    
			    //удаляем переносы строк внутри блоков, обернутых в кавычки
			    $matches = array();
			    preg_match_all('/"[^"]+"/',$csv,$matches); //находим все блоки в кавычках
			    foreach($matches[0] as $quotedRow)
			    {
					$csv = str_replace($quotedRow,str_replace(",",'@#@',str_replace("\r",'',str_replace("\n",'',$quotedRow))),$csv); //заменяем каждый блок на такой же, но с убранным символами перевода строки. А также заменяем запятые на спецсимвол, временно				
			    }
			    $csv = explode("\n",$csv);
				$data = array();
				foreach ($csv as $row)
				{
					$tmp = explode(",",$row);
					foreach($tmp as &$cell)
						$cell = str_replace("@#@",",",$cell);
					$data[] = $tmp;
				}
				
				//находим колонки с ФИО
				$fioKeys = array(
			    	'first' => 'First Name',
			    	'middle' => 'Middle Name',
			    	'last' => 'Last Name',
			    	'groups' => 'Categories'
			    );
				$fioColumns = array();
				foreach($fioKeys as $fioPart=>$fioKey)
				{
					$fioColumns[$fioPart] = array_search($fioKey,$data[0]); 
				}
				//находим колонки с телефонами
				$phoneKeys = array("Primary Phone","Home Phone","Home Phone 2","Mobile Phone","Other Phone","Business Phone","Business Phone 2");
				$phoneColumns = array();
				foreach($data[0] as $column=>$columnName)
				{
					if(in_array($columnName,$phoneKeys))
						$phoneColumns[] = $column;
				}
				
				if(empty($phoneColumns) || empty($fioColumns))
				{
					$answer['state'] = 'error';
					$answer['text'] = GetMessage('OUTLOOK_WRONG_FORMAT');
					echo CUtil::PhpToJsObject($answer);
					die(); 
				}
				
				unset($data[0]);
				$phones = array();
				foreach($data as $row)
				{
					$fio = array();
					foreach($fioColumns as $fioField=>$fioColumn)
					{
						$fio[$fioField] = $row[$fioColumn];
					}
					foreach($phoneColumns as $phoneColumn)
					{
						$phone = $row[$phoneColumn];
						if(!empty($phone))
							$phones[$phone] = $fio;
					}
				}
			}
			
			if(empty($phones))
			{
				$answer['state'] = 'error';
				$answer['text'] = GetMessage('NO_NUMBERS');
				echo CUtil::PhpToJsObject($answer);
				die(); 
			}
			else
			{
				echo CUtil::PhpToJsObject($phones);
				die();
			}				
		}
		elseif (strtoupper($fileInfo['extension']) == 'VCF')
		{
			if($_POST['from']=='addressbook')
			{	
				include($_SERVER["DOCUMENT_ROOT"]."/bitrix/php_interface/libs/vcardphp/vbook.php");		    			    
			    $lines = file($uploadfile);
			     if (!$lines)
			     {
				 	$answer['state'] = 'error';
					$answer['text'] = GetMessage('VCARD_EMPTY');
					echo CUtil::PhpToJsObject($answer);
					die();  
			     }
			     $phones = array();
			     $i=0;
			     foreach($lines as &$line)
			     {			     	 	 
			     	 $line = trim($line);
			     	 if($line=='BEGIN:VCARD')
			     	 {
			     	 	$fio = array();
			     	 	$tmpphones = array();
			     	 	$i++;
			     	 	continue;
					 }
			     	 if($line=='END:VCARD')
			     	 {
			     	 	 foreach($tmpphones as $phone)
			     	 	 	$phones[$phone] = $fio;
						 continue;
			     	 }
			     	 if(empty($line))
			     	 	continue;
					$tmp = explode(':',$line);
					if(strtoupper($tmp[0])=='N')
					{
						$tmpfio = explode(';',$tmp[1]);
						$fio['first'] = $tmpfio[1];
						$fio['middle'] = $tmpfio[2]; 
						$fio['last'] = $tmpfio[0];
					}				
					if(strtoupper($tmp[0])=='CATEGORIES')
					{
						$fio['groups'] = $tmp[1];
					}					
					if(strpos(strtoupper($tmp[0]),'TEL')!==false)
					{
						$tmpphones[] = str_replace(';','',$tmp[1]);
					}
			     }		     		    
			}
			if(empty($phones))
			{
				$answer['state'] = 'error';
				$answer['text'] = GetMessage('NO_NUMBERS');
				echo CUtil::PhpToJsObject($answer);
				die(); 
			}
			else
			{
				echo CUtil::PhpToJsObject($phones);
				die();
			}	
		}
		else
		{
			$answer['state'] = 'error';
			$answer['text'] = GetMessage('WRONG_FORMAT');
			echo CUtil::PhpToJsObject($answer);
			die(); 
		}
	}
	else
	{
		$answer['state'] = 'error';
		$answer['text'] = GetMessage('NO_FILE');
		echo CUtil::PhpToJsObject($answer);
		die(); 
	}	
} 
else 
{
	$answer['state'] = 'error';
	$answer['text'] = GetMessage('FILE_UPLOAD_ERROR');
	echo CUtil::PhpToJsObject($answer);
	die();
}

function importContactsGmail($address,$password){
	return $success;
}
function importContactsOutlook($data){
	return $success;
}
function importContactsIphone($data){
	return $success;
}
function get_csv($filename, $delim =";")
{

    $row = 0;
    $dump = array();
   
    $f = fopen ($filename,"r");
    $size = filesize($filename)+1;
    while ($data = fgetcsv($f, $size, $delim))
    {
    	/*PrintObjToFile($data);
    	$str = explode(';', $data[0]);*/
        $dump[$row] = $data[0].'@@@'.$data[1];
        $row++;
    }
    fclose ($f);
    return $dump;
} 