<?php

namespace App\Application\UseCases\User;

use App\Application\UseCases\Auth;
use App\Application\UseCases\WorkJourney\WorkJourneyCreationCase;
use App\Domain\DomainException\ArgumentsException;
use App\Domain\DTO\Builders\ProfileBuilder;
use App\Domain\DTO\Builders\UserBuilder;
use App\Domain\DTO\Data\AuthUser;
use App\Domain\Entity\User;
use App\Domain\Interfaces\ProfileDAO;
use App\Domain\Interfaces\UserRepository;
use App\Domain\ValueObject\Profile;

class UserCreationCase
{
    use Auth;
    public function __construct(private UserRepository $userRepository, private ProfileDAO $profileDAO, private WorkJourneyCreationCase $workJourneyCreationCase)
    {
    }
    public function execute(UserBuilder $userData):AuthUser
    {
        $profileData = $this->validateProfileType($userData->getProfileId());
        $newUserData = new User(
           null,
            $userData->getMatricula(),
            $userData->getName(),
            $profileData->getId() == 1 ? password_hash($userData->getPassword(), PASSWORD_BCRYPT) : null,
            $profileData,
            null
        );
        $newUser = $this->userRepository->save(
            $newUserData
        );
       $newWorkJourney = $this->workJourneyCreationCase->execute($newUser);

        $payload = $this->buildPayload($newUser);
        $jwtToken = $this->encodeJwt($payload);

        return new AuthUser($newUser, $jwtToken, $newWorkJourney);
    }
    public function validateProfileType($profileId):Profile
    {
        if(!empty($profileId)){
            throw new ArgumentsException('Profile data cannot be empty');
        }
        return $this->profileDAO->getProfileById($profileId->getId());
    }

}