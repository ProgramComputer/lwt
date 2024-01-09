/**
 * Interaction between LWT and jQuery
 *
 * @license unlicense
 * @author  andreask7 <andreasks7@users.noreply.github.com>
 * @since   1.6.16-fork
 */

/**************************************************************
Global variables used in LWT jQuery functions
***************************************************************/

LWT_DATA = {
  /** Language data */
  language: {
    id: undefined,
    /** First dictionary URL */
    dict_link1: '',
    /** Second dictionary URL */
    dict_link2: '',
    /** Translator URL */
    translator_link: '',

    delimiter: '',

    /** Word parsing strategy, usually regular expression or 'mecab' */
    word_parsing: '',

    rtl: false,
    /** Third-party voice API */
    ttsVoiceApi: ''
  },
  text: {
    id: 0,
    reading_position: -1,
    annotations: {}
  },
  word: {
    id: 0
  },
  test: {
    solution: '',
    answer_opened: false
  },
  settings: {
    jQuery_tooltip: false,
    hts: 0,
    word_status_filter: ''
  }
};

/** Word ID, deprecated Since 2.10.0, use LWT_DATA.word.id instead */
WID = 0;
/** Text ID (int), deprecated Since 2.10.0, use LWT_DATA.text.id */
TID = 0;
/** First dictionary URL, deprecated in 2.10.0 use LWT_DATA.language.dict_link1 */
WBLINK1 = '';
/** Second dictionary URL, deprecated in 2.10.0 use LWT_DATA.language.dict_link2 */
WBLINK2 = '';
/** Translator URL, deprecated in 2.10.0 use LWT_DATA.language.translator_link */
WBLINK3 = '';
/** Right-to-left indicator, deprecated in 2.10.0 use LWT_DATA.language.rtl */
RTL = 0;

/**************************************************************
LWT jQuery functions
***************************************************************/

/**
 * Set translation and romanization in a form when possible.
 *
 * Marj the form as edited if something was changed.
 *
 * @param {string} tra Translation
 * @param {string} rom Romanization
 */
function setTransRoman (tra, rom) {
  let form_changed = false;
  if ($('textarea[name="WoTranslation"]').length == 1) {
    $('textarea[name="WoTranslation"]').val(tra);
    form_changed |= true;
  }
  if ($('input[name="WoRomanization"]').length == 1) {
    $('input[name="WoRomanization"]').val(rom);
    form_changed |= true;
  }
  if (form_changed) { lwtFormCheck.makeDirty(); }
}

/**
 * Return whether characters are outside the multilingual plane.
 *
 * @param {string} s Input string
 * @returns {boolean} true is some characters are outside the plane
 */
function containsCharacterOutsideBasicMultilingualPlane (s) {
  return /[\uD800-\uDFFF]/.test(s);
}

/**
 * Alert if characters are outside the multilingual plane.
 *
 * @param {string} s Input string
 * @returns {boolean} true is some characters are outside the plane
 */
function alertFirstCharacterOutsideBasicMultilingualPlane (s, info) {
  if (!containsCharacterOutsideBasicMultilingualPlane(s)) {
    return 0;
  }
  const match = /[\uD800-\uDFFF]/.exec(s);
  alert(
    'ERROR\n\nText "' + info + '" contains invalid character(s) ' +
    '(in the Unicode Supplementary Multilingual Planes, > U+FFFF) like emojis ' +
    'or very rare characters.\n\nFirst invalid character: "' +
    s.substring(match.index, match.index + 2) + '" at position ' +
    (match.index + 1) + '.\n\n' +
    'More info: https://en.wikipedia.org/wiki/Plane_(Unicode)\n\n' +
    'Please remove this/these character(s) and try again.'
  );
  return 1;
}

/**
 * Return the memory size of an UTF8 string.
 *
 * @param {string} s String to evaluate
 * @returns {number} Size in bytes
 */
function getUTF8Length (s) {
  return (new Blob([String(s)])).size;
}

/**
 * Force the user scrolling to an anchor.
 *
 * @param {string} aid Anchor ID
 */
function scrollToAnchor (aid) {
  document.location.href = '#' + aid;
}

/**
 * Set an existing translation as annotation for a term.
 *
 * @param {int} textid Text ID
 * @param {string} elem_name Name of the element of which to change annotation (e. g.: "rg1")
 * @param {Object} form_data All the data from the form
 * (e. g. {"rg0": "foo", "rg1": "bar"})
 */
function do_ajax_save_impr_text (textid, elem_name, form_data) {
  const idwait = '#wait' + elem_name.substring(2);
  $(idwait).html('<img src="icn/waiting2.gif" />');
  // elem: "rg2", form_data: {"rg2": "translation"}
  $.post(
    'api.php/v1/texts/' + textid + '/annotation',
    {
      elem: elem_name,
      data: form_data
    },
    function (data) {
      $(idwait).html('<img src="icn/empty.gif" />');
      if ('error' in data) {
        alert(
          'Saving your changes failed, please reload the page and try again! ' +
          'Error message: "' + data.error + '".'
        );
      }
    },
    'json'
  );
}

/**
 * Change the annotation for a term by setting its text.
 */
function changeImprAnnText () {
  $(this).prev('input:radio').attr('checked', 'checked');
  const textid = $('#editimprtextdata').attr('data_id');
  const elem_name = $(this).attr('name');
  const form_data = JSON.stringify($('form').serializeObject());
  do_ajax_save_impr_text(textid, elem_name, form_data);
}

/**
 * Change the annotation for a term by setting its text.
 */
function changeImprAnnRadio () {
  const textid = $('#editimprtextdata').attr('data_id');
  const elem_name = $(this).attr('name');
  const form_data = JSON.stringify($('form').serializeObject());
  do_ajax_save_impr_text(textid, elem_name, form_data);
}

/**
 * Update a word translation.
 *
 * @param {int}    wordid Word ID
 * @param {string} txid   Text HTML ID or unique HTML selector
 */
