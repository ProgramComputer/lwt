<?php

/**
 * \file
 * \brief Show test frame
 *
 * Call: do_test_test.php?type=[testtype]&lang=[langid]
 * Call: do_test_test.php?type=[testtype]&text=[textid]
 * Call: do_test_test.php?type=[testtype]&selection=1
 *          (SQL via $_SESSION['testsql'])
 *
 * PHP version 8.1
 *
 * @package Lwt
 * @author  LWT Project <lwt-project@hotmail.com>
 * @license Unlicense <http://unlicense.org/>
 * @link    https://hugofara.github.io/lwt/docs/php/files/do-test-test.html
 * @since   1.0.3
 */

require_once 'inc/session_utility.php';
require_once 'inc/langdefs.php';

/**
 * Get the SQL string to perform tests.
 *
 * @param int|null   $selection    Test is of type selection
 * @param string|null $sess_testsql SQL string for test
 * @param int|null    $lang         Test is of type language, for the language $lang ID
 * @param int|null    $text         Testing text with ID $text
 *
 * @return (int|int[]|string)[] Test identifier as an array(key, value)
 *
 * @psalm-return list{string, int|non-empty-list<int>|string}
 */
function do_test_get_identifier($selection, $sess_testsql, $lang, $text): array
{
    if (isset($selection) && isset($sess_testsql)) {
        $data_string_array = explode(",", trim($sess_testsql, "()"));
        $data_int_array = array_map('intval', $data_string_array);
        switch ((int)$selection) {
            case 2:
                return array('words', $data_int_array);
                break;
            case 3:
                return array('texts', $data_int_array);
                break;
            default:
                // Deprecated behavior in 2.9.0, to be removed on 3.0.0
                $test_sql = $sess_testsql;
                $cntlang = get_first_value(
                    "SELECT COUNT(DISTINCT WoLgID) AS value 
                    FROM $test_sql"
                );
                if ($cntlang > 1) {
                    echo "<p>Sorry - The selected terms are in $cntlang languages," .
                    " but tests are only possible in one language at a time.</p>";
                    exit();
                }
                return array('raw_sql', $test_sql);
                break;
        }
    } elseif (isset($lang) && is_numeric($lang)) {
        return array("lang", $lang);
    }
    if (isset($text) && is_numeric($text)) {
        return array("text", $text);
    }
    my_die("do_test_test.php called with wrong parameters");
}

/**
 * Get the SQL string to perform tests.
 *
 * @param bool|null   $selection    Test is of type selection
 * @param string|null $sess_testsql SQL string for test
 * @param int|null    $lang         Test is of type language, for the language $lang ID
 * @param int|null    $text         Testing text with ID $text
 *
 * @return string SQL projection (selection) string
 */
function do_test_get_test_sql($selection, $sess_testsql, $lang, $text)
{
    $identifier = do_test_get_identifier($selection, $sess_testsql, $lang, $text);
    $testsql = do_test_test_get_projection($identifier[0], $identifier[1]);
    return $testsql;
}

/**
 * Get the test type clamped between 1 and 5 (included)
 *
 * @param int $testype Initial test type value
 *
 * @return int Clamped $testtype
 *                     - 1: Test type is ..[L2]..
 *                     - 2: Test type is ..[L1]..
 *                     - 3: Test type is ..[..]..
 *                     - 4: Test type is [L2]
 *                     - 5: Test type is [L1]
 */
function do_test_get_test_type($testtype)
{
    if ($testtype < 1) {
        $testtype = 1;
    }
    if ($testtype > 5) {
        $testtype = 5;
    }
    return $testtype;
}

/**
 * Set sql request for the word test.
 *
 * @return string SQL request string
 *
 * @global string $tbpref
 *
 * @deprecated 2.9.0-fork Use do_test_get_sql instead
 */
function get_test_sql()
{
    return do_test_get_test_sql(
        $_REQUEST['selection'],
        $_SESSION['testsql'],
        $_REQUEST['lang'],
        $_REQUEST['text']
    );
}

/**
 * Give the test type.
 *
 * @return int<1, 5> Test type between 1 and 5 (included)
 *
 * @deprecated 2.9.0-fork Use do_test_get_test_type instead.
 */
function get_test_type()
{
    return do_test_get_test_type((int) getreq('type'));
}

/**
 * Prepare the css code for tests.
 *
 * @deprecated 2.6.0-fork Do not use this function since it was causing wrong
 *                        display. Will be removed in 3.0.0.
 *
 * @return void
 */
function do_test_test_css()
{
    ?>
    <style type="text/css">
        html,
        body {
            width: 100%;
            height: 100%;
        }
    </style>
    <?php
}

/**
 * Return the number of test due for tomorrow.
 *
 * @param string $testsql Test selection string
 *
 * @return int Tomorrow tests
 */
