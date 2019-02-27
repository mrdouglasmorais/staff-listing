
var pagination;
var package_size = 10;
var selected_alpha = '';
var selected_personType='';
var label_dict = {
	"all": {
		"en": "ALL",
		"pt-br": "TODOS",
		"es": "TODOS",
		"fr": "TOUT"
	},
	"placeholder": {
		"en": "Search by name here…",
		"pt-br": "Pesquisar por nome...",
		"es": "Buscar por nombre ...",
		"fr": "Recherche par nom ..."
	},
	"address": {
		"en": "ADDRESS",
		"pt-br": "ENDEREÇO",
		"es": "DIRECCIÓN",
		"fr": "ADRESSE"
	},
	"phone": {
		"en": "TELEPHONE",
		"pt-br": "TELEFONE",
		"es": "TELÉFONO",
		"fr": "TÉLÉPHONE"
	},

	"phone2": {
		"en": "TELEPHONE 2",
		"pt-br": "TELEFONE 2",
		"es": "TELÉFONO 2",
		"fr": "TÉLÉPHONE 2"
	},
	"fax": {
		"en": "Fax",
		"pt-br": "Fax",
		"es": "Fax",
		"fr": "Fax"
	},

	"nation": {
		"en": "NATIONALITY",
		"pt-br": "NACIONALIDADE",
		"es": "NACIONALIDAD",
		"fr": "NATIONALITÉ"
	},
	"language": {
		"en": "LANGUAGES",
		"pt-br": "IDIOMAS",
		"es": "IDIOMAS",
		"fr": "LANGUES"
	},
	"licensed": {
		"en": "COUNTRIES LICENSED TO ADVOCATE",
		"pt-br": "PAÍSES LICENCIADOS PARA ADVOGAR",
		"es": "PAÍSES CON LICENCIA PARA ABOGAR",
		"fr": "PAYS AUTORISÉS À PLAIDER"
	},
	"vitae": {
		"en": "CURRICULUM VITAE",
		"pt-br": "CURRÍCULO",
		"es": "CURRICULUM VITAE",
		"fr": "CURRICULUM VITAE"
	},
	"description": {
		"en": "DESCRIPTION",
		"pt-br": "DESCRIÇÃO",
		"es": "DESCRIPCIÓN",
		"fr": "LA DESCRIPTION"
	},
	"personType": {
		"en": "PERSON TYPE",
		"pt-br": "TIPO DE PESSOA",
		"es": "TIPO DE PERSONA",
		"fr": "TYPE DE PERSONNE"
	},
	"Legal Person": {
		"en": "Legal Person",
		"pt-br": "Pessoa Jurídica",
		"es": "Pessoa Jurídica",
		"fr": "Personne Physique"
    },
	"Natural Person": {
		"en": "Natural Person",
		"pt-br": "Pessoa Física",
		"es": "Pessoa Física",
		"fr": "Personne Morale"
    }	



}
var lang = 'pt-br';
var country = [];
var languages = [];
var nation = [];
jQuery(document).ready(function ($) {
	loadJSON(function(response) {
		// Parse JSON string into object
		  var actual_JSON = JSON.parse(response);
		  for(var i=0; i<actual_JSON[0].length; i++)
		  {
			  name = actual_JSON[0][i].name.common;
			  country[name]={
				"pt-br": actual_JSON[0][i].translations.por.common,
				"es": actual_JSON[0][i].translations.spa.common,
				"fr": actual_JSON[0][i].translations.fra.common,
				"en": name,};
		  }
		  languages = actual_JSON[1][0];
		  for(var i=0; i<actual_JSON[0].length; i++)
		  {
			demonym = actual_JSON[0][i].demonym;
			  nation[demonym]={
				"pt-br": actual_JSON[0][i].translations.por.official,
				"es": actual_JSON[0][i].translations.spa.official,
				"fr": actual_JSON[0][i].translations.fra.official,
				"en": actual_JSON[0][i].name.official,};
		  }
		  var current_url = window.location.href;
			if(current_url.indexOf("/fr/") !== -1)
			{
				lang = 'fr';
			}
			if(current_url.indexOf("/es/") !== -1)
			{
				lang = 'es';
			}
			if(current_url.indexOf("/en/") !== -1)
			{
				lang = 'en';
			}
			if(current_url.indexOf("/pt-br/") !== -1)
			{
				lang = 'pt-br';
			}
			toastr.options = {              
			"closeButton": true,
			"positionClass": "toast-top-center",
			"timeOut": "2000"
			};
			pagination = new Pagination({
				container: $("#sl-pagination"),
				pageClickCallback: setTableContent,
				maxVisibleElements: 9,
			});
			setAlphabetGroup();
			$("body").on("click", "#sl-sort-alphabet p", function(){

				selected_alpha = $(this).text();
				selected_personType = "";
				if($(this).hasClass("alpha-all"))
					selected_alpha = '';
				if($(this).hasClass("alpha-natural"))
				{
					selected_alpha = "";
					selected_personType = "Natural Person";
				}
				if($(this).hasClass("alpha-legal"))
				{
					selected_alpha = "";
					selected_personType = "Legal Person";	
				}
				$(".down").removeClass("down");
				$(this).addClass("down");
				setTableContent(1);
			});
			$("#sl-search-text").keydown(function(e){
				if(e.which == 13){
					selected_alpha = '';
					selected_personType='';
					setTableContent(1);
				}
			});
			$(".alpha-all").text(label_dict["all"][lang]);
			$(".alpha-natural").text(label_dict["Natural Person"][lang]);
			$(".alpha-legal").text(label_dict["Legal Person"][lang]);
			$("#sl-search-text").attr("placeholder",label_dict["placeholder"][lang]);
	   });
	
});
function genCharArray(charA, charZ) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}
function setAlphabetGroup()
{
	var alphabet = genCharArray('A', 'Z');
	for (var i = 0; i < alphabet.length; i++) {
		var alpha = jQuery('<p>'+alphabet[i]+'</p>');
		jQuery("#sl-sort-alphabet").append(alpha);
	}
	
	var all = jQuery('<p class="alpha-all">TODOS</p>');
	var natural = jQuery('<p class="alpha-natural">Natural Person</p>');
	var legal = jQuery('<p class="alpha-legal">Legal Person</p>');
	jQuery("#sl-sort-alphabet").append(all);
	jQuery("#sl-sort-alphabet").append(natural);
	jQuery("#sl-sort-alphabet").append(legal);
}

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', plugin_dir_url + "assets/data/countries.json", true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

