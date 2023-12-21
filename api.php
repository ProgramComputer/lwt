<?php

namespace Lwt\Ajax;

require_once __DIR__ . '/inc/session_utility.php';
require_once __DIR__ . '/inc/simterms.php';
require_once 'do_test_test.php';
require_once __DIR__ . '/inc/ajax_add_term_transl.php';
require_once __DIR__ . '/inc/ajax_check_regexp.php';
require_once __DIR__ . '/inc/ajax_chg_term_status.php';
require_once __DIR__ . '/inc/ajax_save_impr_text.php';
require_once __DIR__ . '/inc/ajax_save_text_position.php';
require_once __DIR__ . '/inc/ajax_show_imported_terms.php';
require_once __DIR__ . '/inc/ajax_edit_impr_text.php';


/**
 * Send JSON response
 */
function send_response($status = 200, $data = null) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function endpoint_exits($method, $requestUri) {
    // Set up API endpoints
    $endpoints = [ 
        'media-paths' => ['GET'],

        'review/next-word' => ['GET'],
        'review/tomorrow-count' => ['GET'],

        'sentences-with-term' => ['GET'],
        //'sentences-with-term/(?<term-id>\d+)' => ['GET'],

        'similar-terms' => ['GET'],

        'settings' => ['POST'],
        'settings/theme-path' => ['GET'],

        'terms' => ['GET', 'POST'],
        'terms/imported' => ['GET'],

        //'terms/(?<term-id>\d+)/translations' => ['GET'],

        //'terms/(?<term-id>\d+)/status/down' => ['POST'],
        //'terms/(?<term-id>\d+)/status/up' => ['POST'],
        //'terms/(?<term-id>\d+)/status/(?<new-status>\d+)' => ['POST'],

        'texts' => ['GET', 'POST'],
        
        //'texts/phonetic-reading' => ['GET'],
        
        //'texts/(?<text-id>\d+)/annotation' => ['POST'],
        //'texts/(?<text-id>\d+)/audio-position' => ['POST'],
        //'texts/(?<text-id>\d+)/reading-position' => ['POST'],

        'texts-statistics' => ['GET'],
        //'texts-statistics/(?<texts-ids>[\d,]+)' => ['GET'],
        
        //'translations/(?<term-id>\d+)' => ['POST'],
        'translations' => ['POST'],
        'translations/new' => ['POST'],

        'version' => ['GET'], 

        // 'regexp/test' => ['POST'], as of LWT 2.9.0, no usage was found
    ];


    // Extract requested endpoint from URI
    $uri_query = parse_url($requestUri, PHP_URL_PATH);
    $matching = preg_match('/(.+?\/api.php\/v\d\/).+/', $uri_query, $matches);
    if (!$matching) {
        send_response(400, ['error' => 'Unrecognized URL format ' . $uri_query]);
    }
    if (count($matches) == 0) {
        send_response(404, ['error' => 'Wrong API Location: ' . $uri_query]);
    }
    // endpoint without prepending URL, like 'version'
    $req_endpoint = rtrim(str_replace($matches[1], '', $uri_query), '/');
    $methods_allowed = null; 
    if (array_key_exists($req_endpoint, $endpoints)) {
        $methods_allowed = $endpoints[$req_endpoint];
    } else { 
        $first_elem = preg_split('/\//', $req_endpoint)[0];
        if (array_key_exists($first_elem, $endpoints)) {
            $methods_allowed = $endpoints[$first_elem];
        } else {
            send_response(404, ['error' => 'Endpoint Not Found: ' . $req_endpoint]);
        }
    }

    // Validate request method for the req_endpoint
    if (!in_array($method, $methods_allowed)) {
        send_response(405, ['error' => 'Method Not Allowed']);
    }
    return $req_endpoint;
}


// -------------------------- GET REQUESTS -------------------------

/**
 * Return the API version.
 * 
 * @param array $get_req GET request, unnused
 * 
 * @return string JSON-encoded version
 */
function rest_api_version($get_req)
{
    return array(
        "version"      => "0.0.1",
        "release_date" => "2023-09-01"
    );
}

