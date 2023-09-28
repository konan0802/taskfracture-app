FROM php:8.1-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set the working directory to /var/www/html
WORKDIR /var/www/html

# Change DocumentRoot to point to the public directory
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Create necessary directories and set permissions
RUN mkdir -p storage/logs && \
    mkdir -p bootstrap/cache && \
    chmod -R 775 storage && \
    chmod -R 775 bootstrap/cache && \
    chown -R www-data:www-data storage && \
    chown -R www-data:www-data bootstrap/cache

# If Laravel’s log file does not exist, create it and set the appropriate permissions
RUN touch storage/logs/laravel.log && \
    chmod 664 storage/logs/laravel.log && \
    chown www-data:www-data storage/logs/laravel.log

# Change the permissions of the /var/www/html directory
RUN chown -R www-data:www-data /var/www/html

# Expose Apache
EXPOSE 80
