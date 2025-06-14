<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250614150750 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create SuperAdmin User';
    }

    public function up(Schema $schema): void
    {
        $hash = '$2y$12$s9OPr6IcqwIHn3b/9lne8.JbPoCf0JI4aH/ldXYbbac3U3mOnM9W2';
        $this->addSql("INSERT INTO users (nome, matricula, senha, perfil_id, jornadaTrabalho_id) VALUES 
    ('SuperAdmin', 1, '$hash', 1, 1)");

        //senha = superadmin

    }
    public function down(Schema $schema): void
    {
        $this->addSql("DROP TABLE users;");

    }
}
