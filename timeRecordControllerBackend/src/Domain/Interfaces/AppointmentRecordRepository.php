<?php

namespace App\Domain\Interfaces;

use App\Domain\Entity\AppointmentRecord;

interface AppointmentRecordRepository
{
    public function getAllRecords(): array;

    public function getRecordById(int $id): ?AppointmentRecord;

    public function saveRecord(array $data):AppointmentRecord;

    public function updateRecord(int $id, array $data): AppointmentRecord;

    public function deleteRecord(int $id): bool;

}