<?php

declare(strict_types=1);

namespace App\Application\Handlers;

use App\Application\Domain\Exception\JWTTokenNotFoundException;
use App\Application\Domain\Exception\RegisterTimeAlreadyExistsException;
use App\Application\Domain\Exception\RegisterTimeOutOfWindowException;
use App\Application\Domain\Exception\UnauthenticatedException;
use App\Domain\DomainException\ArgumentsValidationException;
use App\Domain\DomainException\DomainException;
use App\Domain\DomainException\DomainNotFoundException;
use App\Domain\Exception\UnauthorizedException;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpMethodNotAllowedException;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpNotImplementedException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Handlers\ErrorHandler as SlimErrorHandler;
use Throwable;

class HttpErrorHandler extends SlimErrorHandler
{
    protected function respond(): Response
    {
        $exception = $this->exception;
        $statusCode = 500;
        $error = new ErrorHandler(
            ErrorHandler::SERVER_ERROR,
            'An internal error has occurred while processing your request.'
        );


        if ($exception instanceof HttpException) {
            $statusCode = $exception->getCode();
            $error->setDescription($exception->getMessage());

            if ($exception instanceof HttpNotFoundException) {
                $error->setType(ErrorHandler::RESOURCE_NOT_FOUND);
            } elseif ($exception instanceof HttpMethodNotAllowedException) {
                $error->setType(ErrorHandler::NOT_ALLOWED);
            } elseif ($exception instanceof HttpUnauthorizedException) {
                $error->setType(ErrorHandler::UNAUTHENTICATED);
            } elseif ($exception instanceof HttpForbiddenException) {
                $error->setType(ErrorHandler::INSUFFICIENT_PRIVILEGES);
            } elseif ($exception instanceof HttpBadRequestException) {
                $error->setType(ErrorHandler::BAD_REQUEST);
            } elseif ($exception instanceof HttpNotImplementedException) {
                $error->setType(ErrorHandler::NOT_IMPLEMENTED);
            }
        }

        if (
            !($exception instanceof HttpException)
            && $exception instanceof Throwable
            && $this->displayErrorDetails
        ) {

            if($exception instanceof DomainException) {
                $error->setType("DOMAIN_EXCEPTION");
                $error->setDescription($exception->getMessage());
                $statusCode = 400;
            }
            else if ($exception instanceof DomainNotFoundException){
                $statusCode = 204;
            }
//            else if ($exception instanceof InvalidUserException)
//            {
//                $error->setType("AUTH_USER_EXCEPTION");
//                $error->setDescription($exception->getMessage());
//                $statusCode = 400;
//            }
            else if ($exception instanceof ArgumentsValidationException) {
                $errors = $exception->getErrors();
                $error->setType(ErrorHandler::VALIDATION_ERROR);
                $error->setDescription($errors);
                $statusCode = 422;
            }
            else if ($exception instanceof RegisterTimeAlreadyExistsException ){
                $error->setType(ErrorHandler::VALIDATION_ERROR);
                $error->setDescription($exception->getMessage());
                $statusCode = 422;
            }
            else if ($exception instanceof RegisterTimeOutOfWindowException ){
                $error->setType(ErrorHandler::VALIDATION_ERROR);
                $error->setDescription($exception->getMessage());
                $statusCode = 422;
            }
            else if ($exception instanceof JWTTokenNotFoundException ){
                $error->setType("JWT_TOKEN_NOT_FOUND_EXCEPTION");
                $error->setDescription($exception->getMessage());
                $statusCode = 400;
            }
            else if ($exception instanceof UnauthenticatedException ){
                $error->setType(ErrorHandler::UNAUTHENTICATED);
                $error->setDescription($exception->getMessage());
                $statusCode = 403;
            }
            else if ($exception instanceof UnauthorizedException ){
                $error->setType("UNAUTHORIZED_EXCEPTION");
                $error->setDescription($exception->getMessage());
                $statusCode = 401;
            }
            else {
                $error->setDescription($exception->getMessage());
            }
        }

        $payload = new PayloadHandler($statusCode, null, $error);
        $encodedPayload = json_encode($payload, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT);

        $response = $this->responseFactory->createResponse($statusCode);
        $response->getBody()->write($encodedPayload);

        return $response->withHeader('Content-Type', 'application/json');
    }
}