function updateTermTranslation (wordid, txid) {
  const translation = $(txid).val().trim();
  const pagepos = $(document).scrollTop();
  if (translation == '' || translation == '*') {
    alert('Text Field is empty or = \'*\'!');
    return;
  }
  const request = {
    translation
  };
  const failure = 'Updating translation of term failed!' +
  'Please reload page and try again.';
  $.post(
    'api.php/v1/terms/' + wordid + '/translations',
    request,
    function (d) {
      if (d == '') {
        alert(failure);
        return;
      }
      if ('error' in d) {
        alert(failure + '\n' + d.error);
        return;
      }
      do_ajax_edit_impr_text(pagepos, d.update, wordid);
    },
    'json'
  );
}

/**
 * Add (new word) a word translation.
 *
 * @param {string} txid   Text HTML ID or unique HTML selector
 * @param {string} word   Word text
 * @param {int}    lang   Language ID
 */
function addTermTranslation (txid, word, lang) {
  const translation = $(txid).val().trim();
  const pagepos = $(document).scrollTop();
  if (translation == '' || translation == '*') {
    alert('Text Field is empty or = \'*\'!');
    return;
  }
  const failure = 'Adding translation to term failed!' +
  'Please reload page and try again.'
  $.post(
    'api.php/v1/terms/new',
    {
      translation,
      term_text: word,
      lg_id: lang
    },
    function (d) {
      if (d == '') {
        alert(failure);
        return;
      }
      if ('error' in d) {
        alert(failure + '\n' + d.error);
        return;
      }
      do_ajax_edit_impr_text(pagepos, d.add, d.term_id);
    },
    'json'
  );
}

/**
 * Set a new status for a word in the test table.
 *
 * @param {string} wordid Word ID
 * @param {bool}   up     true if status sould be increased, false otherwise
 */
function changeTableTestStatus (wordid, up) {
  const status_change = up ? 'up' : 'down';
  const wid = parseInt(wordid, 10);
  $.post(
    'api.php/v1/terms/' + wid + '/status/' + status_change,
    {},
    function (data) {
      if (data == '' || 'error' in data) {
        return;
      }
      $('#STAT' + wordid).html(data.increment);
    },
    'json'
  );
}

/**
 * Check if there is no problem with the text.
 *
 * @returns {boolean} true if all checks were successfull
 */
function check () {
  let count = 0;
  $('.notempty').each(function (_n) {
    if ($(this).val().trim() == '') count++;
  });
  if (count > 0) {
    alert('ERROR\n\n' + count + ' field(s) - marked with * - must not be empty!');
    return false;
  }
  count = 0;
  $('input.checkurl').each(function (_n) {
    if ($(this).val().trim().length > 0) {
      if (($(this).val().trim().indexOf('http://') != 0) &&
      ($(this).val().trim().indexOf('https://') != 0) &&
      ($(this).val().trim().indexOf('#') != 0)) {
        alert(
          'ERROR\n\nField "' + $(this).attr('data_info') +
          '" must start with "http://" or "https://" if not empty.'
        );
        count++;
      }
    }
  });
  // Note: as of LWT 2.9.0, no field with "checkregexp" property is found in the code base
  $('input.checkregexp').each(function (_n) {
    const regexp = $(this).val().trim();
    if (regexp.length > 0) {
      $.ajax({
        type: 'POST',
        url: 'inc/ajax.php',
        data: {
          action: '',
          action_type: 'check_regexp',
          regex: regexp
        },
			 async: false
      }
      ).always(function (data) {
        if (data != '') {
          alert(data);
          count++;
        }
      });
    }
  });
  // To enable limits of custom feed texts/articl.
  // change the following «input[class*="max_int_"]» into «input[class*="maxint_"]»
  $('input[class*="max_int_"]').each(function (_n) {
    const maxvalue = parseInt($(this).attr('class')
      .replace(/.*maxint_([0-9]+).*/, '$1'));
    if ($(this).val().trim().length > 0) {
      if ($(this).val() > maxvalue) {
        alert(
          'ERROR\n\n Max Value of Field "' + $(this).attr('data_info') +
          '" is ' + maxvalue
        );
        count++;
      }
    }
  });
  // Check that the Google Translate field is of good type
  $('input.checkdicturl').each(function (_n) {
    const translate_input = $(this).val().trim();
    if (translate_input.length > 0) {
      let refinned = translate_input;
      if (translate_input.startsWith('*')) {
        refinned = translate_input.substring(1);
      }
      if (!/^https?:\/\//.test(refinned)) {
        refinned = 'http://' + refinned;
      }
      try {
        new URL(refinned);
      } catch (err) {
        if (err instanceof TypeError) {
          alert(
            'ERROR\n\nField "' + $(this).attr('data_info') +
            '" should be an URL if not empty.'
          );
          count++;
        }
      }
    }
  });
  $('input.posintnumber').each(function (_n) {
    if ($(this).val().trim().length > 0) {
      if (!(isInt($(this).val().trim()) && (parseInt($(this).val().trim(), 10) > 0))) {
        alert(
          'ERROR\n\nField "' + $(this).attr('data_info') +
          '" must be an integer number > 0.'
        );
        count++;
      }
    }
  });
  $('input.zeroposintnumber').each(function (_n) {
    if ($(this).val().trim().length > 0) {
      if (!(isInt($(this).val().trim()) && (parseInt($(this).val().trim(), 10) >= 0))) {
        alert(
          'ERROR\n\nField "' + $(this).attr('data_info') +
          '" must be an integer number >= 0.'
        );
        count++;
      }
    }
  });
  $('input.checkoutsidebmp').each(function (_n) {
    if ($(this).val().trim().length > 0) {
      if (containsCharacterOutsideBasicMultilingualPlane($(this).val())) {
        count += alertFirstCharacterOutsideBasicMultilingualPlane(
          $(this).val(), $(this).attr('data_info')
        );
      }
    }
  });
  $('textarea.checklength').each(function (_n) {
    if ($(this).val().trim().length > (0 + $(this).attr('data_maxlength'))) {
      alert(
        'ERROR\n\nText is too long in field "' + $(this).attr('data_info') +
        '", please make it shorter! (Maximum length: ' +
        $(this).attr('data_maxlength') + ' char.)'
      );
      count++;
    }
  });
  $('textarea.checkoutsidebmp').each(function (_n) {
    if (containsCharacterOutsideBasicMultilingualPlane($(this).val())) {
      count += alertFirstCharacterOutsideBasicMultilingualPlane(
        $(this).val(), $(this).attr('data_info')
      );
    }
  });
  $('textarea.checkbytes').each(function (_n) {
    if (getUTF8Length($(this).val().trim()) > (0 + $(this).attr('data_maxlength'))) {
      alert(
        'ERROR\n\nText is too long in field "' + $(this).attr('data_info') +
        '", please make it shorter! (Maximum length: ' +
        $(this).attr('data_maxlength') + ' bytes.)'
      );
      count++;
    }
  });
  $('input.noblanksnocomma').each(function (_n) {
    if ($(this).val().indexOf(' ') > 0 || $(this).val().indexOf(',') > 0) {
      alert(
        'ERROR\n\nNo spaces or commas allowed in field "' +
        $(this).attr('data_info') + '", please remove!'
      );
      count++;
    }
  });
  return (count == 0);
}

