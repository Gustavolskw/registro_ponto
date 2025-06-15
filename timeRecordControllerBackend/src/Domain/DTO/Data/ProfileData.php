<?php

namespace App\Domain\DTO\Data;

use App\Domain\ValueObject\Profile;

class ProfileData
{
    private Profile $profile;
    public function __construct(Profile $profile)
    {
        $this->profile = $profile;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->profile->getId(),
            'description' => $this->profile->getDescription(),
        ];
    }

}