function setTableContent(page_id)
{
	var category = jQuery("#sl-stafflist-body").attr("category");
	var staff_str = jQuery("#sl-search-text").val();
	var strParam = "getStaffList=getting&page_id=" + page_id + '&package_size=' + package_size + '&category=' + category + '&staff_str=' + staff_str + '&selected_alpha=' + selected_alpha + '&selected_personType=' + selected_personType;
	jQuery.ajax({
	    url: plugin_dir_url + "shortcode/shortcode_server.php",
	    async:false,
	    data: strParam,
	    type: 'post',
		success: function(result) {
			jQuery("#sl-stafflist-body").html('');
	    	var data = JSON.parse(result)["data"];
	        var page_count = JSON.parse(result)["page_count"];
	        //var lang = JSON.parse(result)["lang"];
	        pagination.make(page_count,1,page_id);
	        if(page_count == 0)
	   			return;
			var index = package_size * (page_id - 1);

	        for (var i = 0; i < data.length; i++) {
	        	var row_data = data[i];
	        	var staff_item = jQuery('<div class="staff-item"></div>');

	        	var staff_name = jQuery('<div class="staff-name"><p>'+row_data.name+'</p></div>');

	        	var staff_addr_phone = jQuery('<div class="staff-addr-phone"></div>');
	        	if(row_data.address != "")
	        		staff_addr_phone.append('<p><span class="staff-label">'+label_dict["address"][lang]+':</span> '+row_data.address+'</p>');
	        	if(row_data.phone != "")
	        		staff_addr_phone.append('<p><span class="staff-label">'+label_dict["phone"][lang]+':</span> '+row_data.phone+'</p>');
	        	if(row_data.phone2 != "")
	        		staff_addr_phone.append('<p><span class="staff-label">'+label_dict["phone2"][lang]+':</span> '+row_data.phone2+'</p>');
	        	if(row_data.fax != "")
	        		staff_addr_phone.append('<p><span class="staff-label">'+label_dict["fax"][lang]+':</span> '+row_data.fax+'</p>');

	        	var staff_email = jQuery('<div class="staff-email"></div>');
	        	if((row_data.email != "")&&(row_data.email != null))
	        		staff_email.append('<p><span class="staff-label">E-mail:</span> '+row_data.email+'</p>');

				var staff_lang_licensed = jQuery('<div class="staff-lang-licensed"></div>');
				if(row_data.nationality != "null")
				{
					var array_nationality = row_data.nationality.split(',');
	        		var licensed_nationality = nation[array_nationality[0]][lang]; 
	        		for(var j=1;j<array_nationality.length;j++){
	        			licensed_nationality = licensed_nationality + "," + " " + nation[array_nationality[j]][lang];
	        		}
	        		staff_lang_licensed.append('<p><span class="staff-label">'+label_dict["nation"][lang]+':</span> '+licensed_nationality+'</p>');
				}
				if(row_data.languages != "null")
				{      		
	        		var array_languages = row_data.languages.split(',');
	        		var licensed_lang = languages[lang][array_languages[0]]; 
	        		for(var k=1;k<array_languages.length;k++){
	        			licensed_lang = licensed_lang + "," + " " + languages[lang][array_languages[k]];
	        		}
	        		staff_lang_licensed.append('<p><span class="staff-label">'+label_dict["language"][lang]+':</span> '+licensed_lang+'</p>');
				}

	        	if(row_data.countries_licensed != "null")
				{   		
	        		var array_countries = row_data.countries_licensed.split(',');
					var licensed_countries = country[array_countries[0]][lang]; 
	        		for(var h=1;h<array_countries.length;h++){
	        			licensed_countries = licensed_countries + "," + " " + country[array_countries[h]][lang];
	        		}
	        		staff_lang_licensed.append('<p><span class="staff-label">'+label_dict["licensed"][lang]+':</span> '+licensed_countries+'</p>');
				}

	        	var staff_vitae = jQuery('<div class="staff-vitae"></div>');
	        	if(row_data.vitae_language != null)
	        	{
	        		staff_vitae.append('<span class="staff-label">'+label_dict["vitae"][lang]+':</span> ');
	        		var vitae_lang = row_data.vitae_language.split(',');
		        	var vitae_url = row_data.vitae_url.split(',');
		        	for (var j = 0; j < vitae_lang.length; j++) {
		        		staff_vitae.append(jQuery('<a href="'+ pdf_url + vitae_url[j] + '" target="_blank">' + vitae_lang[j] + '</a>'));
		        	}
	        	}

	        	var staff_social = jQuery('<div class="staff-social"></div>');
	        	if(row_data.instagram_link != '')
	        		staff_social.append(jQuery('<a href="'+row_data.instagram_link+'" class="instagram"><i class="fa fa-instagram" aria-hidden="true"></i></a>'));
	        	if(row_data.facebook_link != '')
	        		staff_social.append(jQuery('<a href="'+row_data.facebook_link+'" class="facebook"><i class="fa fa-facebook" aria-hidden="true"></i></a>'));
	        	if(row_data.linkedin_link != '')
	        		staff_social.append(jQuery('<a href="'+row_data.linkedin_link+'" class="linkedin"><i class="fa fa-linkedin" aria-hidden="true"></i></a>'));

	        	var company_description = jQuery('<div class="company-description"></div>');
	        	if(row_data.description != "")
	        		company_description.append('<p><span class="staff-label">'+label_dict["description"][lang]+':</span> '+row_data.description+'</p>');

	        	var personType = jQuery('<div class="personType"></div>');
	        	if(row_data.personType != "null")
	        		personType.append('<p><span class="staff-label">'+label_dict["personType"][lang]+':</span> '+label_dict[row_data.personType][lang]+'</p>');

	        	staff_item.append(staff_name);
	        	staff_item.append(staff_addr_phone);
	        	staff_item.append(staff_email);
	        	staff_item.append(staff_lang_licensed);
	        	staff_item.append(staff_vitae);
	        	staff_item.append(staff_social);
	        	staff_item.append(company_description);
	        	staff_item.append(personType);
	        	jQuery("#sl-stafflist-body").append(staff_item);
	        }
	    }
	  });
}
function log(d)
{
	console.log(d);
}