<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250612024132 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create registros_ponto table';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('registros_ponto');
        $table->addColumn('id', 'bigint', ['autoincrement' => true]);
        $table->addColumn('user_id', 'bigint');
        $table->addColumn('tipo_id', 'bigint');
        $table->addColumn('data', 'date');
        $table->addColumn('horario', 'time');
        $table->addColumn('created_at', 'datetime', ['default' => 'CURRENT_TIMESTAMP']);
        $table->setPrimaryKey(['id']);
        $table->addUniqueIndex(['user_id', 'data', 'tipo_id']);
        $table->addForeignKeyConstraint('users', ['user_id'], ['id']);
        $table->addForeignKeyConstraint('tipos_registro', ['tipo_id'], ['id']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('registros_ponto');
    }
}
