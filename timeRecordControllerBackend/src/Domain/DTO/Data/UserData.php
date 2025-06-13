<?php

namespace App\Domain\DTO\Data;

use App\Domain\Entity\User;

class UserData
{
    private User $user;
    public function __construct(User $user)
    {
        $this->user = $user;
    }
    public function toArray(): array
    {
        return [
            'id' => $this->user->getId(),
            'matricula' => $this->user->getMatricula(),
            'name' => $this->user->getName(),
            'profileId' => $this->user->getProfile()->getId(),
            'createdAt' => $this->user->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}