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
    rm -f /var/www/pterodactyl/resources/scripts/components/NavigationBar.tsx > /dev/null 2>&1
    rm -f /var/www/pterodactyl/resources/scripts/components/server/console/ServerConsoleContainer.tsx > /dev/null 2>&1
    rm -f /var/www/pterodactyl/resources/scripts/components/server/console/Console.tsx > /dev/null 2>&1

    echo -e "${GREEN}Moving the new theme files to directory${RESET}"
    cp index.tsx /var/www/pterodactyl/resources/scripts/index.tsx > /dev/null 2>&1
    cp Pterodactyl_Nightcore_Theme.css /var/www/pterodactyl/resources/scripts/Pterodactyl_Nightcore_Theme.css > /dev/null 2>&1
    cp NavigationBar.tsx /var/www/pterodactyl/resources/scripts/components/NavigationBar.tsx > /dev/null 2>&1
    cp ServerConsoleContainer.tsx /var/www/pterodactyl/resources/scripts/components/server/console/ServerConsoleContainer.tsx > /dev/null 2>&1
    cp Console.tsx /var/www/pterodactyl/resources/scripts/components/server/console/Console.tsx > /dev/null 2>&1

    echo -e "${GREEN}Installing BetterAdmin theme...${RESET}"
    # Copy admin CSS ke public folder
    cp admin.style.css /var/www/pterodactyl/public/admin.style.css > /dev/null 2>&1
    
    # Inject link CSS ke admin layout blade jika belum ada
    ADMIN_BLADE="/var/www/pterodactyl/resources/views/layouts/admin.blade.php"
    if [ -f "$ADMIN_BLADE" ]; then
        if ! grep -q "admin.style.css" "$ADMIN_BLADE"; then
            sed -i 's|</head>|    <link rel="stylesheet" href="/admin.style.css">\n</head>|' "$ADMIN_BLADE"
            echo -e "${GREEN}BetterAdmin CSS injected to admin layout${RESET}"
        else
            echo -e "${YELLOW}BetterAdmin CSS already injected, skipping...${RESET}"
        fi
    else
        echo -e "${YELLOW}Admin blade layout not found, skipping BetterAdmin...${RESET}"
    fi

    # ==========================================
    # PEMASANGAN BACKGROUND VIDEO
    # ==========================================
    echo -e "${GREEN}Installing video background...${RESET}"
    mkdir -p /var/www/pterodactyl/public/themes

    if [ -f "bg/bg.mp4" ]; then
        cp -a bg/bg.mp4 /var/www/pterodactyl/public/themes/bg.mp4 > /dev/null 2>&1
        echo -e "${GREEN}bg.mp4 copied to public/themes${RESET}"
    fi
    if [ -f "bg/bg.webm" ]; then
        cp -a bg/bg.webm /var/www/pterodactyl/public/themes/bg.webm > /dev/null 2>&1
        echo -e "${GREEN}bg.webm copied to public/themes${RESET}"
    fi

    # Inject ke wrapper.blade.php (Halaman Panel Client)
    WRAPPER_BLADE="/var/www/pterodactyl/resources/views/templates/wrapper.blade.php"
    if [ -f "$WRAPPER_BLADE" ]; then
        # Hapus tag lama jika ada agar tidak double
        sed -i '/id="bg-video-theme"/d' "$WRAPPER_BLADE"
        # Tambahkan tag video baru
        sed -i '/<body/a \    <video id="bg-video-theme" autoplay muted loop playsinline style="position: fixed; right: 0; bottom: 0; min-width: 100%; min-height: 100%; width: auto; height: auto; z-index: -9999; object-fit: cover; pointer-events: none;"><source src="/themes/bg.mp4" type="video/mp4"></video>' "$WRAPPER_BLADE"
        echo -e "${GREEN}Video background injected to wrapper.blade.php${RESET}"
    fi

    # Inject ke login.blade.php
    LOGIN_BLADE="/var/www/pterodactyl/resources/views/auth/login.blade.php"
    if [ -f "$LOGIN_BLADE" ]; then
        cp "$LOGIN_BLADE" "$LOGIN_BLADE.backup"
        sed -i '/id="video-bg"/,+7d' "$LOGIN_BLADE" # Hapus inject lama
        sed -i '/@section/i\
<div id="video-bg" class="video-bg" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden;">\
    <video autoplay muted loop playsinline style="position: absolute; top: 50%; left: 50%; min-width: 100%; min-height: 100%; width: auto; height: auto; transform: translate(-50%, -50%); object-fit: cover; filter: brightness(0.6) saturate(0.85);">\
        <source src="/themes/bg.mp4" type="video/mp4">\
    </video>\
</div>' "$LOGIN_BLADE"
        echo -e "${GREEN}Video background injected to login blade${RESET}"
    fi
    
    echo -e "${GREEN}Patching background to transparent...${RESET}"
    GLOBAL_CSS="/var/www/pterodactyl/resources/scripts/assets/css/GlobalStylesheet.ts"
    if [ -f "$GLOBAL_CSS" ]; then
        sed -i 's/bg-neutral-800/bg-transparent/g' "$GLOBAL_CSS"
        echo -e "${GREEN}GlobalStylesheet patched${RESET}"
    else
        echo -e "${YELLOW}GlobalStylesheet.ts not found, skipping...${RESET}"
    fi

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

    if ! grep -q "openssl-legacy-provider" /etc/environment 2>/dev/null; then
        echo 'NODE_OPTIONS=--openssl-legacy-provider' >> /etc/environment
    fi
    export NODE_OPTIONS=--openssl-legacy-provider

    cd /var/www/pterodactyl > /dev/null 2>&1
    echo -e "${GREEN}Installing dependencies...${RESET}"
    yarn install > /dev/null 2>&1
    echo -e "${GREEN}Rebuilding the Panel...${RESET}"
    yarn build:production > /dev/null 2>&1
    echo -e "${GREEN}Optimizing the Panel...${RESET}"
    php artisan view:clear > /dev/null 2>&1
    php artisan config:clear > /dev/null 2>&1
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

    rm -f /var/www/pterodactyl/public/admin.style.css > /dev/null 2>&1
    ADMIN_BLADE="/var/www/pterodactyl/resources/views/layouts/admin.blade.php"
    if [ -f "$ADMIN_BLADE" ]; then
        sed -i '/admin.style.css/d' "$ADMIN_BLADE"
    fi

    cd /var/www/pterodactyl > /dev/null 2>&1
    export NODE_OPTIONS=--openssl-legacy-provider
    yarn build:production > /dev/null 2>&1
    php artisan view:clear > /dev/null 2>&1
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
