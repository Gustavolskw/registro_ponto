<?php

namespace App\Application\UseCases\Appointament;

use App\Domain\DTO\Builders\AppointmentRecordBuilder;
use App\Domain\DTO\Data\AppointmentRecordData;
use App\Domain\Entity\AppointmentRecord;
use App\Domain\Entity\User;
use App\Domain\Interfaces\AppointmentRecordRepository;
use App\Domain\Interfaces\RegisterTypeDAO;
use App\Domain\Interfaces\UserRepository;
use App\Domain\ValueObject\RegisterType;
use InvalidArgumentException;

class RegisterAppointmentCase
{
    public function __construct(private AppointmentRecordRepository $appointmentRecordRepository, private RegisterTypeDAO $registerTypeRepository, private UserRepository $userRepository){}

    public function execute(AppointmentRecordBuilder $appointmentRecordBuilder): AppointmentRecordData
    {
        $type = $this->validateAppointmentType($appointmentRecordBuilder->getAppointmentTypeId());
        $user = $this->validateUser($appointmentRecordBuilder->getUserId());

        $appointmentRecord = new AppointmentRecord(
          null,
            $user,
            $type,
            $appointmentRecordBuilder->getDate(),
            $appointmentRecordBuilder->getTime(),
            null
        );

        $newAppointmentRecord = $this->appointmentRecordRepository->saveRecord($appointmentRecord);
        return new AppointmentRecordData($newAppointmentRecord);
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
        $user = $this->userRepository->findById($userId);
        if(!$user){
            throw new InvalidArgumentException("User with ID {$userId} does not exist.");
        }
        return $user;
    }
}