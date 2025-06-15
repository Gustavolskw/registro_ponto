<?php

namespace App\Domain\DTO\Builders;

use DateTime;

class AppointmentRecordBuilder
{
    private int $userId;
    private DateTime $date;
    private DateTime $time;

    public function __construct($userId, DateTime $date, DateTime $time)
    {
        $this->userId = $userId;
        $this->date = $date;
        $this->time = $time;
    }

    public function getUserId(): int
    {
        return $this->userId;
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