<?php
namespace App\Domain\DTO\Builders;

class UserBuilder
{

    private int $id;
    private int $matricula;
    private string $name;
    private string $password;
    private int $profileId;


    public function __construct(int $id, int $matricula,  string $name, string $password, int $profileId)
    {
        $this->id = $id;
        $this->matricula = $matricula;
        $this->name = $name;
        $this->password = $password;
        $this->profileId = $profileId;
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
    public function getProfileId(): int
    {
        return $this->profileId;
    }




}