/**
 * Retun the next word to test as JSON
 * 
 * @param string $testsql   SQL projection query
 * @param bool   $nosent    Test is in word mode
 * @param int    $lgid      Language ID
 * @param string $wordregex Word selection regular expression
 * @param int    $testtype  Test type
 * 
 * @return array Next word formatted as an array.
 */
function get_word_test_ajax($testsql, $nosent, $lgid, $wordregex, $testtype)
{
    $word_record = do_test_get_word($testsql);
    if (empty($word_record)) {
        $output = array(
            "word_id" => 0,
            "word_text" => '',
            "group" => '' 
        );
        return $output;
    }
    $sent = repl_tab_nl($word_record['WoSentence']);
    if ($nosent) {
        $sent = "{" . $word_record['WoText'] . "}";
    } else {
        // $nosent == FALSE, mode 1-3
        list($sent, $_) = do_test_test_sentence(
            $word_record['WoID'], $lgid, $word_record['WoTextLC']
        );
        if ($sent === null) {
            $sent = "{" . $word_record['WoText'] . "}";
        }
    }
    list($r, $save) = do_test_get_term_test(
        $word_record, $sent, $testtype, $nosent, $wordregex
    );
    
    return array(
        "word_id" => $word_record['WoID'],
        "solution" => get_test_solution($testtype, $word_record, $nosent, $save),
        "word_text" => $save,
        "group" => $r 
    );
}


/**
 * Return the next word to test.
 * 
 * @param array $get_req Array with the fields {test_sql: string, 
 *                       test_nosent: bool, test_lgid: int, 
 *                       test_wordregex: string, test_type: int}
 * 
 * @return string Next word formatted as JSON.
 */
function word_test_ajax($get_req)
{
    return get_word_test_ajax(
        $get_req['test_sql'], $get_req['test_nosent'], 
        $get_req['test_lgid'], 
        $get_req['test_wordregex'], $get_req['test_type']
    );
}

/**
 * Return the number of reviews for tomorrow by using the suplied query.
 * 
 * @param array $get_req Array with the field "test_sql"
 * 
 * @return string JSON-encoded result
 */
function tomorrow_test_count($get_req) 
{
    $output = array(
        "test_count" => do_test_get_tomorrow_tests_count($get_req['test_sql'])
    );
    return $output;
}

/**
 * Get the phonetic reading of a word based on it's language.
 * 
 * @param array $get_req Array with the fields "text" and "lang" (short language name)
 * 
 * @return string JSON-encoded result
 */
function get_phonetic_reading($get_req)
{
    $data = phonetic_reading($get_req['text'], $get_req['lang']);
    return array("phonetic_reading" => $data);
}

    
/**
 * Get the file path using theme.
 * 
 * @param array $get_req Get request with field "path", relative filepath using theme.
 * 
 * @return string JSON-encoded result
 */
function get_theme_path($get_req)
{
    return array("theme_path" => get_file_path($get_req['path']));
}

/**
 * Return statistics about a group of text.
 * 
 * @param array $get_req Get request with field "texts_id", texts ID.
 */
function get_texts_statistics($get_req)
{
    return return_textwordcount($get_req["texts_id"]);
}

/**
 * List the audio files in the media folder.
 * 
 * @param array $get_req Unnused
 * 
 * @return string[] Path of media files
 */
function media_paths($get_req) 
{
    return get_media_paths();
}

/**
 * Sentences containing an input word.
 * 
 * @param array $get_req Get request with fields "lg_id", "word_lc" and "word_id".
 */
function sentences_with_registred_term($get_req)
{
    return sentences_with_word(
        (int) $get_req["lg_id"],
        $get_req["word_lc"],
        (int) $get_req["word_id"]
    );
}

/**
 * Return the example sentences containing an input word.
 * 
 * @param array $get_req Get request with fields "lg_id" and "advanced_search" (optional).
 */
function sentences_with_new_term($get_req)
{
    $advanced = null;
    if (array_key_exists("advanced_search", $get_req)) {
        $advanced = -1;
    }
    return sentences_with_word(
        (int) $get_req["lg_id"],
        $get_req["word_lc"],
        $advanced
    );
}

