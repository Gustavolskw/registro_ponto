<?php

namespace App\Domain\Entity;

use DateTime;
use DateTimeInterface;

class WorkJourney
{
    private int $id;
    private User $user;
    private DateTime $entradaManha;
    private DateTime $saidaManha;
    private DateTime $entradaTarde;
    private DateTime $saidaTarde;
    private DateTimeInterface $createdAt;

    public function __construct(
        ?int $id,
        User $user,
        DateTime $entradaManha,
        DateTime $saidaManha,
        DateTime $entradaTarde,
        DateTime $saidaTarde,
        ?DateTimeInterface $createdAt
    ) {
        $this->id = $id;
        $this->user = $user;
        $this->entradaManha = $entradaManha;
        $this->saidaManha = $saidaManha;
        $this->entradaTarde = $entradaTarde;
        $this->saidaTarde = $saidaTarde;
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

    public function getEntradaManha(): string
    {
        return $this->entradaManha->format('H:i:s');
    }

    public function getSaidaManha(): string
    {
        return $this->saidaManha->format('H:i:s');
    }

    public function getEntradaTarde(): string
    {
        return $this->entradaTarde->format('H:i:s');
    }

    public function getSaidaTarde(): string
    {
        return $this->saidaTarde->format('H:i:s');
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt->format('Y-m-d H:i:s');
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function setEntradaManha(DateTime $entradaManha): void
    {
        $this->entradaManha = $entradaManha;
    }

    public function setSaidaManha(DateTime $saidaManha): void
    {
        $this->saidaManha = $saidaManha;
    }

    public function setEntradaTarde(DateTime $entradaTarde): void
    {
        $this->entradaTarde = $entradaTarde;
    }

    public function setSaidaTarde(DateTime $saidaTarde): void
    {
        $this->saidaTarde = $saidaTarde;
    }
}
