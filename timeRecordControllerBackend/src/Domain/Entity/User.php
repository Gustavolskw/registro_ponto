<?php

namespace App\Domain\Entity;

use App\Domain\ValueObject\Profile;
use App\Domain\ValueObject\WorkJourney;
use DateTimeInterface;

class User
{

    private int|null $id;
    private int $matricula;
    private string $name;
    private string|null $password;
    private Profile  $profile;
    private WorkJourney $workJourney;
    private DateTimeInterface|null $createdAt;

    public function __construct(?int $id, int $matricula,  string $name, ?string $password, Profile $profile, WorkJourney $workJourney,  ?DateTimeInterface $createdAt)
    {
        $this->id = $id??null;
        $this->matricula = $matricula;
        $this->name = $name;
        $this->password = $password??null;
        $this->profile = $profile;
        $this->workJourney = $workJourney;
        $this->createdAt = $createdAt??null;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getMatricula(): int
    {
        return $this->matricula;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPassword(): string|null
    {
        return $this->password;
    }

    public function getProfile(): Profile
    {
        return $this->profile;
    }
    public function getWorkJourney(): WorkJourney
    {
        return $this->workJourney;
    }

    public function getCreatedAt(): DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function setProfile(Profile $profile): void
    {
        $this->profile = $profile;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    public function setCreatedAt(?DateTimeInterface $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

}