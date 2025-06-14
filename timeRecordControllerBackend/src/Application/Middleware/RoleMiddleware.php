<?php

declare(strict_types=1);

namespace App\Application\Middleware;

use App\Domain\Exception\UnauthorizedException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class RoleMiddleware implements MiddlewareInterface
{
    private array $allowedProfiles;
    private string $jwtSecret;

    public function __construct(array $allowedProfiles, string $jwtSecret)
    {
        $this->allowedProfiles = $allowedProfiles;
        $this->jwtSecret = $jwtSecret;
    }

    public function process(Request $request, RequestHandlerInterface $handler): Response
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            throw new UnauthorizedException('Token não fornecido.');
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));

            // Aqui é onde corrigimos para ler o atributo correto 'role'
            if (!in_array($decoded->role ?? null, $this->allowedProfiles, true)) {
                throw new UnauthorizedException('Perfil não autorizado.');
            }

            // Opcionalmente, passa o payload para os controllers
            $request = $request->withAttribute('user', $decoded);

            return $handler->handle($request);

        } catch (\Exception $e) {
            throw new UnauthorizedException('Token inválido ou expirado.');
        }
    }
}