function do_test_get_tomorrow_tests_count($testsql): int
{
    return (int) get_first_value(
        "SELECT COUNT(DISTINCT WoID) AS value 
        FROM $testsql AND WoStatus BETWEEN 1 AND 5 
        AND WoTranslation != '' AND WoTranslation != '*' AND WoTomorrowScore < 0"
    );
}

/**
 * Output a message for a finished test, with the number of tests for tomorrow.
 *
 * @param string $testsql    Query used to select words.
 * @param int    $totaltests Total number of tests.
 * @param bool   $ajax       AJAX mode, content will not be displayed.
 *
 * @return void
 */
function do_test_test_finished($testsql, $totaltests, $ajax = false)
{
    $tomorrow_tests = do_test_get_tomorrow_tests_count($testsql);
    echo '<p id="test-finished-area" class="center" style="display: ' .
    ($ajax ? 'none' : 'inherit') . ';">
            <img src="img/ok.png" alt="Done!" />
            <br /><br />
            <span class="red2">
                <span id="tests-done-today">
                    Nothing ' . ($totaltests ? 'more ' : '') . 'to test here!
                </span>
                <br /><br />
                <span id="tests-tomorrow"">
                    Tomorrow you\'ll find here ' . $tomorrow_tests . ' test' .
                    ($tomorrow_tests == 1 ? '' : 's') . '!
                </span>
            </span>
        </p>
    </div>';
}

/**
 * Get a sentence containing the word.
 *
 * The sentence should contain at least 70% of known words.
 *
 * @param int    $wid    The word to test.
 * @param mixed  $lang   ID of the language, will be removed in PHP 3.0.0
 * @param string $wordlc Word in lowercase
 *
 * @global string $tbpref Table prefix
 * @global int    $debug  Echo the passage number if 1. 
 * 
 * @return array{0: string|null, 1: int,2:int,3:int,4:int} Sentence with escaped word and not a 0 if sentence was found.
 *                                                   2 -SeStartSec,3 - SeEndSec, 4 - SeTxID
 * 
 * @since 2.5.3-fork Properly return sentences with at least 70% of known words.
 *                   Previously, it was supposed to be 100%, but buggy.
 *
 * @psalm-return list{null|string, 0|1}
 */
function do_test_test_sentence($wid, $lang, $wordlc): array
{
    global $debug, $tbpref;
    $num = 0;
    $sent = null;
    $seStartSec = 0;
    $seEndSec = 0;
    $seTxID = -1;


    // Select sentences where at least 70 % of words are known
    $sql = "SELECT DISTINCT ti.Ti2SeID AS SeID
    FROM {$tbpref}textitems2 ti
    JOIN (
      SELECT t.Ti2SeID, COUNT(*) AS c
      FROM {$tbpref}textitems2 t
      WHERE t.Ti2WordCount = 1
      GROUP BY t.Ti2SeID
    ) AS sWordCount ON sWordCount.Ti2SeID = ti.Ti2SeID
    LEFT JOIN (
      SELECT t.Ti2SeID, COUNT(*) AS c
      FROM {$tbpref}textitems2 t
      WHERE t.Ti2WordCount = 1 AND t.Ti2WoID = 0
      GROUP BY t.Ti2SeID
    ) AS sUnknownCount ON sUnknownCount.Ti2SeID = ti.Ti2SeID
    WHERE ti.Ti2WoID = $wid
    AND IFNULL(sUnknownCount.c, 0) / sWordCount.c < 0.3
    ORDER BY RAND() LIMIT 1";
    $res = do_mysqli_query($sql);
    $record = mysqli_fetch_assoc($res);
    // If sentence found
    if ($record) {
        $num = 1;
        $seid = $record['SeID'];
        $sql2 = "Select SeStartSec, SeEndSec,SeTxID from {$tbpref}sentences where SeID = " . convert_string_to_sqlsyntax_nonull($seid) .'limit 1;';
        $res2 = do_mysqli_query($sql2);
        $record2 = mysqli_fetch_assoc($res2);
        $seStartSec = $record2['SeStartSec']/1000;
        $seEndSec = $record2['SeEndSec']/1000;
        $seTxID = $record2['SeTxID'];
        

        mysqli_free_result($res2);

        list($_, $sent) = getSentence(
            $seid,
            $wordlc,
            (int) getSettingWithDefault('set-test-sentence-count')
        );
        if ($debug) {
            echo "DEBUG sent: $seid OK: $sent <br />";
        }
    } else {
        if ($debug) {
            echo "DEBUG no random sent found<br />";
        }
    }
    mysqli_free_result($res);

    return array($sent, $num, $seStartSec, $seEndSec,$seTxID);
}

