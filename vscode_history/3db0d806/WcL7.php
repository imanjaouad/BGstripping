<?php

use Illuminate\Support\Facades\Route;

Route.get(['get','post'],'/greeting','/', function () {
    return "Hello world";
});
