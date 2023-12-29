<?php

/**
 * \file
 * \brief Print/Edit an improved annotated text
 * 
 * Call: print_impr_text.php?text=[textid]&...
 *      ... edit=1 ... edit own annotation 
 *      ... del=1  ... delete own annotation
 * 
 * PHP version 8.1
 * 
 * @category User_Interface
 * @package Lwt
 * @author  LWT Project <lwt-project@hotmail.com>
 * @license Unlicense <http://unlicense.org/>
 * @link    https://hugofara.github.io/lwt/docs/php/files/print-impr-text.html
 * @since   1.5.0
 */

namespace Lwt\Interface\Print_Impr_text;

require_once 'inc/session_utility.php';
require_once 'inc/ajax_edit_impr_text.php';

use function Lwt\Ajax\Improved_Text\edit_term_form;

function edit_mode_display($textid, $ann_exists): void
{
    if (!$ann_exists) {
        // No annotations, try create them
        $ann = create_save_ann($textid);
        $ann_exists = strlen($ann) > 0;
    }
    ?>
<div id="printoptions">
    <h2>Improved Annotated Text (Edit Mode) 
        <img src="icn/question-frame.png" title="Help" alt="Help" class="click" 
        onclick="window.open('docs/info.html#il');" />
    </h2>
    <input type="button" value="Display/Print Mode" onclick="location.href='print_impr_text.php?text=<?php echo $textid; ?>';" />
    </div>
</div> 
<!-- noprint -->
    <?php
    if (!$ann_exists) {  
        // No annotations, creation not possible
        echo '<p>No annotated text found, and creation seems not possible.</p>';
    } else {
        // Annotations exist, set up for editing.
        ?>
    <div data_id="<?php echo $textid; ?>" id="editimprtextdata">
        <?php echo edit_term_form($textid); ?>
    </div>
    <script type="text/javascript">
        $(document).ready(function() {
            $('input.impr-ann-text').on('change', changeImprAnnText);
            $('input.impr-ann-radio').on('change', changeImprAnnRadio);
        });
    </script>
        <?php
    }
    ?>
    <div class="noprint">
        <input type="button" value="Display/Print Mode" 
        onclick="location.href='print_impr_text.php?text=<?php echo $textid; ?>" />
    </div>
    <?php
}

function print_mode_display($textid, $langid, $audio, $ann, $title): void
{
    global $tbpref;
    $sql = "SELECT LgTextSize, LgRemoveSpaces, LgRightToLeft, LgGoogleTranslateURI 
    from {$tbpref}languages where LgID = $langid";
    $res = do_mysqli_query($sql);
    $record = mysqli_fetch_assoc($res);
    $textsize = $record['LgTextSize'];
    $rtlScript = $record['LgRightToLeft'];
    $ttsClass = ''; 
    if (!empty($record['LgGoogleTranslateURI'])) {
        $ttsLg = preg_replace(
            '/.*[?&]sl=([a-zA-Z\-]*)(&.*)*$/', '$1', 
            $record['LgGoogleTranslateURI']
        );
        if ($record['LgGoogleTranslateURI'] != $ttsLg) {
            $ttsClass = 'tts_' . $ttsLg . ' '; 
        }
    }
    mysqli_free_result($res);
    ?>
<div id="printoptions">
    <h2>Improved Annotated Text (Display/Print Mode)</h2>
    <div class="flex-spaced">
        <input type="button" value="Edit" 
        onclick="location.href='print_impr_text.php?edit=1&amp;text=<?php echo $textid; ?>';" /> 
        <input type="button" value="Delete" 
        onclick="if (confirm ('Are you sure?')) location.href='print_impr_text.php?del=1&amp;text=<?php echo $textid; ?>';" /> 
        <input type="button" value="Print" onclick="window.print();" />
        <input type="button" 
        value="Display <?php echo (($audio != '') ? ' with Audio Player' : ''); ?> in new Window" 
        onclick="window.open('display_impr_text.php?text=<?php echo $textid; ?>');" />
    </div>
    </div>
</div>
<!-- noprint -->
<div id="print"<?php echo ($rtlScript ? ' dir="rtl"' : ''); ?>>
    <p style="font-size:<?php echo $textsize; ?>%;line-height: 1.35; margin-bottom: 10px; ">
        <?php echo tohtml($title); ?>
        <br /><br />
    <?php
    $items = preg_split('/[\n]/u', $ann);

    foreach ($items as $item) {
        $vals = preg_split('/[\t]/u', $item);
        if ($vals[0] > -1) {
            $trans = '';
            if (count($vals) > 3) { 
                $trans = $vals[3]; 
            }
            if ($trans == '*') { 
                $trans = $vals[1] . " "; // <- U+200A HAIR SPACE
            }      
            echo ' <ruby>
                <rb>
                    <span class="' . $ttsClass . 'anntermruby">' . 
                        tohtml($vals[1]) . 
                    '</span>
                </rb>
                <rt>
                    <span class="anntransruby2">' . tohtml($trans) . '</span>
                </rt>
            </ruby> ';
        } else if (count($vals) >= 2) {
            echo str_replace(
                "¶",
                '</p><p style="font-size:' . $textsize . '%;line-height: 1.3; margin-bottom: 10px;">',
                " " . tohtml($vals[1]) . " "
            );
        }
    }
    ?>
    </p>
</div>
    <?php
}