/**
 * Return the test relative to a word.
 *
 * @param array    $wo_record Query from the database regarding a word.
 * @param string   $sent      Sentence containing the word.
 * @param int      $testtype  Type of test
 * @param bool|int $nosent    1 or true if you want to hide sentences.
 * @param string   $regexword Regex to select the desired word.
 *
 * @return string[] HTML-escaped and raw text sentences (or word)
 *
 * @psalm-return list{string, string}
 */
function do_test_get_term_test($wo_record, $sent, $testtype, $nosent, $regexword): array
{
    $wid = $wo_record['WoID'];
    $word = $wo_record['WoText'];
    $trans = repl_tab_nl($wo_record['WoTranslation']) .
    getWordTagList($wid, ' ', 1, 0);
    $roman = $wo_record['WoRomanization'];
    $status = $wo_record['WoStatus'];

    $cleansent = trim(str_replace("{", '', str_replace("}", '', $sent)));
    $l = mb_strlen($sent, 'utf-8');
    $r = '';
    $save = '';
    $on_word = false;

    $preppend = ' <span style="word-break:normal;" ' .
    'class="click todo todosty word wsty word'
    . $wid .
    '" data_wid="' . $wid . '" data_trans="' . tohtml($trans) .
    '" data_text="' . tohtml($word) . '" data_rom="' . tohtml($roman) .
    '" data_sent="' . tohtml($cleansent) . '" data_status="' . $status .
    '" data_todo="1"';
    if ($testtype == 3) {
        $preppend .= ' title="' . tohtml($trans) . '"';
    }
    $preppend .= '>';
    if ($testtype == 2) {
        // Show translation
        if ($nosent) {
            $preppend .= tohtml($trans);
        } else {
            $preppend .= '<span dir="ltr">[' . tohtml($trans) . ']</span>';
        }
    }

    // Go through sentence characters
    for ($i = 0; $i < $l; $i++) {
        $c = mb_substr($sent, $i, 1, 'UTF-8');
        if ($c == '}') {
            $r .= $preppend;
            if ($testtype == 3) {
                // Show word in original language in sentence
                $sentence = mask_term_in_sentence('{' . $save . '}', $regexword);
                $sentence = str_replace("{", '[', str_replace("}", ']', $sentence));
                $r .= tohtml($sentence);
            } elseif ($testtype != 2) {
                // Show word in original language, alone
                $r .= tohtml($save);
            }
            $r .= '</span> ';
            $on_word = false;
        } elseif ($c == '{') {
            $on_word = true;
            $save = '';
        } else {
            if ($on_word) {
                $save .= $c;
            } else {
                $r .= tohtml($c);
            }
        }
    }
    return array($r, $save);
}



/**
 * Echo the test relative to a word.
 *
 * @param array  $wo_record Query from the database regarding a word.
 * @param string $sent      Sentence containing the word.
 * @param int    $testtype  Type of test
 * @param int    $nosent    1 if you want to hide sentences.
 * @param string $regexword Regex to select the desired word.
 *
 * @return string HTML-escaped and raw text sentences (or word)
 */
function print_term_test($wo_record, $sent, $testtype, $nosent, $regexword): string
{
    list($word, $_) =  do_test_get_term_test(
        $wo_record,
        $sent,
        $testtype,
        $nosent,
        $regexword
    );
    return $word;
}

/**
 * Find the next word to test.
 *
 * @param string $testsql Test selection string
 *
 * @return (float|int|null|string)[] Empty array
 *
 * @psalm-return array<string, float|int|null|string>
 */
function do_test_get_word($testsql): array
{
    $pass = 0;
    while ($pass < 2) {
        $pass++;
        $sql = "SELECT DISTINCT WoID, WoText, WoTextLC, WoTranslation, 
        WoRomanization, WoSentence, WoLgID, 
        (IFNULL(WoSentence, '') NOT LIKE CONCAT('%{', WoText, '}%')) AS notvalid, 
        WoStatus, 
        DATEDIFF( NOW( ), WoStatusChanged ) AS Days, WoTodayScore AS Score 
        FROM $testsql AND WoStatus BETWEEN 1 AND 5 
        AND WoTranslation != '' AND WoTranslation != '*' AND WoTodayScore < 0 " .
        ($pass == 1 ? 'AND WoRandom > RAND()' : '') . ' 
        ORDER BY WoTodayScore, WoRandom 
        LIMIT 1';
        $res = do_mysqli_query($sql);
        $record = mysqli_fetch_assoc($res);
        if ($record) {
            return $record;
        }
        mysqli_free_result($res);
    }
    return array();
}


/**
 * Get the solution to a test.
 *
 * @param int    $testtype  Test type between 1 and 5
 * @param array  $wo_record Word record element
 * @param bool   $nosent    Test is in word mode
 * @param string $wo_text   Word text
 *
 * @return string Solution to display.
 */