function isInt (value) {
  for (let i = 0; i < value.length; i++) {
    if ((value.charAt(i) < '0') || (value.charAt(i) > '9')) {
      return false;
    }
  }
  return true;
}

function markClick () {
  if ($('input.markcheck:checked').length > 0) {
    $('#markaction').removeAttr('disabled');
  } else {
    $('#markaction').attr('disabled', 'disabled');
  }
}

function confirmDelete () {
  return confirm('CONFIRM\n\nAre you sure you want to delete?');
}

/**
 * Enable/disable words hint.
 * Function called when clicking on "Show All".
 */
function showAllwordsClick () {
  const showAll = $('#showallwords').prop('checked') ? '1' : '0';
  const showLeaning = $('#showlearningtranslations').prop('checked') ? '1' : '0';
  const text = $('#thetextid').text();
  // Timeout necessary because the button is clicked on the left (would hide frames)
  setTimeout(function () {
    showRightFrames(
      'set_text_mode.php?mode=' + showAll + '&showLearning=' + showLeaning +
      '&text=' + text
    );
  }, 500);
  setTimeout(function () { window.location.reload(); }, 4000);
}

function textareaKeydown (event) {
  if (event.keyCode && event.keyCode == '13') {
    if (check()) { $('input:submit').last().trigger('click'); }
    return false;
  } else {
    return true;
  }
}

function noShowAfter3Secs () {
  $('#hide3').slideUp();
}

/**
 * Set the focus on an element with the "focus" class.
 */
function setTheFocus () {
  $('.setfocus')
    .trigger('focus')
    .trigger('select');
}

/**
 * Prepare a dialog when the user clicks a word during a test.
 *
 * @returns {false}
 */
function word_click_event_do_test_test () {
  run_overlib_test(
    LWT_DATA.language.dict_link1, LWT_DATA.language.dict_link2, LWT_DATA.language.translator_link,
    $(this).attr('data_wid'),
    $(this).attr('data_text'),
    $(this).attr('data_trans'),
    $(this).attr('data_rom'),
    $(this).attr('data_status'),
    $(this).attr('data_sent'),
    $(this).attr('data_todo')
  );
  $('.todo').text(LWT_DATA.test.solution);
  return false;
}

/**
 * Handle keyboard interaction when testing a word.
 *
 * @param {object} e A keystroke object
 * @returns {bool} true if nothing was done, false otherwise
 */
function keydown_event_do_test_test (e) {
  if ((e.key == 'Space' || e.which == 32) && !LWT_DATA.test.answer_opened) {
    // space : show solution
    $('.word').trigger('click');
    cleanupRightFrames();
    showRightFrames('show_word.php?wid=' + $('.word').attr('data_wid') + '&ann=');
    LWT_DATA.test.answer_opened = true;
    return false;
  }
  if (e.key == 'Escape' || e.which == 27) {
    // esc : skip term, don't change status
    showRightFrames(
      'set_test_status.php?wid=' + LWT_DATA.word.id +
      '&status=' + $('.word').attr('data_status')
    );
    return false;
  }
  if (e.key == 'I' || e.which == 73) {
    // I : ignore, status=98
    showRightFrames('set_test_status.php?wid=' + LWT_DATA.word.id + '&status=98');
    return false;
  }
  if (e.key == 'W' || e.which == 87) {
    // W : well known, status=99
    showRightFrames('set_test_status.php?wid=' + LWT_DATA.word.id + '&status=99');
    return false;
  }
  if (e.key == 'E' || e.which == 69) {
    // E : edit
    showRightFrames('edit_tword.php?wid=' + LWT_DATA.word.id);
    return false;
  }
  // The next interactions should only be available with displayed solution
  if (!LWT_DATA.test.answer_opened) { return true; }
  if (e.key == 'ArrowUp' || e.which == 38) {
    // up : status+1
    showRightFrames('set_test_status.php?wid=' + LWT_DATA.word.id + '&stchange=1');
    return false;
  }
  if (e.key == 'ArrowDown' || e.which == 40) {
    // down : status-1
    showRightFrames('set_test_status.php?wid=' + LWT_DATA.word.id + '&stchange=-1');
    return false;
  }
  for (let i = 0; i < 5; i++) {
    if (e.which == (49 + i) || e.which == (97 + i)) {
      // 1,.. : status=i
      showRightFrames(
        'set_test_status.php?wid=' + LWT_DATA.word.id + '&status=' + (i + 1)
      );
      return false;
    }
  }
  return true;
}

