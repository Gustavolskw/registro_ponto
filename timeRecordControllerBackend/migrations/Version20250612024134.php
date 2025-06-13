<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250612024134 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Seed tipos_registro table with default values';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("INSERT INTO tipos_registro (id, nome, ordem, janela_inicio, janela_fim, exige_validacao, created_at) VALUES
            (1, 'Entrada Manha', 1, '07:45', '08:15', TRUE, CURRENT_TIMESTAMP),
            (2, 'Saida Manha', 2, '11:45', '12:15', TRUE, CURRENT_TIMESTAMP),
            (3, 'Entrada Tarde', 3, '13:45', '14:15', TRUE, CURRENT_TIMESTAMP),
            (4, 'Saida Tarde', 4, '17:45', '18:15', TRUE, CURRENT_TIMESTAMP),
            (5, 'Entrada Extra', 5, NULL, NULL, FALSE, CURRENT_TIMESTAMP),
            (6, 'Saida Extra', 6, NULL, NULL, FALSE, CURRENT_TIMESTAMP)");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DELETE FROM tipos_registro WHERE id IN (1, 2, 3, 4, 5, 6)");
    }
}
