export enum ipcEvents {
    ROUTING = 'lwt-routing',

    // login
    LOGIN = 'lwt-login',
    LOGIN_FAILED = 'lwt-login-failed',
    SIGNUP = 'lwt-signup',
    LOGGED_IN = 'lwt-logged-in',
    LOGGED_OUT = 'lwt-logged-out',
    USER_ID = 'lwt-user-id',

    // languages
    LANGUAGES = 'lwt-languages',
    SELECT_LANGUAGE = 'lwt-select-language',
    LANGUAGE_SELECTED = 'lwt-language-selected',
    LANGUAGES_CHANGED = 'lwt-languages-changed',
    ADD_LANGUAGE = 'lwt-add-language',
    GET_LANGUAGE = 'lwt-get-language',
    EDIT_LANGUAGE = 'lwt-edit-language',
    DELETE_LANGUAGE = 'lwt-delete-language',

    // texts
    ADD_TEXT = 'lwt-add-text',
    GET_TEXT = 'lwt-get-text',
    GET_TEXT_PARSED = 'lwt-get-text-parsed',
    GET_TEXTS = 'lwt-get-texts',
    OPEN_TEXT = 'lwt-open-text',
    FILTER_TEXTS = 'lwt-filter-texts',
    OPEN_TEXT_EDIT = 'lwt-open-text-edit',
    EDIT_TEXT = 'lwt-edit-text',

    // archive
    GET_ARCHIVED_TEXTS = 'lwt-get-archived-texts',
    ARCHIVE_TEXT = 'lwt-archive-text',
    UNARCHIVE_TEXT = 'lwt-unarchive-text',

    // words
    OPEN_WORD_EDIT = 'lwt-open-word-edit',
    GET_WORD = 'lwt-get-word',
    EDIT_WORD = 'lwt-edit-word',
    GET_WORDS = 'lwt-get-words',

    // selections
    SAVE_SELECTION = 'lwt-save-selection',
}