/**
 * Return the list of imported terms.
 * 
 * @param array $get_req Get request with fields "last_update", "page" and "count".
 * 
 * @return array 
 */
function imported_terms($get_req)
{
    return imported_terms_list(
        $get_req["last_update"], $get_req["page"], $get_req["count"]
    );
}


/**
 * Get terms similar to a given term.
 * 
 * @param array $get_req Input get request.
 * 
 * @return string Similar terms in HTML format.
 */
function similar_terms($get_req) 
{
    return array("similar_terms" => print_similar_terms(
        (int)$get_req["simterms_lgid"], 
        (string) $get_req["simterms_word"]
    ));
}


/**
 * Translations for a term to choose an annotation.
 * 
 * @param array $get_req Get request with fields "text_id" and "page" and "count".
 */
function term_translations($get_req)
{
    return \Lwt\Ajax\Improved_Text\get_term_translations(
        (string)$get_req["term_lc"], (int)$get_req["text_id"]
    );
}


/**
 * Error message when the provided action_type does not match anything known.
 * 
 * @param array $post_req GET request used
 * @param bool  $action_exists Set to true if the action is recognized but not 
 * the action_type
 * 
 * @return string JSON-encoded error message.
 */
function unknown_get_action_type($get_req, $action_exists=false)
{
    if ($action_exists) {
        $message = 'action_type with value "' . $get_req["action_type"] . 
        '" with action "' . $get_req["action"] . '" does not exist!';
    } else {
        $message = 'action_type with value "' . $get_req["action_type"] . 
        '" with default action (' . $get_req["action"] . ') does not exist'; 
    }
    return array("error" => $message); 
}

// --------------------------------- POST REQUESTS ---------------------


/**
 * Set text reading position.
 * 
 * @param array $post_req Array with the fields "tid" (int) and "tposition"
 * 
 * @return string
 */
function set_text_position($post_req) 
{
    return array("text" => save_text_position(
        (int)$post_req["tid"], (int)$post_req["tposition"]
    ));
}

/**
 * Set audio position.
 * 
 * @param array $post_req Array with the fields "tid" (int) and "audio_position"
 * 
 * @return string
 */
function set_audio_position($post_req) 
{
    return array(
        "audio" => save_audio_position(
            (int)$post_req["tid"], (int)$post_req["audio_position"]
        )
    );
}


/**
 * Create the translation for a new term.
 * 
 * @param array $post_req Input post request.
 * 
 * @return string Error message in case of failure, lowercase term otherwise
 */
function add_translation($post_req)
{
    $text = trim($post_req['text']);
    $result = add_new_term_transl(
        $text, (int)$post_req['lang'], trim($post_req['translation'])
    );
    $raw_answer = array();
    if ($result == mb_strtolower($text, 'UTF-8')) {
        $raw_answer["add"] = $result;
    } else {
        $raw_answer["error"] = $result;
    }
    return $raw_answer;
}

/**
 * Edit the translation of an existing term.
 * 
 * @param array $post_req Input post request.
 * 
 * @return string Term in lower case, or "" if term does not exist
 */
function update_translation($post_req)
{
    $result = do_ajax_check_update_translation(
        (int)$post_req['id'], trim($post_req['translation'])
    );
    $raw_answer = array();
    if ($result == "") {
        $raw_answer["error"] = $result;
    } else {
        $raw_answer["update"] = $result;
    }
    return $raw_answer;
}

/**
 * Check if a regexp is correctly recognized.
 * 
 * @param array $post_req Array with the field "regexp"
 */
function check_regexp($post_req)
{
    $result = do_ajax_check_regexp(trim($post_req['regexp'])); 
    return array("check_regexp" => $result);
}

/**
 * Change the status of a term by one unit.
 * 
 * @param array $post_req Array with the fields "wid" (int) and "status_up" (1 or 0)
 */
function increment_term_status($post_req)
{
    $result = ajax_increment_term_status(
        (int)$post_req['wid'], (bool)$post_req['status_up']
    );
    $raw_answer = array();
    if ($result == '') {
        $raw_answer["error"] = '';
    } else {
        $raw_answer["increment"] = $result;
    }
    return $raw_answer;
}

