<?php

namespace App\Infrastructure\Persistence;

use App\Domain\DomainException\DomainNotFoundException;
use App\Domain\DTO\Data\AppointmentReportData;
use App\Domain\Entity\AppointmentRecord;
use App\Domain\Interfaces\AppointmentRecordRepository;
use App\Infrastructure\ObjectBuilder\ObjectBuilderTrait;
use DateTime;
use Exception;
use PDO;

class AppointmentRecordRepositoryImpl extends PersistenceRepository implements AppointmentRecordRepository
{
    use ObjectBuilderTrait;
    private $appointmentSql = "SELECT registros_ponto.id as registros_ponto_id, registros_ponto.data, registros_ponto.horario, registros_ponto.created_at as appointment_record_created_at,
users.id as user_id, users.matricula, users.nome, users.senha, users.created_at as user_created_at,
perfil.id as perfil_id, perfil.descricao,
jornada_trabalho.id as jornada_trabalho_id, jornada_trabalho.entrada_manha, jornada_trabalho.saida_manha, jornada_trabalho.entrada_tarde, jornada_trabalho.saida_tarde, jornada_trabalho.created_at as jornada_trabalho_created_at,
tipos_registro.id as tipo_registro_id, tipos_registro.nome, tipos_registro.ordem, tipos_registro.janela_inicio, tipos_registro.janela_fim, tipos_registro.exige_validacao, tipos_registro.created_at as tipos_registro_created_at
FROM registros_ponto 
INNER JOIN users ON users.id = registros_ponto.user_id
INNER JOIN perfil ON perfil.id = users.perfil_id
INNER JOIN jornada_trabalho ON jornada_trabalho.id = users.jornadaTrabalho_id 
INNER JOIN tipos_registro ON tipos_registro.id = registros_ponto.tipo_id";


    public function getAllRecords(): array
    {
        $query = $this->appointmentSql . " ORDER BY tipos_registro.ordem ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($record) {

        }, $records);

    }

    public function getRecordById(int $id): ?AppointmentRecord
    {
       $stmt = $this->pdo->prepare($this->appointmentSql . " WHERE registros_ponto.id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$result) {
           throw new DomainNotFoundException("Record with ID {$id} not found.");
        }
        return $this->buildAppointmentRecord($result['registros_ponto_id'], $result);
    }

    public function getRecordsFromUserByDateAndType(int $userId, DateTime $date, int $typeId): array
    {
        $stmt = $this->pdo->prepare($this->appointmentSql . " WHERE registros_ponto.user_id = :userId AND registros_ponto.data = :date AND tipos_registro.id = :typeId");
        $date = $date->format('Y-m-d');
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':date', $date, PDO::PARAM_STR);
        $stmt->bindParam(':typeId', $typeId, PDO::PARAM_INT);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($item) {
            return $this->buildAppointmentRecord($item['registros_ponto_id'], $item);
        }, $results);
    }

    public function saveRecord(AppointmentRecord $data): AppointmentRecord
    {
        try{
            $this->pdo->beginTransaction();
            $stmt = $this->pdo->prepare("INSERT INTO registros_ponto (user_id, tipo_id, data, horario) VALUES (:user_id, :tipo_id, :data, :horario)");
            $userId = $data->getUser()->getId();
            $typeId = $data->getRegisterType()->getId();
            $date = $data->getDate()->format('Y-m-d');
            $time = $data->getTime()->format('H:i:s');
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':tipo_id', $typeId, PDO::PARAM_INT);
            $stmt->bindParam(':data', $date, PDO::PARAM_STR);
            $stmt->bindParam(':horario', $time, PDO::PARAM_STR);
            $stmt->execute();
            $data->setId($this->pdo->lastInsertId());
            $this->pdo->commit();
            return $data;

        }catch (Exception){
            $this->pdo->rollBack();
        }
    }

    public function updateRecord(AppointmentRecord $data): AppointmentRecord
    {
        try{
            $this->pdo->beginTransaction();
            $stmt = $this->pdo->prepare("UPDATE registros_ponto SET horario = :horario WHERE id = :id");
            $id = $data->getId();
            $time = $data->getTime()->format('H:i:s');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':horario', $time, PDO::PARAM_STR);
            $stmt->execute();
            $data->setId($this->pdo->lastInsertId());
            $this->pdo->commit();
            return $data;

        }catch (Exception){
            $this->pdo->rollBack();
        }
    }

    public function deleteRecord(int $id): void
    {
        try{
            $this->pdo->beginTransaction();
            $stmt = $this->pdo->prepare("DELETE FROM registros_ponto WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $this->pdo->commit();
        }catch (Exception){
            $this->pdo->rollBack();
        }
    }

    public function getAllAppointmentsFromUserOnDay(int $userId, DateTime $date): array
    {
        $stmt = $this->pdo->prepare($this->appointmentSql . " WHERE registros_ponto.user_id = :userId AND registros_ponto.data = :date ORDER BY tipos_registro.ordem ASC");
        $date = $date->format('Y-m-d');
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':date', $date, PDO::PARAM_STR);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (empty($results)) {
            return [];
        }
        return array_map(function ($item) {
            return $this->buildAppointmentRecord($item['registros_ponto_id'], $item);
        }, $results);
    }

    public function generalReport(DateTime $date):array
    {
        $sql = "SELECT users.matricula AS matricula,
    users.nome AS nome,
    DATE(registros_ponto.data) AS data,
    MAX(CASE WHEN tipos_registro.nome = 'Entrada Manha' THEN TIME(registros_ponto.horario) END) AS entrada_manha,
    MAX(CASE WHEN tipos_registro.nome = 'Saida Manha' THEN TIME(registros_ponto.horario) END) AS saida_manha,
    MAX(CASE WHEN tipos_registro.nome = 'Entrada Tarde' THEN TIME(registros_ponto.horario) END) AS entrada_tarde,
    MAX(CASE WHEN tipos_registro.nome = 'Saida Tarde' THEN TIME(registros_ponto.horario) END) AS saida_tarde,
    MAX(CASE WHEN tipos_registro.nome = 'Entrada Extra' THEN TIME(registros_ponto.horario) END) AS entrada_extra,
    MAX(CASE WHEN tipos_registro.nome = 'Saida Extra' THEN TIME(registros_ponto.horario) END) AS saida_extra
FROM 
    registros_ponto
JOIN 
    users ON users.id = registros_ponto.user_id
JOIN 
    tipos_registro ON tipos_registro.id = registros_ponto.tipo_id
WHERE registros_ponto.data = :date
GROUP BY 
    users.matricula, users.nome, DATE(registros_ponto.data)
ORDER BY 
    users.nome, DATE(registros_ponto.data)";
    $stmt = $this->pdo->prepare($sql);
        $date = $date->format('Y-m-d');
        $stmt->bindParam(':date', $date, PDO::PARAM_STR);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (empty($results)) {
            return [];
        }
        return array_map(function ($item) {
            return new AppointmentReportData(
                $item['matricula'],
                $item['nome'],
                new DateTime($item['data']),
                !empty($item['entrada_manha']) ? new DateTime($item['entrada_manha']) : null,
                !empty($item['saida_manha']) ? new DateTime($item['saida_manha']) : null,
                !empty($item['entrada_tarde']) ? new DateTime($item['entrada_tarde']) : null,
                !empty($item['saida_tarde']) ? new DateTime($item['saida_tarde']) : null,
                !empty($item['entrada_extra']) ? new DateTime($item['entrada_extra']) : null,
                !empty($item['saida_extra']) ? new DateTime($item['saida_extra']) : null
            );
        }, $results);

    }
}