function get_test_solution($testtype, $wo_record, $nosent, $wo_text)
{
    if ($testtype == 1) {
        $trans = repl_tab_nl($wo_record['WoTranslation']) .
        getWordTagList($wo_record['WoID'], ' ', 1, 0);
        return $nosent ? $trans : "[$trans]";
    }
    return $wo_text;
}


/**
 * Preforms the HTML of the test area, to update through AJAX.
 *
 * @param string    $selector   Type of test to run.
 * @param array|int $selection  Items to run the test on.
 * @param int       $totaltests Total number of tests to do.
 * @param int       $count      Number of tests left.
 * @param int       $testtype   Type of test.
 *
 * @return int Number of tests left to do.
 *
 * @global string $tbpref Table prefix
 * @global int    $debug  Show the SQL query used if 1.
 * @global string $langDefs Languages definition array
 * @psalm-return int<0, max>
 */
function do_test_prepare_ajax_test_area($selector, $selection, $count, $testtype): int
{
    global $tbpref, $langDefs;

    $nosent = false;
    if ($testtype > 3) {
        $testtype -= 3;
        $nosent = true;
    }
    $testsql = do_test_test_get_projection($selector, $selection);


    echo '<div id="body">';

    $lgid = (int) get_first_value(
        "SELECT WoLgID AS value FROM $testsql LIMIT 1"
    );

    $sql = "SELECT LgName, LgDict1URI, LgDict2URI, LgGoogleTranslateURI, LgTextSize, 
    LgRemoveSpaces, LgRegexpWordCharacters, LgRightToLeft 
    FROM {$tbpref}languages WHERE LgID =" . convert_string_to_sqlsyntax_nonull($lgid);
    $res = do_mysqli_query($sql);
    $record = mysqli_fetch_assoc($res);
    $lang = array(
        'wb1' => isset($record['LgDict1URI']) ? $record['LgDict1URI'] : "",
        'wb2' => isset($record['LgDict2URI']) ? $record['LgDict2URI'] : "",
        'wb3' => isset($record['LgGoogleTranslateURI'])?$record['LgGoogleTranslateURI']:"",
        'textsize' =>isset($record['textsize'])?$record['textsize']:"",
        'removeSpaces' =>isset($record['removeSpaces'])?$record['removeSpaces']:"" ,
        'regexword' => isset($record['regexword'])?$record['regexword']:"",
        'rtlScript' =>isset($record['rtlScript'])?$record['rtlScript']:""
    );
    mysqli_free_result($res);

    ?>
    <script type="text/javascript">
        window.onload = (event) => {
            var utterancecheckbox = document.getElementById('utterance-allowed')

            var utterancechecked = JSON.parse(localStorage.getItem('utterance-allowed'));
            utterancecheckbox.checked = utterancechecked;
            utterancecheckbox.addEventListener('change', function () {
                localStorage.setItem('utterance-allowed', utterancecheckbox.checked);
            });
        };

        var sentenceaudio = new Audio();
        /** 
         * Play audio for sentence
         */
        function playAudio() {


            var playsentence = document.getElementById('playSentence');
            var startTime = playsentence.getAttribute('data-start-time');
            var endTime = playsentence.getAttribute('data-end-time');
          // window.onload = (event) => {
            //sentenceaudio.addEventListener('canplaythrough', function () {
                // start it at the start time
                sentenceaudio.currentTime = startTime;
                sentenceaudio.play();

                // let it play to the end time and then pause
                setTimeout(function () {
                    sentenceaudio.pause()
                }, (endTime - startTime) * 1000)
          //  })
       // };
        }
        /**
         * Get a new word test.
         */
        function get_new_word()
        {
            const review_data = <?php echo json_encode(array(
                "total_tests" => $count,
                "test_key" => $selector,
                "selection" => $selection,
                "word_mode" => $nosent,
                "lg_id" => $lgid,
                "word_regex" => (string)$lang['regexword'],
                "type" => $testtype
            )); ?>;

            query_next_term(review_data);

            // Close any previous tooltip
            cClick();
        }

        $(get_new_word);
    </script>

    <p id="term-test" dir="<?php echo($lang['rtlScript'] ? 'rtl' : 'ltr'); ?>" 
    style="<?php echo($lang['removeSpaces'] ? 'word-break:break-all;' : ''); ?>
    font-size: <?php echo $lang['textsize'] ?>%; line-height: 1.4; text-align:center; margin-bottom:300px;"
    >
    </p>
    <?php do_test_test_finished($testsql, $count, true); ?>
    </div>
    <?php

    do_test_test_interaction_globals($lang['wb1'], $lang['wb2'], $lang['wb3']);

    return $count;
}


