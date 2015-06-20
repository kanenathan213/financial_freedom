<?php 
    $I = new ApiTester($scenario);

    $initial_user_count = $I->dbCount('users');

    $I->wantTo('Sign up with existing email');
    $I->sendPOST('/signup.php', array("email" => "test1@test.com", "password" => "123"));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $final_user_count = $I->dbCount('users');

    $expected_response = [
        "success" => FALSE,
        "errors" => ["Email already in use."]
    ];

    $I->seeJsonResponseContains($expected_response);
    $I->assertEquals($initial_user_count, $final_user_count);
?>