<?php

namespace App\Domain\DTO\Data;

use App\Domain\Entity\User;
use App\Domain\ValueObject\WorkJourney;

class AuthUser
{
    private User $user;
    private string $jwtToken;

    public function __construct(User $user, string $jwtToken)
    {
        $this->user = $user;
        $this->jwtToken = $jwtToken;
    }

    public function toArray(): array
    {
        $userArray = [
            'id' => $this->user->getId(),
            'matricula' => $this->user->getMatricula(),
            'name' => $this->user->getName(),
            'profileId' => $this->user->getProfile()->getId(),
            'createdAt' => $this->user->getCreatedAt()->format('Y-m-d H:i:s'),
            'workJourney' => [
                'id' => $this->user->getWorkJourney()->getId(),
                'startMorningTime' => $this->user->getWorkJourney()->getEntradaManha(),
                'endMorningTime' => $this->user->getWorkJourney()->getSaidaManha(),
                'startAfternoonTime' => $this->user->getWorkJourney()->getEntradaTarde(),
                'endAfternoonTime' => $this->user->getWorkJourney()->getEntradaTarde(),
            ],
        ];
        return [
            'user' => $userArray,
            'jwtToken' => $this->jwtToken,
        ];
    }
}