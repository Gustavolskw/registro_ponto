<?php

namespace App\Domain\Interfaces;

use App\Domain\ValueObject\WorkJourney;

interface WorkJourneyDAO
{
    public function findById(int $id): ?WorkJourney;

    public function findAll(): array;

}