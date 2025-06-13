<?php

namespace App\Application\UseCases\WorkJourney;

use App\Domain\Entity\User;
use App\Domain\Entity\WorkJourney;
use App\Domain\Interfaces\WorkJourneyRepository;
use DateTime;

class WorkJourneyCreationCase
{

    public function __construct(private WorkJourneyRepository $workJourneyRepository)
    {

    }

    public function execute(User $user){
        $startMorningTime    = new DateTime('08:00');
        $endMorningTime      = new DateTime('12:00');
        $startAfternoonTime  = new DateTime('14:00');
        $endAfternoonTime    = new DateTime('18:00');

        $newWorkJourneyBuild = new WorkJourney(
            null,
            $user,
            $startMorningTime,
            $endMorningTime,
            $startAfternoonTime,
            $endAfternoonTime,
            null,
        );

        return $this->workJourneyRepository->save(
            $newWorkJourneyBuild
        );
    }


}