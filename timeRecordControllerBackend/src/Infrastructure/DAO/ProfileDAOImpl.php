<?php

namespace App\Infrastructure\DAO;

use App\Domain\Interfaces\ProfileDAO;
use App\Domain\Interfaces\UserRepository;
use App\Domain\ValueObject\Profile;

class ProfileDAOImpl implements ProfileDAO
{

    public function getAllProfiles(): array
    {
        // TODO: Implement getAllProfiles() method.
    }

    public function getProfileById(int $id): ?Profile
    {
        // TODO: Implement getProfileById() method.
    }
}