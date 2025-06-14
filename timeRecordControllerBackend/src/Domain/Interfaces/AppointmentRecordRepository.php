<?php

namespace App\Domain\Interfaces;

use App\Domain\Entity\AppointmentRecord;
use DateTime;

interface AppointmentRecordRepository
{
    public function getAllRecords(): array;
    public function getRecordById(int $id): ?AppointmentRecord;
    public function getRecordsFromUserByDateAndType(int $userId, DateTime $date, int $typeId): array;
    public function saveRecord(AppointmentRecord $data):AppointmentRecord;
    public function updateRecord(AppointmentRecord $data): AppointmentRecord;
    public function deleteRecord(int $id): void;

}