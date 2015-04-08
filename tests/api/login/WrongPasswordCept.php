<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Login with wrong password');
    $I->sendGET('/login.php', array('email' => 'test1@test.com', 'password' => '1234'));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeResponseContains('{"success":false,"errors":["Incorrect password."]}');
?>