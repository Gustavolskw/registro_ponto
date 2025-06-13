<?php

namespace App\Domain\Interfaces;

use App\Domain\Entity\RegisterType;

interface RegisterTypeRepository
{
    public function getAllRegisterTypes(): array;
    public function getRegisterTypeById(int $id): ?RegisterType;
    public function saveRegisterType(array $data): RegisterType;
    public function updateRegisterType(int $id, array $data): RegisterType;
    public function deleteRegisterType(int $id): bool;

}