jQuery.fn.extend({
  tooltip_wsty_content: function () {
    var re = new RegExp('([' + LWT_DATA.language.delimiter + '])(?! )', 'g');
    let title = '';
    if ($(this).hasClass('mwsty')) {
      title = "<p><b style='font-size:120%'>" + $(this).attr('data_text') +
      '</b></p>';
    } else {
      title = "<p><b style='font-size:120%'>" + $(this).text() + '</b></p>';
    }
    const roman = $(this).attr('data_rom');
    let trans = $(this).attr('data_trans').replace(re, '$1 ');
    let statname = '';
    const status = parseInt($(this).attr('data_status'));
    if (status == 0)statname = 'Unknown [?]';
    else if (status < 5)statname = 'Learning [' + status + ']';
    if (status == 5)statname = 'Learned [5]';
    if (status == 98)statname = 'Ignored [Ign]';
    if (status == 99)statname = 'Well Known [WKn]';
    if (roman != '') {
      title += '<p><b>Roman.</b>: ' + roman + '</p>';
    }
    if (trans != '' && trans != '*') {
      if ($(this).attr('data_ann')) {
        const ann = $(this).attr('data_ann');
        if (ann != '' && ann != '*') {
          var re = new RegExp(
            '(.*[' + LWT_DATA.language.delimiter + '][ ]{0,1}|^)(' +
            ann.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')($|[ ]{0,1}[' +
            LWT_DATA.language.delimiter + '].*$| \\[.*$)',
            ''
          );
          trans = trans.replace(re, '$1<span style="color:red">$2</span>$3');
        }
      }
      title += '<p><b>Transl.</b>: ' + trans + '</p>';
    }
    title += '<p><b>Status</b>: <span class="status' + status + '">' + statname +
    '</span></p>';
    return title;
  }
});

jQuery.fn.extend({
	 tooltip_wsty_init: function () {
		 $(this).tooltip({
		      position: { my: 'left top+10', at: 'left bottom', collision: 'flipfit' },
		      items: '.hword',
		      show: { easing: 'easeOutCirc' },
		      content: function () { return $(this).tooltip_wsty_content(); }
    });
	 }
});

function get_position_from_id (id_string) {
  if ((typeof id_string) === 'undefined') return -1;
  const arr = id_string.split('-');
  return parseInt(arr[1]) * 10 + 10 - parseInt(arr[2]);
}

/**
 * Save a setting to the database.
 *
 * @param {string} k Setting name as a key
 * @param {string} v Setting value
 */
function do_ajax_save_setting (k, v) {
  $.post(
    'api.php/v1/settings',
    {
      key: k,
      value: v
    }
  );
}

/**
 * Assign the display value of a select element to the value element of another input.
 *
 * @param {elem} select_elem
 * @param {elem} input_elem
 */
function quick_select_to_input (select_elem, input_elem) {
  const val = select_elem.options[select_elem.selectedIndex].value;
  if (val != '') { input_elem.value = val; }
  select_elem.value = '';
}

/**
 * Return an HTML group of options to add to a select field.
 *
 * @param {string[]} paths     All paths (files and folders)
 * @param {string[]} folders   Folders paths, should be a subset of paths
 * @param {string}   base_path Base path for LWT to append
 *
 * @returns {HTMLOptionElement[]} List of options to append to the select.
 *
 * @since 2.9.1-fork Base path is no longer used
 */
function select_media_path (paths, folders, base_path) {
  const options = []; let temp_option = document.createElement('option');
  temp_option.value = '';
  temp_option.text = '[Choose...]';
  options.push(temp_option);
  for (let i = 0; i < paths.length; i++) {
    temp_option = document.createElement('option')
    if (folders.includes(paths[i])) {
      temp_option.setAttribute('disabled', 'disabled');
      temp_option.text = '-- Directory: ' + paths[i] + '--';
    } else {
      temp_option.value = paths[i];
      temp_option.text = paths[i];
    }
    options.push(temp_option);
  }
  return options;
}

/**
 * Process the received data from media selection query
 *
 * @param {Object} data Received data as a JSON object
 */
function media_select_receive_data (data) {
  $('#mediaSelectLoadingImg').css('display', 'none');
  if (data.error !== undefined) {
    let msg;
    if (data.error == 'not_a_directory') {
      msg = '[Error: "../' + data.base_path + '/media" exists, but it is not a directory.]';
    } else if (data.error == 'does_not_exist') {
      msg = '[Directory "../' + data.base_path + '/media" does not yet exist.]';
    } else {
      msg = '[Unknown error!]';
    }
    $('#mediaSelectErrorMessage').text(msg);
    $('#mediaSelectErrorMessage').css('display', 'inherit');
  } else {
    const options = select_media_path(data.paths, data.folders, data.base_path);
    $('#mediaselect select').empty();
    for (let i = 0; i < options.length; i++) {
      $('#mediaselect select').append(options[i]);
    }
    $('#mediaselect select').css('display', 'inherit');
  }
}

/**
 * Perform an AJAX query to retrieve and display the media files path.
 */
function do_ajax_update_media_select (id) {
  $('#mediaSelectErrorMessage').css("display", "none");
  $('#mediaselect select').css("display", "none");
  $('#mediaSelectLoadingImg').css("display", "inherit");
  $.getJSON(
    'api.php/v1/media-files',
    {
      id: "-1"
    },
    media_select_receive_data
  );
}

/**
 * Process the received data from subtitles query
 * 
 * @param {Object} data Received data as a JSON object 
 */
function subtitles_receive_data(data) {
  $('#subtitlesLoadingImg').css("display", "none");

  $('#TxText').val(data["subtitles"]);
  if (data["error"] !== null) {
  
      msg = data["error"];
    
    $('#subtitlesErrorMessage').text(msg);
    $('#subtitlesErrorMessage').css("display", "inherit");
  }

}
/**
 * Perform an AJAX query to retrieve subtitles.
 */
