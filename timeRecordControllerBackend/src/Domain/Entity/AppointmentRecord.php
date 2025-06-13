<?php

namespace App\Domain\Entity;

use App\Domain\ValueObject\RegisterType;
use DateTime;
use DateTimeInterface;

class AppointmentRecord
{
    private int $id;
    private User $user;
    private RegisterType  $registerType;
    private DateTime $date;
    private DateTime $time;
    private DateTimeInterface $createdAt;

    public function __construct(
        ?int $id,
        User $user,
        RegisterType $registerType,
        DateTime $date,
        DateTime $time,
        ?DateTimeInterface $createdAt
    ) {
        $this->id = $id;
        $this->user = $user;
        $this->registerType = $registerType;
        $this->date = $date;
        $this->time = $time;
        $this->createdAt = $createdAt;
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

    public function getDate(): string
    {
        return $this->date->format('Y-m-d');
    }

    public function getTime(): string
    {
        return $this->time->format('H:i:s');
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt->format('Y-m-d H:i:s');
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
}