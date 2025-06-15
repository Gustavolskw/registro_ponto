<?php

namespace App\Domain\DTO\Data;

use App\Domain\ValueObject\WorkJourney;

class WorkJourneyData
{

    private WorkJourney $workJourney;

    public function __construct(WorkJourney $workJourney)
    {
        $this->workJourney = $workJourney;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->workJourney->getId(),
            'entradaManha' => $this->workJourney->getEntradaManha(),
            'saidaManha' => $this->workJourney->getSaidaManha(),
            'entradaTarde' => $this->workJourney->getEntradaTarde(),
            'saidaTarde' => $this->workJourney->getSaidaTarde(),
        ];
    }

}