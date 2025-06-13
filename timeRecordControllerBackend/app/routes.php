<?php

declare(strict_types=1);

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

    $app->group("/user", function (RouteCollectorProxy $group) {
        $group->post("", UserController::class . ":createNewAdminUser");
        //$group->get("/{id}", ViewAccountAction::class);
    });
};
