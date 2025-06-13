<?php

namespace App\Domain\DTO\Data;

use App\Domain\Entity\User;
use App\Domain\ValueObject\WorkJourney;

class AuthUser
{
    private User $user;
    private string $jwtToken;
    private WorkJourney $workJourney;

    public function __construct(User $user, string $jwtToken, ?WorkJourney $workJourney)
    {
        $this->user = $user;
        $this->jwtToken = $jwtToken;
        $this->workJourney = $workJourney;
    }

    public function toArray(): array
    {
        $userArray = [
            'id' => $this->user->getId(),
            'matricula' => $this->user->getMatricula(),
            'name' => $this->user->getName(),
            'profileId' => $this->user->getProfile()->getId(),
            'createdAt' => $this->user->getCreatedAt()->format('Y-m-d H:i:s'),
        ];

        if (!empty($this->workJourney)) {
            $userArray['workJourney'] = [
                'id' => $this->workJourney->getId(),
                'startMorningTime' => $this->workJourney->getEntradaManha(),
                'endMorningTime' => $this->workJourney->getSaidaManha(),
                'startAfternoonTime' => $this->workJourney->getEntradaTarde(),
                'endAfternoonTime' => $this->workJourney->getEntradaTarde(),
            ];
        }

        return [
            'user' => $userArray,
            'jwtToken' => $this->jwtToken,
        ];
    }
}