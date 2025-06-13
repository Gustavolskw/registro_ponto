<?php

namespace App\Domain\Interfaces;

use App\Domain\Entity\User;

interface UserRepository
{

    public function findById(int $id): ?User;
    public function findAll(): array;
    public function findByMatricula(int $matricula): ?User;
    public function save(User $user): User;

    public function inactivate(int $id): void;
    public function reactivate(int $id): void;

    public function update(array $user): void;

}