function do_ajax_update_subtitles () {
  $('#subtitlesErrorMessage').css("display", "none");
  $('#subtitlesLoadingImg').css("display", "inherit");

  uri = $('[name="TxAudioURI"]').val();
  lang_id = $("#TxLgID").val()
  $.ajax({
    url: 'api.php/v1/subtitles',
    dataType: 'json',
    data:{
      lang_id: lang_id,
      uri:uri
    },
    success: function( data,status,xhr ) {
          subtitles_receive_data(data)
    }
    ,
    error: function(xhr,status, error ) {
      data = {
        "subtitles":"",
        "error": error
        }
      subtitles_receive_data(data)

    }
  });
}

/**
 * Prepare am HTML element that formats the sentences
 *
 * @param {JSON}   sentences    A list of sentences to display.
 * @param {string} click_target The selector for the element that should change value on click
 * @param {string} second_click_target The selector for the element that should change value on click
 * @returns {HTMLElement} A formatted group of sentences
 */
function display_example_sentences (sentences, click_target,second_click_target) {
  let img, clickable, parentDiv;
  const outElement = document.createElement('div');
  for (let i = 0; i < sentences.length; i++) {
    // Add the checbox
    img = document.createElement('img');
    img.src = 'icn/tick-button.png';
    img.title = 'Choose';
    // Clickable element
    clickable = document.createElement('span');
    clickable.classList.add('click');
    // Doesn't feel the right way to do it
    clickable.setAttribute(
      'onclick',
      '{' + click_target + ".value = '" + sentences[i]['sentence'][1].replaceAll("'", "\\'") +
      "';"+second_click_target+".value = '" + sentences[i]['SeID'] +"';"+ "lwtFormCheck.makeDirty();}"
    );
    clickable.appendChild(img);
    // Create parent
    parentDiv = document.createElement('div');
    parentDiv.appendChild(clickable);
    parentDiv.innerHTML += '&nbsp; ' + sentences[i]['sentence'][0];
    // Add to the output
    outElement.appendChild(parentDiv);
  }
  return outElement;
}

/**
 * Prepare am HTML element that formats the sentences
 *
 * @param {JSON}   sentences    {{sentences-A list of sentences to display., SeID -sentence ID}}
 * @param {string} click_target The selector for the element that should change value on click
 * @param {string} second_click_target The second selector for the element that should change value on click
 * @returns {HTMLElement} A formatted group of sentences
 */
function change_example_sentences_zone (sentences, ctl,second_ctl) {
  $('#exsent-waiting').css('display', 'none');
  $('#exsent-sentences').css('display', 'inherit');
  const new_element = display_example_sentences(sentences, ctl,second_ctl);
  $('#exsent-sentences').append(new_element);
}

/**
 * Get and display the sentences containing specific word.
 *
 * @param {int}    lang Language ID
 * @param {string} word Term text (the looked for term)
 * @param {string} ctl  Selector for the element to edit on click
 * @param {string} secondCtl  Second selector for the element to edit on click
 * @param {int}    woid Term id (word or multi-word)
 * @returns {undefined}
 */
function do_ajax_show_sentences (lang, word, ctl, secondCtl, woid) {
  $('#exsent-interactable').css('display', 'none');
  $('#exsent-waiting').css('display', 'inherit');

  if (isInt(woid) && woid != -1) {
    $.getJSON(
      'api.php/v1/sentences-with-term/' + woid,
      {
        lg_id: lang,
        word_lc: word
      },
      (data) => change_example_sentences_zone(data, ctl,secondCtl)
    );
  } else {
    const query = {
      lg_id: lang,
      word_lc: word
    };
    if (parseInt(woid, 10) == -1) {
      query.advanced_search = true;
    }
    $.getJSON(
      'api.php/v1/sentences-with-term',
      query,
      (data) => change_example_sentences_zone(data, ctl,secondCtl)
    );
  }
}

/**
 * Send an AJAX request to get similar terms to a term.
 *
 * @param {number} lg_id Language ID
 * @param {string} word_text Text to match
 * @returns {JSON} Request used
 */
function do_ajax_req_sim_terms (lg_id, word_text) {
  return $.getJSON(
    'api.php/v1/similar-terms',
    {
      "lg_id": lg_id,
      "term": word_text
    }
  );
}

/**
 * Display the terms similar to a specific term with AJAX.
 */
function do_ajax_show_similar_terms () {
  $('#simwords').html('<img src="icn/waiting2.gif" />');
  do_ajax_req_sim_terms(
    parseInt($('#langfield').val(), 10), $('#wordfield').val()
  )
    .done(
      function (data) {
        $('#simwords').html(data.similar_terms);
      }
    ).fail(
      function (data) {
        console.log(data);
      }
    );
}

/**
 * Update WORDCOUNTS in with an AJAX request.
 *
 * @returns {undefined}
 */
function do_ajax_word_counts () {
  const t = $('.markcheck').map(function () {
    return $(this).val();
  })
    .get().join(',');
  $.getJSON(
    'api.php/v1/texts/statistics',
    {
      texts_id: t
    },
    function (data) {
      WORDCOUNTS = data;
      word_count_click();
      $('.barchart').removeClass('hide');
    }
  );
}

/**
 * Set a unique item in barchart to reflect how many words are known.
 *
 * @returns {undefined}
 */
function set_barchart_item () {
  const id = $(this).find('span').first().attr('id').split('_')[2];
  /** @var {int} v Number of terms in the text */
  let v;
  if (SUW & 16) {
    v = parseInt(WORDCOUNTS.expru[id] || 0, 10) +
    parseInt(WORDCOUNTS.totalu[id], 10);
  } else {
    v = parseInt(WORDCOUNTS.expr[id] || 0, 10) +
    parseInt(WORDCOUNTS.total[id], 10);
  }
  $(this).children('li').each(function () {
    /** {number} Word count in the category */
    let cat_word_count = parseInt($(this).children('span').text(), 10);
    /*
    Linear version
		const h = (v - $(this).children('span').text()) * 25 / v;
    */
    /*
    Logarithmic version
    (25 / v) is vocab per pixel
    log scale so the size scaled becomes Math.log(($(this).children('span').text()))
    so the total height corresponding to text vocab after scaling should be
    Math.log(v) the proportion of column height to box height is thus
    (Math.log(($(this).children('span').text())) / Math.log(v))
    putting this back in pixel, we get
    (Math.log(($(this).children('span').text())) / Math.log(v)) * 25
    should be the column height
    so (25 - (Math.log(($(this).children('span').text())) / Math.log(v)) * 25)
    is the intended border top size.
    */
    // Avoid to put 0 in logarithm
    cat_word_count += 1;
    v += 1;
    const h = 25 - Math.log(cat_word_count) / Math.log(v) * 25;
    $(this).css('border-top-width', h + 'px');
  });
}

