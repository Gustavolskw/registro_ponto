<?php

namespace App\Application\UseCases\WorkJourney;

use App\Domain\DTO\Data\WorkJourneyData;
use App\Domain\Interfaces\WorkJourneyDAO;

class GetAllWorkJourneyCase
{
    public function __construct(private WorkJourneyDAO $workJourneyDAO)
    {
    }

    public function execute(): array
    {
        $workJourneys =  $this->workJourneyDAO->findAll();
        return array_map(
            fn($workJourney) => new WorkJourneyData($workJourney),
            $workJourneys
        );
    }

}