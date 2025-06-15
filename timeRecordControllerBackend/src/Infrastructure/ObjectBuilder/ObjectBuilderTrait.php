<?php

namespace App\Infrastructure\ObjectBuilder;

use App\Domain\Entity\AppointmentRecord;
use App\Domain\Entity\User;
use App\Domain\ValueObject\Profile;
use App\Domain\ValueObject\RegisterType;
use App\Domain\ValueObject\WorkJourney;
use DateTime;

trait ObjectBuilderTrait
{

    public function buildUser(int $userId, array $data): User
    {
        $workJouney = $this->buildWorkJouney($data['jornada_trabalho_id'], $data);
        $profile = $this->buildProfile($data['perfil_id'], $data);
        return new User(
            $userId,
            $data['matricula'],
            $data['nome'],
            $data['senha'],
            $profile,
            $workJouney,
            new DateTime($data['user_created_at']) ?? null
        );
    }
    public function buildWorkJouney(int $workJouneyId, array $data): WorkJourney
    {
        return new WorkJourney(
            $workJouneyId,
            new DateTime($data['entrada_manha']) ?? null,
            new DateTime($data['saida_manha']) ?? null,
            new DateTime($data['entrada_tarde']) ?? null,
            new DateTime($data['saida_tarde']) ?? null,
            new DateTime($data['jornada_trabalho_created_at']) ?? null
        );
    }
    public function buildProfile(int $profileId, array $data): Profile
    {
        return new Profile(
            $profileId,
            $data['descricao']
        );
    }

    public function buildAppointmentRecord(int $appointmentId, array $data): AppointmentRecord
    {
        $user = $this->buildUser($data['user_id'], $data);
        $registerType = $this->buildRegisterType($data['tipo_registro_id'], $data);
        return new AppointmentRecord(
            $appointmentId,
            $user,
            $registerType,
            new DateTime($data['data'])?? null,
            new DateTime($data['horario'])?? null,
            new DateTime($data['appointment_record_created_at'])??null
        );
    }
    public function buildRegisterType(int  $registerTypeId, array $data): RegisterType
    {
        return new RegisterType(
            $registerTypeId,
            $data['nome'] ?? null,
            $data['ordem'] ?? null,
            !empty($data['janela_inicio']) ? new DateTime($data['janela_inicio']) : null,
            !empty($data['janela_fim']) ? new DateTime($data['janela_fim']) : null,
            $data['exige_validacao'] ?? null,
            new DateTime($data['tipos_registro_created_at']) ?? null
        );
    }

}