<?php

namespace App\Domain\ValueObject;

use DateTime;

class RegisterType
{
    private int $id;
    private string $name;
    private int $order;
    private DateTime $startWindow;
    private DateTime $endWindow;
    private bool $requiresValidation;
    private DateTime $createdAt;

    public function __construct(
        ?int $id,
        string $name,
        int $order,
        DateTime $startWindow,
        DateTime $endWindow,
        bool $requiresValidation,
        ?DateTime $createdAt
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->order = $order;
        $this->startWindow = $startWindow;
        $this->endWindow = $endWindow;
        $this->requiresValidation = $requiresValidation;
        $this->createdAt = $createdAt;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getOrder(): int
    {
        return $this->order;
    }

    public function getStartWindow(): DateTime
    {
        return $this->startWindow;
    }

    public function getEndWindow(): DateTime
    {
        return $this->endWindow;
    }

    public function isRequiresValidation(): bool
    {
        return $this->requiresValidation;
    }

    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function setOrder(int $order): void
    {
        $this->order = $order;
    }

    public function setStartWindow(DateTime $startWindow): void
    {
        $this->startWindow = $startWindow;
    }

    public function setEndWindow(DateTime $endWindow): void
    {
        $this->endWindow = $endWindow;
    }

    public function setRequiresValidation(bool $requiresValidation): void
    {
        $this->requiresValidation = $requiresValidation;
    }
}