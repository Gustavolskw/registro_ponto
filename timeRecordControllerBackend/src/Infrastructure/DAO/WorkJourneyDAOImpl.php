<?php

namespace App\Infrastructure\DAO;

use App\Domain\Interfaces\AppointmentRecordRepository;
use App\Domain\Interfaces\WorkJourneyDAO;
use App\Domain\ValueObject\WorkJourney;
use App\Infrastructure\ObjectBuilder\ObjectBuilderTrait;
use App\Infrastructure\Persistence\PersistenceRepository;

class WorkJourneyDAOImpl extends PersistenceRepository implements WorkJourneyDAO
{
    use ObjectBuilderTrait;
    private $workJourneySql = "SELECT jornada_trabalho.id as jornada_trabalho_id, jornada_trabalho.entrada_manha, 
    jornada_trabalho.saida_manha, jornada_trabalho.entrada_tarde, jornada_trabalho.saida_tarde, 
    jornada_trabalho.created_at as jornada_trabalho_created_at
    FROM jornada_trabalho";
    public function findById(int $id): ?WorkJourney
    {
       $stmt = $this->pdo->prepare($this->workJourneySql . " WHERE jornada_trabalho.id = :id");
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (empty($result)) {
            throw new \Exception("Work journey with ID {$id} not found.");
        }
        return $this->buildWorkJouney($result['jornada_trabalho_id'], $result);
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query($this->workJourneySql);
        $results = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        if (!empty($results)) {
            return array_map(
                function ($item) {
                    return $this->buildWorkJouney($item['jornada_trabalho_id'], $item);
                },
                $results
            );
        }
        return [];
    }
}