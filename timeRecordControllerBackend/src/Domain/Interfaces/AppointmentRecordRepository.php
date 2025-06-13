<?php

namespace App\Domain\Interfaces;

use App\Domain\Entity\AppointmentRecord;

interface AppointmentRecordRepository
{
    public function getAllRecords(): array;

    public function getRecordById(int $id): ?AppointmentRecord;

    public function saveRecord(AppointmentRecord $data):AppointmentRecord;

    public function updateRecord(int $id, AppointmentRecord $data): AppointmentRecord;

    public function deleteRecord(int $id): bool;

}