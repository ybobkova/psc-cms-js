<?php

// really dirty script to create the fixture
require_once 'D:\www\webforge\bootstrap.php';

use Psc\JS\JSONConverter;
use Webforge\TestData\NestedSet\FoodCategories;

$food = new FoodCategories();
$foodNodes = $food->toArray();

$ids = range(1+50, count($foodNodes)+50);
shuffle($ids);

$pageId = 10;
$flat = array();
foreach ($foodNodes as $simpleNode) {
  $simpleNode = (object) $simpleNode;
  $node = (object) array(
    'id'=>array_pop($ids),
    'title'=>array('en'=>$simpleNode->title),
    'slug'=>array('en'=>mb_strtolower($simpleNode->title)),
    'depth'=>$simpleNode->depth,
    'pageId'=>rand(0,1) ? $pageId++ : NULL,
    'locale'=>'en',
    'languages'=>array('en')
  );
  
  $flat[] = $node;
}

$converter = new JSONConverter();

$file = __DIR__.DIRECTORY_SEPARATOR.'navigation.food.json';
printf(
  '%s bytes written to %s',
  
  file_put_contents($file, $converter->stringify($flat, JSONConverter::PRETTY_PRINT)),
  $file
);

?>