<?php
    function send_success_response() {
        $data = [
            'success' => TRUE,
            'errors' => []
        ];
        send_json_response($data);
    }

    function send_json_response($response_data) {
        exit(json_encode($response_data));
    }

    session_start();
    session_destroy();
    send_success_response();