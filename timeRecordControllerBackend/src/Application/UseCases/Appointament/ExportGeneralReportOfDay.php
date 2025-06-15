<?php

namespace App\Application\UseCases\Appointament;

use App\Domain\Interfaces\AppointmentRecordRepository;
use DateTime;
use Dompdf\Dompdf;
use Dompdf\Options;

class ExportGeneralReportOfDay
{

    public function __construct(private AppointmentRecordRepository $appointmentRecordRepository)
    {
    }

    public function execute(DateTime $date): string
    {
        $reportData = $this->appointmentRecordRepository->generalReport($date);

        $html = '<h2 style="text-align: center;">Relatório geral do dia - ' . $date->format('d/m/Y') . '</h2>';
        $html .= '<table border="1" cellspacing="0" cellpadding="6" style="width: 100%; font-size: 12px;">
                    <thead>
                        <tr>
                            <th>Matrícula</th>
                            <th>Nome</th>
                            <th>Data</th>
                            <th>Entrada Manhã</th>
                            <th>Saída Manhã</th>
                            <th>Entrada Tarde</th>
                            <th>Saída Tarde</th>
                            <th>Entrada Extra</th>
                            <th>Saída Extra</th>
                        </tr>
                    </thead>
                    <tbody>';

        foreach ($reportData as $item) {
            $row = $item->toArray();
            $html .= '<tr>
                        <td>' . $row['matricula'] . '</td>
                        <td>' . htmlspecialchars($row['nome']) . '</td>
                        <td>' . $row['data'] . '</td>
                        <td>' . ($row['entrada_manha'] ?? '-') . '</td>
                        <td>' . ($row['saida_manha'] ?? '-') . '</td>
                        <td>' . ($row['entrada_tarde'] ?? '-') . '</td>
                        <td>' . ($row['saida_tarde'] ?? '-') . '</td>
                        <td>' . ($row['entrada_extra'] ?? '-') . '</td>
                        <td>' . ($row['saida_extra'] ?? '-') . '</td>
                    </tr>';
        }

        $html .= '</tbody></table>';

        $options = new Options();
        $options->set('defaultFont', 'Arial');
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();

        return $dompdf->output();
    }

}