<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250612022119 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create jornada_trabalho table';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('jornada_trabalho');
        $table->addColumn('id', 'bigint', ['autoincrement' => true]);
        $table->addColumn('entrada_manha', 'time');
        $table->addColumn('saida_manha', 'time');
        $table->addColumn('entrada_tarde', 'time');
        $table->addColumn('saida_tarde', 'time');
        $table->addColumn('created_at', 'datetime', ['default' => 'CURRENT_TIMESTAMP']);
        $table->setPrimaryKey(['id']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('jornada_trabalho');
    }
}
