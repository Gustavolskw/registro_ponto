<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250612022120 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create users table';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('users');
        $table->addColumn('id', 'bigint', ['autoincrement' => true]);
        $table->addColumn('matricula', 'bigint', ['notnull' => true]);
        $table->addColumn('nome', 'string', ['length' => 100]);
        $table->addColumn('senha', 'text');
        $table->addColumn('perfil_id', 'bigint');
        $table->addForeignKeyConstraint('perfil', ['perfil_id'], ['id']);
        $table->addColumn('jornadaTrabalho_id', 'bigint', ['notnull' => false]);
        $table->addForeignKeyConstraint('jornada_trabalho', ['jornadaTrabalho_id'], ['id'], ['onDelete' => 'SET NULL']);
        $table->addColumn('created_at', 'datetime', ['default' => 'CURRENT_TIMESTAMP']);
        $table->setPrimaryKey(['id']);
        $table->addUniqueIndex(['matricula']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('users');
    }
}
