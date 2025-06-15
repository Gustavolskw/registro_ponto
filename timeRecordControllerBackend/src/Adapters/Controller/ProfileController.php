<?php

namespace App\Adapters\Controller;

use App\Application\UseCases\Profile\GetAllProfilesCase;
use App\Domain\DTO\Data\AppointmentRecordData;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ProfileController extends Controller
{

    public function __construct(private GetAllProfilesCase $getAllProfilesCase)
    {
        parent::__construct();
    }


    public function getAllProfiles(Request $request, Response $response): Response
    {
         $profiles = $this->getAllProfilesCase->execute();
         return $this->respondWithData($response, array_map(fn($dto) => $dto->toArray(), $profiles));
    }

}