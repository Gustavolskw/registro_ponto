<?php

namespace App\Domain\DTO\Builders;

use App\Domain\Entity\User;
use DateTime;

class AppointmentRecordValidatorBuilder
{
    private User $user;
    private DateTime $date;
    private DateTime $time;

    public function __construct(User $user, DateTime $date, DateTime $time)
    {
        $this->user = $user;
        $this->date = $date;
        $this->time = $time;
    }

    public function getUser(): User
    {
        return $this->user;
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