#!/bin/bash

if (( $EUID != 0 )); then
    echo "Please run as root"
    exit
fi

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo -e "${YELLOW}Repairing panel...${RESET}"

cd /var/www/pterodactyl > /dev/null 2>&1

echo -e "${GREEN}Restoring original files...${RESET}"
tar -xvf /var/www/Pterodactyl_Nightcore_Themebackup.tar.gz -C /var/www/ > /dev/null 2>&1

echo -e "${GREEN}Rebuilding the Panel...${RESET}"
yarn build:production > /dev/null 2>&1

echo -e "${GREEN}Optimizing the Panel...${RESET}"
php artisan optimize:clear > /dev/null 2>&1

echo -e "${GREEN}Done! Panel repaired.${RESET}"
