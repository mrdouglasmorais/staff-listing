<?php
	require_once('../../../../wp-load.php');
	global $wpdb;
	$table_prefix = 'wp_';
	if(isset($_REQUEST["getStaffList"]))
	{
		$page_id = intval($_REQUEST["page_id"]);
		$package_size = intval($_REQUEST["package_size"]);
		$category = $_REQUEST["category"];
		$staff_str = $_REQUEST["staff_str"];
		$selected_alpha = $_REQUEST["selected_alpha"];
		$selected_personType = $_REQUEST["selected_personType"];

		$category_caluse = '';
		if($category != '')
			$category_caluse = " AND category='$category'";
		$total_count = $wpdb->get_var("select count(*) from ".$table_prefix."stafflist where name like '%$staff_str%' AND name like '$selected_alpha%'" . $category_caluse."AND personType like '%".$selected_personType."%'");
		$page_count = ceil($total_count / $package_size);
		$offset = $package_size * ($page_id - 1);
		
		$query = "select list.*, vitae.vitae_language, vitae.vitae_url from ".$table_prefix."stafflist list LEFT JOIN (select staff_id, GROUP_CONCAT(language) as vitae_language, GROUP_CONCAT(url) as vitae_url from ".$table_prefix."vitae group by staff_id) vitae ON list.staff_id=vitae.staff_id where list.name like '%$staff_str%'" . $category_caluse . " AND list.personType like '%". $selected_personType."%' AND name like '$selected_alpha%' order by list.name limit $package_size offset $offset";
		$lang = 'pt-br';
		if ( defined( 'ICL_LANGUAGE_CODE' ) ) 
		{
			$lang = ICL_LANGUAGE_CODE;
		}
		if($lang == 'en')
				$query = "select SUBSTRING_INDEX(SUBSTRING_INDEX(name, ' ', 1), ' ', -1) AS first_name, If(  length(name) - length(replace(name, ' ', ''))>1, SUBSTRING_INDEX(SUBSTRING_INDEX(name, ' ', 2), ' ', -1) ,NULL) as middle_name, SUBSTRING_INDEX(SUBSTRING_INDEX(name, ' ', 3), ' ', -1) AS last_name, list.*, vitae.vitae_language, vitae.vitae_url from ".$table_prefix."stafflist list LEFT JOIN (select staff_id, GROUP_CONCAT(language) as vitae_language, GROUP_CONCAT(url) as vitae_url from ".$table_prefix."vitae group by staff_id) vitae ON list.staff_id=vitae.staff_id where list.name like '%$staff_str%'" . $category_caluse . "AND list.personType like '%".$selected_personType."%' AND name like '$selected_alpha%' order by last_name limit $package_size offset $offset";
		
		$result = $wpdb->get_results($query);
		$data = array();
		foreach ( $result as $row )  
		{
			array_push($data, $row);
		}
		$result_array = array("data"=>$data,"page_count"=>$page_count,"lang"=>$lang);
		echo json_encode($result_array);
	}
?>