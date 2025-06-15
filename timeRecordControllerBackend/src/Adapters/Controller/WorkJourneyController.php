<?php

namespace App\Adapters\Controller;


use App\Application\UseCases\WorkJourney\GetAllWorkJourneyCase;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
class WorkJourneyController extends Controller
{
    public function __construct(private  GetAllWorkJourneyCase $getAllWorkJourneyCase,)
    {
        parent::__construct();
    }


    public function getAllWorkJourneys(Request $request, Response $response): Response
    {
        $workJourneys = $this->getAllWorkJourneyCase->execute();
        return $this->respondWithData($response, array_map(fn($dto) => $dto->toArray(), $workJourneys));
    }
}