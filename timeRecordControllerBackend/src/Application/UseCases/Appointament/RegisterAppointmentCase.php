<?php

namespace App\Application\UseCases\Appointament;

use App\Domain\DTO\Builders\AppointmentRecordBuilder;
use App\Domain\DTO\Builders\AppointmentRecordValidatorBuilder;
use App\Domain\DTO\Data\AppointmentRecordData;
use App\Domain\Entity\AppointmentRecord;
use App\Domain\Entity\User;
use App\Domain\Interfaces\AppointmentRecordRepository;
use App\Domain\Interfaces\UserRepository;
use InvalidArgumentException;

class RegisterAppointmentCase
{
    public function __construct(private AppointmentRecordRepository $appointmentRecordRepository,
                                private UserRepository $userRepository,
                                private ValidateAppointmentRegisterCase $validateAppointmentRegisterCase){}

    public function execute(AppointmentRecordBuilder $appointmentRecordBuilder): AppointmentRecordData
    {
        $user = $this->validateUser($appointmentRecordBuilder->getUserId());

        $registerBuilder = new AppointmentRecordValidatorBuilder(
            $user,
            $appointmentRecordBuilder->getDate(),
            $appointmentRecordBuilder->getTime(),
        );
        $registerType = $this->validateAppointmentRegisterCase->execute(
        $registerBuilder
        );

        $appointmentRecord = new AppointmentRecord(
          null,
            $user,
            $registerType,
            $appointmentRecordBuilder->getDate(),
            $appointmentRecordBuilder->getTime(),
            null
        );

        $newAppointmentRecord = $this->appointmentRecordRepository->saveRecord($appointmentRecord);
        return new AppointmentRecordData($newAppointmentRecord);
    }
    public function validateUser($userId): User
    {
        if(empty($userId)){
            throw new InvalidArgumentException("User ID cannot be empty.");
        }
        $user = $this->userRepository->findById($userId);
        if(!$user){
            throw new InvalidArgumentException("User with ID {$userId} does not exist.");
        }
        return $user;
    }
}