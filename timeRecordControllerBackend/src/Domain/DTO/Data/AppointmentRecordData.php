<?php

namespace App\Domain\DTO\Data;


use App\Domain\Entity\AppointmentRecord;

class AppointmentRecordData
{

    private AppointmentRecord $appointmentRecord;
    public function __construct(AppointmentRecord $appointmentRecord)
    {
        $this->appointmentRecord = $appointmentRecord;
    }
    public function toArray(): array
    {
        return [
            'id' => $this->appointmentRecord->getId(),
            'user' =>[
                'id' => $this->appointmentRecord->getUser()->getId(),
                'name' => $this->appointmentRecord->getUser()->getName(),
            ],
            'appointmentType' => [
                'id' => $this->appointmentRecord->getRegisterType()->getId(),
                'description' => $this->appointmentRecord->getRegisterType()->getName(),
            ],
            'date' => $this->appointmentRecord->getDate(),
            'time' => $this->appointmentRecord->getTime(),
        ];
    }

}