/**
 * Set the number of words known in a text (in edit_texts.php main page).
 *
 * @returns {undefined}
 */
function set_word_counts () {
  $.each(WORDCOUNTS.totalu, function (key, value) {
    let knownu, known, todo, stat0;
    knownu = known = todo = stat0 = 0;
    const expr = WORDCOUNTS.expru[key] ? parseInt((SUW & 2) ? WORDCOUNTS.expru[key] : WORDCOUNTS.expr[key]) : 0;
    if (!WORDCOUNTS.stat[key]) {
      WORDCOUNTS.statu[key] = WORDCOUNTS.stat[key] = [];
    }
    $('#total_' + key).html((SUW & 1 ? value : WORDCOUNTS.total[key]));
    $.each(WORDCOUNTS.statu[key], function (k, v) {
      if (SUW & 8) { $('#stat_' + k + '_' + key).html(v); }
      knownu += parseInt(v);
    });
    $.each(WORDCOUNTS.stat[key], function (k, v) {
      if (!(SUW & 8)) { $('#stat_' + k + '_' + key).html(v); }
      known += parseInt(v);
    });
    $('#saved_' + key).html(known ? ((SUW & 2 ? knownu : known) - expr + '+' + expr) : 0);
    if (SUW & 4) {
      todo = parseInt(value) + parseInt(WORDCOUNTS.expru[key] || 0) - parseInt(knownu);
    } else {
      todo = parseInt(WORDCOUNTS.total[key]) + parseInt(WORDCOUNTS.expr[key] || 0) - parseInt(known);
    }
    $('#todo_' + key).html(todo);

    // added unknown percent
    if (SUW & 8) {
      unknowncount = parseInt(value) + parseInt(WORDCOUNTS.expru[key] || 0) - parseInt(knownu);
      unknownpercent = Math.round(unknowncount * 10000 / (knownu + unknowncount)) / 100;
    } else {
      unknowncount = parseInt(WORDCOUNTS.total[key]) + parseInt(WORDCOUNTS.expr[key] || 0) - parseInt(known);
      unknownpercent = Math.round(unknowncount * 10000 / (known + unknowncount)) / 100;
    }
    $('#unknownpercent_' + key).html(unknownpercent == 0 ? 0 : unknownpercent.toFixed(2));
    // end here

    if (SUW & 16) {
      stat0 = parseInt(value) + parseInt(WORDCOUNTS.expru[key] || 0) - parseInt(knownu);
    } else {
      stat0 = parseInt(WORDCOUNTS.total[key]) + parseInt(WORDCOUNTS.expr[key] || 0) - parseInt(known);
    }
    $('#stat_0_' + key).html(stat0);
  });
  $('.barchart').each(set_barchart_item);
}

/**
 * Handle the click event to switch between total and
 * unique words count in edit_texts.php.
 *
 * @returns {undefined}
 */
function word_count_click () {
  $('.wc_cont').children().each(function () {
    if (parseInt($(this).attr('data_wo_cnt')) == 1) {
      $(this).html('u');
    } else {
      $(this).html('t');
    }
    SUW = (parseInt($('#chart').attr('data_wo_cnt')) << 4) +
    (parseInt($('#unknownpercent').attr('data_wo_cnt')) << 3) +
    (parseInt($('#unknown').attr('data_wo_cnt')) << 2) +
    (parseInt($('#saved').attr('data_wo_cnt')) << 1) +
    (parseInt($('#total').attr('data_wo_cnt')));
    set_word_counts();
  });
}

/**
 * Create a radio button with a candidate choice for a term annotation.
 *
 * @param {string} curr_trans Current anotation (translation) set for the term
 * @param {string} trans_data All the useful data for the term
 * @returns {string} An HTML-formatted option
 */
function translation_radio (curr_trans, trans_data) {
  if (trans_data.wid === null) {
    return '';
  }
  const trim_trans = curr_trans.trim();
  if (trim_trans == '*' || trim_trans == '') {
    return '';
  }
  const set = trim_trans == trans_data.trans;
  const option = `<span class="nowrap">
    <input class="impr-ann-radio" ` +
      (set ? 'checked="checked" ' : '') + 'type="radio" name="rg' +
      trans_data.ann_index + '" value="' + escape_html_chars(trim_trans) + `" /> 
          &nbsp; ` + escape_html_chars(trim_trans) + `
  </span>
  <br />`;
  return option;
}

/**
 * When a term translation is edited, recreate it's annotations.
 *
 * @param {Object} trans_data Useful data for this term
 * @param {int}    text_id    Text ID
 */
