# Dockerfile
FROM php:8.4.3-apache



# Instala extensoes e ferramentas necessarias
RUN apt-get update && \
    apt-get install -y \
        libzip-dev \
        libicu-dev \
        zip \
        unzip \
        git \
        curl \
        libpq-dev \
        supervisor \
        && docker-php-ext-install \
            zip \
            sockets \
            pdo \
            pdo_mysql \
            bcmath \
            intl && \
    pecl install xdebug && \
    docker-php-ext-enable xdebug && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*



# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY composer.json /var/www/html

RUN composer install --no-dev --prefer-dist --no-interaction

RUN a2enmod rewrite

WORKDIR /var/www/html

COPY 90-xdebug.ini "${PHP_INI_DIR}/conf.d"
# Run composer dump-autoload to optimize the autoloader
RUN composer dump-autoload --optimize

# Ativa o mod_rewrite do Apache
RUN a2enmod rewrite

# Copia arquivos
COPY . /var/www/html

# Permissões
RUN chown -R www-data:www-data /var/www/html

RUN mkdir -p /var/www/html/logs \
 && chown -R www-data:www-data /var/www/html/logs \
 && chmod -R 775 /var/www/html/logs

RUN sed -i 's/80/8080/g' /etc/apache2/ports.conf
RUN sed -i 's/:80>/:8080>/g' /etc/apache2/sites-available/000-default.conf

EXPOSE 8080

# Copia o script de entrada para o container
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Define o entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
