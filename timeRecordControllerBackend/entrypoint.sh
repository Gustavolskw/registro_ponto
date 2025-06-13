#!/bin/bash
set -e
if [ ! -d "vendor" ]; then
  echo "$(date "+%Y-%m-%d %H:%M:%S") WARN Pasta 'vendor' não encontrada. Executando 'composer install'..."
  composer install --no-interaction --prefer-dist --optimize-autoloader
else
  echo "$(date "+%Y-%m-%d %H:%M:%S") INFO Dependências já instaladas."
fi
sleep 6
#echo "$(date "+%Y-%m-%d %H:%M:%S") INFO Executando testes automatizados..."
#vendor/bin/phpunit --testsuite=unit --testdox

echo "$(date "+%Y-%m-%d %H:%M:%S") INFO Executando migrações do banco de dados..."
php /var/www/html/vendor/bin/doctrine-migrations migrations:migrate --no-interaction

echo "$(date "+%Y-%m-%d %H:%M:%S") INFO Iniciando Apache..."
exec apache2-foreground
