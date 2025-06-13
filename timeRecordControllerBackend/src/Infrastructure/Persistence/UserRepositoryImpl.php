<?php

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\User;
use App\Domain\Interfaces\UserRepository;

class UserRepositoryImpl implements UserRepository
{

    public function findById(int $id): ?User
    {
        // TODO: Implement findById() method.
    }

    public function findAll(): array
    {
        // TODO: Implement findAll() method.
    }

    public function findByMatricula(int $matricula): ?User
    {
        // TODO: Implement findByMatricula() method.
    }

    public function findByMatriculaAndPasswordNull(int $matricula): ?User
    {
        // TODO: Implement findByMatriculaAndPasswordNull() method.
    }

    public function existsByMatricula(int $matricula): bool
    {
        // TODO: Implement existsByMatricula() method.
    }

    public function save(User $user): User
    {
        // TODO: Implement save() method.
    }

    public function inactivate(int $id): void
    {
        // TODO: Implement inactivate() method.
    }

    public function reactivate(int $id): void
    {
        // TODO: Implement reactivate() method.
    }

    public function update(User $user): void
    {
        // TODO: Implement update() method.
    }
}