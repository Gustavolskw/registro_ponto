<?php

namespace App\Application\UseCases\Appointament;

use App\Domain\DTO\Builders\AppointmentRecordBuilder;
use App\Domain\Entity\RegisterType;
use App\Domain\Entity\User;
use App\Domain\Interfaces\AppointmentRecordRepository;
use App\Domain\Interfaces\RegisterTypeRepository;
use App\Domain\Interfaces\UserRepository;
use InvalidArgumentException;

class CreateAppointmentCase
{
    public function __construct(private AppointmentRecordRepository $appointmentRecordRepository, private RegisterTypeRepository $registerTypeRepository, private UserRepository $userRepository){}

    public function execute(AppointmentRecordBuilder $appointmentRecordBuilder): void
    {
        $this->validateAppointmentType($appointmentRecordBuilder->getAppointmentTypeId());

    }
    public function validateAppointmentType($typeId): RegisterType
    {
        if(empty($typeId)){
            throw new InvalidArgumentException("Appointment type ID cannot be empty.");
        }
        $AppointmentType = $this->registerTypeRepository->getRegisterTypeById($typeId);
        if(!$AppointmentType){
            throw new InvalidArgumentException("Appointment type with ID {$typeId} does not exist.");
        }
        return $AppointmentType;
    }
    public function validateUser($userId): User
    {
        if(empty($userId)){
            throw new InvalidArgumentException("User ID cannot be empty.");
        }
        // Assuming there's a method to validate user existence
        $user = $this->userRepository->findById($userId);
        if(!$user){
            throw new InvalidArgumentException("User with ID {$userId} does not exist.");
        }
        return $user;
    }
}