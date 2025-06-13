<?php

namespace App\Application\Dependency;

use App\Domain\Entity\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use stdClass;

trait Auth
{
    public function buildPayload(User $user): ?array
    {
        return [
            'iss' => 'auth_service',
            'sub' => $user->getId(),
            'email' => $user->getMatricula(),
            'role' => $user->getProfile()->getId(),
            'iat' => time(),
            'exp' => time() + 3600,
        ];
    }
    public function encodeJwt(array $payload): string
    {
        return JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
    }
    public function decodeJwt($token): stdClass
    {
        $key = new Key($_ENV['JWT_SECRET'], 'HS256');
        return JWT::decode($token, $key);
    }

}