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
            'iss' => 'appointment-system',
            'sub' => $user->getId(),
            'name' => $user->getName(),
            'matricula' => $user->getMatricula(),
            'role' => $user->getProfile()->getId(),
            'roleDescription' => $user->getProfile()->getDescription(),
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
    public function generateJwt(User $user): string
    {
      return $this->encodeJwt($this->buildPayload($user));
    }

}