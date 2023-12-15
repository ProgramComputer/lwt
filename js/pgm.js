/**
 * \file
 * \brief All the function to make an audio controller in do_text_header.php
 * 
 * @license Unlicense
 */
function new_pos(p){$("#jquery_jplayer_1").jPlayer("playHead",p)}
function set_new_playerseconds(){var newval=($("#backtime :selected").val());do_ajax_save_setting('currentplayerseconds',newval)}
function set_new_playbackrate(){var newval=($("#playbackrate :selected").val());do_ajax_save_setting('currentplaybackrate',newval);$("#jquery_jplayer_1").jPlayer("option","playbackRate",newval*0.1)}
function set_current_playbackrate(){var val=($("#playbackrate :selected").val());$("#jquery_jplayer_1").jPlayer("option","playbackRate",val*0.1)}
function click_single(){$("#jquery_jplayer_1").off('bind',$.jPlayer.event.ended+".jp-repeat");$("#do-single").addClass('hide');$("#do-repeat").removeClass('hide');do_ajax_save_setting('currentplayerrepeatmode','0');return!1}
function click_repeat(){$("#jquery_jplayer_1").on('bind',$.jPlayer.event.ended+".jp-repeat",function(event){$(this).jPlayer("play")});$("#do-repeat").addClass('hide');$("#do-single").removeClass('hide');do_ajax_save_setting('currentplayerrepeatmode','1');return!1}
function click_back(){var t=parseInt($("#playTime").text(),10);var b=parseInt($("#backtime").val(),10);var nt=t-b;var st='pause';if(nt<0)nt=0;if(!$('#jquery_jplayer_1').data().jPlayer.status.paused)st='play';$("#jquery_jplayer_1").jPlayer(st,nt)}
function click_forw(){var t=parseInt($("#playTime").text(),10);var b=parseInt($("#backtime").val(),10);var nt=t+b;var st='pause';if(!$('#jquery_jplayer_1').data().jPlayer.status.paused)st='play';$("#jquery_jplayer_1").jPlayer(st,nt)}
function click_slower(){val=parseFloat($("#pbvalue").text())-0.1;if(val>=0.5){$("#pbvalue").text(val.toFixed(1)).css({'color':'#BBB'}).animate({color:'#888'},150,function(){});$("#jquery_jplayer_1").jPlayer("playbackRate",val)}}
function click_faster(){val=parseFloat($("#pbvalue").text())+0.1;if(val<=4.0){$("#pbvalue").text(val.toFixed(1)).css({'color':'#BBB'}).animate({color:'#888'},150,function(){});$("#jquery_jplayer_1").jPlayer("playbackRate",val)}}
function click_stdspeed(){$("#playbackrate").val(10);set_new_playbackrate()}
function click_slower(){var val=($("#playbackrate :selected").val());if(val>5){val--;$("#playbackrate").val(val);set_new_playbackrate()}}
function click_faster(){var val=($("#playbackrate :selected").val());if(val<15){val++;$("#playbackrate").val(val);set_new_playbackrate()}};function CountUp(server_now,server_start,id,dontrun){if(server_now<server_start)server_start=server_now;this.beginSecs=Math.floor(((new Date()).getTime())/1000)-server_now+server_start;this.dontrun=dontrun;this.update(id)}
CountUp.prototype.update=function(id){var nowSecs=Math.floor(((new Date()).getTime())/1000);var sec=nowSecs-this.beginSecs;var min=Math.floor(sec/60);sec=sec-min*60;var hr=Math.floor(min/60);min=min-hr*60;var r='';if(hr>0){r+=hr<10?("0"+hr):hr;r+=":"}
r+=min<10?("0"+min):min;r+=":";r+=sec<10?("0"+sec):sec;document.getElementById(id).innerHTML=r;if(this.dontrun)return;var self=this;setTimeout(function(){self.update(id)},1000)};/**
 * \file
 * \brief Control the interactions for making an automated feed wizard.
 * 
 * @package Lwt
 * @author  andreask7 <andreasks7@users.noreply.github.com>
 * @license Unlicense
 * @since   1.6.16-fork
 */
function extend_adv_xpath(){$('#adv').prepend('<p style="text-align: left;">'+'<input style="vertical-align: middle; margin: 2px;" class="xpath" '+'type="radio" name="xpath" value=\'\'>'+'custom: '+'<input type="text" id="custom_xpath" name="custom_xpath" '+'style="width:70%" '+'onkeyup="try{val=$(\'#custom_xpath\').val();valid=$(document).xpath(val);}catch(err){val=\'\';valid=0;}if(valid==0){$(this).parent().find(\'.xpath\').val(\'\');if($(this).parent().find(\':radio\').is(\':checked\'))$(\'#adv_get_button\').prop(\'disabled\', true);$(\'#custom_img\').attr(\'src\',\'icn/exclamation-red.png\');}else {$(this).parent().find(\'.xpath\').val(val);if($(this).parent().find(\':radio\').is(\':checked\'))$(\'#adv_get_button\').prop(\'disabled\', false);$(\'#custom_img\').attr(\'src\',\'icn/tick.png\');}return false;" onpaste="setTimeout(function() {try{val=$(\'#custom_xpath\').val();valid=$(document).xpath(val);}catch(err){val=\'\';valid=0;}if(valid==0){$(this).parent().find(\'.xpath\').val(\'\');if($(\'#custom_xpath\').parent().find(\':radio\').is(\':checked\'))$(\'#adv_get_button\').prop(\'disabled\', true);$(\'#custom_img\').attr(\'src\',\'icn/exclamation-red.png\');}else {$(\'#custom_xpath\').parent().find(\'.xpath\').val(val);if($(\'#custom_xpath\').parent().find(\':radio\').is(\':checked\'))$(\'#adv_get_button\').prop(\'disabled\', false);$(\'#custom_img\').attr(\'src\',\'icn/tick.png\');}}, 0);" value=\'\'>'+'</input>'+'<img id="custom_img" src="icn/exclamation-red.png" alt="-" />'+'</input>'+'</p>');$('#adv').show();$('*').removeClass("lwt_marked_text");$('*[class=\'\']').removeAttr('class');var val1=$($('#mark_action :selected').data()).get(0).tagName.toLowerCase(),attr='',node_count=0,attr_v='',attr_p='',val_p='';for(var i=0,attrs=this[0].attributes,l=attrs.length;i<l;i++){if(attrs.item(i).nodeName=='id'){var id_cont=attrs.item(i).nodeValue.split(' ');for(var z=0;z<id_cont.length;z++){var val='//*[@id[contains(concat(" ",normalize-space(.)," ")," '+id_cont[z]+' ")]]';$('#adv').prepend('<p style="text-align: left;">'+'<input style="vertical-align: middle; margin: 2px;" '+'class="xpath" type="radio" name="xpath" value=\''+val+'\'>'+'contains id: «'+id_cont[z]+'»'+'</input>'+'</p>')}}
if(attrs.item(i).nodeName=='class'){var cl_cont=attrs.item(i).nodeValue.split(' ');for(var z=0;z<cl_cont.length;z++){val='//*[@class[contains(concat(" ",normalize-space(.)," ")," '+cl_cont[z]+' ")]]';$('#adv').prepend('<p style="text-align: left;">'+'<input style="vertical-align: middle; margin: 2px;" '+'class="xpath" type="radio" name="xpath" value=\''+val+'\'>'+'contains class: «'+cl_cont[z]+'»'+'</input>'+'</p>')}}
if(i>0)attr_v+=' and ';if(i==0)attr_v+='[';attr_v+='@'+attrs.item(i).nodeName;attr_v+='="'+attrs.item(i).nodeValue+'"';if(i==(attrs.length-1))attr_v+=']'}
this.parents().each(function(){var pa=$(this).get(0);for(var i=0,attrs=pa.attributes,l=attrs.length;i<l;i++){if(node_count==0){if(attrs.item(i).nodeName=='id'){id_cont=attrs.item(i).nodeValue.split(' ');for(var z=0;z<id_cont.length;z++){val='//*[@id[contains(concat(" ",normalize-space(.)," ")," '+id_cont[z]+' ")]]';$('#adv').prepend('<p style="text-align: left;">'+'<input style="vertical-align: middle; margin: 2px;" '+'class="xpath" type="radio" name="xpath" value=\''+val+'/'+val1+'\'>'+'parent contains id: «'+id_cont[z]+'»'+'</input>'+'</p>')}}
if(attrs.item(i).nodeName=='class'){cl_cont=attrs.item(i).nodeValue.split(' ');for(var z=0;z<cl_cont.length;z++){if(cl_cont[z]!='lwt_filtered_text'){val='//*[@class[contains(concat(" ",normalize-space(.)," ")," '+cl_cont[z]+' ")]]';$('#adv').prepend('<p style="text-align: left;"><input style="vertical-align: middle; margin: 2px;" class="xpath" type="radio" name="xpath" value=\''+val+'/'+val1+'\'>parent contains class: «'+cl_cont[z]+'»</input></p>')}}}}
if(attrs.length>1||attrs.item(i).nodeValue!='lwt_filtered_text'){if(i>0&&attrs.item(i).nodeValue!='lwt_filtered_text')attr_p+=' and ';if(i==0)attr_p+='[';if(attrs.item(i).nodeValue!='lwt_filtered_text')attr_p+='@'+attrs.item(i).nodeName;if(attrs.item(i).nodeValue!='lwt_filtered_text')attr_p+='="'+attrs.item(i).nodeValue.replace('lwt_filtered_text','').trim()+'"';if(i==(attrs.length-1))attr_p+=']'}}
val_p=pa.tagName.toLowerCase()+attr_p+'/'+val_p;attr_p='';pa='';node_count++});$('#adv').prepend('<p style="text-align: left;"><input style="vertical-align: middle; margin: 2px;" class="xpath" type="radio" name="xpath" value=\'/'+val_p+val1+attr_v+'\'>all: « /'+val_p.replace('=""','')+val1+attr_v.replace('=""','')+' »</input></p>');$('#adv input[type="radio"]').each(function(z){if(typeof z=='undefined')z=1;if(typeof $(this).attr('id')=='undefined'){$(this).attr('id','rb_'+z++)}
$(this).after('<label class="wrap_radio" for="'+$(this).attr('id')+'"><span></span></label>')})}
function feedwizard_prepare_interaction(){if($('#lwt_sel').html()==''&&$('input[name=\'step\']').val()==2)
$('#next').prop('disabled',!0);else $('#next').prop('disabled',!1);$('#lwt_last').css('margin-top',$('#lwt_header').height());$('#lwt_header').nextAll().on('click',function(event){if(!($(event.target).hasClass("lwt_selected_text"))){if(!($(event.target).hasClass("lwt_filtered_text"))){if($(event.target).hasClass("lwt_marked_text")){$("#mark_action").empty();$('*').removeClass("lwt_marked_text");$('*[class=\'\']').removeAttr('class');$('button[name="button"]').prop('disabled',!0);$('<option/>').val('').text('[Click On Text]').appendTo('#mark_action');return!1}else{$('*').removeClass("lwt_marked_text");$("#mark_action").empty();var filter_array=[];$(event.target).parents(':not(html,body)').addBack().each(function(){if(!($(this).hasClass("lwt_filtered_text"))){filter_array=[];$(this).parents('.lwt_filtered_text').each(function(){$(this).removeClass('lwt_filtered_text');filter_array.push(this)});$('*[class=\'\']').removeAttr('class');var el=this;if($(this).attr('style')==='')$(this).removeAttr("style");val1=$(this).get(0).tagName.toLowerCase();var attr='',attr_v='',attr_p='',attr_mode='',val_p='';if($('select[name="select_mode"]').val()!='0'){attr_mode=5}else if($(this).attr('id'))attr_mode=1;else if($(this).parent().attr('id'))attr_mode=2;else if($(this).attr('class'))attr_mode=3;else if($(this).parent().attr('class'))attr_mode=4;else attr_mode=5;for(var i=0,attrs=el.attributes,l=attrs.length;i<l;i++){if(attr_mode==5||(attrs.item(i).nodeName=='class'&&attr_mode!=1)||(attrs.item(i).nodeName=='id')){attr+=attrs.item(i).nodeName;attr+='="'+attrs.item(i).nodeValue+'" ';if(i>0)attr_v+=' and ';attr_v+='@'+attrs.item(i).nodeName;attr_v+='="'+attrs.item(i).nodeValue+'"'}}
attr=attr.replace('=""','').trim();if(attr_v)attr_v='['+attr_v+']';if(attr_mode!=1&&attr_mode!=3){for(var i=0,attrs=$(this).parent().get(0).attributes,l=attrs.length;i<l;i++){if(attr_mode==5||(attrs.item(i).nodeName=='class'&&attr_mode!=2)||(attrs.item(i).nodeName=='id')){if(i>0)attr_p+=' and ';attr_p+='@'+attrs.item(i).nodeName;attr_p+='="'+attrs.item(i).nodeValue+'"'}}
if(attr_p)attr_p='['+attr_p+']';val_p=$(this).parent().get(0).tagName.toLowerCase()+attr_p+'§'}val_p=val_p.replace('body§','');var attrsplit=attr.substr(0,20);if(!(attrsplit==attr))attrsplit=attrsplit+'... ';if(!(attrsplit==''))attrsplit=" "+attrsplit;if(event.target==this)
$("<option/>").val('//'+val_p.replace('=""','').replace('[ and @','[@')+val1+attr_v.replace('=""','').replace('[ and @','[@')).text("<"+val1.replace('[ and @','[@')+attrsplit.replace('[ and @','[@')+">").data(el).attr("selected",!0).prependTo("#mark_action");else $("<option/>").val('//'+val_p.replace('=""','').replace('[ and @','[@')+val1+attr_v.replace('=""','').replace('[ and @','[@')).text("<"+val1.replace('[ and @','[@')+attrsplit.replace('[ and @','[@')+">").data(el).prependTo("#mark_action");for(var i in filter_array){$(filter_array[i]).addClass('lwt_filtered_text')}}});$('button[name="button"]').prop('disabled',!1);var attr=$('#mark_action').val();attr=attr.replace(/@/g,'').replace('//','').replace(/ and /g,'][').replace('§','>');filter_array=[];$(this).parents('.lwt_filtered_text').each(function(){$(this).removeClass('lwt_filtered_text');filter_array.push(this)});$(attr+':not(.lwt_selected_text)').find('*:not(.lwt_selected_text)').addBack().addClass("lwt_marked_text");for(var i in filter_array){$(filter_array[i]).addClass('lwt_filtered_text')}
return!1}}else{event.preventDefault()}}else{var selected_Array=[];var filter_array=[];$('.lwt_selected_text').each(function(){selected_Array.push(this)});$(event.target).parents('*').addBack().each(function(){if(!($(this).parent().hasClass("lwt_selected_text"))&&$(this).hasClass("lwt_selected_text")){if($(this).hasClass('lwt_highlighted_text')){$('*').removeClass('lwt_highlighted_text')}else{el=this;$('*').removeClass('lwt_selected_text');filter_array=[];$(this).parents('.lwt_filtered_text').each(function(){$(this).removeClass('lwt_filtered_text');filter_array.push(this)});$('*[class=\'\']').removeAttr('class');$('#lwt_sel li').each(function(){$('*').removeClass('lwt_highlighted_text');$(this).addClass('lwt_highlighted_text');$(document).xpath($(this).text()).addClass('lwt_highlighted_text');if($(el).hasClass('lwt_highlighted_text')){return!1}});for(var i in selected_Array){$(selected_Array[i]).addClass('lwt_selected_text')}}}});for(var i in filter_array){$(filter_array[i]).addClass('lwt_filtered_text')}
$('button[name="button"]').prop('disabled',!0);$("#mark_action").empty();$('<option/>').val('').text('[Click On Text]').appendTo('#mark_action');return!1}});$('*').removeClass('lwt_filtered_text');$('*[class=\'\']').removeAttr('class');var sel_array="";$('#lwt_sel li').each(function(){if($(this).hasClass('lwt_highlighted_text')){$(document).xpath($(this).text()).not($('#lwt_header').find('*').addBack()).addClass('lwt_highlighted_text').find('*').addBack().addClass('lwt_selected_text')}else sel_array+=$(this).text()+" | "});if(sel_array!="")
$(document).xpath(sel_array.replace(/ \| $/,'')).find('*').addBack().not($('#lwt_header').find('*').addBack()).addClass('lwt_selected_text');for(var i in filter_Array){$(filter_Array[i]).addClass('lwt_filtered_text')}
$('*[style=\'\']').removeAttr('style');$("#lwt_header select").wrap("<label class='wrap_select'></label>");$(document).mouseup(function(){$("select:not(:active),button,input[type=button],.wrap_radio span,.wrap_checkbox span").trigger('blur')})}
$(document).on('click','.delete_selection',function(){$('*').removeClass('lwt_selected_text').removeClass('lwt_marked_text');$('*').removeClass('lwt_filtered_text');$('#lwt_header').nextAll().find('*').addBack().removeClass('lwt_highlighted_text');$(this).parent().remove();var sel_array="";$('#lwt_sel li').each(function(){if($(this).hasClass('lwt_highlighted_text')){$(document).xpath($(this).text()).not($('#lwt_header').find('*').addBack()).addClass('lwt_highlighted_text').find('*').addBack().addClass('lwt_selected_text')}else sel_array+=$(this).text()+" | "});if(sel_array!="")
$(document).xpath(sel_array.replace(/ \| $/,'')).find('*').addBack().not($('#lwt_header').find('*').addBack()).addClass('lwt_selected_text');for(var i in filter_Array){$(filter_Array[i]).addClass('lwt_filtered_text')}
$('*[class=\'\']').removeAttr('class');$('*[style=\'\']').removeAttr('style');$('#lwt_last').css('margin-top',$('#lwt_header').height());if($('#lwt_sel').html()==''&&$('input[name=\'step\']').val()==2)
$('#next').prop('disabled',!0);return!1});$(document).on('change','.xpath',function(){$('#adv_get_button').prop('disabled',!1);$(this).parent().find('img').each(function(){if($(this).attr('src')=='icn/exclamation-red.png')$('#adv_get_button').prop('disabled',!0);});return!1});$(document).on('click','#adv_get_button',function(){$('*').removeClass('lwt_filtered_text');$('*[class=\'\']').removeAttr('class');if(typeof $('#adv :radio:checked').val()!='undefined'){$('#lwt_sel').append('<li style=\'text-align: left\'><img class=\'delete_selection\' src=\'icn/cross.png\'  title=\'Delete Selection\' alt=\'\' /> '+$('#adv :radio:checked').val()+'</li>');$(document).xpath($('#adv :radio:checked').val()).find('*').addBack().not($('#lwt_header').find('*').addBack()).addClass('lwt_selected_text');$('#next').prop('disabled',!1)}
$('#adv').hide();$('#lwt_last').css('margin-top',$('#lwt_header').height());for(var i in filter_Array){$(filter_Array[i]).addClass('lwt_filtered_text')}
return!1});$(document).on('click','#lwt_sel li',function(){if($(this).hasClass('lwt_highlighted_text')){$('*').removeClass('lwt_highlighted_text')}else{var selected_Array=[];$('.lwt_selected_text').each(function(){$(this).removeClass('lwt_selected_text');selected_Array.push(this)});$('*').removeClass('lwt_filtered_text');$('*').removeClass('lwt_highlighted_text');$('*[class=\'\']').removeAttr('class');$(this).addClass('lwt_highlighted_text');$(document).xpath($(this).text()).not($('#lwt_header').find('*').addBack()).addClass('lwt_highlighted_text').find('*').addBack().addClass('lwt_selected_text');for(var i in filter_Array){$(filter_Array[i]).addClass('lwt_filtered_text')}
for(var i in selected_Array){$(selected_Array[i]).addClass('lwt_selected_text')}}
return!1});$(document).on('change','#mark_action',function(){$('*').removeClass('lwt_marked_text');$('*[class=\'\']').removeAttr('class');attr=$('#mark_action').val();attr=attr.replace(/@/g,'').replace('//','').replace(/ and /g,'][').replace('§','>');$('*').removeClass('lwt_filtered_text');$(attr).find('*:not(.lwt_selected_text)').addBack().addClass('lwt_marked_text');for(var i in filter_Array){$(filter_Array[i]).addClass('lwt_filtered_text')}
return!1});$(document).on('click','#get_button,#filter_button',function(){$('*').removeClass('lwt_marked_text');if($('select[name=\'select_mode\']').val()=='adv'){$('#adv p').remove();$('*[style=\'\']').removeAttr('style');$('#adv_get_button').prop('disabled',!0);$($('#mark_action :selected').data()).get_adv_xpath()}else{$('#next').prop('disabled',!1);attr=$('#mark_action').val();attr=attr.replace(/@/g,'').replace('//','').replace(/ and /g,'][').replace('§','>');var filter_Array=[];$('.lwt_filtered_text').each(function(){$(this).removeClass('lwt_filtered_text');filter_Array.push(this)});$('*').removeClass('lwt_filtered_text');$(attr).find('*').addBack().addClass('lwt_selected_text');for(var i in filter_Array){$(filter_Array[i]).addClass('lwt_filtered_text')}
$('#lwt_sel').append('<li style=\'text-align: left\'><img class=\'delete_selection\' src=\'icn/cross.png\'  title=\'Delete Selection\' alt=\''+$('#mark_action').val()+'\' /> '+$('#mark_action').val().replace('§','/')+'</li>')}
$(this).prop('disabled',!0);$('#mark_action').empty();$('<option/>').val('').text('[Click On Text]').appendTo('#mark_action');$('#lwt_last').css('margin-top',$('#lwt_header').height());return!1});$(document).on('click','#next',function(){$('#article_tags,#filter_tags').val($('#lwt_sel').html()).prop('disabled',!1);var html=$('#lwt_sel li').map(function(){return $(this).text()}).get().join(' | ');$('input[name=\'html\']').val(html);var val=$('input[name=\'step\']').val();if(val==2){$('input[name=\'html\']').attr('name','article_selector')
$('select[name=\'NfArticleSection\'] option').each(function(){art_sec=$('#lwt_sel li').map(function(){return $(this).text()}).get().join(' | ');$(this).val(art_sec)})}
$('input[name=\'step\']').val(++val);document.lwt_form1.submit();return!1});$(document).on('change','#host_status',function(){var host_status=$(this).val();var current_host=$('input[name=\'host_name\']').val();$('select[name=\'selected_feed\'] option').each(function(){var opt_str=$(this).text();var host_name=opt_str.replace(/[▸\-][0-9\s]*[★☆\-][\s]*host:/,'');if(host_name.trim()==current_host.trim()){$(this).text(opt_str.replace(/([▸\-][0-9\s]*?)\s[★☆\-]\s(.*)/,'$1 '+host_status.trim()+' $2'))}});return!1});/**
 * \file
 * \brief Interaction between LWT and jQuery
 * 
 * @package Lwt
 * @license unlicense
 * @author  andreask7 <andreasks7@users.noreply.github.com>
 * @since   1.6.16-fork
 */
