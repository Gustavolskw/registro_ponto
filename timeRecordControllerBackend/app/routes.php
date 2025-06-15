<?php

declare(strict_types=1);

use App\Adapters\Controller\AppointingController;
use App\Adapters\Controller\UserController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function (App $app) {

    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    $app->get('/', function (Request $request, Response $response) {
        $response->getBody()->write('Hello world!');
        return $response;
    });

    $app->group("/user", function (RouteCollectorProxy $group){
        $group->post("", UserController::class . ":createNewUser")->add(withRole([1]));
        $group->patch("", UserController::class . ":createFuncionarioPassword")->add(withRole([1, 2]));
    });
    $app->group("/appointment", function (RouteCollectorProxy $group){
        $group->post("/mark", AppointingController::class . ":markAppointment")->add(withRole([1, 2]));
        $group->get('', AppointingController::class . ":getAllAppointmentsFromUserOnDay")->add(withRole([1, 2]));
        $group->get('/general-report', AppointingController::class . ":generateGeneralReportOfDay")->add(withRole([1]));
    });
    $app->group('', function (RouteCollectorProxy $group){
        $group->post('/login', UserController::class . ':loginUser');
    });
};
