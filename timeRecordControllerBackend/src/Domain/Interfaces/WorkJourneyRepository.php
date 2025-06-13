<?php

namespace App\Domain\Interfaces;

use App\Domain\Entity\WorkJourney;

interface WorkJourneyRepository
{
    public function findById(int $id): ?WorkJourney;

    public function findAll(): array;

    public function save(WorkJourney $workJourney): WorkJourney;

    public function delete(int $id): void;

    public function update(int $id, array $workJourney): void;

}