/**
 * Preforms the HTML of the test area.
 *
 * @param string $testsql    SQL query of for the words that should be tested.
 * @param int    $totaltests Total number of tests to do.
 * @param int    $count      Number of tests left.
 * @param int    $testtype   Type of test.
 *
 * @return int Number of tests left to do.
 *
 * @global string $tbpref Table prefix
 * @global int    $debug  Show the SQL query used if 1.
 *
 * @psalm-return int<0, max>
 */
function prepare_test_area($testsql, $totaltests, $count, $testtype): int
{
    global $tbpref, $debug;
    $nosent = 0;
    if ($testtype > 3) {
        $testtype -= 3;
        $nosent = 1;
    }

    echo '<div id="body">';

    if ($count <= 0) {
        do_test_test_finished($testsql, $totaltests);
        return 0;
    }

    $lang = get_first_value("SELECT WoLgID AS value FROM $testsql LIMIT 1");

    $sql = 'SELECT LgName, LgDict1URI, LgDict2URI, LgGoogleTranslateURI, LgTextSize, 
    LgRemoveSpaces, LgRegexpWordCharacters, LgRightToLeft 
    FROM ' . $tbpref . 'languages WHERE LgID = ' . $lang;
    $res = do_mysqli_query($sql);
    $record = mysqli_fetch_assoc($res);
    $wb1 = isset($record['LgDict1URI']) ? $record['LgDict1URI'] : "";
    $wb2 = isset($record['LgDict2URI']) ? $record['LgDict2URI'] : "";
    $wb3 = isset($record['LgGoogleTranslateURI']) ? $record['LgGoogleTranslateURI'] : "";
    $textsize = $record['LgTextSize'];
    $removeSpaces = $record['LgRemoveSpaces'];
    $regexword = $record['LgRegexpWordCharacters'];
    $rtlScript = $record['LgRightToLeft'];
    mysqli_free_result($res);

    // Find the next word to test

    $pass = 0;
    $num = 0;
    $notvalid = null;
    $sent = null;
    $startSec = 0;
    $endSec = 0;
    $txID = null;
    $wid = null;
    $word = null;
    $wordlc = null;
    while ($pass < 2) {
        $pass++;
        $sql = "SELECT DISTINCT WoID, WoText, WoTextLC, WoTranslation, 
        WoRomanization, WoSentence, WoLgID, 
        (IFNULL(WoSentence, '') NOT LIKE CONCAT('%{', WoText, '}%')) AS notvalid, 
        WoStatus, 
        DATEDIFF( NOW( ), WoStatusChanged ) AS Days, WoTodayScore AS Score 
        FROM $testsql AND WoStatus BETWEEN 1 AND 5 
        AND WoTranslation != '' AND WoTranslation != '*' AND WoTodayScore < 0 " .
        ($pass == 1 ? 'AND WoRandom > RAND()' : '') . ' 
        ORDER BY WoTodayScore, WoRandom 
        LIMIT 1';
        if ($debug) {
            echo 'DEBUG TEST-SQL: ' . $sql . '<br />';
        }
        $res = do_mysqli_query($sql);
        $record = mysqli_fetch_assoc($res);
        if ($record) {
            $num = 1;
            $wid = $record['WoID'];
            $word = $record['WoText'];
            $wordlc = $record['WoTextLC'];
            $sent = repl_tab_nl($record['WoSentence']);
            $notvalid = $record['notvalid'];
            $pass = 2;
        }
        mysqli_free_result($res);
    }

    if ($num == 0) {
        // Should not occur but...
        do_test_test_finished($testsql, $totaltests);
        return 0;
    }

    if ($nosent) {
        // No sentence mode (4+5)
        $num = 0;
        $notvalid = 1;
    } else {
        // $nosent == FALSE, mode 1-3
        list($sent, $num, $startSec, $endSec,$txID) = do_test_test_sentence($wid, $lang, $wordlc);
        if ($sent === null) {
            $notvalid = 1;
        }
    }

    if ($num == 0) {
        // take term sent. if valid
        if ($notvalid) {
            $sent = "{" . $word . "}";
        }
        if ($debug) {
            echo "DEBUG not found, use sent = $sent<br />";
        }
    }


    echo '<p ' . ($rtlScript ? 'dir="rtl"' : '') .
    ' style="' . ($removeSpaces ? 'word-break:break-all;' : '') .
    'font-size:' . $textsize . '%;
    line-height: 1.4; text-align:center; margin-bottom:300px;">';

    list($r, $save) = do_test_get_term_test(
        $record,
        $sent,
        $testtype,
        $nosent,
        $regexword
    );

    // Show Sentence
    echo $r;

    do_test_test_javascript_interaction(
        $record,
        $wb1,
        $wb2,
        $wb3,
        $testtype,
        $nosent,
        $save,
        $startSec,
        $endSec,
    );

    echo '</p></div>';

    return $count;
}


