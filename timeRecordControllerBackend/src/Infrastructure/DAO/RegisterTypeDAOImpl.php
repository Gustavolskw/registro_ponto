<?php

namespace App\Infrastructure\DAO;

use App\Domain\Interfaces\AppointmentRecordRepository;
use App\Domain\Interfaces\RegisterTypeDAO;
use App\Domain\ValueObject\RegisterType;

class RegisterTypeDAOImpl implements RegisterTypeDAO
{

    public function getAllRegisterTypes(): array
    {
        // TODO: Implement getAllRegisterTypes() method.
    }

    public function getRegisterTypeById(int $id): ?RegisterType
    {
        // TODO: Implement getRegisterTypeById() method.
    }
}