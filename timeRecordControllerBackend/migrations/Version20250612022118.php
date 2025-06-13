<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250612022118 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create perfis table';
    }
    public function up(Schema $schema): void
    {
        $table = $schema->createTable('perfil');
        $table->addColumn('id', 'bigint', ['autoincrement' => true]);
        $table->addColumn('descricao', 'string', ['length' => 50]);
        $table->setPrimaryKey(['id']);
        $table->addUniqueIndex(['descricao']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('perfis');
    }
}