/**
 * Prepare JavaScript code globals so that you can click on words.
 *
 * @param array  $wo_record Word record. Associative array with keys 'WoID',
 *                          'WoTranslation'.
 * @param string $wb1       URL of the first dictionary.
 * @param string $wb2       URL of the secondary dictionary.
 * @param string $wb3       URL of the google translate dictionary.
 * @param int    $testtype  Type of test
 * @param int    $nosent    1 to use single word instead of sentence.
 * @param string $save      Word or sentence to use for the test
 *
 * @return void
 *
 * @global string $tbpref  Database table prefix
 * @global string $angDefs Languages definition array
 */
function do_test_test_interaction_globals($wb1, $wb2, $wb3)
{
    ?>
<script type="text/javascript">
    LWT_DATA.language.dict_link1 = <?php echo json_encode($wb1); ?>;
    LWT_DATA.language.dict_link2 = <?php echo json_encode($wb2); ?>;
    LWT_DATA.language.translator_link = <?php echo json_encode($wb3); ?>;
    LANG = getLangFromDict(LWT_DATA.language.translator_link);
    if (LANG && LANG != LWT_DATA.language.translator_link) {
        $("html").attr('lang', LANG);
    }
    LWT_DATA.test.answer_opened = false;
</script>
    <?php
}


/**
 * Prepare JavaScript code so that you can click on words.
 *
 * @param array  $wo_record Word record. Associative array with keys 'WoID',
 *                          'WoTranslation'.
 * @param string $solution  solution to test
 * @param string $startSec  starting second of sentence audio
 * @param string $endSec ending second of sentence audio
 *
 * @return void
 * 
 * @global string $tbpref  Database table prefix
 * @global string $langDefs Languages definition array
 */
function do_test_test_javascript_clickable($wo_record, $solution, $startSec, $endSec)
{
    global $tbpref;
    $wid = $wo_record['WoID'];
    $voiceApi = get_first_value(
        "SELECT LgTTSVoiceAPI AS value FROM {$tbpref}languages 
        WHERE LgID = " . $wo_record['WoLgID']
    );
    ?>
<script type="text/javascript">
    /** 
     * Read the word aloud
     */
    function read_word() {
        speechDispatcher(
            <?php echo json_encode($wo_record['WoText']); ?>, 
            <?php echo json_encode($wo_record['WoLgID']); ?>
        );
    }

    LWT_DATA.language.id = <?php echo json_encode($wo_record['WoLgID']); ?>;
    LWT_DATA.test.solution = <?php echo prepare_textdata_js($solution); ?>;
    LWT_DATA.word.id = <?php echo $wid; ?>;
    LWT_DATA.language.ttsVoiceApi = <?php echo json_encode($voiceApi); ?>;

        $(document).on('keydown', keydown_event_do_test_test);
        $('.word')
            .on('click', word_click_event_do_test_test)
            .on('click', read_word);
    </script>
    <?php
}

/**
 * Prepare JavaScript code so that you can click on words.
 *
 * @param array  $wo_record Word record. Associative array with keys 'WoID',
 *                          'WoTranslation'.
 * @param string $wb1       URL of the first dictionary.
 * @param string $wb2       URL of the secondary dictionary.
 * @param string $wb3       URL of the google translate dictionary.
 * @param int    $testtype  Type of test
 * @param int    $nosent    1 to use single word instead of sentence.
 * @param string $save      Word or sentence to use for the test
 * @param string $startSec  starting second of sentence audio
 * @param string $endSec ending second of sentence audio
 * 
 *
 * @return void
 *
 * @global string $tbpref  Database table prefix
 * @global string $angDefs Languages definition array
 */
function do_test_test_javascript_interaction(
    $wo_record,
    $wb1,
    $wb2,
    $wb3,
    $testtype,
    $nosent,
    $save,
    $startSec,
    $endSec
) {
    do_test_test_interaction_globals($wb1, $wb2, $wb3);
    $solution = get_test_solution($testtype, $wo_record, (bool) $nosent, $save);
    do_test_test_javascript_clickable($wo_record, $solution, $startSec, $endSec);
}

/**
 * Get the data and echoes the footer.
 *
 * @param int $notyettested Number of words left to be tested.
 *
 * @return void
 */
function prepare_test_footer($notyettested)
{
    $wrong = $_SESSION['testwrong'];
    $correct = $_SESSION['testcorrect'];
    do_test_footer($notyettested, $wrong, $correct);
}

/**
 * Echoes HTML code for the footer of a words test page.
 *
 * @param int $notyettested Number of words left to be tested
 * @param int $wrong        Number of failed tests
 * @param int $correct      Number of correct answers.
 *
 * @return void
 */
