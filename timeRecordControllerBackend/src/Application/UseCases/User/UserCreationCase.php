<?php

namespace App\Application\UseCases\User;

use App\Application\Dependency\Auth;
use App\Application\UseCases\WorkJourney\WorkJourneyCreationCase;
use App\Domain\DomainException\ArgumentsException;
use App\Domain\DTO\Builders\ProfileBuilder;
use App\Domain\DTO\Builders\UserBuilder;
use App\Domain\DTO\Data\AuthUser;
use App\Domain\Entity\User;
use App\Domain\Interfaces\ProfileDAO;
use App\Domain\Interfaces\UserRepository;
use App\Domain\Interfaces\WorkJourneyDAO;
use App\Domain\ValueObject\Profile;
use App\Domain\ValueObject\WorkJourney;

class UserCreationCase
{
    use Auth;
    public function __construct(private UserRepository $userRepository, private ProfileDAO $profileDAO, private WorkJourneyDAO $workJourneyDAO)
    {
    }
    public function execute(UserBuilder $userData):AuthUser
    {
        $profileData = $this->validateProfileType($userData->getProfileId());
        $workJourney = $this->validateWorkJourney($userData->getWorkJourneyId());
        $newUserData = new User(
            null,
            $this->generateMatricula(),
            $userData->getName(),
            $profileData->getId() == 1 ? password_hash($userData->getPassword(), PASSWORD_BCRYPT) : null,
            $profileData,
            $workJourney,
            null
        );
        $newUser = $this->userRepository->save(
            $newUserData
        );
        $jwtToken = $this->generateJwt($newUser);
        return new AuthUser($newUser, $jwtToken);
    }
    private function validateProfileType($profileId):Profile
    {
        if(empty($profileId)){
            throw new ArgumentsException('Profile data cannot be empty');
        }
        return $this->profileDAO->getProfileById($profileId);
    }

    private function validateWorkJourney($idJornadaTrabalho):WorkJourney
    {
        if(empty($idJornadaTrabalho)){
            throw new ArgumentsException('Work journey data cannot be empty');
        }
        $workJourney = $this->workJourneyDAO->findById($idJornadaTrabalho);
        if(empty($workJourney)){
            throw new ArgumentsException('Work journey not found');
        }
        return $workJourney;
    }
    private function generateMatricula(): int
    {
        do {
            $matricula = random_int(1, 99999999);
        } while ($this->userRepository->existsByMatricula($matricula));

        return $matricula;
    }
}