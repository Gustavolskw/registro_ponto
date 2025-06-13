<?php

namespace App\Domain\DTO\Builders;

use DateTime;

class AppointmentRecordBuilder
{
    private int $userId;
    private int $appointmentTypeId;
    private DateTime $date;
    private DateTime $time;

    public function __construct($userId, int $appointmentTypeId, DateTime $date, DateTime $time)
    {
        $this->userId = $userId;
        $this->appointmentTypeId = $appointmentTypeId;
        $this->date = $date;
        $this->time = $time;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getAppointmentTypeId(): int
    {
        return $this->appointmentTypeId;
    }

    public function getDate(): DateTime
    {
        return $this->date;
    }

    public function getTime(): DateTime
    {
        return $this->time;
    }
}