/**
 * Set the status of a term.
 * 
 * @param array $post_req Array with the fields "wid" (int) and "status" (0-5|98|99)
 */
function set_term_status($post_req)
{
    $result = set_word_status((int)$post_req['wid'], (int)$post_req['status']);
    $raw_answer = array();
    if (is_numeric($result)) {
        $raw_answer["set"] = (int)$result;
    } else {
        $raw_answer["error"] = $result;
    }
    return $raw_answer;
}

/**
 * Save the annotation for a term.
 * 
 * @param array $post_req Post request with keys "tid", "elem" and "data".
 * 
 * @return string JSON-encoded result
 */
function set_annotation($post_req)
{
    $result = save_impr_text(
        (int)$post_req["tid"], $post_req['elem'], 
        json_decode($post_req['data'])
    );
    $raw_answer = array();
    if (array_key_exists("error", $result)) {
        $raw_answer["error"] = $result["error"];
    } else {
        $raw_answer["save_impr_text"] = $result["success"];
    }
    return $raw_answer;
}


/**
 * Save a setting to the database.
 * 
 * @param array $post_req Array with the fields "k" (key, setting name) and "v" (value)
 * 
 * @return string[] Setting save status
 */
function save_setting($post_req): array
{
    $status = saveSetting($post_req['k'], $post_req['v']);
    $raw_answer = array();
    if (str_starts_with($status, "OK: ")) {
        $raw_answer["save_setting"] = substr($status, 4);
    } else {
        $raw_answer["error"] = $status;
    }
    return $raw_answer;
}

/**
 * Notify of an error on POST method.
 * 
 * @param array $post_req POST request used
 * @param bool  $action_exists Set to true if the action is recognized but not 
 * the action_type
 * 
 * @return string JSON-encoded error message
 */
function unknown_post_action_type($post_req, $action_exists=false)
{
    if ($action_exists) {
        $message = 'action_type with value "' . $post_req["action_type"] . 
        '" with action "' . $post_req["action"] . '" does not exist!'; 
    } else {
        $message = 'action_type with value "' . $post_req["action_type"] . 
        '" with default action (' . $post_req["action"] . ') does not exist'; 
    }
    return array("error" => $message); 
}


