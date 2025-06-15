<?php

namespace App\Application\UseCases\Profile;

use App\Domain\DTO\Data\ProfileData;
use App\Domain\Interfaces\ProfileDAO;

class GetAllProfilesCase
{

    public function __construct(private ProfileDAO $profileDAO)
    {

    }

    public function execute(): array
    {
       $profiles =  $this->profileDAO->getAllProfiles();

       return array_map(function ($profile) {
            return new ProfileData($profile);
        }, $profiles);
    }

}