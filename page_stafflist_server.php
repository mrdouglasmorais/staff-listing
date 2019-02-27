<?php
	require_once('../../../wp-load.php');
	global $wpdb;
	$table_prefix = 'wp_';
	if(isset($_REQUEST["getStaffList"]))
	{
		$page_id = intval($_REQUEST["page_id"]);
		$package_size = intval($_REQUEST["package_size"]);
		$staff_search_name = $_REQUEST["staff_search_name"];
		$staff_search_category = $_REQUEST["staff_search_category"];
		$total_count = $wpdb->get_var("select count(*) from ".$table_prefix."stafflist where name like '%".$staff_search_name."%' and category like '%".$staff_search_category."%'");
		$page_count = ceil($total_count / $package_size);
		$offset = $package_size * ($page_id - 1);
		$query = "select list.*, vitae.vitae_language, vitae.vitae_url from ".$table_prefix."stafflist list LEFT JOIN (select staff_id, GROUP_CONCAT(language) as vitae_language, GROUP_CONCAT(url) as vitae_url from ".$table_prefix."vitae group by staff_id) vitae ON list.staff_id=vitae.staff_id where list.name like '%".$staff_search_name."%' and list.category like '%".$staff_search_category."%' order by list.category, list.name limit $package_size offset $offset";
		$result = $wpdb->get_results($query);
		$data = array();
		foreach ( $result as $row )  
		{
			array_push($data, $row);
		}
		$result_array = array("data"=>$data,"page_count"=>$page_count);
		echo json_encode($result_array);
	}

	if(isset($_REQUEST["deleteStaff"]))
	{
		$staff_id = $_REQUEST["staff_id"];
		$wpdb->delete( $table_prefix."stafflist", array( 'staff_id' => $staff_id ) );
		$wpdb->delete( $table_prefix."vitae", array( 'staff_id' => $staff_id ) );
		echo 'success';
	}

	if(isset($_REQUEST["getStaffCategory"]))
	{
		$query = "select * from ".$table_prefix."staffcategory order by name";
		$result = $wpdb->get_results($query);
		$data = array();
		foreach ( $result as $row )  
		{
			array_push($data, $row);
		}
		echo json_encode($data);
	}

	if(isset($_REQUEST["insertStaff"]))
	{	
		$category = $_REQUEST["category"];
		$name = $_REQUEST["name"];
		$address = $_REQUEST["address"];
		$phone = $_REQUEST["phone"];
		$phone2 = $_REQUEST["phone2"];
		$fax = $_REQUEST["fax"];
		$email = $_REQUEST["email"];
		$nationality = $_REQUEST["nationality"];
		$languages = $_REQUEST["languages"];
		$licensed = $_REQUEST["licensed"];
		$instagram = $_REQUEST["instagram"];
		$facebook = $_REQUEST["facebook"];
		$linkedin = $_REQUEST["linkedin"];
		$description = $_REQUEST["description"];
		$personType = $_REQUEST["personType"];

		$query ="select * from ".$table_prefix."stafflist where name = '".$name."'";
		$res = $wpdb->get_results($query);
		if($res[0] == NULL)
		{	
			$result = $wpdb->insert($table_prefix.'stafflist', array(
		    'category' => $category,
		    'name' => $name,
		    'address' => $address,
		    'phone' => $phone,
		    'phone2' => $phone2,
		    'fax' => $fax,
		    'email' => $email,
		    'nationality' => $nationality,
		    'languages' => $languages,
		    'countries_licensed' => $licensed,
		    'instagram_link' => $instagram,
		    'facebook_link' => $facebook,
		    'linkedin_link' => $linkedin,
		    'description' => $description,
		    'personType' => $personType
			));
			if($result != 1)
				echo 'failed';
			else
			{
				$staff_id = $wpdb->get_var("select staff_id from ".$table_prefix."stafflist where name='$name' AND phone='$phone' AND address='$address'");
				if($staff_id == NULL)
					echo 'failed';
				else
					echo $staff_id;
			}		
		}else{
			$err = "This entry has already been registered";
			echo "exist";
		}	
		
	}

	if(isset($_FILES['vitae-file']))
	{
		$pdf_filename = $_FILES['vitae-file']['name'];
		$tmp_filename = $_FILES['vitae-file']['tmp_name'];
	 	$vitae_lang = $_POST['vitae_lang'];
	 	$staff_id = $_POST['staff_id'];

		$ext = strtolower(pathinfo($pdf_filename, PATHINFO_EXTENSION));
		$filename = strtolower(pathinfo($pdf_filename, PATHINFO_FILENAME));
	 
		$final_pdf = md5(time()) . "." . $ext;
	 	$valid_extensions = array('pdf');
	 	$success = false;
		if(in_array($ext, $valid_extensions)) 
		{ 
			$upload_path = '../../../wp-content/plugins/staff-listing/uploads/' . strtolower($final_pdf); 
			if(move_uploaded_file($tmp_filename, $upload_path)) 
			{
				$result = $wpdb->insert($table_prefix.'vitae', array(
				    'staff_id' => $staff_id,
				    'language' => $vitae_lang,
				    'url' => strtolower($final_pdf)
				));
				if($result == 1)
					$success = true;
			}
		} 
		echo $success == true ? json_encode(array("uploaded"=>'OK')) : json_encode(array("uploaded"=>'ERROR'));
	}

	if(isset($_REQUEST["getStaff"]))
	{
		$staff_id = $_REQUEST["staff_id"];
		$query = "select list.*, vitae.vitae_ids, vitae.vitae_language, vitae.vitae_url from ".$table_prefix."stafflist list LEFT JOIN (select staff_id, GROUP_CONCAT(vitae_id) as vitae_ids, GROUP_CONCAT(language) as vitae_language, GROUP_CONCAT(url) as vitae_url from ".$table_prefix."vitae group by staff_id) vitae ON list.staff_id=vitae.staff_id where list.staff_id='$staff_id'";
		$result = $wpdb->get_results($query);
		echo json_encode($result[0]);
	}

	if(isset($_FILES['edit-vitae-file']))
	{
		$pdf_filename = $_FILES['edit-vitae-file']['name'];
		$tmp_filename = $_FILES['edit-vitae-file']['tmp_name'];
	 	$vitae_lang = $_POST['vitae_lang'];
	 	$staff_id = $_POST['staff_id'];

		$ext = strtolower(pathinfo($pdf_filename, PATHINFO_EXTENSION));
		$filename = strtolower(pathinfo($pdf_filename, PATHINFO_FILENAME));
	 
		$final_pdf = md5(time()) . "." . $ext;
		$final_pdf_name = strtolower($final_pdf); 
	 	$valid_extensions = array('pdf');
	 	$success = false;
	 	$added_vitae_id = -1;
		if(in_array($ext, $valid_extensions)) 
		{ 
			$upload_path = '../../../wp-content/plugins/staff-listing/uploads/' . $final_pdf_name; 
			if(move_uploaded_file($tmp_filename, $upload_path)) 
			{
				$result = $wpdb->insert($table_prefix.'vitae', array(
				    'staff_id' => $staff_id,
				    'language' => $vitae_lang,
				    'url' => $final_pdf_name
				));
				if($result == 1)
				{
					$success = true;
					$added_vitae_id = $wpdb->get_var("select vitae_id from ".$table_prefix."vitae where url='$final_pdf_name'");
				}
			}
		} 
		echo $success == true ? json_encode(array("uploaded"=>'OK', "lang"=>$vitae_lang, "url"=>$final_pdf_name, "vitae_id"=>$added_vitae_id)) : json_encode(array("uploaded"=>'ERROR'));
	}

	if(isset($_REQUEST["updateStaff"]))
	{
		$category = $_REQUEST["category"];
		$name = $_REQUEST["name"];
		$address = $_REQUEST["address"];
		$phone = $_REQUEST["phone"];
		$phone2 = $_REQUEST["phone2"];
		$fax = $_REQUEST["fax"];
		$email = $_REQUEST["email"];
		$nationality = $_REQUEST["nationality"];
		$languages = $_REQUEST["languages"];
		$licensed = $_REQUEST["licensed"];
		$instagram = $_REQUEST["instagram"];
		$facebook = $_REQUEST["facebook"];
		$linkedin = $_REQUEST["linkedin"];
		$description = $_REQUEST["description"];
		$personType = $_REQUEST["personType"];
		$staff_id = $_REQUEST["staff_id"];
		$result = $wpdb->update($table_prefix.'stafflist', array(
		    'category' => $category,
		    'name' => $name,
		    'address' => $address,
		    'phone' => $phone,
		    'phone2' => $phone2,
		    'fax' => $fax,
		    'email' => $email,
		    'nationality' => $nationality,
		    'languages' => $languages,
		    'countries_licensed' => $licensed,
		    'instagram_link' => $instagram,
		    'facebook_link' => $facebook,
		    'linkedin_link' => $linkedin,
		    'description' => $description,
		    'personType' => $personType
			),	
			array('staff_id' => $staff_id)
		);
		if($result != 1)
			echo 'failed';
		else
			echo 'success';
	}
	if(isset($_REQUEST["deleteVitae"]))
	{
		$vitae_id = $_REQUEST["vitae_id"];
		$result = $wpdb->delete( $table_prefix."vitae", array( 'vitae_id' => $vitae_id ) );
		if($result == 1)
			echo 'success';
		else
			echo "failed";
	}
?>