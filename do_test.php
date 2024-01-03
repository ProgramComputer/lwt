<?php


/**
 * \file
 * \brief Start a test (frameset)
 * 
 * Call: do_test.php?lang=[langid]
 * Call: do_test.php?text=[textid]
 * Call: do_test.php?selection=1  (SQL via $_SESSION['testsql'])
 * Call: do_test.php?type=table for a table of words
 * Call: do_test.php?type=[1-5] for a test of words.
 * 
 * PHP version 8.1
 * 
 * @category User_Interface
 * @package Lwt
 * @author  LWT Project <lwt-project@hotmail.com>
 * @license Unlicense <http://unlicense.org/>
 * @link    https://hugofara.github.io/lwt/docs/php/files/do-test.html
 * @since   1.0.3
 */

require_once 'inc/session_utility.php';
require_once 'inc/mobile_interactions.php';
require_once 'inc/start_session.php';
require_once 'do_test_header.php';    
require_once 'do_test_test.php';
require_once 'do_test_table.php';

/**
 * Find the L2 language name.
 * 
 * @return string Language name
 * 
 * @global string $tbpref Database table prefix
 */
function get_l2_language_name()
{
    global $tbpref;

    $lang = 'L2';
    if (getreq('lang') != '') {
        $langid = (int) getreq('lang');
        $lang = (string) get_first_value(
            "SELECT LgName AS value FROM {$tbpref}languages 
            WHERE LgID = $langid
            LIMIT 1"
        ); 
    } else if (getreq('text') != '') {
        $textid = (int) getreq('text');
        $lang = (string) get_first_value(
            "SELECT LgName AS value 
            FROM {$tbpref}texts
            JOIN {$tbpref}languages
            ON TxLgID = LgID
            WHERE TxID = $textid
            LIMIT 1"
        );
    } else if (getreq('selection')) {
        $test_sql = do_test_test_from_selection(
            (int)getreq('selection'), $_SESSION['testsql']
        );
        $cntlang = get_first_value(
            "SELECT count(distinct WoLgID) AS value FROM $test_sql"
        );
        if ($cntlang == 1) {
            $lang = (string) get_first_value(
                "SELECT LgName AS value 
                FROM {$tbpref}languages, {$test_sql} AND LgID = WoLgID 
                LIMIT 1"
            ); 
        }
    }

    return $lang;
}

/**
 * Find the appropiate property to add to the test.
 * It uses requests provided to the page.
 * 
 * @return string Some URL property
 */
function get_test_property()
{
    if (isset($_REQUEST['selection']) && isset($_SESSION['testsql'])) { 
        return "selection=" . $_REQUEST['selection']; 
    } 
    if (isset($_REQUEST['lang'])) { 
        return "lang=" . $_REQUEST['lang']; 
    } 
    if (isset($_REQUEST['text'])) { 
        return "text=" . $_REQUEST['text']; 
    } 
    return '';
}

/**
 * Make the content of the mobile page.
 * 
 * @param string $property URL property
 * 
 * @return void
 * 
 * @deprecated Use do_frameset_mobile_page_content instead
 */
function do_test_mobile_page_content($property) 
{
    do_frameset_mobile_page_content(
        "do_test_header.php?$property", "empty.html", true
    );
}

/**
 * Make the mobile test page.
 * 
 * @param string $property Unnused, null by default
 * 
 * @return void
 * 
 * @since 2.6.0-fork Function rewrote and no longer deprecated
 */
function do_test_mobile_page($property=null) 
{
    $language = get_l2_language_name();
    ?>
<div style="width: 95%; height: 100%;">
    <div id="frame-h">
        <?php
        start_test_header_page($language);
        ?>
    </div>
    <hr />
    <div id="frame-l">
        <?php
        if (getreq('type') == 'table') {
            do_test_table();
        } else {
            $identifier = do_test_get_identifier(
                $_REQUEST['selection'] ?? null, $_SESSION['testsql'] ?? null, 
                $_REQUEST['lang'] ?? null, $_REQUEST['text'] ?? null
            );
            do_test_test_content_ajax($identifier[0], $identifier[1]);
        }
        ?>
    </div>
</div>
<div id="frames-r" 
style="position: fixed; top: 0; right: -100%; width: 100%; height: 100%;" 
onclick="hideRightFrames();">
    <!-- iFrames wrapper for events -->
    <div style="margin-left: 50%; height: 99%;">
        <iframe src="empty.html" scrolling="auto" name="ro" style="height: 50%; width: 100%;">
            Your browser doesn't support iFrames, update it!
        </iframe>
        <iframe src="empty.html" scrolling="auto" name="ru" style="height: 50%; width: 100%;">
            Your browser doesn't support iFrames, update it!
        </iframe>
    </div>
</div>
<audio id="success_sound">
    <source src="<?php print_file_path("sounds/success.mp3") ?>" type="audio/mpeg" />
    Your browser does not support audio element!
</audio>
<audio id="failure_sound">
    <source src="<?php print_file_path("sounds/failure.mp3") ?>" type="audio/mpeg" />
    Your browser does not support audio element!
</audio>
    <?php
}

