<?php

namespace App\Infrastructure\DAO;

use App\Domain\Interfaces\ProfileDAO;
use App\Domain\Interfaces\UserRepository;
use App\Domain\ValueObject\Profile;
use App\Infrastructure\ObjectBuilder\ObjectBuilderTrait;
use App\Infrastructure\Persistence\PersistenceRepository;
use PDO;

class ProfileDAOImpl extends PersistenceRepository implements ProfileDAO
{
    use ObjectBuilderTrait;

    private $profileSql = "SELECT perfil.id as perfil_id, perfil.descricao
FROM perfil";

    public function getAllProfiles(): array
    {
        $stmt = $this->pdo->query($this->profileSql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($result)) {
            return array_map(
                function ($item) {
                    return $this->buildProfile($item['perfil_id'], $item);
                },
                $result
            );
        }
        return [];
    }

    public function getProfileById(int $id): ?Profile
    {
        $stmt = $this->pdo->prepare($this->profileSql . " WHERE perfil.id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (empty($result)) {
            throw new \Exception("Profile with ID {$id} not found.");
        }
        return $this->buildProfile($result['perfil_id'], $result);
    }
}