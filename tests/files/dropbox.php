<?php

use Psc\UI\DropBox2;

$dropBox = new DropBox2('tags',
                        \Psc\PSC::getProject()->getModule('Doctrine')->getEntityMeta('Psc\Doctrine\TestEntities\Tag'),     
                        array(),                // values pre set
                        DropBox2::MULTIPLE                                         // flags
                       );

print $dropBox->html();

?>