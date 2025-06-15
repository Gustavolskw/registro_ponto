<?php

namespace App\Application\UseCases\User;

use App\Application\Dependency\Auth;
use App\Domain\DomainException\DomainNotFoundException;
use App\Domain\DTO\Data\AuthUser;
use App\Domain\Entity\User;
use App\Domain\Interfaces\UserRepository;
use InvalidArgumentException;

class CreateNewUserPasswordCase
{
    use Auth;

    public function __construct(private UserRepository $userRepository)
    {
    }

    public function execute(int $userId, string $newPassword): AuthUser
    {
        $user = $this->validateUser($userId);
        $this->validateNewPassword($newPassword);
        $user->setPassword(password_hash($newPassword, PASSWORD_BCRYPT));
        $userUpdated = $this->userRepository->update($user);
        $jwtToken = $this->generateJwt($userUpdated);
        return new AuthUser($user, $jwtToken);
    }

    public function validateUser(int $matricula): User
    {
        if (empty($matricula)) {
            throw new InvalidArgumentException("User ID cannot be empty.");
        }
        $user = $this->userRepository->findByMatriculaAndPasswordNull($matricula);
        if (!$user) {
            throw new DomainNotFoundException("Matricula {$matricula} is Invalid to register new password!.");
        }
        return $user;
    }

    public function validateNewPassword(string $newPassword): void
    {
        if (empty($newPassword)) {
            throw new InvalidArgumentException("New password cannot be empty.");
        }
        if (strlen($newPassword) < 8) {
            throw new InvalidArgumentException("New password must be at least 8 characters long.");
        }
    }

}