/**
 * @return void
 */
function do_content()
{
    global $tbpref;
    $textid = (int)getreq('text');
    $editmode = getreq('edit');
    $editmode = ($editmode == '' ? 0 : (int)$editmode);
    $delmode = getreq('del');
    $delmode = ($delmode == '' ? 0 : (int)$delmode);
    $ann = (string) get_first_value(
        "SELECT TxAnnotatedText AS value FROM {$tbpref}texts 
        WHERE TxID = $textid"
    );
    $ann_exists = strlen($ann) > 0;
    if ($ann_exists) {
        $ann = recreate_save_ann($textid, $ann);
        $ann_exists = strlen($ann) > 0;
    }
    
    if ($textid == 0) {
        header("Location: edit_texts.php");
        exit();
    }
    
    if ($delmode) {
        // Delete
        if ($ann_exists) { 
            runsql(
                "UPDATE {$tbpref}texts 
                SET TxAnnotatedText = NULL
                WHERE TxID = $textid", 
                ""
            );
        }
        $ann_exists = (int)get_first_value(
            "SELECT LENGTH(TxAnnotatedText) AS value 
            FROM {$tbpref}texts 
            WHERE TxID = $textid"
        ) > 0;
        if (!$ann_exists) {
            header("Location: print_text.php?text=$textid");
            exit();
        }
    }
    
    $sql = "SELECT TxLgID, TxTitle, TxAudioURI, TxSourceURI 
    from {$tbpref}texts where TxID = $textid";
    $res = do_mysqli_query($sql);
    $record = mysqli_fetch_assoc($res);
    $title = (string) $record['TxTitle'];
    $sourceURI = (string) $record['TxSourceURI'];
    $langid = (int) $record['TxLgID'];
    if (isset($record['TxAudioURI'])) { 
        $audio = (string) $record['TxAudioURI'];
    } else {
        $audio = '';
    }
    $audio = trim($audio);
    mysqli_free_result($res);
    
    saveSetting('currenttext', $textid);
    
    pagestart_nobody('Annotated Text', 'input[type="radio"]{display:inline;}');
    
    ?>
<div class="noprint"> 
    <div class="flex-header">
        <div>
            <?php echo_lwt_logo(); ?>
        </div>
        <div>
            <?php echo getPreviousAndNextTextLinks(
                $textid, 'print_impr_text.php?text=', true, ''
            ); ?>
        </div>
        <div>
            <a href="do_text.php?start=<?php echo $textid; ?>" target="_top">
                <img src="icn/book-open-bookmark.png" title="Read" alt="Read" />
            </a>
            <a href="do_test.php?text=<?php echo $textid; ?>" target="_top">
                <img src="icn/question-balloon.png" title="Test" alt="Test" />
            </a>
            <a href="print_text.php?text=<?php echo $textid; ?>" target="_top">
                <img src="icn/printer.png" title="Print" alt="Print" />
            </a>
            <a target="_top" href="edit_texts.php?chg=<?php echo $textid; ?>">
                <img src="icn/document--pencil.png" title="Edit Text" 
                alt="Edit Text" />
            </a>
        </div>
        <div>
            <?php quickMenu(); ?>
        </div>
    </div>
    <h1>ANN.TEXT ▶ <?php echo tohtml($title) . 
    (isset($record['TxSourceURI']) && substr(trim($sourceURI), 0, 1) != '#' ? 
    ' <a href="<?php echo $sourceURI; ?>" target="_blank">
        <img src="'.get_file_path('icn/chain.png') . 
        '" title="Text Source" alt="Text Source" />
    </a>' 
    : '') ?>
    </h1>
    <?php
    if ($editmode) {
        edit_mode_display($textid, $ann_exists);
    } else {
        print_mode_display(
            $textid, $langid, $audio, $ann, $title
        );
    }
    
    pageend();
}

do_content();

?>
