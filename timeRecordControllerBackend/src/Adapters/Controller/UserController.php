<?php

namespace App\Adapters\Controller;

use App\Application\UseCases\User\CreateNewUserPasswordCase;
use App\Application\UseCases\User\LoginUserCase;
use App\Application\UseCases\User\UserCreationCase;
use App\Domain\DTO\Builders\UserBuilder;
use App\Infrastructure\Validation\ValidationMessages;
use Dotenv\Exception\ValidationException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class UserController extends Controller
{
    private CreateNewUserPasswordCase $createNewUserPasswordCase;
    private LoginUserCase $loginUserCase;
    private UserCreationCase $userCreationCase;

    public function __construct(CreateNewUserPasswordCase $createNewUserPasswordCase, LoginUserCase $loginUserCase, UserCreationCase $userCreationCase)
    {
        $this->createNewUserPasswordCase = $createNewUserPasswordCase;
        $this->loginUserCase = $loginUserCase;
        $this->userCreationCase = $userCreationCase;

    }

    public function createNewAdminUser(Request $request, Response $response)
    {
        $body = $this->getFormData($request);
        $rules = [
            'name' => 'string',
            'password' => 'required|string|min:6|max:255',
            'profileId' => 'required|integer|in:1,2',
            'workJourneyId' => 'required|integer',
        ];

        $validator = $this->validator->make($body, $rules, ValidationMessages::getMessages());

        if ($validator->fails()) {
            throw new ValidationException($validator->errors());
        }
        $validatedData = $validator->validated();

        $userData = new UserBuilder(
            $validatedData['name'],
            $validatedData['password'],
            $validatedData['profileId'],
            $validatedData['workJourneyId']
        );
        $user = $this->userCreationCase->execute($userData);
        return $this->respondWithData($response, $user->toArray());
    }


}