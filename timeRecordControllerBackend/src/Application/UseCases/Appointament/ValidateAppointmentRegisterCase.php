<?php

namespace App\Application\UseCases\Appointament;

use App\Application\Domain\Exception\RegisterTimeAlreadyExistsException;
use App\Application\Domain\Exception\RegisterTimeOutOfWindowException;
use App\Domain\DTO\Builders\AppointmentRecordValidatorBuilder;
use App\Domain\Entity\User;
use App\Domain\Interfaces\AppointmentRecordRepository;
use App\Domain\Interfaces\RegisterTypeDAO;
use App\Domain\Interfaces\UserRepository;
use App\Domain\Interfaces\WorkJourneyDAO;
use App\Domain\ValueObject\RegisterType;
use DateTime;
use InvalidArgumentException;

class ValidateAppointmentRegisterCase
{

    public function __construct(private AppointmentRecordRepository $appointmentRecordRepository, private RegisterTypeDAO $registerTypeDAO)
    {
    }

    public function execute(AppointmentRecordValidatorBuilder $builder): RegisterType
    {
        $registerTypes = $this->registerTypeDAO->getAllRegisterTypes();
        $time = $builder->getTime()->format('H:i:s');
        $userId = $builder->getUser()->getId();
        $date = $builder->getDate();

        $matchedRegisterType = null;

        foreach ($registerTypes as $registerType) {
            $start = $registerType->getJanelaInicio()->format('H:i:s');
            $end = $registerType->getJanelaFim()->format('H:i:s');

            // Tipos extras que não têm janela são ignorados nessa lógica
            if (!$start || !$end) {
                continue;
            }
            if ($registerType->isRequiresValidation()) {
                if ($time >= $start && $time <= $end) {
                    $matchedRegisterType = $registerType;
                    break;
                }
            }
        }

        if (!$matchedRegisterType) {
            throw new RegisterTimeOutOfWindowException('Horário informado não pertence a nenhuma janela válida.');
        }

        // Se exige validação, verificar se já há apontamento nesse dia e janela

        $existing = $this->appointmentRecordRepository->getRecordsFromUserByDateAndType(
            $userId,
            $date,
            $matchedRegisterType->getId()
        );

        if ($existing) {
            throw new RegisterTimeAlreadyExistsException('Já existe um apontamento registrado para essa janela nesse dia.');
        }


        return $matchedRegisterType;
    }

}