function edit_term_ann_translations (trans_data, text_id) {
  const widset = trans_data.wid !== null;
  // First create a link to edit the word in a new window
  let edit_word_link;
  if (widset) {
    const req_arg = $.param({
      fromAnn: '$(document).scrollTop()',
      wid: trans_data.wid,
      ord: trans_data.term_ord,
      tid: text_id
    })
    edit_word_link = `<a name="rec${trans_data.ann_index}"></a>
    <span class="click"
    onclick="oewin('edit_word.php?` + escape_html_chars(req_arg) + `');">
          <img src="icn/sticky-note--pencil.png" title="Edit Term" alt="Edit Term" />
      </span>`;
  } else {
    edit_word_link = '&nbsp;';
  }
  $(`#editlink${trans_data.ann_index}`).html(edit_word_link);
  // Now edit translations (if necessary)
  let translations_list = '';
  trans_data.translations.forEach(
    function (candidate_trans) {
      translations_list += translation_radio(candidate_trans, trans_data);
    }
  );

  const select_last = trans_data.translations.length == 0;
  // Empty radio button and text field after the list of translations
  translations_list += `<span class="nowrap">
  <input class="impr-ann-radio" type="radio" name="rg${trans_data.ann_index}" ` +
  (select_last ? 'checked="checked" ' : '') + `value="" />
  &nbsp;
  <input class="impr-ann-text" type="text" name="tx${trans_data.ann_index}` +
    `" id="tx${trans_data.ann_index}" value="` +
    (select_last ? escape_html_chars(curr_trans) : '') +
  `" maxlength="50" size="40" />
   &nbsp;
  <img class="click" src="icn/eraser.png" title="Erase Text Field" 
  alt="Erase Text Field" 
  onclick="$('#tx${trans_data.ann_index}').val('').trigger('change');" />
    &nbsp;
  <img class="click" src="icn/star.png" title="* (Set to Term)" 
  alt="* (Set to Term)" 
  onclick="$('#tx${trans_data.ann_index}').val('*').trigger('change');" />
  &nbsp;`;
  // Add the "plus button" to add a translation
  if (widset) {
    translations_list +=
    `<img class="click" src="icn/plus-button.png" 
    title="Save another translation to existent term" 
    alt="Save another translation to existent term" 
    onclick="updateTermTranslation(${trans_data.wid}, ` +
      `'#tx${trans_data.ann_index}');" />`;
  } else {
    translations_list +=
    `<img class="click" src="icn/plus-button.png" 
    title="Save translation to new term" 
    alt="Save translation to new term" 
    onclick="addTermTranslation('#tx${trans_data.ann_index}',` +
      `${trans_data.term_lc},${trans_data.lang_id});" />`;
  }
  translations_list += `&nbsp;&nbsp;
  <span id="wait${trans_data.ann_index}">
      <img src="icn/empty.gif" />
  </span>
  </span>`;
  $(`#transsel${trans_data.ann_index}`).html(translations_list);
}

/**
 * Load the possible translations for a word.
 *
 * @param {int}    pagepos Position to scroll to
 * @param {string} word    Word in lowercase to get annotations
 * @param {int}    term_id Term ID
 *
 * @since 2.9.0 The new parameter $wid is now necessary
 */
function do_ajax_edit_impr_text (pagepos, word, term_id) {
  // Special case, on empty word reload the main annotations form
  if (word == '') {
    $('#editimprtextdata').html('<img src="icn/waiting2.gif" />');
    location.reload();
    return;
  }
  // Load the possible translations for a word
  const textid = $('#editimprtextdata').attr('data_id');
  $.getJSON(
    'api.php/v1/terms/' + term_id + '/translations',
    {
      text_id: textid,
      term_lc: word
    },
    function (data) {
      if ('error' in data) {
        alert(data.error);
      } else {
        edit_term_ann_translations(data, textid);
        $.scrollTo(pagepos);
        $('input.impr-ann-text').on('change', changeImprAnnText);
        $('input.impr-ann-radio').on('change', changeImprAnnRadio);
      }
    }
  );
}

/**
 * Show the right frames if found, and can load an URL in those frames
 *
 * @param {string|undefined} roUrl Upper-right frame URL to laod
 * @param {string|undefined} ruUrl Lower-right frame URL to load
 * @returns {boolean} true if frames were found, false otherwise
 */
function showRightFrames (roUrl, ruUrl) {
  if (roUrl !== undefined) {
    top.frames.ro.location.href = roUrl;
  }
  if (ruUrl !== undefined) {
    top.frames.ru.location.href = ruUrl;
  }
  if ($('#frames-r').length) {
   // $('#frames-r').animate({right: '5px'});
    return true;
  }
  return false;
}

/**
 * Hide the right frames if found.
 *
 * @returns {boolean} true if frames were found, false otherwise
 */
function hideRightFrames () {
  if ($('#frames-r').length) {
    $('#frames-r').animate({ right: '-100%' });
    return true;
  }
  return false;
}

/**
 * Hide the right frame and any popups.
 *
 * Called from several places: insert_word_ignore.php,
 * set_word_status.php, delete_word.php, etc.
 *
 * @returns {undefined}
 */
function cleanupRightFrames () {
  // A very annoying hack to get right frames to hide correctly.
  // Calling hideRightFrames directly in window.parent.setTimeout
  // does  //not work* for some reason ... when called that way,
  // in hideRightFrames $('#frames-r').length is always 0.  I'm not
  // sure why.  Using the mytimeout method lets the js find the
  // element at runtime, and then it's clicked, invoking the function
  // hideRightFrames, which then works.
  //
  // We have to use an anon function to ensure that the frames-r
  // gets resolved when the timeout fires.
  const mytimeout = function () {
    const rf = window.parent.document.getElementById('frames-r');
    rf.click();
  }
  window.parent.setTimeout(mytimeout, 800);

  window.parent.document.getElementById('frame-l').focus();
  window.parent.setTimeout(window.parent.cClick, 100);
}

/**
 * Play the success sound.
 *
 * @returns {object} Promise on the status of sound
 */
function successSound () {
  document.getElementById('success_sound').pause();
  document.getElementById('failure_sound').pause();
  return document.getElementById('success_sound').play();
}

/**
 * Play the failure sound.
 *
 * @returns {object} Promise on the status of sound
 */
function failureSound () {
  document.getElementById('success_sound').pause();
  document.getElementById('failure_sound').pause();
  return document.getElementById('failure_sound').play();
}

