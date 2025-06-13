<?php
namespace App\Domain\DTO\Builders;

class UserBuilder
{

    private string $name;
    private string $password;
    private int $profileId;
    private int $workJourneyId;


    public function __construct(string $name, string $password, int $profileId, int $workJourneyId)
    {
        $this->name = $name;
        $this->password = $password;
        $this->profileId = $profileId;
        $this->workJourneyId = $workJourneyId;
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
    public function getWorkJourneyId(): int
    {
        return $this->workJourneyId;
    }
}