function do_test_footer($notyettested, $wrong, $correct)
{
    $totaltests = $wrong + $correct + $notyettested;
    $totaltestsdiv = 1;
    if ($totaltests > 0) {
        $totaltestsdiv = 1.0 / $totaltests;
    }
    $totaltestsdiv *= 100;
    $l_notyet = round($notyettested * $totaltestsdiv, 0);
    $l_wrong = round($wrong * $totaltestsdiv, 0);
    $l_correct = round($correct * $totaltestsdiv, 0);
    ?>
    <footer id="footer">
        <span style="margin-left: 15px; margin-right: 15px;">
            <img src="icn/clock.png" title="Elapsed Time" alt="Elapsed Time" />
            <span id="timer" title="Elapsed Time"></span>
        </span>
        <span style="margin-left: 15px; margin-right: 15px;">
            <img id="not-tested-box" class="borderl" src="<?php print_file_path('icn/test_notyet.png'); ?>"
                title="Not yet tested" alt="Not yet tested" height="10" width="<?php echo $l_notyet; ?>" /><img
                id="wrong-tests-box" class="bordermiddle" src="<?php print_file_path('icn/test_wrong.png'); ?>" title="Wrong"
                alt="Wrong" height="10" width="<?php echo $l_wrong; ?>" /><img id="correct-tests-box" class="borderr"
                src="<?php print_file_path('icn/test_correct.png'); ?>" title="Correct" alt="Correct" height="10"
                width="<?php echo $l_correct; ?>" />
        </span>
        <span style="margin-left: 15px; margin-right: 15px;">
            <span title="Total number of tests" id="total_tests">
                <?php
                echo $totaltests;
                ?>
            </span>
            =
            <span class="todosty" title="Not yet tested" id="not-tested">
                <?php
                echo $notyettested;
                ?>
            </span>
            +
            <span class="donewrongsty" title="Wrong" id="wrong-tests">
                <?php
                echo $wrong;
                ?>
            </span>
            +
            <span class="doneoksty" title="Correct" id="correct-tests">
                <?php
                echo $correct;
                ?>
            </span>
        </span>
    </footer>
    <?php
}

/**
 * Prepare JavaScript code for interacting between the different frames.
 *
 * @param int $count Total number of tests that were done today
 *
 * @return void
 */
