<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250612024136 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Seed perfis table with admin and funcionario';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("INSERT INTO perfil (id, descricao) VALUES
            (1, 'Admin'),
            (2, 'Funcionario')");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DELETE FROM perfis WHERE id IN (1, 2)");
    }
}
