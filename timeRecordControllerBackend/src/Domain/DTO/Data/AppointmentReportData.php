<?php

namespace App\Domain\DTO\Data;

use App\Domain\Entity\AppointmentRecord;
use App\Domain\Entity\User;
use DateTime;

class AppointmentReportData
{
    private int $matricula;
    private string $nome;

    private DateTime $data;

    private DateTime|null $entradaManha;
    private DateTime|null $saidaManha;
    private DateTime|null $entradaTarde;
    private DateTime|null $saidaTarde;

    private DateTime|null $entradaExtra;
    private DateTime|null $saidaExtra;


   public function __construct(int $matricula, string $nome, ?DateTime $data, ?DateTime $entradaManha, ?DateTime $saidaManha, ?DateTime $entradaTarde, ?DateTime $saidaTarde, ?DateTime $entradaExtra,  ?DateTime $saidaExtra)
    {
        $this->matricula = $matricula;
        $this->nome = $nome;
        $this->data = $data;
        $this->entradaManha = $entradaManha??null;
        $this->saidaManha = $saidaManha??null;
        $this->entradaTarde = $entradaTarde??null;
        $this->saidaTarde = $saidaTarde??null;
        $this->entradaExtra = $entradaExtra??null;
        $this->saidaExtra = $saidaExtra??null;
    }

    public function toArray(): array
    {
        return [
            'matricula' => $this->matricula,
            'nome' => $this->nome,
            'data' => $this->data->format('d/m/Y'),
            'entrada_manha' => $this->entradaManha?->format('H:i:s'),
            'saida_manha' => $this->saidaManha?->format('H:i:s'),
            'entrada_tarde' => $this->entradaTarde?->format('H:i:s'),
            'saida_tarde' => $this->saidaTarde?->format('H:i:s'),
            'entrada_extra' => $this->entradaExtra?->format('H:i:s'),
            'saida_extra' => $this->saidaExtra?->format('H:i:s'),
        ];
    }

}