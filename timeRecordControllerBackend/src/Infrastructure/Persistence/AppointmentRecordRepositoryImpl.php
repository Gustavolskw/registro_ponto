<?php

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\AppointmentRecord;
use App\Domain\Interfaces\AppointmentRecordRepository;

class AppointmentRecordRepositoryImpl implements AppointmentRecordRepository
{

    public function getAllRecords(): array
    {
        // TODO: Implement getAllRecords() method.
    }

    public function getRecordById(int $id): ?AppointmentRecord
    {
        // TODO: Implement getRecordById() method.
    }

    public function saveRecord(AppointmentRecord $data): AppointmentRecord
    {
        // TODO: Implement saveRecord() method.
    }

    public function updateRecord(int $id, AppointmentRecord $data): AppointmentRecord
    {
        // TODO: Implement updateRecord() method.
    }

    public function deleteRecord(int $id): bool
    {
        // TODO: Implement deleteRecord() method.
    }
}