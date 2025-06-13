<?php

namespace App\Domain\Interfaces;

use App\Domain\Entity\User;

interface UserRepository
{

    public function findById(int $id): ?User;
    public function findAll(): array;
    public function findByMatricula(int $matricula): ?User;
    public function findByMatriculaAndPasswordNull(int $matricula): ?User;
    public function existsByMatricula(int $matricula): bool;
    public function save(User $user): User;
    public function inactivate(int $id): void;
    public function reactivate(int $id): void;
    public function update(User $user): void;

}