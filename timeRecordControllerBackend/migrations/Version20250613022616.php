<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250613022616 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Seed jornada de trabalho table with admin and funcionario';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("INSERT INTO jornada_trabalho (entrada_manha, saida_manha, entrada_tarde, saida_tarde) VALUE
            ('08:00', '12:00','14:00','18:00')");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DELETE FROM jornada_trabalho WHERE id IN (1, 2)");
    }
}
