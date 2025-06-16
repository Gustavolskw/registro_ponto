<?php

namespace App\Domain\Entity;

use App\Domain\ValueObject\RegisterType;
use DateTime;
use DateTimeInterface;

class AppointmentRecord
{
    private int|null $id;
    private User $user;
    private RegisterType  $registerType;
    private DateTime $date;
    private DateTime $time;
    private DateTime|null $createdAt;

    public function __construct(
        ?int $id,
        User $user,
        RegisterType $registerType,
        DateTime $date,
        DateTime $time,
        ?DateTime $createdAt
    ) {
        $this->id = $id ?? null;
        $this->user = $user;
        $this->registerType = $registerType;
        $this->date = $date;
        $this->time = $time;
        $this->createdAt = $createdAt??null;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getRegisterType(): RegisterType
    {
        return $this->registerType;
    }

    public function getDate(): DateTime
    {
        return $this->date;
    }

    public function getTime(): DateTime
    {
        return $this->time;
    }

    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function setRegisterType(RegisterType $registerType): void
    {
        $this->registerType = $registerType;
    }

    public function setDate(DateTime $date): void
    {
        $this->date = $date;
    }

    public function setTime(DateTime $time): void
    {
        $this->time = $time;
    }

    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getDateTime(): DateTime
    {
        return new DateTime($this->date->format('Y-m-d') . ' ' . $this->time->format('H:i:s'));
    }


}