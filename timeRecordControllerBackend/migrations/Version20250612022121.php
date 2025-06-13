<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250612022121 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create tipos_registro table';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('tipos_registro');
        $table->addColumn('id', 'bigint', ['autoincrement' => true]);
        $table->addColumn('nome', 'string', ['length' => 50]);
        $table->addColumn('ordem', 'integer');
        $table->addColumn('janela_inicio', 'time', ['notnull' => false]);
        $table->addColumn('janela_fim', 'time', ['notnull' => false]);
        $table->addColumn('exige_validacao', 'boolean');
        $table->addColumn('created_at', 'datetime', ['default' => 'CURRENT_TIMESTAMP']);
        $table->setPrimaryKey(['id']);
        $table->addUniqueIndex(['nome']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('tipos_registro');
    }
}
