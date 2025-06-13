<?php

declare(strict_types=1);

use App\Application\Settings\Settings;
use App\Application\Settings\SettingsInterface;
use App\Domain\Interfaces\AppointmentRecordRepository;
use App\Domain\Interfaces\ProfileDAO;
use App\Domain\Interfaces\RegisterTypeDAO;
use App\Domain\Interfaces\UserRepository;
use App\Domain\Interfaces\WorkJourneyDAO;
use App\Infrastructure\DAO\ProfileDAOImpl;
use App\Infrastructure\DAO\RegisterTypeDAOImpl;
use App\Infrastructure\DAO\WorkJourneyDAOImpl;
use App\Infrastructure\Persistence\AppointmentRecordRepositoryImpl;
use App\Infrastructure\Persistence\UserRepositoryImpl;
use DI\ContainerBuilder;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\UidProcessor;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        SettingsInterface::class => function () {
            return new Settings([
                'displayErrorDetails' => true,
                'logError' => true,
                'logErrorDetails' => true,
                'logger' => [
                    'name' => 'app',
                    'path' => __DIR__ . '/../logs/app.log',
                    'level' => \Monolog\Logger::DEBUG,
                ],
            ]);
        },
        LoggerInterface::class => function (ContainerInterface $c) {
            $settings = $c->get(SettingsInterface::class);
            $loggerSettings = $settings->get('logger');

            $logger = new Logger($loggerSettings['name']);
            $logger->pushProcessor(new UidProcessor());
            $logger->pushHandler(new StreamHandler($loggerSettings['path'], $loggerSettings['level']));

            return $logger;
        },
        PDO::class => function (ContainerInterface $c) {
            $dbConfig = $c->get('db');
            $dsn = "{$dbConfig['driver']}:host={$dbConfig['host']};dbname={$dbConfig['dbname']};charset={$dbConfig['charset']}";
            return new PDO($dsn, $dbConfig['username'], $dbConfig['password'], $dbConfig['flag']);
        },
        'db' => [
            'driver' => getenv('DB_DRIVER'),
            'host' => getenv('DB_HOST'),
            'port' => getenv('DB_PORT'),
            'dbname' => getenv('DB_NAME'),
            'username' => getenv('DB_USER'),
            'password' => getenv('DB_PASS'),
            'charset' => 'utf8mb4',
            'flag' => [
                PDO::ATTR_PERSISTENT => false,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES => true,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ],
        ],
        //WalletRepository::class => DI\autowire(PdoWalletRepository::class),
        AppointmentRecordRepository::class => DI\autowire(AppointmentRecordRepositoryImpl::class),
        UserRepository::class => DI\autowire(UserRepositoryImpl::class),
        ProfileDAO::class => DI\autowire(ProfileDAOImpl::class),
        RegisterTypeDAO::class => DI\autowire(RegisterTypeDAOImpl::class),
        WorkJourneyDAO::class => DI\autowire(WorkJourneyDAOImpl::class),

    ]);
};
