<?php

namespace App\Application\UseCases\Appointament;

use App\Application\Domain\Exception\RegisterTimeOutOfWindowException;
use App\Domain\DTO\Builders\AppointmentRecordValidatorBuilder;
use App\Domain\Entity\AppointmentRecord;
use App\Domain\Interfaces\AppointmentRecordRepository;
use App\Domain\Interfaces\RegisterTypeDAO;
use App\Domain\ValueObject\RegisterType;
use DateTime;

class ValidateAppointmentRegisterCase
{

    public function __construct(private AppointmentRecordRepository $appointmentRecordRepository, private RegisterTypeDAO $registerTypeDAO)
    {
    }

    public function execute(AppointmentRecordValidatorBuilder $builder): RegisterType
    {
        $registerTypes = $this->registerTypeDAO->getAllRegisterTypes();
        $time = $builder->getTime()->format('H:i:s');
        $userId = $builder->getUser()->getId();
        $date = $builder->getDate();
        $userAppointments = $this->appointmentRecordRepository->getAllAppointmentsFromUserOnDay(
            $userId,
            $date,
        );

        $matchedRegisterType = $this->validateTimeWindow($registerTypes, $userId, $time, $date, $userAppointments);

        if (empty($matchedRegisterType)) {
            throw new RegisterTimeOutOfWindowException('Horário informado não pertence a nenhuma janela válida.');
        }

        return $matchedRegisterType;
    }


    public function validateTimeWindow(array $registerTypes, int $userId, string $time, DateTime $date, array $userAppointments): RegisterType|null
    {
        $matchedRegisterType = null;

        $lastAppointment = $this->getLastAppointment($userAppointments);
        $expectedNextRegisterType = $this->getExpectedNextRegisterType($lastAppointment?->getRegisterType(), $registerTypes);

        foreach ($registerTypes as $registerType) {
            // Skip if this is not the next expected type
            if ($expectedNextRegisterType && $registerType->getId() !== $expectedNextRegisterType->getId()) {
                continue;
            }

            $start = $registerType->getStartWindow()?->format('H:i:s');
            $end = $registerType->getEndWindow()?->format('H:i:s');

            if (!$registerType->isRequiresValidation()) {
                foreach ($userAppointments as $appointment) {
                    if ($appointment->getRegisterType()->getId() === $registerType->getId()) {
                        continue 2; // Skip this type entirely
                    }
                }
                $matchedRegisterType = $registerType;
                break;
            }

            if (!$start || !$end) {
                continue;
            }

            if ($time >= $start && $time <= $end) {
                $matchedRegisterType = $registerType;
                break;
            }
        }

        return $matchedRegisterType;
    }

    private function getLastAppointment(array $appointments): ?AppointmentRecord
    {
        if (empty($appointments)) return null;

        usort($appointments, fn($a, $b) => $a->getDateTime() <=> $b->getDateTime());

        return end($appointments);
    }

    private function getExpectedNextRegisterType(?RegisterType $lastType, array $allRegisterTypes): ?RegisterType
    {
        if (!$lastType) {
            // First registration of the day
            return $this->getRegisterTypeByName('Entrada Manhã', $allRegisterTypes);
        }

        // Define logical sequence of register types
        $sequence = [
            'Entrada Manhã' => 'Saída Manhã',
            'Saída Manhã'   => 'Entrada Tarde',
            'Entrada Tarde' => 'Saída Tarde',
            'Saída Tarde'   => 'Entrada Extra',
            'Entrada Extra' => 'Saída Extra',
        ];

        $lastName = $lastType->getName();
        $nextName = $sequence[$lastName] ?? null;

        return $nextName ? $this->getRegisterTypeByName($nextName, $allRegisterTypes) : null;
    }

// You must implement this helper to retrieve a RegisterType by name
    private function getRegisterTypeByName(string $name, array $allRegisterTypes): ?RegisterType
    {
        foreach ($allRegisterTypes as $type) {
            if ($type->getName() === $name) {
                return $type;
            }
        }
        return null;
    }
}