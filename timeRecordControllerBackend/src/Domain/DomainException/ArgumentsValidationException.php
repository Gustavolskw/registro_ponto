<?php

namespace App\Domain\DomainException;

class ArgumentsValidationException extends \Exception
{
    private array $errors;

    public function __construct(array $errors)
    {
        parent::__construct("Validation failed", 422);
        $this->errors = $errors;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}