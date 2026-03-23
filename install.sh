#!/bin/bash

if (( $EUID != 0 )); then
    echo "Please run as root"
    exit
fi

clear

installTheme(){
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    RESET='\033[0m'

    echo -e "${GREEN}Installing sudo if not installed${RESET}"
    apt install sudo -y > /dev/null 2>&1
    cd /var/www/ > /dev/null 2>&1
    echo -e "${GREEN}Unpack the themebackup...${RESET}"
    tar -cvf Pterodactyl_Nightcore_Themebackup.tar.gz pterodactyl > /dev/null 2>&1
    echo -e "${GREEN}Installing theme...${RESET}"
    cd /var/www/pterodactyl > /dev/null 2>&1
    echo -e "${GREEN}Removing old theme if exist${RESET}"
    rm -rf Pterodactyl_Nightcore_Theme > /dev/null 2>&1
    echo -e "${GREEN}Download the Theme${RESET}"
    git clone https://github.com/RzOffc/theme-wow.git Pterodactyl_Nightcore_Theme > /dev/null 2>&1
    cd Pterodactyl_Nightcore_Theme > /dev/null 2>&1
    echo -e "${GREEN}Removing old theme resources if exist${RESET}"
    rm -f /var/www/pterodactyl/resources/scripts/Pterodactyl_Nightcore_Theme.css > /dev/null 2>&1
    rm -f /var/www/pterodactyl/resources/scripts/index.tsx > /dev/null 2>&1
    echo -e "${GREEN}Moving the new theme files to directory${RESET}"
    cp index.tsx /var/www/pterodactyl/resources/scripts/index.tsx > /dev/null 2>&1
    cp Pterodactyl_Nightcore_Theme.css /var/www/pterodactyl/resources/scripts/Pterodactyl_Nightcore_Theme.css > /dev/null 2>&1
    cd /var/www/pterodactyl > /dev/null 2>&1

    echo -e "${GREEN}Checking Node.js version...${RESET}"
    NODE_VER=$(node -v 2>/dev/null | sed 's/v//' | cut -d. -f1)
    if [ -z "$NODE_VER" ] || [ "$NODE_VER" -lt 18 ]; then
        echo -e "${YELLOW}Upgrading Node.js to v22...${RESET}"
        apt-get remove -y nodejs npm > /dev/null 2>&1
        apt-get autoremove -y > /dev/null 2>&1
        rm -rf /usr/local/n > /dev/null 2>&1
        curl -fsSL https://deb.nodesource.com/setup_22.x | bash - > /dev/null 2>&1
        apt-get install -y nodejs > /dev/null 2>&1
        echo -e "${GREEN}Node.js $(node -v) installed${RESET}"
    else
        echo -e "${GREEN}Node.js v${NODE_VER} is compatible${RESET}"
    fi

    if ! command -v yarn &> /dev/null; then
        npm install -g yarn > /dev/null 2>&1
    fi

    cd /var/www/pterodactyl > /dev/null 2>&1
    echo -e "${GREEN}Installing dependencies...${RESET}"
    yarn install > /dev/null 2>&1
    echo -e "${GREEN}Rebuilding the Panel...${RESET}"
    export NODE_OPTIONS=--openssl-legacy-provider
    yarn build:production > /dev/null 2>&1
    echo -e "${GREEN}Optimizing the Panel...${RESET}"
    php artisan optimize:clear > /dev/null 2>&1
    echo -e "${GREEN}Done! Hard refresh your browser (Ctrl+Shift+R)${RESET}"
}

installThemeQuestion(){
    while true; do
        read -p "Are you sure that you want to install the theme [y/n]? " yn
        case $yn in
            [Yy]* ) installTheme; break;;
            [Nn]* ) exit;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

repair(){
    bash <(curl https://raw.githubusercontent.com/RzOffc/theme-wow/main/repair.sh)
}

restoreBackUp(){
    echo "Restoring backup..."
    cd /var/www/ > /dev/null 2>&1
    tar -xvf Pterodactyl_Nightcore_Themebackup.tar.gz > /dev/null 2>&1
    rm Pterodactyl_Nightcore_Themebackup.tar.gz > /dev/null 2>&1
    cd /var/www/pterodactyl > /dev/null 2>&1
    export NODE_OPTIONS=--openssl-legacy-provider
    yarn build:production > /dev/null 2>&1
    php artisan optimize:clear > /dev/null 2>&1
}

echo "Unix Dark Theme by RzOffc"
echo "Pterodactyl Panel v1.11 - v1.12"
echo ""
echo "[1] Install theme"
echo "[2] Restore backup"
echo "[3] Repair panel"
echo "[4] Exit"

read -p "Please enter a number: " choice
if [ $choice == "1" ]; then installThemeQuestion; fi
if [ $choice == "2" ]; then restoreBackUp; fi
if [ $choice == "3" ]; then repair; fi
if [ $choice == "4" ]; then exit; fi
