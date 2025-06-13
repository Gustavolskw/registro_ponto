<?php

namespace App\Domain\Entity;

use App\Domain\ValueObject\Profile;
use DateTimeInterface;

class User
{

    private int $id;
    private int $matricula;
    private string $name;
    private string $password;
    private Profile  $profile;
    private DateTimeInterface $createdAt;

    public function __construct(?int $id, int $matricula,  string $name, string $password, Profile $profile, ?DateTimeInterface $createdAt)
    {
        $this->id = $id;
        $this->matricula = $matricula;
        $this->name = $name;
        $this->password = $password;
        $this->profile = $profile;
        $this->createdAt = $createdAt;
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

    public function getPassword(): string
    {
        return $this->password;
    }

    public function getProfile(): Profile
    {
        return $this->profile;
    }

    public function getCreatedAt(): DateTimeInterface
    {
        return $this->createdAt;
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
}