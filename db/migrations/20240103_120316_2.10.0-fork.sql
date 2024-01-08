-- LWT version 2.10.0 adds several features: 
-- External voice api support, romanization hiding option, longer URI for text audio


-- Add a third-party voice API
ALTER TABLE `languages` 
    ADD COLUMN `LgTTSVoiceAPI` VARCHAR(2048) NOT NULL;

-- Romanization disabling option
ALTER TABLE `languages` 
    ADD COLUMN `LgShowRomanization` TINYINT(1) DEFAULT TRUE;

-- URI should be at least 2048 characters long: 
-- https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
ALTER TABLE `texts` 
    MODIFY COLUMN `TxAudioURI` VARCHAR(2048) NOT NULL;

ALTER TABLE `sentences` 
    ADD COLUMN `SeStartSec` int(11) unsigned NOT NULL DEFAULT '0',  
    ADD COLUMN `SeEndSec` int(11) unsigned NOT NULL DEFAULT '0';
     