<?php
header("Content-Type: text/xml;charset=utf-8");
/*********************************************************************************

    Baztille
        
    Copyright (C) 2015  Grégory Isabelli, Thibaut Villemont and contributors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
***********************************************************************************/

$g_config = array();
$g_config['db_name'] = 'baztille';

$m = new \MongoClient(); // connect
$db = $m->selectDB( $g_config['db_name'] );

$collection = new MongoCollection($db, 'questions');

$cursor = $collection->find();
$array = iterator_to_array($cursor);

print('<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
print '<url>
        <loc>http://app.baztille.org/question/voted</loc>
    </url>';
print '<url>
        <loc>http://app.baztille.org/question/questions</loc>
    </url>';
print '<url>
        <loc>http://app.baztille.org/question/proposed</loc>
    </url>';
foreach ($array as $key => $value) {
    print '<url>
            <loc>http://app.baztille.org/question/questions/'.$key.'</loc>
        </url>';
}
print '</urlset>';