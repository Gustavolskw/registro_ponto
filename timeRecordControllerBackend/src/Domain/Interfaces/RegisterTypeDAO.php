<?php

namespace App\Domain\Interfaces;

use App\Domain\ValueObject\RegisterType;

interface RegisterTypeDAO
{
    public function getAllRegisterTypes(): array;
    public function getRegisterTypeById(int $id): ?RegisterType;

}