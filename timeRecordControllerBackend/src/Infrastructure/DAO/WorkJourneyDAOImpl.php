<?php

namespace App\Infrastructure\DAO;

use App\Domain\Interfaces\AppointmentRecordRepository;
use App\Domain\Interfaces\WorkJourneyDAO;
use App\Domain\ValueObject\WorkJourney;

class WorkJourneyDAOImpl implements WorkJourneyDAO
{

    public function findById(int $id): ?WorkJourney
    {
        // TODO: Implement findById() method.
    }

    public function findAll(): array
    {
        // TODO: Implement findAll() method.
    }
}