<?php

namespace App\Domain\Interfaces;

use App\Domain\ValueObject\Profile;

interface ProfileDAO
{
    public function getAllProfiles(): array;
    public function getProfileById(int $id): ?Profile;

}