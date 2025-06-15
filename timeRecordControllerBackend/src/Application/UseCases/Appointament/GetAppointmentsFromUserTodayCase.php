<?php

namespace App\Application\UseCases\Appointament;

use App\Domain\DTO\Data\AppointmentRecordData;
use App\Domain\Interfaces\AppointmentRecordRepository;

class GetAppointmentsFromUserTodayCase
{
    public function __construct(private AppointmentRecordRepository $appointmentRecordRepository)
    {
    }
    public function execute(int $userId){
        $actualDate = new \DateTime('now', new \DateTimeZone('America/Sao_Paulo'));
        $appointments = $this->appointmentRecordRepository->getAllAppointmentsFromUserOnDay($userId, $actualDate);
        return array_map(function ($appointment) {
            return new AppointmentRecordData($appointment);
        }, $appointments);
    }

}