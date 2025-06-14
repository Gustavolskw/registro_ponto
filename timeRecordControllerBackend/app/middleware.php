<?php

declare(strict_types=1);

use App\Application\Middleware\AuthMiddleware;
use App\Application\Middleware\RoleMiddleware;
use App\Application\Middleware\SessionMiddleware;
use Psr\Http\Server\MiddlewareInterface;
use Slim\App;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface;

return function (App $app) {
    $app->add(SessionMiddleware::class);
};

function withRole(array $allowedRoles): MiddlewareInterface
{
    $jwtSecret = getenv('JWT_SECRET');
    return new class($allowedRoles, $jwtSecret) implements MiddlewareInterface {
        private array $roles;
        private string $secret;

        public function __construct(array $roles, string $secret)
        {
            $this->roles = $roles;
            $this->secret = $secret;
        }

        public function process(Request $request, RequestHandlerInterface $handler): Response
        {
            return (new RoleMiddleware($this->roles, $this->secret))->process($request, $handler);
        }
    };
}