function do_test_test_javascript($count)
{
    
    ?>
<script type="text/javascript">
    /**
     * Prepare the different frames for a test.
     */
    function prepare_test_frames()
    {
        const time_data = <?php echo json_encode(array(
            "wait_time" => (int)getSettingWithDefault('set-test-edit-frame-waiting-time'),
            "time" => time(),
            "start_time" => $_SESSION['teststart'],
            "show_timer" => ($count ? 0 : 1)
        )) ?>;

        window.parent.frames['ru'].location.href = 'empty.html';
        if (time_data.wait_time <= 0) {
            window.parent.frames['ro'].location.href = 'empty.html';
        } else {
            setTimeout(
                'window.parent.frames["ro"].location.href="empty.html";', 
                time_data.wait_time
            );
        }
        new CountUp(
            time_data.time, time_data.start_time, 'timer', time_data.show_timer
        );
    }


    /**
     * Insert a new word test.
     * 
     * @param {number} word_id  Word ID
     * @param {number} tx_id  transaction ID
     * @param {number} start_sec  starting second
     * @param {number} end_sec  ending second
     * @param {string} word_text  word text
     * @param {string} word_lg_abbr  Word abbr
     * @param {string} solution Test answer
     * @param {string} group    
     */
    function insert_new_word(word_id,tx_id,start_sec,end_sec,word_text,word_lg_abbr, solution, group) {
        
        

                    /** 
                    * Read the word aloud
                    */
                    function read_word() {
                        if (('speechSynthesis' in window) &&
                            document.getElementById('utterance-allowed').checked) {
                            const text = word_text;
                            const lang = word_lg_abbr;
                            speechDispatcher(text, lang);
                        }
                    }
                
        
            const options_media_paths = {
                "id": tx_id
            };
            $.getJSON(
                'api.php/v1/media-files?' + $.param(options_media_paths)
            ).done(function (data) {
                if (data["paths"]) {
                    var MEDIA =  data["paths"]
                    sentenceaudio.src = MEDIA;
        if (!(/(http(s?)):\/\//i.test(MEDIA))) {
            MEDIA = new URL(MEDIA, window.location.origin).href
            sentenceaudio.src = MEDIA;
        }
                }
            })


        LWT_DATA.test.solution = solution;
        LWT_DATA.word.id = word_id;
        var playsentence = document.getElementById('playSentence');

if(parseInt(end_sec) == 0 || end_sec == null )
{
    playsentence.style.display = 'none';

}
else{
playsentence.style.display = '';
playsentence.setAttribute('data-start-time',start_sec)
playsentence.setAttribute('data-end-time',end_sec)
}

        $('#term-test').html(group);

        $(document).on('keydown', keydown_event_do_test_test);
        $('.word')
        .on('click', word_click_event_do_test_test)
        $('.word').on('click', read_word);

    }

    /**
    * Handles an ajax query for word tests.
    * 
    * @param {JSON}   current_test Current test data
    * @param {number} total_tests  Total number of tests for the day
    * @param {string} test_key     Key identifier for the test to run
    * @param {string} selection    Selection of data to run the test on
    */
    function test_query_handler(current_test, total_tests, test_key, selection)
    {
        if (current_test['word_id'] == 0) {
            do_test_finished(total_tests);
            $.getJSON(
                'api.php/v1/review/tomorrow-count', 
                { 
                    test_key: test_key,
                    selection: selection
                },
                function (tomorrow_test) {
                    if (tomorrow_test.count) {
                        $('#tests-tomorrow').css("display", "inherit");
                        $('#tests-tomorrow').text(
                            "Tomorrow you'll find here " + tomorrow_test.count + 
                            ' test' + (tomorrow_test.count < 2 ? '' : 's') + "!"
                        );
                    }
                }
            );
        } else {
            insert_new_word(
                current_test.word_id,current_test.txID,current_test.startSec,current_test.endSec,current_test.word_text,current_test.word_lg_abbr,current_test.solution, current_test.group
            );
        }
    }

    /**
    * Get new term to test through AJAX
    * 
    * @param {JSON} review_data Various data on the current test
    */
    function query_next_term(review_data)
    {
        $.getJSON(
            'api.php/v1/review/next-word', 
            {
                test_key: review_data.test_key,
                selection: review_data.selection,
                word_mode: review_data.word_mode,
                lg_id: review_data.lg_id,
                word_regex: review_data.word_regex,
                type: review_data.type
            }
        )
        .done(function (data) {
            test_query_handler(
                data, review_data.count, review_data.test_key, review_data.selection
            );
        } );
    }

        /**
         * Make a custom display when tests are finished for today.
         */
        function do_test_finished(total_tests) {
            $('#term-test').css("display", "none");
            $('#test-finished-area').css("display", "inherit");
            $('#tests-done-today').text(
                "Nothing " + (total_tests > 0 ? 'more ' : '') + "to test here!"
            );

            $('#tests-tomorrow').css("display", "none");
        }

        $(document).ready(prepare_test_frames);
    </script>
    <?php
}

/**
 * Do the main content of a test page.
 * Replaced by do_test_test_content_ajax()
 * @global int $debug Show debug informations
 *
 * @return void
 * @deprecated 
 */
function do_test_test_content()
{
    global $debug;

    $testsql = do_test_get_test_sql(
        $_REQUEST['selection'],
        $_SESSION['testsql'],
        $_REQUEST['lang'],
        $_REQUEST['text']
    );
    $totaltests = $_SESSION['testtotal'];
    $testtype = do_test_get_test_type((int) getreq('type'));
    $count = get_first_value(
        "SELECT COUNT(DISTINCT WoID) AS value 
        FROM $testsql AND WoStatus BETWEEN 1 AND 5 
        AND WoTranslation != '' AND WoTranslation != '*' AND WoTodayScore < 0"
    );
    if ($debug) {
        echo "DEBUG - COUNT TO TEST: $count<br />";
    }
    if (!is_numeric($count)) {
        my_die("The number of words left to test is not an integer: \"$count\"!");
    }
    $notyettested = (int) $count;

    $count2 = prepare_test_area($testsql, $totaltests, $notyettested, $testtype);
    prepare_test_footer($notyettested);
    do_test_test_javascript($count2);
}

/**
 * Do the main content of a test page.
 *
 * @param string    $selector  Type of test to run
 * @param array|int $selection Items to run the test on
 *
 * @global int $debug Show debug informations
 *
 * @return void
 */
function do_test_test_content_ajax($selector, $selection)
{
    global $debug;

    $testtype = do_test_get_test_type((int)getreq('type'));
    $test_sql = do_test_test_get_projection($selector, $selection);
    $count = get_first_value(
        "SELECT COUNT(DISTINCT WoID) AS value 
        FROM $test_sql AND WoStatus BETWEEN 1 AND 5 
        AND WoTranslation != '' AND WoTranslation != '*' AND WoTodayScore < 0"
    );
    if ($debug) {
        echo "DEBUG - COUNT TO TEST: $count<br />";
    }
    if (!is_numeric($count)) {
        my_die("The number of words left to test is not an integer: \"$count\"!");
    }
    $notyettested = (int) $count;

    $total_tests = do_test_prepare_ajax_test_area(
        $selector,
        $selection,
        $notyettested,
        $testtype
    );
    prepare_test_footer($notyettested);
    do_test_test_javascript($total_tests);
}


?>