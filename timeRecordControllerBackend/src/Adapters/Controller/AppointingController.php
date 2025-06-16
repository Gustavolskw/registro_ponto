<?php

namespace App\Adapters\Controller;

use App\Application\UseCases\Appointament\ExportGeneralReportOfDay;
use App\Application\UseCases\Appointament\GetAppointmentsFromUserTodayCase;
use App\Application\UseCases\Appointament\RegisterAppointmentCase;
use App\Domain\DomainException\ArgumentsValidationException;
use App\Domain\DTO\Builders\AppointmentRecordBuilder;
use App\Infrastructure\Validation\ValidationMessages;
use DateTime;
use Dotenv\Exception\ValidationException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AppointingController extends Controller
{
    public function __construct(private RegisterAppointmentCase $registerAppointmentCase,
                                private GetAppointmentsFromUserTodayCase $getAppointmentsFromUserTodayCase,
                                private ExportGeneralReportOfDay $exportGeneralReportOfDay,)
    {
        parent::__construct();
    }

    public function markAppointment(Request $request, Response $response)
    {

        $jwtPayload = $request->getAttribute('user');
        $userId = $jwtPayload->sub;
        $actualDate = new DateTime('now', new \DateTimeZone('America/Sao_Paulo'));
        //$actualDate = new DateTime("2025-06-17 12:48:00"); // motivos de teste
        $builder  = new AppointmentRecordBuilder(
            $userId,
            $actualDate,
            $actualDate
        );
        $appointmentData = $this->registerAppointmentCase->execute($builder);
        return $this->respondWithData($response, $appointmentData->toArray());
    }
    public function getAllAppointmentsFromUserOnDay(Request $request, Response $response)
    {
        $jwtPayload = $request->getAttribute('user');
        $userId = $jwtPayload->sub;
        $appointmentsData = $this->getAppointmentsFromUserTodayCase->execute($userId);
        return $this->respondWithData($response, array_map(fn($dto) => $dto->toArray(), $appointmentsData));
    }

    public function generateGeneralReportOfDay(Request $request, Response $response, mixed $args)
    {
        $dateFromClient = $request->getQueryParams()['date'] ?? null;
        $rules = [
            'date' => 'required|date',
        ];

        $validator = $this->validator->make(['date' => $dateFromClient], $rules, ValidationMessages::getMessages());
        if ($validator->fails()) {
            throw new ArgumentsValidationException($validator->errors()->toArray());
        }
        $actualDate = new DateTime($dateFromClient);
        $pdfContent = $this->exportGeneralReportOfDay->execute($actualDate);

        $filename = 'relatorio-geral-' . $actualDate->format('Y-m-d') . '.pdf';

        $response->getBody()->write($pdfContent);

        return $response
            ->withHeader('Content-Type', 'application/pdf')
            ->withHeader('Content-Disposition', 'attachment; filename="' . $filename . '"')
            ->withHeader('Content-Length', (string) strlen($pdfContent));
    }
}