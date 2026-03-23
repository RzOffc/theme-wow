#!/bin/bash
if (( $EUID != 0 )); then echo "Please run as root"; exit; fi
echo "Repairing panel..."
cd /var/www/pterodactyl
yarn build:production > /dev/null 2>&1
php artisan optimize:clear > /dev/null 2>&1
echo "Done!"
