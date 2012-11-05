<?php

use Psc\UI\DropBox2;
use Psc\HTML\HTML;

$tag1 = new \Psc\Doctrine\TestEntities\Tag('Sound');
$tag1->setId(1);

$tag2 = new \Psc\Doctrine\TestEntities\Tag('Promo');
$tag2->setId(2);

$dropBox = new DropBox2('act0',
                        \Psc\PSC::getProject()->getModule('Doctrine')->getEntityMeta('Psc\Doctrine\TestEntities\Tag'),
                        array($tag1),                      // values pre set
                        DropBox2::MULTIPLE            // flags
                       );
$dropBox->setConnectWith('div.psc-cms-ui-drop-box');

$dropBox2 = new DropBox2('act1',
                        \Psc\PSC::getProject()->getModule('Doctrine')->getEntityMeta('Psc\Doctrine\TestEntities\Tag'),
                        array($tag2),                      // values pre set
                        DropBox2::MULTIPLE            // flags
                       );
$dropBox2->setConnectWith('div.psc-cms-ui-drop-box');


print HTML::tag('div', $dropBox->html(), array('id'=>'drop-box1'));
print HTML::tag('div', $dropBox2->html(), array('id'=>'drop-box2'));
?>