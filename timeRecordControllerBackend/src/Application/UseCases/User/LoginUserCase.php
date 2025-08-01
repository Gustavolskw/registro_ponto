<?php

namespace App\Application\UseCases\User;

use App\Application\Dependency\Auth;
use App\Domain\DomainException\ArgumentsException;
use App\Domain\DomainException\DomainNotFoundException;
use App\Domain\DomainException\InvalidAuthentication;
use App\Domain\DTO\Data\AuthUser;
use App\Domain\Interfaces\UserRepository;

class LoginUserCase
{
    use Auth;
    public function __construct(private UserRepository $userRepository)
    {
    }
    public function execute(int $matricula, string $password):AuthUser
    {
        $user = $this->validateUserByMatricula($matricula);
        if(empty($user->getPassword()) || !password_verify($password, $user->getPassword())){
            throw new InvalidAuthentication('Invalid credentials');
        }

        $jwtToken = $this->generateJwt($user);
        return new AuthUser($user, $jwtToken);
    }

    public function validateUserByMatricula($matricula){
        if(empty($matricula)){
            throw new ArgumentsException('Matricula cannot be empty');
        }
        $user =  $this->userRepository->findByMatricula($matricula);
        if(empty($user)){
            throw new DomainNotFoundException('Matricula not found');
        }
        return $user;
    }

}