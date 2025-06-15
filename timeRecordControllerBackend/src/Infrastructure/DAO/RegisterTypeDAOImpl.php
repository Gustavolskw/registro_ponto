<?php

namespace App\Infrastructure\DAO;

use App\Domain\Interfaces\AppointmentRecordRepository;
use App\Domain\Interfaces\RegisterTypeDAO;
use App\Domain\ValueObject\RegisterType;
use App\Infrastructure\ObjectBuilder\ObjectBuilderTrait;
use App\Infrastructure\Persistence\PersistenceRepository;

class RegisterTypeDAOImpl extends PersistenceRepository implements RegisterTypeDAO
{
    use ObjectBuilderTrait;
    private $registerTypeSql = "SELECT tipos_registro.id as tipo_registro_id, tipos_registro.nome, tipos_registro.ordem, tipos_registro.janela_inicio , tipos_registro.janela_fim, tipos_registro.exige_validacao, tipos_registro.created_at as tipos_registro_created_at
FROM tipos_registro";

    public function getAllRegisterTypes(): array
    {
        $stmt = $this->pdo->query($this->registerTypeSql);
        $results = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        if (!empty($results)) {
            return array_map(
                function ($item) {
                    return $this->buildRegisterType($item['tipo_registro_id'], $item);
                },
                $results
            );
        }
        return [];
    }

    public function getRegisterTypeById(int $id): ?RegisterType
    {
        $stmt = $this->pdo->prepare($this->registerTypeSql . " WHERE tipos_registro.id = :id");
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (empty($result)) {
            throw new \Exception("Register type with ID {$id} not found.");
        }
        return $this->buildRegisterType($result['tipo_registro_id'], $result);
    }
}