const lwt = {

  /**
   * Prepare the action so that a click switches between
   * unique word count and total word count.
   *
   * @returns {undefined}
   */
  prepare_word_count_click: function () {
    $('#total,#saved,#unknown,#chart,#unknownpercent')
      .on('click', function (event) {
        $(this).attr('data_wo_cnt', parseInt($(this).attr('data_wo_cnt')) ^ 1);
        word_count_click();
        event.stopImmediatePropagation();
      }).attr('title', 'u: Unique Word Counts\nt: Total  Word  Counts');
    do_ajax_word_counts();
  },

  /**
   * Save the settings about unique/total words count.
   *
   * @returns {undefined}
   */
  save_text_word_count_settings: function () {
    if (SUW == SHOWUNIQUE) {
      return;
    }
    const a = $('#total').attr('data_wo_cnt') +
      $('#saved').attr('data_wo_cnt') +
      $('#unknown').attr('data_wo_cnt') +
      $('#unknownpercent').attr('data_wo_cnt') +
      $('#chart').attr('data_wo_cnt');
    do_ajax_save_setting('set-show-text-word-counts', a);
  }
}

// Present data in a handy way, for instance in a form
$.fn.serializeObject = function () {
  const o = {};
  const a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

/**
 * Wrap the radio buttons into stylised elements.
 */
function wrapRadioButtons () {
  $(
    ':input,.wrap_checkbox span,.wrap_radio span,a:not([name^=rec]),select,' +
    '#mediaselect span.click,#forwbutt,#backbutt'
  ).each(function (i) { $(this).attr('tabindex', i + 1); });
  $('.wrap_radio span').on('keydown', function (e) {
    if (e.keyCode == 32) {
      $(this).parent().parent().find('input[type=radio]').trigger('click');
      return false;
    }
  });
}

/**
 * Do a lot of different DOM manipulations
 */
function prepareMainAreas () {
  $('.edit_area').editable('inline_edit.php',
    {
      type: 'textarea',
      indicator: '<img src="icn/indicator.gif">',
      tooltip: 'Click to edit...',
      submit: 'Save',
      cancel: 'Cancel',
      rows: 3,
      cols: 35
    }
  );
  $('select').wrap("<label class='wrap_select'></label>");
  $('form').attr('autocomplete', 'off');
  $('input[type="file"]').each(function () {
    if (!$(this).is(':visible')) {
      $(this).before('<button class="button-file">Choose File</button>')
			 .after('<span style="position:relative" class="fakefile"></span>')
			 .on('change', function () {
          let txt = this.value.replace('C:\\fakepath\\', '');
          if (txt.length > 85)txt = txt.replace(/.*(.{80})$/, ' ... $1');
          $(this).next().text(txt);
			 })
			 .on('onmouseout', function () {
          let txt = this.value.replace('C:\\fakepath\\', '');
          if (txt.length > 85)txt = txt.replace(/.*(.{80})$/, ' ... $1');
          $(this).next().text(txt);
			 });
    }
  });
  $('input[type="checkbox"]').each(function (z) {
    if (typeof z === 'undefined')z = 1;
    if (typeof $(this).attr('id') === 'undefined') {
      $(this).attr('id', 'cb_' + z++);
    }
    $(this).after(
      '<label class="wrap_checkbox" for="' + $(this).attr('id') +
      '"><span></span></label>'
    );
  });
  $('span[class*="tts_"]').on('click', function () {
    const lg = $(this).attr('class').replace(/.*tts_([a-zA-Z-]+).*/, '$1');
    const txt = $(this).text();
    readRawTextAloud(txt, lg);
  });
  $(document).on('mouseup', function () {
    $('button,input[type=button],.wrap_radio span,.wrap_checkbox span')
      .trigger('blur');
  });
  $('.wrap_checkbox span').on('keydown', function (e) {
    if (e.keyCode == 32) {
      $(this).parent().parent().find('input[type=checkbox]').trigger('click');
      return false;
    }
  });
  $('input[type="radio"]').each(function (z) {
    if (z === undefined) {
      z = 1;
    }
    if (typeof $(this).attr('id') === 'undefined') {
      $(this).attr('id', 'rb_' + z++);
    }
    $(this).after(
      '<label class="wrap_radio" for="' + $(this).attr('id') +
      '"><span></span></label>'
    );
  });
  $('.button-file').on('click', function () {
    $(this).next('input[type="file"]').trigger('click');
    return false;
  });
  $('input.impr-ann-text').on('change', changeImprAnnText);
  $('input.impr-ann-radio').on('change', changeImprAnnRadio);
  $('form.validate').on('submit', check);
  $('input.markcheck').on('click', markClick);
  $('.confirmdelete').on('click', confirmDelete);
  $('textarea.textarea-noreturn').on('keydown', textareaKeydown);
  // Resizable from right frames
  $('#frames-r').resizable({
    handles: 'w',
    stop: function (_event, ui) {
      // Resize left frames
      $('#frames-l').css('width', ui.position.left);
      // Save settings
      do_ajax_save_setting(
        'set-text-l-framewidth-percent',
        Math.round($('#frames-l').width() / $(window).width() * 100)
      );
    }
  });
  $('#termtags').tagit(
    {
      beforeTagAdded: function (_event, ui) {
        return !containsCharacterOutsideBasicMultilingualPlane(ui.tag.text());
      },
      availableTags: TAGS,
      fieldName: 'TermTags[TagList][]'
    }
  );
  $('#texttags').tagit(
    {
      beforeTagAdded: function (_event, ui) {
        return !containsCharacterOutsideBasicMultilingualPlane(ui.tag.text());
      },
      availableTags: TEXTTAGS,
      fieldName: 'TextTags[TagList][]'
    }
  );
  markClick();
  setTheFocus();
  if (
    $('#simwords').length > 0 && $('#langfield').length > 0 &&
    $('#wordfield').length > 0
  ) {
  	$('#wordfield').on('blur', do_ajax_show_similar_terms);
  	do_ajax_show_similar_terms();
  }
  window.setTimeout(noShowAfter3Secs, 3000);
}

$(window).on('load', wrapRadioButtons);

$(document).ready(prepareMainAreas);