TEXTPOS=-1;OPENED=0;WID=0;TID=0;WBLINK1='';WBLINK2='';WBLINK3='';SOLUTION='';ADDFILTER='';RTL=0;ANN_ARRAY={};DELIMITER='';JQ_TOOLTIP=0;function setTransRoman(tra,rom){let form_changed=!1;if($('textarea[name="WoTranslation"]').length==1){$('textarea[name="WoTranslation"]').val(tra);form_changed|=!0}
if($('input[name="WoRomanization"]').length==1){$('input[name="WoRomanization"]').val(rom);form_changed|=!0}
if(form_changed)
makeDirty();}
function containsCharacterOutsideBasicMultilingualPlane(s){return/[\uD800-\uDFFF]/.test(s)}
function alertFirstCharacterOutsideBasicMultilingualPlane(s,info){if(!containsCharacterOutsideBasicMultilingualPlane(s)){return 0}
const match=/[\uD800-\uDFFF]/.exec(s);alert('ERROR\n\nText "'+info+'" contains invalid character(s) '+'(in the Unicode Supplementary Multilingual Planes, > U+FFFF) like emojis '+'or very rare characters.\n\nFirst invalid character: "'+s.substring(match.index,match.index+2)+'" at position '+(match.index+1)+'.\n\n'+'More info: https://en.wikipedia.org/wiki/Plane_(Unicode)\n\n'+'Please remove this/these character(s) and try again.');return 1}
function getUTF8Length(s){return(new Blob([String(s)])).size}
function scrollToAnchor(aid){document.location.href='#'+aid}
function do_ajax_save_impr_text(textid,elem_name,form_data){const idwait='#wait'+elem_name.substring(2);$(idwait).html('<img src="icn/waiting2.gif" />');$.post('inc/ajax.php/v1/texts/'+textid+'/annotation',{action:"",action_type:"set_annotation",tid:textid,elem:elem_name,data:form_data},function(data){$(idwait).html('<img src="icn/empty.gif" />');if("error" in data)
alert('Saving your changes failed, please reload the page and try again! '+'Error message: "'+data.error+'".');},"json")}
function changeImprAnnText(){$(this).prev('input:radio').attr('checked','checked');const textid=$('#editimprtextdata').attr('data_id');const elem_name=$(this).attr('name');const form_data=JSON.stringify($('form').serializeObject());do_ajax_save_impr_text(textid,elem_name,form_data)}
function changeImprAnnRadio(){const textid=$('#editimprtextdata').attr('data_id');const elem_name=$(this).attr('name');const form_data=JSON.stringify($('form').serializeObject());do_ajax_save_impr_text(textid,elem_name,form_data)}
function addTermTranslation(wordid,txid,word,lang){const translation=$(txid).val().trim();const pagepos=$(document).scrollTop();if(translation==''||translation=='*'){alert('Text Field is empty or = \'*\'!');return}
let request={action:"change_translation",translation:translation,};let failure,action_type,endpoint;if(wordid===0){action_type="add";endpoint="new";request.text=word;request.lang=lang;failure="Adding translation to term failed!"}else{action_type="update";endpoint=parseInt(wordid,10);request.wordid=wordid;failure="Updating translation of term failed!"}
request.action_type=action_type;failure+="Please reload page and try again."
$.post('inc/ajax.php/v1/translations/'+endpoint,request,function(d){if(d==''){alert(failure);return}
if("error" in d){alert(failure+"\n"+d.error);return}
do_ajax_edit_impr_text(pagepos,d[action_type])},"json")}
function changeTableTestStatus(wordid,up){const status_change=up?'up':'down';const wid=parseInt(wordid,10);$.post('inc/ajax.php/v1/terms/'+wid+'/status/'+status_change,{action:"term_status",action_type:"increment",wid:wid,status_up:(up?1:0)},function(data){if(data==""||"error" in data){return}
$('#STAT'+wordid).html(data.increment)},"json")}
function check(){let count=0;$('.notempty').each(function(_n){if($(this).val().trim()=='')count++});if(count>0){alert('ERROR\n\n'+count+' field(s) - marked with * - must not be empty!');return!1}
count=0;$('input.checkurl').each(function(_n){if($(this).val().trim().length>0){if(($(this).val().trim().indexOf('http://')!=0)&&($(this).val().trim().indexOf('https://')!=0)&&($(this).val().trim().indexOf('#')!=0)){alert('ERROR\n\nField "'+$(this).attr('data_info')+'" must start with "http://" or "https://" if not empty.');count++}}});$('input.checkregexp').each(function(_n){const regexp=$(this).val().trim();if(regexp.length>0){$.ajax({type:'POST',url:'inc/ajax.php',data:{action:"",action_type:"check_regexp",regex:regexp},async:!1}).always(function(data){if(data!=''){alert(data);count++}})}});$('input[class*="max_int_"]').each(function(_n){const maxvalue=parseInt($(this).attr('class').replace(/.*maxint_([0-9]+).*/,'$1'));if($(this).val().trim().length>0){if($(this).val()>maxvalue){alert('ERROR\n\n Max Value of Field "'+$(this).attr('data_info')+'" is '+maxvalue);count++}}});$('input.checkdicturl').each(function(_n){const translate_input=$(this).val().trim();if(translate_input.length>0){let refinned=translate_input;if(translate_input.startsWith('*')){refinned=translate_input.substring(1)}
if(!/^https?:\/\//.test(refinned)){refinned='http://'+refinned}
try{new URL(refinned)}catch(err){if(err instanceof TypeError){alert('ERROR\n\nField "'+$(this).attr('data_info')+'" should be an URL if not empty.');count++}}}});$('input.posintnumber').each(function(_n){if($(this).val().trim().length>0){if(!(isInt($(this).val().trim())&&(parseInt($(this).val().trim(),10)>0))){alert('ERROR\n\nField "'+$(this).attr('data_info')+'" must be an integer number > 0.');count++}}});$('input.zeroposintnumber').each(function(_n){if($(this).val().trim().length>0){if(!(isInt($(this).val().trim())&&(parseInt($(this).val().trim(),10)>=0))){alert('ERROR\n\nField "'+$(this).attr('data_info')+'" must be an integer number >= 0.');count++}}});$('input.checkoutsidebmp').each(function(_n){if($(this).val().trim().length>0){if(containsCharacterOutsideBasicMultilingualPlane($(this).val())){count+=alertFirstCharacterOutsideBasicMultilingualPlane($(this).val(),$(this).attr('data_info'))}}});$('textarea.checklength').each(function(_n){if($(this).val().trim().length>(0+$(this).attr('data_maxlength'))){alert('ERROR\n\nText is too long in field "'+$(this).attr('data_info')+'", please make it shorter! (Maximum length: '+$(this).attr('data_maxlength')+' char.)');count++}});$('textarea.checkoutsidebmp').each(function(_n){if(containsCharacterOutsideBasicMultilingualPlane($(this).val())){count+=alertFirstCharacterOutsideBasicMultilingualPlane($(this).val(),$(this).attr('data_info'))}});$('textarea.checkbytes').each(function(_n){if(getUTF8Length($(this).val().trim())>(0+$(this).attr('data_maxlength'))){alert('ERROR\n\nText is too long in field "'+$(this).attr('data_info')+'", please make it shorter! (Maximum length: '+$(this).attr('data_maxlength')+' bytes.)');count++}});$('input.noblanksnocomma').each(function(_n){if($(this).val().indexOf(' ')>0||$(this).val().indexOf(',')>0){alert('ERROR\n\nNo spaces or commas allowed in field "'+$(this).attr('data_info')+'", please remove!');count++}});return(count==0)}
function isInt(value){for(let i=0;i<value.length;i++){if((value.charAt(i)<'0')||(value.charAt(i)>'9')){return!1}}
return!0}
function markClick(){if($('input.markcheck:checked').length>0){$('#markaction').removeAttr('disabled')}else{$('#markaction').attr('disabled','disabled')}}
function confirmDelete(){return confirm('CONFIRM\n\nAre you sure you want to delete?')}
function showAllwordsClick(){const showAll=$('#showallwords').prop('checked')?'1':'0';const showLeaning=$('#showlearningtranslations').prop('checked')?'1':'0';const text=$('#thetextid').text();setTimeout(function(){showRightFrames('set_text_mode.php?mode='+showAll+'&showLearning='+showLeaning+'&text='+text)},500);setTimeout(function(){window.location.reload()},4000)}
function textareaKeydown(event){if(event.keyCode&&event.keyCode=='13'){if(check())
$('input:submit').last().trigger('click');return!1}else{return!0}}
function noShowAfter3Secs(){$('#hide3').slideUp()}
function setTheFocus(){$('.setfocus').trigger('focus').trigger('select')}
function word_click_event_do_test_test(){run_overlib_test(WBLINK1,WBLINK2,WBLINK3,$(this).attr('data_wid'),$(this).attr('data_text'),$(this).attr('data_trans'),$(this).attr('data_rom'),$(this).attr('data_status'),$(this).attr('data_sent'),$(this).attr('data_todo'));$('.todo').text(SOLUTION);return!1}
function keydown_event_do_test_test(e){if(e.key=='Space'&&OPENED==0){$('.word').trigger('click');cleanupRightFrames();showRightFrames('show_word.php?wid='+$('.word').attr('data_wid')+'&ann=');OPENED=1;return!1}
if(e.which==38){showRightFrames('set_test_status.php?wid='+WID+'&stchange=1');return!1}
if(e.which==27){showRightFrames('set_test_status.php?wid='+WID+'&status='+$('.word').attr('data_status'));return!1}
if(e.which==73){showRightFrames('set_test_status.php?wid='+WID+'&status=98');return!1}
if(e.which==87){showRightFrames('set_test_status.php?wid='+WID+'&status=99');return!1}
if(e.which==69){showRightFrames('edit_tword.php?wid='+WID);return!1}
if(OPENED==0)return!0;if(e.which==40){showRightFrames('set_test_status.php?wid='+WID+'&stchange=-1');return!1}
for(let i=1;i<=5;i++){if(e.which==(48+i)||e.which==(96+i)){showRightFrames('set_test_status.php?wid='+WID+'&status='+i);return!1}}
return!0}
function word_each_do_text_text(_){const wid=$(this).attr('data_wid');if(wid!=''){const order=$(this).attr('data_order');if(order in ANN_ARRAY){if(wid==ANN_ARRAY[order][1]){const ann=ANN_ARRAY[order][2];const re=new RegExp('(['+DELIMITER+'][ ]{0,1}|^)('+ann.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&')+')($|[ ]{0,1}['+DELIMITER+'])','');if(!re.test($(this).attr('data_trans').replace(/ \[.*$/,''))){const trans=ann+' / '+$(this).attr('data_trans');$(this).attr('data_trans',trans.replace(' / *',''))}
$(this).attr('data_ann',ann)}}}
if(!JQ_TOOLTIP){this.title=make_tooltip($(this).text(),$(this).attr('data_trans'),$(this).attr('data_rom'),$(this).attr('data_status'))}}
function mword_each_do_text_text(_){if($(this).attr('data_status')!=''){const wid=$(this).attr('data_wid');if(wid!=''){const order=parseInt($(this).attr('data_order'));for(let j=2;j<=16;j=j+2){const index=(order+j).toString();if(index in ANN_ARRAY){if(wid==ANN_ARRAY[index][1]){const ann=ANN_ARRAY[index][2];const re=new RegExp('(['+DELIMITER+'][ ]{0,1}|^)('+ann.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&')+')($|[ ]{0,1}['+DELIMITER+'])','');if(!re.test($(this).attr('data_trans').replace(/ \[.*$/,''))){const trans=ann+' / '+$(this).attr('data_trans');$(this).attr('data_trans',trans.replace(' / *',''))}
$(this).attr('data_ann',ann);break}}}}
if(!JQ_TOOLTIP){this.title=make_tooltip($(this).attr('data_text'),$(this).attr('data_trans'),$(this).attr('data_rom'),$(this).attr('data_status'))}}}
function word_dblclick_event_do_text_text(){const t=parseInt($('#totalcharcount').text(),10);if(t==0)return;let p=100*($(this).attr('data_pos')-5)/t;if(p<0)p=0;if(typeof(window.parent.frames.h.new_pos)==='function'){window.parent.frames.h.new_pos(p)}}
function word_click_event_do_text_text(){const status=$(this).attr('data_status');let ann='';if($(this).attr('data_ann')!==undefined){ann=$(this).attr('data_ann')}
let hints;if(JQ_TOOLTIP){hints=make_tooltip($(this).text(),$(this).attr('data_trans'),$(this).attr('data_rom'),status)}else{hints=$(this).attr('title')}
const multi_words=Array(7);for(let i=0;i<7;i++){multi_words[i]=$(this).attr('data_mw'+(i+2))}
if(status<1){run_overlib_status_unknown(WBLINK1,WBLINK2,WBLINK3,hints,TID,$(this).attr('data_order'),$(this).text(),multi_words,RTL);showRightFrames('edit_word.php?tid='+TID+'&ord='+$(this).attr('data_order')+'&wid=')}else if(status==99){run_overlib_status_99(WBLINK1,WBLINK2,WBLINK3,hints,TID,$(this).attr('data_order'),$(this).text(),$(this).attr('data_wid'),multi_words,RTL,ann)}else if(status==98){run_overlib_status_98(WBLINK1,WBLINK2,WBLINK3,hints,TID,$(this).attr('data_order'),$(this).text(),$(this).attr('data_wid'),multi_words,RTL,ann)}else{run_overlib_status_1_to_5(WBLINK1,WBLINK2,WBLINK3,hints,TID,$(this).attr('data_order'),$(this).text(),$(this).attr('data_wid'),status,multi_words,RTL,ann)}
return!1}
function mword_click_event_do_text_text(){const status=$(this).attr('data_status');if(status!=''){let ann='';if((typeof $(this).attr('data_ann'))!=='undefined'){ann=$(this).attr('data_ann')}
run_overlib_multiword(WBLINK1,WBLINK2,WBLINK3,JQ_TOOLTIP?make_tooltip($(this).text(),$(this).attr('data_trans'),$(this).attr('data_rom'),status):$(this).attr('title'),TID,$(this).attr('data_order'),$(this).attr('data_text'),$(this).attr('data_wid'),status,$(this).attr('data_code'),ann)}
return!1}
function mword_drag_n_drop_select(event){if(JQ_TOOLTIP)$('.ui-tooltip').remove();const context=$(this).parent();context.one('mouseup mouseout',$(this),function(){clearTimeout(to);$('.nword').removeClass('nword');$('.tword').removeClass('tword');$('.lword').removeClass('lword');$('.wsty',context).css('background-color','').css('border-bottom-color','');$('#pe').remove()});to=setTimeout(function(){let pos;context.off('mouseout');$('.wsty',context).css('background-color','inherit').css('border-bottom-color','rgba(0,0,0,0)').not('.hide,.word').each(function(){f=parseInt($(this).attr('data_code'))*2+parseInt($(this).attr('data_order'))-1;h='';$(this).nextUntil($('[id^="ID-'+f+'-"]',context),'[id$="-1"]').each(function(){l=$(this).attr('data_order');if(typeof l!=='undefined'){h+='<span class="tword" data_order="'+l+'">'+$(this).text()+'</span>'}else{h+='<span class="nword" data_order="'+$(this).attr('id').split('-')[1]+'">'+$(this).text()+'</span>'}});$(this).html(h)});$('#pe').remove();$('body').append('<style id="pe">#'+context.attr('id')+' .wsty:after,#'+context.attr('id')+' .wsty:before{opacity:0}</style>');$('[id$="-1"]',context).not('.hide,.wsty').addClass('nword').each(function(){$(this).attr('data_order',$(this).attr('id').split('-')[1])});$('.word',context).not('.hide').each(function(){$(this).html('<span class="tword" data_order="'+$(this).attr('data_order')+'">'+$(this).text()+'</span>')});if(event.data.annotation==1){$('.wsty',context).not('.hide').each(function(){$(this).children('.tword').last().attr('data_ann',$(this).attr('data_ann')).attr('data_trans',$(this).attr('data_trans')).addClass('content'+$(this).removeClass('status1 status2 status3 status4 status5 status98 status99').attr('data_status'))})}else if(event.data.annotation==3){$('.wsty',context).not('.hide').each(function(){$(this).children('.tword').first().attr('data_ann',$(this).attr('data_ann')).attr('data_trans',$(this).attr('data_trans')).addClass('content'+$(this).removeClass('status1 status2 status3 status4 status5 status98 status99').attr('data_status'))})}
$(context).one('mouseover','.tword',function(){$('html').one('mouseup',function(){$('.wsty',context).each(function(){$(this).addClass('status'+$(this).attr('data_status'))});if(!$(this).hasClass('tword')){$('span',context).removeClass('nword tword lword');$('.wsty',context).css('background-color','').css('border-bottom-color','');$('#pe').remove()}});pos=parseInt($(this).attr('data_order'));$('.lword',context).removeClass('lword');$(this).addClass('lword');$(context).on('mouseleave',function(){$('.lword',context).removeClass('lword')});$(context).one('mouseup','.nword,.tword',function(ev){if(ev.handled!==!0){const len=$('.lword.tword',context).length;if(len>0){g=$('.lword',context).first().attr('data_order');if(len>1){const text=$('.lword',context).map(function(){return $(this).text()}).get().join('');if(text.length>250){alert('selected text is too long!!!')}else{showRightFrames('edit_mword.php?tid='+TID+'&len='+len+'&ord='+g+'&txt='+text)}}else{showRightFrames('edit_word.php?tid='+TID+'&ord='+g+'&txt='+$('#ID-'+g+'-1').text())}}
$('span',context).removeClass('tword nword');ev.handled=!0}})});$(context).hoverIntent({over:function(){$('.lword',context).removeClass('lword');const lpos=parseInt($(this).attr('data_order'));$(this).addClass('lword');if(lpos>pos){for(var i=pos;i<lpos;i++){$('.tword[data_order="'+i+'"],.nword[data_order="'+i+'"]',context).addClass('lword')}}else{for(var i=pos;i>lpos;i--){$('.tword[data_order="'+i+'"],.nword[data_order="'+i+'"]',context).addClass('lword')}}},out:function(){},sensitivity:18,selector:'.tword'})},300)}
function word_hover_over(){if(!$('.tword')[0]){const v=$(this).attr('class').replace(/.*(TERM[^ ]*)( .*)*/,'$1');$('.'+v).addClass('hword');if(JQ_TOOLTIP){$(this).trigger('mouseover')}}}
function word_hover_out(){$('.hword').removeClass('hword');if(JQ_TOOLTIP)$('.ui-helper-hidden-accessible>div[style]').remove();}
jQuery.fn.extend({tooltip_wsty_content:function(){var re=new RegExp('(['+DELIMITER+'])(?! )','g');let title='';if($(this).hasClass('mwsty')){title="<p><b style='font-size:120%'>"+$(this).attr('data_text')+'</b></p>'}else{title="<p><b style='font-size:120%'>"+$(this).text()+'</b></p>'}
const roman=$(this).attr('data_rom');let trans=$(this).attr('data_trans').replace(re,'$1 ');let statname='';const status=parseInt($(this).attr('data_status'));if(status==0)statname='Unknown [?]';else if(status<5)statname='Learning ['+status+']';if(status==5)statname='Learned [5]';if(status==98)statname='Ignored [Ign]';if(status==99)statname='Well Known [WKn]';if(roman!=''){title+='<p><b>Roman.</b>: '+roman+'</p>'}
if(trans!=''&&trans!='*'){if($(this).attr('data_ann')){const ann=$(this).attr('data_ann');if(ann!=''&&ann!='*'){var re=new RegExp('(.*['+DELIMITER+'][ ]{0,1}|^)('+ann.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&')+')($|[ ]{0,1}['+DELIMITER+'].*$| \\[.*$)','');trans=trans.replace(re,'$1<span style="color:red">$2</span>$3')}}
title+='<p><b>Transl.</b>: '+trans+'</p>'}
title+='<p><b>Status</b>: <span class="status'+status+'">'+statname+'</span></p>';return title}});jQuery.fn.extend({tooltip_wsty_init:function(){$(this).tooltip({position:{my:'left top+10',at:'left bottom',collision:'flipfit'},items:'.hword',show:{easing:'easeOutCirc'},content:function(){return $(this).tooltip_wsty_content()}})}});function get_position_from_id(id_string){if((typeof id_string)==='undefined')return-1;const arr=id_string.split('-');return parseInt(arr[1])*10+10-parseInt(arr[2])}
function keydown_event_do_text_text(e){if(e.which==27){TEXTPOS=-1;$('span.uwordmarked').removeClass('uwordmarked');$('span.kwordmarked').removeClass('kwordmarked');cClick();return!1}
if(e.which==13){$('span.uwordmarked').removeClass('uwordmarked');const unknownwordlist=$('span.status0.word:not(.hide):first');if(unknownwordlist.size()==0)return!1;$(window).scrollTo(unknownwordlist,{axis:'y',offset:-150});unknownwordlist.addClass('uwordmarked').trigger('click');cClick();return!1}
const knownwordlist=$('span.word:not(.hide):not(.status0)'+ADDFILTER+',span.mword:not(.hide)'+ADDFILTER);const l_knownwordlist=knownwordlist.size();if(l_knownwordlist==0)return!0;if(e.which==36){$('span.kwordmarked').removeClass('kwordmarked');TEXTPOS=0;curr=knownwordlist.eq(TEXTPOS);curr.addClass('kwordmarked');$(window).scrollTo(curr,{axis:'y',offset:-150});var ann='';if((typeof curr.attr('data_ann'))!=='undefined'){ann=curr.attr('data_ann')}
showRightFrames('show_word.php?wid='+curr.attr('data_wid')+'&ann='+encodeURIComponent(ann));return!1}
if(e.which==35){$('span.kwordmarked').removeClass('kwordmarked');TEXTPOS=l_knownwordlist-1;curr=knownwordlist.eq(TEXTPOS);curr.addClass('kwordmarked');$(window).scrollTo(curr,{axis:'y',offset:-150});var ann='';if((typeof curr.attr('data_ann'))!=='undefined'){ann=curr.attr('data_ann')}
showRightFrames('show_word.php?wid='+curr.attr('data_wid')+'&ann='+encodeURIComponent(ann));return!1}
if(e.which==37){var marked=$('span.kwordmarked');var currid=(marked.length==0)?(100000000):get_position_from_id(marked.attr('id'));$('span.kwordmarked').removeClass('kwordmarked');TEXTPOS=l_knownwordlist-1;for(var i=l_knownwordlist-1;i>=0;i--){var iid=get_position_from_id(knownwordlist.eq(i).attr('id'));if(iid<currid){TEXTPOS=i;break}}
curr=knownwordlist.eq(TEXTPOS);curr.addClass('kwordmarked');$(window).scrollTo(curr,{axis:'y',offset:-150});var ann='';if((typeof curr.attr('data_ann'))!=='undefined'){ann=curr.attr('data_ann')}
showRightFrames('show_word.php?wid='+curr.attr('data_wid')+'&ann='+encodeURIComponent(ann));return!1}
if(e.which==39||e.which==32){var marked=$('span.kwordmarked');var currid=(marked.length==0)?(-1):get_position_from_id(marked.attr('id'));$('span.kwordmarked').removeClass('kwordmarked');TEXTPOS=0;for(var i=0;i<l_knownwordlist;i++){var iid=get_position_from_id(knownwordlist.eq(i).attr('id'));if(iid>currid){TEXTPOS=i;break}}
curr=knownwordlist.eq(TEXTPOS);curr.addClass('kwordmarked');$(window).scrollTo(curr,{axis:'y',offset:-150});var ann='';if((typeof curr.attr('data_ann'))!=='undefined'){ann=curr.attr('data_ann')}
showRightFrames('show_word.php?wid='+curr.attr('data_wid')+'&ann='+encodeURIComponent(ann));return!1}
if((!$('.kwordmarked, .uwordmarked')[0])&&$('.hword:hover')[0]){curr=$('.hword:hover')}else{if(TEXTPOS<0||TEXTPOS>=l_knownwordlist)return!0;curr=knownwordlist.eq(TEXTPOS)}
const wid=curr.attr('data_wid');const ord=curr.attr('data_order');const stat=curr.attr('data_status');const txt=(curr.hasClass('mwsty'))?curr.attr('data_text'):curr.text();let dict='';for(var i=1;i<=5;i++){if(e.which==(48+i)||e.which==(96+i)){if(stat=='0'){if(i==1){const sl=getLangFromDict(WBLINK3);const tl=WBLINK3.replace(/.*[?&]tl=([a-zA-Z\-]*)(&.*)*$/,'$1');if(sl!=WBLINK3&&tl!=WBLINK3)
i=i+'&sl='+sl+'&tl='+tl}
showRightFrames('set_word_on_hover.php?text='+txt+'&tid='+TID+'&status='+i)}else{showRightFrames('set_word_status.php?wid='+wid+'&tid='+TID+'&ord='+ord+'&status='+i);return!1}}}
if(e.which==73){if(stat=='0'){showRightFrames('set_word_on_hover.php?text='+txt+'&tid='+TID+'&status=98')}else{showRightFrames('set_word_status.php?wid='+wid+'&tid='+TID+'&ord='+ord+'&status=98');return!1}}
if(e.which==87){if(stat=='0'){showRightFrames('set_word_on_hover.php?text='+txt+'&tid='+TID+'&status=99')}else{showRightFrames('set_word_status.php?wid='+wid+'&tid='+TID+'&ord='+ord+'&status=99')}
return!1}
if(e.which==80){const lg=getLangFromDict(WBLINK3);readTextAloud(txt,lg);return!1}
if(e.which==84){let popup=!1;let dict_link=WBLINK3;if(WBLINK3.startsWith('*')){popup=!0;dict_link=substring(dict_link,1)}
if(dict_link.startsWith('ggl.php')){dict_link="http://"+dict_link}
let open_url=!0;let final_url;try{final_url=new URL(dict_link);popup|=final_url.searchParams.has("lwt_popup")}catch(err){if(err instanceof TypeError){open_url=!1}}
if(popup){owin('trans.php?x=1&i='+ord+'&t='+TID)}else if(open_url){showRightFrames(undefined,'trans.php?x=1&i='+ord+'&t='+TID)}
return!1}
if(e.which==65){let p=curr.attr('data_pos');const t=parseInt($('#totalcharcount').text(),10);if(t==0)return!0;p=100*(p-5)/t;if(p<0)p=0;if(typeof(window.parent.frames.h.new_pos)==='function'){window.parent.frames.h.new_pos(p)}else{return!0}
return!1}
if(e.which==71){dict='&nodict';setTimeout(function(){let target_url=WBLINK3;let popup=!1;popup=target_url.startsWith('*');try{const final_url=new URL(target_url);popup|=final_url.searchParams.has('lwt_popup')}catch(err){if(!(err instanceof TypeError)){throw err}}
if(popup){owin(createTheDictUrl(target_url,txt))}else{showRightFrames(undefined,createTheDictUrl(target_url,txt))}},10)}
if(e.which==69||e.which==71){let url='';if(curr.hasClass('mword')){url='edit_mword.php?wid='+wid+'&len='+curr.attr('data_code')+'&tid='+TID+'&ord='+ord+dict}else if(stat=='0'){url='edit_word.php?wid=&tid='+TID+'&ord='+ord+dict}else{url='edit_word.php?wid='+wid+'&tid='+TID+'&ord='+ord+dict}
showRightFrames(url);return!1}
return!0}
function do_ajax_save_setting(k,v){$.post('inc/ajax.php/v1/settings',{action:'',action_type:'save_setting',k:k,v:v})}
function quick_select_to_input(select_elem,input_elem){let val=select_elem.options[select_elem.selectedIndex].value;if(val!='')
input_elem.value=val;select_elem.value=''}
function select_media_path(paths,folders,base_path){let options=[],temp_option=document.createElement('option');temp_option.value="";temp_option.text="[Choose...]";options.push(temp_option);for(let i=0;i<paths.length;i++){temp_option=document.createElement('option')
if(folders.includes(paths[i])){temp_option.setAttribute("disabled","disabled");temp_option.text='-- Directory: '+paths[i]+'--'}else{temp_option.value=base_path+"/"+paths[i];temp_option.text=paths[i]}
options.push(temp_option)}
return options}
function media_select_receive_data(data){$('#mediaSelectLoadingImg').css("display","none");if(data.error!==undefined){let msg;if(data.error=="not_a_directory"){msg='[Error: "../'+data.base_path+'/media" exists, but it is not a directory.]'}else if(data.error=="does_not_exist"){msg='[Directory "../'+data.base_path+'/media" does not yet exist.]'}else{msg="[Unknown error!]"}
$('#mediaSelectErrorMessage').text(msg);$('#mediaSelectErrorMessage').css("display","inherit")}else{const options=select_media_path(data.paths,data.folders,data.base_path);$('#mediaselect select').empty();for(let i=0;i<options.length;i++){$('#mediaselect select').append(options[i])}
$('#mediaselect select').css("display","inherit")}}
function do_ajax_update_media_select(){$('#mediaSelectErrorMessage').css("display","none");$('#mediaselect select').css("display","none");$('#mediaSelectLoadingImg').css("display","inherit");$.getJSON('inc/ajax.php/v1/media-path',{action:"query",action_type:"media_paths"},media_select_receive_data)}
function display_example_sentences(sentences,click_target){let img,clickable,parentDiv;const outElement=document.createElement("div");for(let i=0;i<sentences.length;i++){img=document.createElement("img");img.src="icn/tick-button.png";img.title="Choose";clickable=document.createElement('span');clickable.classList.add("click");clickable.setAttribute("onclick","{"+click_target+".value = '"+sentences[i][1].replaceAll("'","\\'")+"';makeDirty();}");clickable.appendChild(img);parentDiv=document.createElement("div");parentDiv.appendChild(clickable);parentDiv.innerHTML+="&nbsp; "+sentences[i][0];outElement.appendChild(parentDiv)}
return outElement}
function do_ajax_show_sentences(lang,word,ctl,woid){$('#exsent-interactable').css("display","none");$('#exsent-waiting').css("display","inherit");$.getJSON('inc/ajax.php/v1/sentences-with-term',{action:"query",action_type:"example_sentences",lid:lang,word_lc:word,wid:woid,term:word},function(data){$('#exsent-waiting').css("display","none");$('#exsent-sentences').css("display","inherit");const new_element=display_example_sentences(data,ctl);$('#exsent-sentences').append(new_element)})}
function do_ajax_req_sim_terms(lg_id,word_text){return $.getJSON('inc/ajax.php/v1/similar-terms',{"action":"query","action_type":"similar_terms","simterms_lgid":lg_id,"simterms_word":word_text})}
function do_ajax_show_similar_terms(){$('#simwords').html('<img src="icn/waiting2.gif" />');do_ajax_req_sim_terms(parseInt($('#langfield').val(),10),$('#wordfield').val()).done(function(data){$('#simwords').html(data.similar_terms)}).fail(function(data){console.log(data)})}
function do_ajax_word_counts(){const t=$('.markcheck').map(function(){return $(this).val()}).get().join(',');$.getJSON('inc/ajax.php/v1/texts-statistics',{action:"query",action_type:"texts_statistics",texts_id:t},function(data){WORDCOUNTS=data;word_count_click();$('.barchart').removeClass('hide')})}
function set_barchart_item(){const id=$(this).find('span').first().attr('id').split('_')[2];let v;if(SUW&16){v=parseInt(WORDCOUNTS.expru[id]||0,10)+parseInt(WORDCOUNTS.totalu[id],10)}else{v=parseInt(WORDCOUNTS.expr[id]||0,10)+parseInt(WORDCOUNTS.total[id],10)}
$(this).children('li').each(function(){let cat_word_count=parseInt($(this).children('span').text(),10);cat_word_count+=1;v+=1;const h=25-Math.log(cat_word_count)/Math.log(v)*25;$(this).css('border-top-width',h+'px')})}
function set_word_counts(){$.each(WORDCOUNTS.totalu,function(key,value){let knownu,known,todo,stat0;knownu=known=todo=stat0=0;const expr=WORDCOUNTS.expru[key]?parseInt((SUW&2)?WORDCOUNTS.expru[key]:WORDCOUNTS.expr[key]):0;if(!WORDCOUNTS.stat[key]){WORDCOUNTS.statu[key]=WORDCOUNTS.stat[key]=[]}
$('#total_'+key).html((SUW&1?value:WORDCOUNTS.total[key]));$.each(WORDCOUNTS.statu[key],function(k,v){if(SUW&8)
$('#stat_'+k+'_'+key).html(v);knownu+=parseInt(v)});$.each(WORDCOUNTS.stat[key],function(k,v){if(!(SUW&8))
$('#stat_'+k+'_'+key).html(v);known+=parseInt(v)});$('#saved_'+key).html(known?((SUW&2?knownu:known)-expr+'+'+expr):0);if(SUW&4){todo=parseInt(value)+parseInt(WORDCOUNTS.expru[key]||0)-parseInt(knownu)}else{todo=parseInt(WORDCOUNTS.total[key])+parseInt(WORDCOUNTS.expr[key]||0)-parseInt(known)}
$('#todo_'+key).html(todo);if(SUW&8){unknowncount=parseInt(value)+parseInt(WORDCOUNTS.expru[key]||0)-parseInt(knownu);unknownpercent=Math.round(unknowncount*10000/(knownu+unknowncount))/100}else{unknowncount=parseInt(WORDCOUNTS.total[key])+parseInt(WORDCOUNTS.expr[key]||0)-parseInt(known);unknownpercent=Math.round(unknowncount*10000/(known+unknowncount))/100}
$('#unknownpercent_'+key).html(unknownpercent==0?0:unknownpercent.toFixed(2));if(SUW&16){stat0=parseInt(value)+parseInt(WORDCOUNTS.expru[key]||0)-parseInt(knownu)}else{stat0=parseInt(WORDCOUNTS.total[key])+parseInt(WORDCOUNTS.expr[key]||0)-parseInt(known)}
$('#stat_0_'+key).html(stat0)});$('.barchart').each(set_barchart_item)}
function word_count_click(){$('.wc_cont').children().each(function(){if(parseInt($(this).attr('data_wo_cnt'))==1){$(this).html('u')}else{$(this).html('t')}
SUW=(parseInt($('#chart').attr('data_wo_cnt'))<<4)+(parseInt($('#unknownpercent').attr('data_wo_cnt'))<<3)+(parseInt($('#unknown').attr('data_wo_cnt'))<<2)+(parseInt($('#saved').attr('data_wo_cnt'))<<1)+(parseInt($('#total').attr('data_wo_cnt')));set_word_counts()})}
function translation_radio(curr_trans,trans_data){if(trans_data.wid===null){return""}
const trim_trans=curr_trans.trim();if(trim_trans=='*'||trim_trans==''){return""}
const set=trim_trans==trans_data.trans;const option=`<span class="nowrap">
    <input class="impr-ann-radio" `+(set?'checked="checked" ':'')+'type="radio" name="rg'+trans_data.ann_index+`" value="`+escape_html_chars(trim_trans)+`" /> 
          &nbsp; `+escape_html_chars(trim_trans)+`
  </span>
  <br />`;return option}
function edit_term_ann_translations(trans_data,text_id){const widset=trans_data.wid!==null;let edit_word_link;if(widset){const req_arg=$.param({fromAnn:"$(document).scrollTop()",wid:trans_data.wid,ord:trans_data.term_ord,tid:text_id})
edit_word_link=`<a name="rec${trans_data.ann_index}"></a>
    <span class="click"
    onclick="oewin('edit_word.php?`+escape_html_chars(req_arg)+`');">
          <img src="icn/sticky-note--pencil.png" title="Edit Term" alt="Edit Term" />
      </span>`}else{edit_word_link='&nbsp;'}
$(`#editlink${trans_data.ann_index}`).html(edit_word_link);let translations_list="";trans_data.translations.forEach(function(candidate_trans){translations_list+=translation_radio(candidate_trans,trans_data)});const select_last=trans_data.translations.length==0;translations_list+=`<span class="nowrap">
  <input class="impr-ann-radio" type="radio" name="rg${trans_data.ann_index}" `+(select_last?'checked="checked" ':'')+`value="" />
  &nbsp;
  <input class="impr-ann-text" type="text" name="tx${trans_data.ann_index}`+`" id="tx${trans_data.ann_index}" value="`+(select_last?escape_html_chars(curr_trans):'')+`" maxlength="50" size="40" />
   &nbsp;
  <img class="click" src="icn/eraser.png" title="Erase Text Field" 
  alt="Erase Text Field" 
  onclick="$('#tx${trans_data.ann_index}').val('').trigger('change');" />
    &nbsp;
  <img class="click" src="icn/star.png" title="* (Set to Term)" 
  alt="* (Set to Term)" 
  onclick="$('#tx${trans_data.ann_index}').val('*').trigger('change');" />
  &nbsp;`;if(widset){translations_list+=`<img class="click" src="icn/plus-button.png" 
    title="Save another translation to existent term" 
    alt="Save another translation to existent term" 
    onclick="addTermTranslation(${trans_data.wid}, `+`'#tx${trans_data.ann_index}', '',${trans_data.lang_id});" />`}else{translations_list+=`<img class="click" src="icn/plus-button.png" 
    title="Save translation to new term" 
    alt="Save translation to new term" 
    onclick="addTermTranslation(0, '#tx${trans_data.ann_index}',`+`${trans_data.term_lc},${trans_data.lang_id});" />`}
translations_list+=`&nbsp;&nbsp;
  <span id="wait${trans_data.ann_index}">
      <img src="icn/empty.gif" />
  </span>
  </span>`;$(`#transsel${trans_data.ann_index}`).html(translations_list)}
function do_ajax_edit_impr_text(pagepos,word){if(word==''){$('#editimprtextdata').html('<img src="icn/waiting2.gif" />');location.reload();return}
const textid=$('#editimprtextdata').attr('data_id');$.getJSON('inc/ajax.php/v1/translations',{action:"query",action_type:"term_translations",text_id:textid,term_lc:word},function(data){if("error" in data){alert(data.error)}else{edit_term_ann_translations(data,textid);$.scrollTo(pagepos);$('input.impr-ann-text').on('change',changeImprAnnText);$('input.impr-ann-radio').on('change',changeImprAnnRadio)}})}
function showRightFrames(roUrl,ruUrl){if(roUrl!==undefined){top.frames.ro.location.href=roUrl}
if(ruUrl!==undefined){top.frames.ru.location.href=ruUrl}
if($('#frames-r').length){$('#frames-r').animate({right:'5px'});return!0}
return!1}
function hideRightFrames(){if($('#frames-r').length){$('#frames-r').animate({right:'-100%'});return!0}
return!1}
function cleanupRightFrames(){const mytimeout=function(){const rf=window.parent.document.getElementById('frames-r');rf.click()}
window.parent.setTimeout(mytimeout,800);window.parent.document.getElementById('frame-l').focus();window.parent.setTimeout(window.parent.cClick,100)}
function successSound(){document.getElementById('success_sound').pause();document.getElementById('failure_sound').pause();return document.getElementById('success_sound').play()}
function failureSound(){document.getElementById('success_sound').pause();document.getElementById('failure_sound').pause();return document.getElementById('failure_sound').play()}
const lwt={prepare_word_count_click:function(){$('#total,#saved,#unknown,#chart,#unknownpercent').on('click',function(event){$(this).attr('data_wo_cnt',parseInt($(this).attr('data_wo_cnt'))^1);word_count_click();event.stopImmediatePropagation()}).attr('title',"u: Unique Word Counts\nt: Total  Word  Counts");do_ajax_word_counts()},save_text_word_count_settings:function(){if(SUW==SHOWUNIQUE){return}
const a=$('#total').attr('data_wo_cnt')+$('#saved').attr('data_wo_cnt')+$('#unknown').attr('data_wo_cnt')+$('#unknownpercent').attr('data_wo_cnt')+$('#chart').attr('data_wo_cnt');do_ajax_save_setting('set-show-text-word-counts',a)}}
$.fn.serializeObject=function(){const o={};const a=this.serializeArray();$.each(a,function(){if(o[this.name]!==undefined){if(!o[this.name].push){o[this.name]=[o[this.name]]}
o[this.name].push(this.value||'')}else{o[this.name]=this.value||''}});return o};function wrapRadioButtons(){$(':input,.wrap_checkbox span,.wrap_radio span,a:not([name^=rec]),select,'+'#mediaselect span.click,#forwbutt,#backbutt').each(function(i){$(this).attr('tabindex',i+1)});$('.wrap_radio span').on('keydown',function(e){if(e.keyCode==32){$(this).parent().parent().find('input[type=radio]').trigger('click');return!1}})}
function prepareMainAreas(){$('.edit_area').editable('inline_edit.php',{type:'textarea',indicator:'<img src="icn/indicator.gif">',tooltip:'Click to edit...',submit:'Save',cancel:'Cancel',rows:3,cols:35});$('select').wrap("<label class='wrap_select'></label>");$('form').attr('autocomplete','off');$('input[type="file"]').each(function(){if(!$(this).is(':visible')){$(this).before('<button class="button-file">Choose File</button>').after('<span style="position:relative" class="fakefile"></span>').on('change',function(){let txt=this.value.replace('C:\\fakepath\\','');if(txt.length>85)txt=txt.replace(/.*(.{80})$/,' ... $1');$(this).next().text(txt)}).on('onmouseout',function(){let txt=this.value.replace('C:\\fakepath\\','');if(txt.length>85)txt=txt.replace(/.*(.{80})$/,' ... $1');$(this).next().text(txt)})}});$('input[type="checkbox"]').each(function(z){if(typeof z==='undefined')z=1;if(typeof $(this).attr('id')==='undefined'){$(this).attr('id','cb_'+z++)}
$(this).after('<label class="wrap_checkbox" for="'+$(this).attr('id')+'"><span></span></label>')});$('span[class*="tts_"]').on('click',function(){const lg=$(this).attr('class').replace(/.*tts_([a-zA-Z-]+).*/,'$1');const txt=$(this).text();readRawTextAloud(txt,lg)});$(document).on('mouseup',function(){$('button,input[type=button],.wrap_radio span,.wrap_checkbox span').trigger('blur')});$('.wrap_checkbox span').on('keydown',function(e){if(e.keyCode==32){$(this).parent().parent().find('input[type=checkbox]').trigger('click');return!1}});$('input[type="radio"]').each(function(z){if(z===undefined){z=1}
if(typeof $(this).attr('id')==='undefined'){$(this).attr('id','rb_'+z++)}
$(this).after('<label class="wrap_radio" for="'+$(this).attr('id')+'"><span></span></label>')});$('.button-file').on('click',function(){$(this).next('input[type="file"]').trigger('click');return!1});$('input.impr-ann-text').on('change',changeImprAnnText);$('input.impr-ann-radio').on('change',changeImprAnnRadio);$('form.validate').on('submit',check);$('input.markcheck').on('click',markClick);$('.confirmdelete').on('click',confirmDelete);$('textarea.textarea-noreturn').on('keydown',textareaKeydown);$('#frames-r').resizable({handles:"w",stop:function(_event,ui){$('#frames-l').css('width',ui.position.left-20);do_ajax_save_setting('set-text-l-framewidth-percent',Math.round($('#frames-l').width()/$(window).width()*100))}});$('#termtags').tagit({beforeTagAdded:function(_event,ui){return!containsCharacterOutsideBasicMultilingualPlane(ui.tag.text())},availableTags:TAGS,fieldName:'TermTags[TagList][]'});$('#texttags').tagit({beforeTagAdded:function(_event,ui){return!containsCharacterOutsideBasicMultilingualPlane(ui.tag.text())},availableTags:TEXTTAGS,fieldName:'TextTags[TagList][]'});markClick();setTheFocus();if($('#simwords').length>0&&$('#langfield').length>0&&$('#wordfield').length>0){$('#wordfield').on('blur',do_ajax_show_similar_terms);do_ajax_show_similar_terms()}
window.setTimeout(noShowAfter3Secs,3000)}
$(window).on('load',wrapRadioButtons);$(document).ready(prepareMainAreas);/**
 * \file
 * \brief LWT Javascript functions
 * 
 * @package Lwt
 * @author  andreask7 <andreasks7@users.noreply.github.com>
 * @license Unlicense <http://unlicense.org/>
 * @since   1.6.16-fork
 * 
 * "Learning with Texts" (LWT) is free and unencumbered software
 * released into the PUBLIC DOMAIN.
 * 
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a
 * compiled binary, for any purpose, commercial or non-commercial,
 * and by any means.
 * 
 * In jurisdictions that recognize copyright laws, the author or
 * authors of this software dedicate any and all copyright
 * interest in the software to the public domain. We make this
 * dedication for the benefit of the public at large and to the
 * detriment of our heirs and successors. We intend this
 * dedication to be an overt act of relinquishment in perpetuity
 * of all present and future rights to this software under
 * copyright law.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * For more information, please refer to [http://unlicense.org/].
 */
var ol_textfont='"Lucida Grande",Arial,sans-serif,STHeiti,"Arial Unicode MS",MingLiu';var ol_textsize=3;var ol_sticky=1;var ol_captionfont='"Lucida Grande",Arial,sans-serif,STHeiti,"Arial Unicode MS",MingLiu';var ol_captionsize=3;var ol_width=260;var ol_close='Close';var ol_offsety=30;var ol_offsetx=3;var ol_fgcolor='#FFFFE8';var ol_closecolor='#FFFFFF';function run_overlib_status_98(wblink1,wblink2,wblink3,hints,txid,torder,txt,wid,multi_words,rtl,ann){const lang=getLangFromDict(WBLINK3);return overlib(make_overlib_audio(txt,lang)+'<b>'+escape_html_chars_2(hints,ann)+'</b><br/>'+make_overlib_link_new_word(txid,torder,wid)+' | '+make_overlib_link_delete_word(txid,wid)+make_overlib_link_new_multiword(txid,torder,multi_words,rtl)+' <br /> '+make_overlib_link_wb(wblink1,wblink2,wblink3,txt,txid,torder),CAPTION,'Word')}
function run_overlib_status_99(wblink1,wblink2,wblink3,hints,txid,torder,txt,wid,multi_words,rtl,ann){const lang=getLangFromDict(WBLINK3);return overlib(make_overlib_audio(txt,lang)+'<b>'+escape_html_chars_2(hints,ann)+'</b><br/> '+make_overlib_link_new_word(txid,torder,wid)+' | '+make_overlib_link_delete_word(txid,wid)+make_overlib_link_new_multiword(txid,torder,multi_words,rtl)+' <br /> '+make_overlib_link_wb(wblink1,wblink2,wblink3,txt,txid,torder),CAPTION,'Word')}
function run_overlib_status_1_to_5(wblink1,wblink2,wblink3,hints,txid,torder,txt,wid,stat,multi_words,rtl,ann){const lang=getLangFromDict(WBLINK3);return overlib('<div>'+make_overlib_audio(txt,lang)+'<span>(Read)</span></div>'+make_overlib_link_change_status_all(txid,torder,wid,stat)+' <br /> '+make_overlib_link_edit_word(txid,torder,wid)+' | '+make_overlib_link_delete_word(txid,wid)+make_overlib_link_new_multiword(txid,torder,multi_words,rtl)+' <br /> '+make_overlib_link_wb(wblink1,wblink2,wblink3,txt,txid,torder),CAPTION,make_overlib_link_edit_word_title('Word &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;',txid,torder,wid))}
function run_overlib_status_unknown(wblink1,wblink2,wblink3,hints,txid,torder,txt,multi_words,rtl){const lang=getLangFromDict(WBLINK3);return overlib(make_overlib_audio(txt,lang)+'<b>'+escape_html_chars(hints)+'</b><br /> '+make_overlib_link_wellknown_word(txid,torder)+' <br /> '+make_overlib_link_ignore_word(txid,torder)+make_overlib_link_new_multiword(txid,torder,multi_words,rtl)+' <br /> '+make_overlib_link_wb(wblink1,wblink2,wblink3,txt,txid,torder),CAPTION,'New Word')}
function run_overlib_multiword(wblink1,wblink2,wblink3,hints,txid,torder,txt,wid,stat,wcnt,ann){const lang=getLangFromDict(WBLINK3);return overlib(make_overlib_audio(txt,lang)+'<b>'+escape_html_chars_2(hints,ann)+'</b><br /> '+make_overlib_link_change_status_all(txid,torder,wid,stat)+' <br /> '+make_overlib_link_edit_multiword(txid,torder,wid)+' | '+make_overlib_link_delete_multiword(txid,wid)+' <br /> '+make_overlib_link_wb(wblink1,wblink2,wblink3,txt,txid,torder),CAPTION,make_overlib_link_edit_multiword_title(wcnt.trim()+'-Word-Expression',txid,torder,wid))}
function run_overlib_test(wblink1,wblink2,wblink3,wid,txt,trans,roman,stat,sent,todo,oldstat){const s=parseInt(stat,10);let c=s+1;if(c>5)c=5;let w=s-1;if(w<1)w=1;let cc=stat+' ▶ '+c;if(c==s)cc=c;let ww=stat+' ▶ '+w;if(w==s)ww=w;let overlib_string='';if(todo==1){overlib_string+='<center><hr noshade size=1 /><b>';if(stat>=1&&stat<=5){overlib_string+=make_overlib_link_change_status_test(wid,1,'<img src="icn/thumb-up.png" title="Got it!" alt="Got it!" /> Got it! ['+cc+']')+'<hr noshade size=1 />'+make_overlib_link_change_status_test(wid,-1,'<img src="icn/thumb.png" title="Oops!" alt="Oops!" /> Oops! ['+ww+']')+'<hr noshade size=1 />'}
overlib_string+=make_overlib_link_change_status_alltest(wid,stat)+'</b></center><hr noshade size=1 />'}
overlib_string+='<b>'+escape_html_chars(make_tooltip(txt,trans,roman,stat))+'</b><br />'+' <a href="edit_tword.php?wid='+wid+'" target="ro" onclick="showRightFrames();">Edit term</a><br />'+createTheDictLink(wblink1,txt,'Dict1','Lookup Term: ')+createTheDictLink(wblink2,txt,'Dict2','')+createTheDictLink(wblink3,txt,'Trans','')+createTheDictLink(wblink3,sent,'Trans','<br />Lookup Sentence:');return overlib(overlib_string,CAPTION,'Got it?')}
function make_overlib_link_new_multiword(txid,torder,multi_words,rtl){if(multi_words.every((x)=>!x))return'';const output=Array();if(rtl){for(let i=7;i<0;i--){if(multi_words[i]){output.push(make_overlib_link_create_edit_multiword_rtl(i+2,txid,torder,multi_words[i]))}}}else{for(let i=0;i<7;i++){if(multi_words[i]){output.push(make_overlib_link_create_edit_multiword(i+2,txid,torder,multi_words[i]))}}}
return' <br />Expr: '+output.join(' ')+' '}
function make_overlib_link_wb(wblink1,wblink2,wblink3,txt,txid,torder){let s=createTheDictLink(wblink1,txt,'Dict1','Lookup Term: ')+createTheDictLink(wblink2,txt,'Dict2','')+createTheDictLink(wblink3,txt,'Trans','');if(torder>0&&txid>0){s+='<br />Lookup Sentence: '+createSentLookupLink(torder,txid,wblink3,'Trans')}
return s}
function make_overlib_link_wbnl(wblink1,wblink2,wblink3,txt,txid,torder){let s=createTheDictLink(wblink1,txt,'Dict1','Term: ')+createTheDictLink(wblink2,txt,'Dict2','')+createTheDictLink(wblink3,txt,'Trans','');if(torder>0&&txid>0){s+=' | Sentence: '+createSentLookupLink(torder,txid,wblink3,'Trans')}
return s}
function make_overlib_link_wbnl2(wblink1,wblink2,wblink3,txt,sent){let s=createTheDictLink(wblink1,txt,'Dict1','Term: ')+createTheDictLink(wblink2,txt,'Dict2','')+createTheDictLink(wblink3,txt,'Trans','');if(sent!=''){s+=createTheDictLink(wblink3,sent,'Trans',' | Sentence:')}
return s}
function make_overlib_link_change_status_all(txid,torder,wid,oldstat){let result='St: ';for(let newstat=1;newstat<=5;newstat++){result+=make_overlib_link_change_status(txid,torder,wid,oldstat,newstat)}
result+=make_overlib_link_change_status(txid,torder,wid,oldstat,99);result+=make_overlib_link_change_status(txid,torder,wid,oldstat,98);return result}
function make_overlib_link_change_status_alltest(wid,oldstat){let result='';for(let newstat=1;newstat<=5;newstat++){result+=make_overlib_link_change_status_test2(wid,oldstat,newstat)}
result+=make_overlib_link_change_status_test2(wid,oldstat,99);result+=make_overlib_link_change_status_test2(wid,oldstat,98);return result}
function make_overlib_link_change_status(txid,torder,wid,oldstat,newstat){if(oldstat==newstat){return'<span title="'+getStatusName(oldstat)+'">◆</span>'}
return' <a href="set_word_status.php?tid='+txid+'&amp;ord='+torder+'&amp;wid='+wid+'&amp;status='+newstat+'" target="ro" onclick="showRightFrames();">'+'<span title="'+getStatusName(newstat)+'">['+getStatusAbbr(newstat)+']</span></a> '}
function make_overlib_link_change_status_test2(wid,oldstat,newstat){let output=' <a href="set_test_status.php?wid='+wid+'&amp;status='+newstat+'&amp;ajax=1" target="ro" onclick="showRightFrames();">'+'<span title="'+getStatusName(newstat)+'">[';output+=(oldstat==newstat)?'◆':getStatusAbbr(newstat);output+=']</span></a> ';return output}
function make_overlib_link_change_status_test(wid,plusminus,text){return' <a href="set_test_status.php?wid='+wid+'&amp;stchange='+plusminus+'&amp;ajax=1" target="ro" onclick="showRightFrames();'+(plusminus>0?'successSound()':'failureSound()')+';">'+text+'</a> '}
function make_overlib_link_new_word(txid,torder,wid){return' <a href="edit_word.php?tid='+txid+'&amp;ord='+torder+'&amp;wid='+wid+'" target="ro" onclick="showRightFrames();">Learn term</a> '}
function make_overlib_link_edit_multiword(txid,torder,wid){return' <a href="edit_mword.php?tid='+txid+'&amp;ord='+torder+'&amp;wid='+wid+'" target="ro" onclick="showRightFrames();">Edit term</a> '}
function make_overlib_link_edit_multiword_title(text,txid,torder,wid){return'<a style="color:yellow" href="edit_mword.php?tid='+txid+'&amp;ord='+torder+'&amp;wid='+wid+'" target="ro" onclick="showRightFrames();">'+text+'</a>'}
function make_overlib_link_create_edit_multiword(len,txid,torder,txt){return' <a href="edit_mword.php?tid='+txid+'&amp;ord='+torder+'&amp;txt='+txt+'" target="ro" onclick="showRightFrames();">'+len+'..'+escape_html_chars(txt.substring(2).trim())+'</a> '}
function make_overlib_link_create_edit_multiword_rtl(len,txid,torder,txt){return' <a dir="rtl" href="edit_mword.php?tid='+txid+'&amp;ord='+torder+'&amp;txt='+txt+'" target="ro" onclick="showRightFrames();">'+len+'..'+escape_html_chars(txt.substring(2).trim())+'</a> '}
function make_overlib_link_edit_word(txid,torder,wid){const url='edit_word.php?tid='+txid+'&amp;ord='+torder+'&amp;wid='+wid;return' <a href="'+url+' " target="ro" onclick="showRightFrames()">Edit term</a> '}
function make_overlib_link_edit_word_title(text,txid,torder,wid){return'<a style="color:yellow" href="edit_word.php?tid='+txid+'&amp;ord='+torder+'&amp;wid='+wid+'" target="ro" onclick="showRightFrames();">'+text+'</a>'}
function make_overlib_link_delete_word(txid,wid){return' <a onclick="showRightFrames(); return confirmDelete();" '+'href="delete_word.php?wid='+wid+'&amp;tid='+txid+'" target="ro">Delete term</a> '}
function make_overlib_link_delete_multiword(txid,wid){return' <a onclick="showRightFrames(); return confirmDelete();" '+'href="delete_mword.php?wid='+wid+'&amp;tid='+txid+'" target="ro">Delete term</a> '}
function make_overlib_link_wellknown_word(txid,torder){return' <a href="insert_word_wellknown.php?tid='+txid+'&amp;ord='+torder+'" target="ro" onclick="showRightFrames();">I know this term well</a> '}
function make_overlib_link_ignore_word(txid,torder){return' <a href="insert_word_ignore.php?tid='+txid+'&amp;ord='+torder+'" target="ro" onclick="showRightFrames();">Ignore this term</a> '}
function make_overlib_audio(txt,lang){let img=document.createElement("img");img.title="Click to read!";img.src="icn/speaker-volume.png";img.style.cursor="pointer";img.setAttribute("onclick","readTextAloud('"+escape_html_chars(txt)+"', '"+(lang||"")+"')");return img.outerHTML}
function getStatusName(status){return STATUSES[status]?STATUSES[status].name:'Unknown'}
function getStatusAbbr(status){return STATUSES[status]?STATUSES[status].abbr:'?'}
function translateSentence(url,sentctl){if(sentctl!==undefined&&url!=''){const text=sentctl.value;if(typeof text==='string'){showRightFrames(undefined,createTheDictUrl(url,text.replace(/[{}]/g,'')))}}}
function translateSentence2(url,sentctl){if(typeof sentctl!=='undefined'&&url!=''){const text=sentctl.value;if(typeof text==='string'){const finalurl=createTheDictUrl(url,text.replace(/[{}]/g,''));owin(finalurl)}}}
function translateWord(url,wordctl){if(wordctl!==undefined&&url!=''){const text=wordctl.value;if(typeof text==='string'){showRightFrames(undefined,createTheDictUrl(url,text))}}}
function translateWord2(url,wordctl){if(wordctl!==undefined&&url!=''){const text=wordctl.value;if(typeof text==='string'){owin(createTheDictUrl(url,text))}}}
function translateWord3(url,word){owin(createTheDictUrl(url,word))}
function getLangFromDict(wblink3){let dictUrl,urlParams;if(wblink3.trim()==''){return''}
if(wblink3.startsWith('*')){wblink3=wblink3.substring(1)}
if(wblink3.startsWith("trans.php")||wblink3.startsWith("ggl.php")){wblink3='http://'+wblink3}
dictUrl=new URL(wblink3);urlParams=dictUrl.searchParams;if(urlParams.get("lwt_translator")=="libretranslate"){return urlParams.get("source")||""}
return urlParams.get("sl")||""}
function make_tooltip(word,trans,roman,status){const nl='\x0d';let title=word;if(roman!=''){if(title!='')title+=nl;title+='▶ '+roman}
if(trans!=''&&trans!='*'){if(title!='')title+=nl;title+='▶ '+trans}
if(title!='')title+=nl;title+='▶ '+getStatusName(status)+' ['+getStatusAbbr(status)+']';return title}
function escape_html_chars_2(title,ann){if(ann!=''){const ann2=escape_html_chars(ann);return escape_html_chars(title).replace(ann2,'<span style="color:red">'+ann2+'</span>')}
return escape_html_chars(title)}
function owin(url){window.open(url,'dictwin','width=800, height=400, scrollbars=yes, menubar=no, resizable=yes, status=no')}
function oewin(url){window.open(url,'editwin','width=800, height=600, scrollbars=yes, menubar=no, resizable=yes, status=no')}
function createTheDictUrl(u,w){const url=u.trim();const trm=w.trim();const term_elem=url.match(/lwt_term|###/);const pos=(term_elem===null)?-1:url.indexOf(term_elem[0]);if(pos==-1){return url+encodeURIComponent(trm)}
const pos2=url.indexOf('###',pos+1);if(pos2===-1){return url.replace(term_elem,trm==''?'+':encodeURIComponent(trm))}
const enc=url.substring(pos+term_elem[0].length,pos2-pos-term_elem[0].length).trim();console.warn("Trying to use encoding '"+enc+"'. This feature is abandonned since "+"2.6.0-fork. Using default UTF-8.");let output=url.substring(0,pos)+encodeURIComponent(trm);if(pos2+3<url.length){output+=url.substring(pos2+3)}
return output}
function createTheDictLink(u,w,t,b){let url=u.trim();let popup=!1;const trm=w.trim();const txt=t.trim();const txtbefore=b.trim();let r='';if(url==''||txt==''){return r}
if(url.startsWith('*')){url=url.substring(1);popup=!0}
try{let final_url=new URL(url);popup|=final_url.searchParams.has('lwt_popup')}catch(err){if(!(err instanceof TypeError)){throw err}}
if(popup){r=' '+txtbefore+' <span class="click" onclick="owin(\''+createTheDictUrl(url,escape_apostrophes(trm))+'\');">'+txt+'</span> '}else{r=' '+txtbefore+' <a href="'+createTheDictUrl(url,trm)+'" target="ru" onclick="showRightFrames();">'+txt+'</a> '}
return r}
function createSentLookupLink(torder,txid,url,txt){url=url.trim();txt=txt.trim();let r='';let popup=!1;let external=!1;const target_url='trans.php?x=1&i='+torder+'&t='+txid;if(url==''||txt==''){return r}
if(url.startsWith('*')){url=url.substring(1);popup=!0}
try{let final_url=new URL(url);popup|=final_url.searchParams.has('lwt_popup');external=!0}catch(err){if(!(err instanceof TypeError)){throw err}}
if(popup){return' <span class="click" onclick="owin(\''+target_url+'\');">'+txt+'</span> '}
if(external){return' <a href="'+target_url+'" target="ru" onclick="showRightFrames();">'+txt+'</a> '}
return r}
function escape_html_chars(s){let map={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;',"\x0d":'<br />'};return s.replace(/[&<>"'\x0d]/g,function(m){return map[m]})}
function escape_apostrophes(s){return s.replace(/'/g,'\\\'')}
function selectToggle(toggle,form){const myForm=document.forms[form];for(let i=0;i<myForm.length;i++){if(toggle){myForm.elements[i].checked='checked'}else{myForm.elements[i].checked=''}}
markClick()}
function multiActionGo(f,sel){if(f!==undefined&&sel!==undefined){const v=sel.value;const t=sel.options[sel.selectedIndex].text;if(typeof v==='string'){if(v=='addtag'||v=='deltag'){let notok=1;var answer='';while(notok){answer=prompt('*** '+t+' ***'+'\n\n*** '+$('input.markcheck:checked').length+' Record(s) will be affected ***'+'\n\nPlease enter one tag (20 char. max., no spaces, no commas -- '+'or leave empty to cancel:',answer);if(typeof answer==='object')answer='';if(answer.indexOf(' ')>0||answer.indexOf(',')>0){alert('Please no spaces or commas!')}else if(answer.length>20){alert('Please no tags longer than 20 char.!')}else{notok=0}}
if(answer!=''){f.data.value=answer;f.submit()}}else if(v=='del'||v=='smi1'||v=='spl1'||v=='s1'||v=='s5'||v=='s98'||v=='s99'||v=='today'||v=='delsent'||v=='lower'||v=='cap'){var answer=confirm('*** '+t+' ***\n\n*** '+$('input.markcheck:checked').length+' Record(s) will be affected ***\n\nAre you sure?');if(answer){f.submit()}}else{f.submit()}}
sel.value=''}}
function allActionGo(f,sel,n){if(typeof f!=='undefined'&&typeof sel!=='undefined'){const v=sel.value;const t=sel.options[sel.selectedIndex].text;if(typeof v==='string'){if(v=='addtagall'||v=='deltagall'){let notok=1;var answer='';while(notok){answer=prompt('THIS IS AN ACTION ON ALL RECORDS\n'+'ON ALL PAGES OF THE CURRENT QUERY!\n\n'+'*** '+t+' ***\n\n*** '+n+' Record(s) will be affected ***\n\n'+'Please enter one tag (20 char. max., no spaces, no commas -- '+'or leave empty to cancel:',answer);if(typeof answer==='object')answer='';if(answer.indexOf(' ')>0||answer.indexOf(',')>0){alert('Please no spaces or commas!')}else if(answer.length>20){alert('Please no tags longer than 20 char.!')}else{notok=0}}
if(answer!=''){f.data.value=answer;f.submit()}}else if(v=='delall'||v=='smi1all'||v=='spl1all'||v=='s1all'||v=='s5all'||v=='s98all'||v=='s99all'||v=='todayall'||v=='delsentall'||v=='capall'||v=='lowerall'){var answer=confirm('THIS IS AN ACTION ON ALL RECORDS\nON ALL PAGES OF THE CURRENT QUERY!\n\n'+'*** '+t+' ***\n\n*** '+n+' Record(s) will be affected ***\n\n'+'ARE YOU SURE?');if(answer){f.submit()}}else{f.submit()}}
sel.value=''}}
function areCookiesEnabled(){setCookie('test','none','','/','','');if(getCookie('test')){cookie_set=!0;deleteCookie('test','/','')}else{cookie_set=!1}
return cookie_set}
function setLang(ctl,url){location.href='inc/save_setting_redirect.php?k=currentlanguage&v='+ctl.options[ctl.selectedIndex].value+'&u='+url}
function resetAll(url){location.href='inc/save_setting_redirect.php?k=currentlanguage&v=&u='+url}
function getCookie(check_name){const a_all_cookies=document.cookie.split(';');let a_temp_cookie='';let cookie_name='';let cookie_value='';let b_cookie_found=!1;let i='';for(i=0;i<a_all_cookies.length;i++){a_temp_cookie=a_all_cookies[i].split('=');cookie_name=a_temp_cookie[0].replace(/^\s+|\s+$/g,'');if(cookie_name==check_name){b_cookie_found=!0;if(a_temp_cookie.length>1){cookie_value=decodeURIComponent(a_temp_cookie[1].replace(/^\s+|\s+$/g,''))}
return cookie_value}
a_temp_cookie=null;cookie_name=''}
if(!b_cookie_found){return null}}
function setCookie(name,value,expires,path,domain,secure){const today=new Date();today.setTime(today.getTime());if(expires){expires=expires*1000*60*60*24}
const expires_date=new Date(today.getTime()+(expires));document.cookie=name+'='+encodeURIComponent(value)+(expires?';expires='+expires_date.toGMTString():'')+(path?';path='+path:'')+(domain?';domain='+domain:'')+(secure?';secure':'')}
function deleteCookie(name,path,domain){if(getCookie(name)){document.cookie=name+'='+(path?';path='+path:'')+(domain?';domain='+domain:'')+';expires=Thu, 01-Jan-1970 00:00:01 GMT'}}
function iknowall(t){const answer=confirm('Are you sure?');if(answer){showRightFrames('all_words_wellknown.php?text='+t)}}
function check_table_prefix(p){const re=/^[_a-zA-Z0-9]*$/;const r=p.length<=20&&p.length>0&&p.match(re);if(!r){alert('Table Set Name (= Table Prefix) must'+'\ncontain 1 to 20 characters (only 0-9, a-z, A-Z and _).'+'\nPlease correct your input.')}
return r};/**
 * \file
 * \brief Standard JS interface to get translations
 * 
 * @package Lwt
 * @author  andreask7 <andreasks7@users.noreply.github.com>
 * @license Unlicense <http://unlicense.org/>
 * @since   1.6.16-fork
 */
function deleteTranslation(){let w=window.parent.frames.ro;if(w===undefined)
w=window.opener;if($('[name="WoTranslation"]',w.document).val().trim().length){$('[name="WoTranslation"]',w.document).val('');w.makeDirty()}}
function addTranslation(s){let w=window.parent.frames.ro;if(w===undefined)
w=window.opener;if(w===undefined){alert('Translation can not be copied!');return}
let c=w.document.forms[0].WoTranslation;if(typeof c!='object'){alert('Translation can not be copied!');return}
let oldValue=c.value;if(oldValue.trim()==''){c.value=s;w.makeDirty()}else{if(oldValue.indexOf(s)==-1){c.value=oldValue+' / '+s;w.makeDirty()}else{if(confirm('"'+s+'" seems already to exist as a translation.\nInsert anyway?')){c.value=oldValue+' / '+s;w.makeDirty()}}}}
function getGlosbeTranslation(text,lang,dest){$.ajax({url:'http://glosbe.com/gapi/translate?'+$.param({from:lang,dest:dest,format:"json",phrase:text,callback:"?"}),type:"GET",dataType:'jsonp',jsonp:'getTranslationFromGlosbeApi',jsonpCallback:'getTranslationFromGlosbeApi',async:'true'})}
function getTranslationFromGlosbeApi(data){try{$.each(data.tuc,function(i,rows){if(rows.phrase){$('#translations').append('<span class="click" onclick="addTranslation(\''+rows.phrase.text+'\');">'+'<img src="icn/tick-button.png" title="Copy" alt="Copy" />'+' &nbsp; '+rows.phrase.text+'</span><br />')}else if(rows.meanings){$('#translations').append('<span class="click" onclick="addTranslation('+"'("+rows.meanings[0].text+")'"+');">'+'<img src="icn/tick-button.png" title="Copy" alt="Copy" />'+' &nbsp; '+"("+rows.meanings[0].text+")"+'</span><br />')}});if(!data.tuc.length){$('#translations').before('<p>No translations found ('+data.from+'-'+data.dest+').</p>');if(data.dest!='en'&&data.from!='en'){$('#translations').attr('id','no_trans').after('<hr /><p>&nbsp;</p><h3><a href="http://glosbe.com/'+data.from+'/en/'+data.phrase+'">Glosbe Dictionary ('+data.from+'-en):  &nbsp; <span class="red2">'+data.phrase+'</span></a></h3>&nbsp;<p id="translations"></p>');getGlosbeTranslation(data.phrase,data.from,'en')}else $('#translations').after('<hr />')}else $('#translations').after('<p>&nbsp;<br/>'+data.tuc.length+' translation'+(data.tuc.length==1?'':'s')+' retrieved via <a href="http://glosbe.com/a-api" target="_blank">'+'Glosbe API</a>.</p><hr />')}catch(err){$('#translations').text('Retrieval error. Possible reason: There is a limit of Glosbe API '+'calls that may be done from one IP address in a fixed period of time,'+' to prevent from abuse.').after('<hr />')}}
async function getLibreTranslateTranslationBase(text,lang,dest,key="",url="http://localhost:5000/translate"){const res=await fetch(url,{method:"POST",body:JSON.stringify({q:text,source:lang,target:dest,format:"text",api_key:key}),headers:{"Content-Type":"application/json"}});const data=await res.json();return data.translatedText}
async function getLibreTranslateTranslation(libre_url,text,lang,dest){const search_params=libre_url.searchParams;if(search_params.get("lwt_translator")!="libretranslate"){throw 'Translation API not supported: '+search_params.get("lwt_translator")+"!"}
let translator_ajax;if(search_params.get("lwt_translator_ajax")){translator_ajax=decodeURIComponent(search_params.get("lwt_translator_ajax"))}else{translator_ajax=libre_url.toString().replace(libre_url.search,'')+"translate"}
return getLibreTranslateTranslationBase(text,lang,dest,key=search_params.get("lwt_key"),translator_ajax)};/**
 * \file
 * \brief Check for unsaved changes when unloading window.
 * 
 * @package Lwt
 * @license unlicense
 * @author  andreask7 <andreasks7@users.noreply.github.com>
 * @since   1.6.16-fork
 * @since   2.3.1-fork You should not only include this script to check before unload
 * 					but also call ask_before_exiting once.
 */
var DIRTY=0;function askConfirmIfDirty(){if(DIRTY){return'** You have unsaved changes! **'}}
function makeDirty(){DIRTY=1}
function resetDirty(){DIRTY=0}
function tagChanged(_,ui){if(!ui.duringInitialization){DIRTY=1}
return!0}
function ask_before_exiting(){$('#termtags').tagit({afterTagAdded:tagChanged,afterTagRemoved:tagChanged});$('#texttags').tagit({afterTagAdded:tagChanged,afterTagRemoved:tagChanged});$('input,checkbox,textarea,radio,select').not('#quickmenu').on('change',makeDirty);$(':reset,:submit').on('click',resetDirty);$(window).on('beforeunload',askConfirmIfDirty)};var stIsIE=!1;sorttable={init:function(){if(arguments.callee.done)return;arguments.callee.done=!0;if(_timer)clearInterval(_timer);if(!document.createElement||!document.getElementsByTagName)return;sorttable.DATE_RE=/^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/;forEach(document.getElementsByTagName('table'),function(table){if(table.className.search(/\bsortable\b/)!=-1){sorttable.makeSortable(table)}})},makeSortable:function(table){if(table.getElementsByTagName('thead').length==0){the=document.createElement('thead');the.appendChild(table.rows[0]);table.insertBefore(the,table.firstChild)}
if(table.tHead==null)table.tHead=table.getElementsByTagName('thead')[0];if(table.tHead.rows.length!=1)return;sortbottomrows=[];for(var i=0;i<table.rows.length;i++){if(table.rows[i].className.search(/\bsortbottom\b/)!=-1){sortbottomrows[sortbottomrows.length]=table.rows[i]}}
if(sortbottomrows){if(table.tFoot==null){tfo=document.createElement('tfoot');table.appendChild(tfo)}
for(var i=0;i<sortbottomrows.length;i++){tfo.appendChild(sortbottomrows[i])}
delete sortbottomrows}
headrow=table.tHead.rows[0].cells;for(var i=0;i<headrow.length;i++){if(!headrow[i].className.match(/\bsorttable_nosort\b/)){mtch=headrow[i].className.match(/\bsorttable_([a-z0-9]+)\b/);if(mtch){override=mtch[1]}
if(mtch&&typeof sorttable["sort_"+override]=='function'){headrow[i].sorttable_sortfunction=sorttable["sort_"+override]}else{headrow[i].sorttable_sortfunction=sorttable.guessType(table,i)}
headrow[i].sorttable_columnindex=i;headrow[i].sorttable_tbody=table.tBodies[0];dean_addEvent(headrow[i],"click",sorttable.innerSortFunction=function(e){if(this.className.search(/\bsorttable_sorted\b/)!=-1){sorttable.reverse(this.sorttable_tbody);this.className=this.className.replace('sorttable_sorted','sorttable_sorted_reverse');this.removeChild(document.getElementById('sorttable_sortfwdind'));sortrevind=document.createElement('span');sortrevind.id="sorttable_sortrevind";sortrevind.innerHTML=stIsIE?'&nbsp<font face="webdings">5</font>':'&nbsp;&#x25B4;';this.appendChild(sortrevind);return}
if(this.className.search(/\bsorttable_sorted_reverse\b/)!=-1){sorttable.reverse(this.sorttable_tbody);this.className=this.className.replace('sorttable_sorted_reverse','sorttable_sorted');this.removeChild(document.getElementById('sorttable_sortrevind'));sortfwdind=document.createElement('span');sortfwdind.id="sorttable_sortfwdind";sortfwdind.innerHTML=stIsIE?'&nbsp<font face="webdings">6</font>':'&nbsp;&#x25BE;';this.appendChild(sortfwdind);return}
theadrow=this.parentNode;forEach(theadrow.childNodes,function(cell){if(cell.nodeType==1){cell.className=cell.className.replace('sorttable_sorted_reverse','');cell.className=cell.className.replace('sorttable_sorted','')}});sortfwdind=document.getElementById('sorttable_sortfwdind');if(sortfwdind){sortfwdind.parentNode.removeChild(sortfwdind)}
sortrevind=document.getElementById('sorttable_sortrevind');if(sortrevind){sortrevind.parentNode.removeChild(sortrevind)}
this.className+=' sorttable_sorted';sortfwdind=document.createElement('span');sortfwdind.id="sorttable_sortfwdind";sortfwdind.innerHTML=stIsIE?'&nbsp<font face="webdings">6</font>':'&nbsp;&#x25BE;';this.appendChild(sortfwdind);row_array=[];col=this.sorttable_columnindex;rows=this.sorttable_tbody.rows;for(var j=0;j<rows.length;j++){row_array[row_array.length]=[sorttable.getInnerText(rows[j].cells[col]),rows[j]]}
row_array.sort(this.sorttable_sortfunction);tb=this.sorttable_tbody;for(var j=0;j<row_array.length;j++){tb.appendChild(row_array[j][1])}
delete row_array})}}},guessType:function(table,column){sortfn=sorttable.sort_alpha;for(var i=0;i<table.tBodies[0].rows.length;i++){text=sorttable.getInnerText(table.tBodies[0].rows[i].cells[column]);if(text!=''){if(text.match(/^-?[�$�]?[\d,.]+%?$/)){return sorttable.sort_numeric}
possdate=text.match(sorttable.DATE_RE)
if(possdate){first=parseInt(possdate[1]);second=parseInt(possdate[2]);if(first>12){return sorttable.sort_ddmm}else if(second>12){return sorttable.sort_mmdd}else{sortfn=sorttable.sort_ddmm}}}}
return sortfn},getInnerText:function(node){if(!node)return"";hasInputs=(typeof node.getElementsByTagName=='function')&&node.getElementsByTagName('input').length;if(node.getAttribute("sorttable_customkey")!=null){return node.getAttribute("sorttable_customkey")}else if(typeof node.textContent!='undefined'&&!hasInputs){return node.textContent.replace(/^\s+|\s+$/g,'')}else if(typeof node.innerText!='undefined'&&!hasInputs){return node.innerText.replace(/^\s+|\s+$/g,'')}else if(typeof node.text!='undefined'&&!hasInputs){return node.text.replace(/^\s+|\s+$/g,'')}else{switch(node.nodeType){case 3:if(node.nodeName.toLowerCase()=='input'){return node.value.replace(/^\s+|\s+$/g,'')}
case 4:return node.nodeValue.replace(/^\s+|\s+$/g,'');break;case 1:case 11:var innerText='';for(var i=0;i<node.childNodes.length;i++){innerText+=sorttable.getInnerText(node.childNodes[i])}
return innerText.replace(/^\s+|\s+$/g,'');break;default:return''}}},reverse:function(tbody){newrows=[];for(var i=0;i<tbody.rows.length;i++){newrows[newrows.length]=tbody.rows[i]}
for(var i=newrows.length-1;i>=0;i--){tbody.appendChild(newrows[i])}
delete newrows},sort_numeric:function(a,b){aa=parseFloat(a[0].replace(/[^0-9.-]/g,''));if(isNaN(aa))aa=0;bb=parseFloat(b[0].replace(/[^0-9.-]/g,''));if(isNaN(bb))bb=0;return aa-bb},sort_alpha:function(a,b){if(a[0]==b[0])return 0;if(a[0]<b[0])return-1;return 1},sort_ddmm:function(a,b){mtch=a[0].match(sorttable.DATE_RE);y=mtch[3];m=mtch[2];d=mtch[1];if(m.length==1)m='0'+m;if(d.length==1)d='0'+d;dt1=y+m+d;mtch=b[0].match(sorttable.DATE_RE);y=mtch[3];m=mtch[2];d=mtch[1];if(m.length==1)m='0'+m;if(d.length==1)d='0'+d;dt2=y+m+d;if(dt1==dt2)return 0;if(dt1<dt2)return-1;return 1},sort_mmdd:function(a,b){mtch=a[0].match(sorttable.DATE_RE);y=mtch[3];d=mtch[2];m=mtch[1];if(m.length==1)m='0'+m;if(d.length==1)d='0'+d;dt1=y+m+d;mtch=b[0].match(sorttable.DATE_RE);y=mtch[3];d=mtch[2];m=mtch[1];if(m.length==1)m='0'+m;if(d.length==1)d='0'+d;dt2=y+m+d;if(dt1==dt2)return 0;if(dt1<dt2)return-1;return 1},shaker_sort:function(list,comp_func){var b=0;var t=list.length-1;var swap=!0;while(swap){swap=!1;for(var i=b;i<t;++i){if(comp_func(list[i],list[i+1])>0){var q=list[i];list[i]=list[i+1];list[i+1]=q;swap=!0}}
t--;if(!swap)break;for(var i=t;i>b;--i){if(comp_func(list[i],list[i-1])<0){var q=list[i];list[i]=list[i-1];list[i-1]=q;swap=!0}}
b++}}}
if(document.addEventListener){document.addEventListener("DOMContentLoaded",sorttable.init,!1)}
if(/WebKit/i.test(navigator.userAgent)){var _timer=setInterval(function(){if(/loaded|complete/.test(document.readyState)){sorttable.init()}},10)}
window.onload=sorttable.init;function dean_addEvent(element,type,handler){if(element.addEventListener){element.addEventListener(type,handler,!1)}else{if(!handler.$$guid)handler.$$guid=dean_addEvent.guid++;if(!element.events)element.events={};var handlers=element.events[type];if(!handlers){handlers=element.events[type]={};if(element["on"+type]){handlers[0]=element["on"+type]}}
handlers[handler.$$guid]=handler;element["on"+type]=handleEvent}};dean_addEvent.guid=1;function removeEvent(element,type,handler){if(element.removeEventListener){element.removeEventListener(type,handler,!1)}else{if(element.events&&element.events[type]){delete element.events[type][handler.$$guid]}}};function handleEvent(event){var returnValue=!0;event=event||fixEvent(((this.ownerDocument||this.document||this).parentWindow||window).event);var handlers=this.events[event.type];for(var i in handlers){this.$$handleEvent=handlers[i];if(this.$$handleEvent(event)===!1){returnValue=!1}}
return returnValue};function fixEvent(event){event.preventDefault=fixEvent.preventDefault;event.stopPropagation=fixEvent.stopPropagation;return event};fixEvent.preventDefault=function(){this.returnValue=!1};fixEvent.stopPropagation=function(){this.cancelBubble=!0}
if(!Array.forEach){Array.forEach=function(array,block,context){for(var i=0;i<array.length;i++){block.call(context,array[i],i,array)}}}
Function.prototype.forEach=function(object,block,context){for(var key in object){if(typeof this.prototype[key]=="undefined"){block.call(context,object[key],key,object)}}};String.forEach=function(string,block,context){Array.forEach(string.split(""),function(chr,index){block.call(context,chr,index,string)})};var forEach=function(object,block,context){if(object){var resolve=Object;if(object instanceof Function){resolve=Function}else if(object.forEach instanceof Function){object.forEach(block,context);return}else if(typeof object=="string"){resolve=String}else if(typeof object.length=="number"){resolve=Array}
resolve.forEach(object,block,context)}};/**
 * \file
 * \brief General file to control dynamic interactions with the user.
 * 
 * @package Lwt
 * @author  HugoFara <Hugo.Farajallah@protonmail.com>
 * @license Unlicense <http://unlicense.org/>
 * @since   2.0.3-fork
 */
function quickMenuRedirection(value){const qm=document.getElementById('quickmenu');qm.selectedIndex=0;if(value=='')
return;if(value=='INFO'){top.location.href='docs/info.html'}else if(value=='rss_import'){top.location.href='do_feeds.php?check_autoupdate=1'}else{top.location.href=value+'.php'}}
function newExpressionInteractable(text,attrs,length,hex,showallwords){const context=window.parent.document;for(key in text){const words=$('span[id^="ID-'+key+'-"]',context).not(".hide");const text_refresh=(words.attr('data_code')!==undefined&&words.attr('data_code')<=length);$('#ID-'+key+'-'+length,context).remove();let i='';for(let j=length-1;j>0;j--){if(j==1)
i='#ID-'+key+'-1';if($('#ID-'+key+'-'+j,context).length){i='#ID-'+key+'-'+j;break}}
$(i,context).before('<span id="ID-'+key+'-'+length+'"'+attrs+'>'+text[key]+'</span>');const el=$('#ID-'+key+'-'+length,context);el.addClass('order'+key).attr('data_order',key);const txt=el.nextUntil($('#ID-'+(parseInt(key)+length*2-1)+'-1',context),'[id$="-1"]').map(function(){return $(this).text()}).get().join("");const pos=$('#ID-'+key+'-1',context).attr('data_pos');el.attr('data_text',txt).attr('data_pos',pos);if(!showallwords){if(!0||text_refresh){}else{el.addClass('hide')}}}}
function prepareTextInteractions(){$('.word').each(word_each_do_text_text);$('.mword').each(mword_each_do_text_text);$('.word').on('click',word_click_event_do_text_text);$('#thetext').on('selectstart','span',!1).on('mousedown','.wsty',{annotation:ANNOTATIONS_MODE},mword_drag_n_drop_select);$('#thetext').on('click','.mword',mword_click_event_do_text_text);$('.word').on('dblclick',word_dblclick_event_do_text_text);$('#thetext').on('dblclick','.mword',word_dblclick_event_do_text_text);$(document).on('keydown',keydown_event_do_text_text);$('#thetext').hoverIntent({over:word_hover_over,out:word_hover_out,interval:150,selector:".wsty,.mwsty"})}
function goToLastPosition(){const lookPos=POS;let pos=0;if(lookPos>0){let posObj=$(".wsty[data_pos="+lookPos+"]").not(".hide").eq(0);if(posObj.attr("data_pos")===undefined){pos=$(".wsty").not(".hide").filter(function(){return $(this).attr("data_pos")<=lookPos}).eq(-1)}}
$(document).scrollTo(pos);focus();setTimeout(overlib,10);setTimeout(cClick,100)}
function saveCurrentPosition(){let pos=0;const top_pos=$(window).scrollTop()-$('.wsty').not('.hide').eq(0).height();$('.wsty').not('.hide').each(function(){if($(this).offset().top>=top_pos){pos=$(this).attr('data_pos');return!1}});$.ajax({type:"POST",url:'inc/ajax.php/v1/texts/'+TID+'/reading-position',data:{action:"reading_position",action_type:"text",tid:TID,tposition:pos},async:!1})}
function getPhoneticText(text,lang){let phoneticText;$.ajax('inc/ajax.php/v1/phonetic-reading',{async:!1,data:{action:"query",action_type:"phonetic_reading",text:text,lang:lang},dataType:"json",type:"GET",}).done(function(data){phoneticText=data.phonetic_reading});return phoneticText}
async function getPhoneticTextAsync(text,lang){return $.getJSON('inc/ajax.php/v1/phonetic-reading',{action:"query",action_type:"phonetic_reading",text:text,lang:lang})}
function readRawTextAloud(text,lang,rate,pitch,voice){let msg=new SpeechSynthesisUtterance();const trimmed=lang.substring(0,2);const prefix='tts['+trimmed;msg.text=text;if(lang){msg.lang=lang}
const useVoice=voice||getCookie(prefix+'Voice]');if(useVoice){const voices=window.speechSynthesis.getVoices();for(let i=0;i<voices.length;i++){if(voices[i].name===useVoice){msg.voice=voices[i]}}}
if(rate){msg.rate=rate}else if(getCookie(prefix+'Rate]')){msg.rate=parseInt(getCookie(prefix+'Rate]'),10)}
if(pitch){msg.pitch=pitch}else if(getCookie(prefix+'Pitch]')){msg.pitch=parseInt(getCookie(prefix+'Pitch]'),10)}
window.speechSynthesis.speak(msg);return msg}
function readTextAloud(text,lang,rate,pitch,voice){if(lang.startsWith('ja')){getPhoneticTextAsync(text,lang).then(function(data){readRawTextAloud(data.phonetic_reading,lang,rate,pitch,voice)})}else{readRawTextAloud(text,lang,rate,pitch,voice)}}