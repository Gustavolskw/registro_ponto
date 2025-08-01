<?php

namespace App\Infrastructure\Persistence;

use App\Domain\DomainException\DomainNotFoundException;
use App\Domain\Entity\User;
use App\Domain\Interfaces\UserRepository;
use App\Infrastructure\ObjectBuilder\ObjectBuilderTrait;
use PDO;

class UserRepositoryImpl extends PersistenceRepository implements UserRepository
{
    use ObjectBuilderTrait;

    private $userSql = "SELECT users.id as user_id, users.nome, users.matricula, users.senha, users.created_at as user_created_at,
                        perfil.id as perfil_id, perfil.descricao, 
                        jornada_trabalho.id as jornada_trabalho_id, jornada_trabalho.entrada_manha, jornada_trabalho.saida_manha, jornada_trabalho.entrada_tarde, jornada_trabalho.saida_tarde, jornada_trabalho.created_at as jornada_trabalho_created_at
                        FROM users
                        INNER JOIN perfil ON users.perfil_id = perfil.id
                        INNER JOIN jornada_trabalho ON users.jornadaTrabalho_id = jornada_trabalho.id";

    public function findById(int $id): ?User
    {
        $stmt = $this->pdo->prepare($this->userSql . " WHERE users.id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            throw new \Exception("User with ID {$id} not found.");
        }
        return $this->buildUser($result['user_id'], $result);

    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query($this->userSql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {
            return array_map(
                function ($item) {
                    return $this->buildUser($item['user_id'],$item);
                },
                $result
            );
        }
        return [];
    }

    public function findByMatricula(int $matricula): ?User
    {
        $stmt = $this->pdo->prepare($this->userSql . " WHERE users.matricula = :matricula");
        $stmt->bindParam(':matricula', $matricula, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            throw new DomainNotFoundException("User with matricula {$matricula} not found.");
        }
        return $this->buildUser($result['user_id'], $result);
    }

    public function findByMatriculaAndPasswordNull(int $matricula): ?User
    {
        $stmt = $this->pdo->prepare($this->userSql . " WHERE users.matricula = :matricula AND users.senha IS NULL");
        $stmt->bindParam(':matricula', $matricula, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            return null; // User not found or password is not null
        }
        return $this->buildUser($result['user_id'], $result);
    }

    public function existsByMatricula(int $matricula): bool
    {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM users WHERE matricula = :matricula");
        $stmt->bindParam(':matricula', $matricula, PDO::PARAM_INT);
        $stmt->execute();
        $count = $stmt->fetchColumn();

        return $count > 0;
    }

    public function save(User $user): User
    {
        try {
            $this->pdo->beginTransaction();
            $stmt = $this->pdo->prepare("INSERT INTO users (nome, matricula, senha, perfil_id, jornadaTrabalho_id) 
                                      VALUES (:nome, :matricula, :senha, :perfil_id, :jornadaTrabalho_id)");

            $name = $user->getName();
            $matricula = $user->getMatricula();
            $password = $user->getPassword();
            $profileId = $user->getProfile()->getId();
            $workJourneyId = $user->getWorkJourney()->getId();
            $stmt->bindParam(':nome', $name);
            $stmt->bindParam(':matricula', $matricula);
            $stmt->bindParam(':senha', $password);
            $stmt->bindParam(':perfil_id', $profileId, PDO::PARAM_INT);
            $stmt->bindParam(':jornadaTrabalho_id', $workJourneyId, PDO::PARAM_INT);
            $stmt->execute();
            $user->setId($this->pdo->lastInsertId());
            $user->setCreatedAt(new \DateTime());
            $this->pdo->commit();
            return $user;
        } catch (\Exception $exception) {
            $this->pdo->rollBack();
            throw new \DomainException("User with ID {$user->getId()} could not be saved.");
        }
    }

    public function inactivate(int $id): void
    {
        $stmt = $this->pdo->prepare("UPDATE users SET ativo = 0 WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        if (!$stmt->execute()) {
            throw new \DomainException("User with ID {$id} could not be inactivated.");
        }
    }

    public function reactivate(int $id): void
    {
        $stmt = $this->pdo->prepare("UPDATE users SET ativo = 1 WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        if (!$stmt->execute()) {
            throw new \DomainException("User with ID {$id} could not be reactivated.");
        }
    }

    public function update(User $user): User
    {
        try {
            $this->pdo->beginTransaction();
            $stmt = $this->pdo->prepare("UPDATE users SET nome = :nome, senha = :senha, perfil_id = :perfil_id, jornadaTrabalho_id = :jornadaTrabalho_id WHERE id = :id");
            $id = $user->getId();
            $name = $user->getName();
            $matricula = $user->getMatricula();
            $password = $user->getPassword();
            $profileId = $user->getProfile()->getId();
            $workJourneyId = $user->getWorkJourney()->getId();
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':nome', $name);
            $stmt->bindParam(':senha', $password);
            $stmt->bindParam(':perfil_id', $profileId , PDO::PARAM_INT);
            $stmt->bindParam(':jornadaTrabalho_id', $workJourneyId, PDO::PARAM_INT);
            $stmt->execute();
            $this->pdo->commit();
            return $user;
        } catch (\Exception $exception) {
            $this->pdo->rollBack();
            throw new \DomainException("User with ID {$id} could not be updated.");
        }
    }
}