/**
 * Make the desktop test page
 * 
 * @param string $property Unnused, null by default
 * 
 * @return void
 */
function do_test_desktop_page($property=null) 
{
    $frame_l_width = (int)getSettingWithDefault('set-text-l-framewidth-percent');
    $language = get_l2_language_name();
    ?>
<div id="frames-l" style="width: <?php echo $frame_l_width; ?>%;">
    <div id="frame-h">
        <?php
        start_test_header_page($language);
        ?>
    </div>
    <hr />
    <div id="frame-l">
        <?php
        if (getreq('type') == 'table') {
            do_test_table();
        } else {
            $identifier = do_test_get_identifier(
                $_REQUEST['selection'] ?? null, $_SESSION['testsql'] ?? null, 
                $_REQUEST['lang'] ?? null, $_REQUEST['text'] ?? null
            );
            do_test_test_content_ajax($identifier[0], $identifier[1]);
        }
        ?>
    </div>
</div>
<div id="frames-r" 
style="position: fixed; top: 2%; right: 0; height: 98vh; 
width: <?php echo 100 - $frame_l_width; ?>%;display:flex; flex-direction: column;">
    <!-- iFrames wrapper for events -->
    <iframe src="empty.html" scrolling="auto"  id="ro" name="ro" 
    style="height: 50%; width: 100%;resize:vertical;">
        Your browser doesn't support iFrames, update it!
    </iframe>
    <iframe src="empty.html" scrolling="auto"  id="ru" name="ru" 
    style="height: 50%; width: 100%;">
        Your browser doesn't support iFrames, update it!
    </iframe>
</div>
<script>
function adjustIframeHeights(entries) {
  for (const entry of entries) {




            const heightDifference = $("#frames-r").height() - entry.contentRect.height - $('#ru').height();
            $('#ru').height($('#ru').height() + heightDifference + 'px');
}
        }

        var iframeObserver = new ResizeObserver(adjustIframeHeights);
        iframeObserver.observe(document.getElementById("ro"));
</script>
<audio id="success_sound">
    <source src="<?php print_file_path("sounds/success.mp3") ?>" type="audio/mpeg" />
    Your browser does not support audio element!
</audio>
<audio id="failure_sound">
    <source src="<?php print_file_path("sounds/failure.mp3") ?>" type="audio/mpeg" />
    Your browser does not support audio element!
</audio>
    <?php
}

/**
 * Start the test page.
 * 
 * @param string $p Unnused.
 * 
 * @since 2.2.1 The $mobile parameter is no longer required.
 * @since 2.6.0 Mobile interface is back and self-set.
 * @since 2.7.0 Adds a CSS rule to auto-enlarge the body.
 * 
 * @return void
 */
function do_test_page($p)
{
    pagestart_nobody(
        'Test',
        "
        #test-html {
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: none;
          }
        
        body {
            margin: 20px;
            max-width: 100%;
        }
        #frame-h {
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: stretch;
            overflow: auto;
            resize: vertical;
            height: 10.773em;
        }
        #frames-l {
            top: 2%;
            left: 0;
            width: 50%;
            position: absolute;
            overflow: hidden;
        }
        #frames-r{
            overflow: hidden;
            position: absolute;
            top: 2%;
            right: 0;
            height: 99vh;
            width: 50%;
        }
        .h4{ 

            display: block;
            margin-top: 1.33em;
            margin-bottom: 1.33em;
            margin-left: 0;
            margin-right: 0;
            font-weight: bold;
        }
        "
    );
    
    if (is_mobile()) {
        do_test_mobile_page();
    } else {
        do_test_desktop_page();
    }

    pageend();
}


/**
 * Main function to try to start a test page.
 *
 * If unsifficiant arguments are provided to
 * the page, the page will be redirected to
 * edit_texts.php.
 */
function try_start_test($p): void
{
    if ($p != '') {
        do_test_page($p);
    } else {
        header("Location: edit_texts.php");
        exit();
    }
}


try_start_test(get_test_property());

?>