function main_enpoint($method, $requestUri) {
    // Extract requested endpoint from URI
    $req_endpoint = endpoint_exits($method, $requestUri);
    parse_str(parse_url($requestUri, PHP_URL_QUERY), $req_param);
    $endpoint_fragments = preg_split("/\//", $req_endpoint);

    // Process endpoint request
    if ($method === 'GET') {
        // Handle GET request for each endpoint
        switch ($endpoint_fragments[0]) {
            case 'media-paths':
                $answer = media_paths($req_param);
                send_response(200, $answer);
                break;
            case 'sentences-with-term':
                if (ctype_digit($endpoint_fragments[1])) {
                    $get_req['word_id'] = (int) $endpoint_fragments[1];
                    $answer = sentences_with_registred_term($req_param);
                } else {
                    $answer = sentences_with_new_term($req_param);
                }
                send_response(200, $answer);
                break;
            case 'similar-terms':
                $answer = similar_terms($req_param);
                send_response(200, $answer);
                break;
            case 'settings':
                switch ($endpoint_fragments[1]) {
                    case 'theme-path':
                        $answer = get_theme_path($req_param);
                        send_response(200, $answer);
                        break;
                    default:
                        send_response(
                            404, 
                            ['error' => 'Endpoint Not Found: ' . 
                            $endpoint_fragments[1]]
                        );
                }
                break;
            case 'terms':
                if ($endpoint_fragments[1] == "imported") {
                    $answer = imported_terms($req_param);
                    send_response(200, $answer);
                } else if (
                    ctype_digit($endpoint_fragments[1]) && 
                    $endpoint_fragments[2] == 'translations'
                ) {
                    $req_param['text_id'] = $endpoint_fragments[1];
                    $answer = term_translations($req_param);
                    send_response(200, $answer);
                } else {
                    send_response(
                        404, 
                        ['error' => 'Endpoint Not Found' . 
                        $endpoint_fragments[1]]
                    );
                }
                break;
            case 'review':
                switch ($endpoint_fragments[1]) {
                    case 'next-word':
                        $answer = word_test_ajax($req_param);
                        send_response(200, $answer);
                        break;
                    case 'tomorrow-count':
                        $answer = tomorrow_test_count($req_param);
                        send_response(200, $answer);
                        break;
                    default:
                        send_response(
                            404, 
                            ['error' => 'Endpoint Not Found' . 
                            $endpoint_fragments[2]]
                        );
                }
                break;
            case 'texts':
                if ($endpoint_fragments[2] == 'phonetic-reading') {
                    $answer = get_phonetic_reading($req_param);
                    send_response(200, $answer);
                } else if (!ctype_digit($endpoint_fragments[1])) {
                    send_response(
                        404, 
                        ['error' => 'Text ID (Integer) Expected, Got ' . 
                        $endpoint_fragments[1]]
                    );
                }else {
                    send_response(404, ['error' => 'Endpoint Not Found']);
                }
                break;
            case 'texts-statistics':
                $answer = get_texts_statistics($req_param);
                send_response(200, $answer);
            case 'version':
                $answer = rest_api_version($req_param);
                send_response(200, $answer);
                break;
            // Add more GET handlers for other endpoints
            default:
                send_response(404, ['error' => 'Endpoint Not Found']);
        }
    } elseif ($method === 'POST') {
        // Handle POST request for each endpoint
        switch ($req_endpoint) {
            case 'regexp/test':
                $answer = check_regexp($_POST);
                send_response(200, $answer);
                break;
            case 'settings':
                $answer = save_setting($_POST);
                send_response(200, $answer);
                break;
            case 'texts':
                if (!ctype_digit($endpoint_fragments[1])) {
                    send_response(
                        404, 
                        ['error' => 'Text ID (Integer) Expected, Got ' . 
                        $endpoint_fragments[1]]
                    );
                }
                switch ($endpoint_fragments[2]) {
                    case 'audio-position':
                        $answer = set_audio_position($_POST);
                        send_response(200, $answer);
                        break;
                    case 'annotation':
                        $answer = set_annotation($_POST);
                        send_response(200, $answer);
                        break;
                    case 'reading-position':
                        $answer = set_text_position($_POST);
                        send_response(200, $answer);
                        break;
                    default:
                        send_response(
                            404, 
                            ['error' => 'Endpoint Not Found: ' . 
                            $endpoint_fragments[2]]
                        );
                }
                break;
            case 'terms':
                if (!ctype_digit($endpoint_fragments[1])) {
                    send_response(
                        404, 
                        ['error' => 'Term ID (Integer) Expected, Got ' . 
                        $endpoint_fragments[1]]
                    );
                }
                if ($endpoint_fragments[2] != "status") {
                    send_response(
                        404, 
                        ['error' => '"status" Expected, Got ' . 
                        $endpoint_fragments[2]]
                    );
                }
                if (ctype_digit($endpoint_fragments[3])) {
                    $answer = set_term_status($_POST);
                    send_response(200, $answer);
                } else if ($endpoint_fragments[3] == 'down') {
                    $answer = increment_term_status($_POST);
                    send_response(200, $answer);
                } else if ($endpoint_fragments[3] == 'up') {
                    $answer = increment_term_status($_POST);
                    send_response(200, $answer);
                } else {
                    send_response(
                        404, 
                        ['error' => 'Endpoint Not Found: ' . 
                        $endpoint_fragments[3]]
                    );
                }
                break;
            case 'translations/new':
                $answer = add_translation($_POST);
                send_response(200, $answer);
                break;
            case 'translations':
                if (!ctype_digit($endpoint_fragments[1])) {
                    send_response(
                        404, 
                        ['error' => 'Text ID (Integer) Expected, Got ' . 
                        $endpoint_fragments[1]]
                    );
                }
                $answer = update_translation($_POST);
                send_response(200, $answer);
                break;
            default:
                send_response(404, ['error' => 'Endpoint Not Found']);
        }
    }
}


// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_response(405, ['error' => 'Method Not Allowed']);
} else {
    main_enpoint($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
}

?>
