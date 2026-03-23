import React from 'react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCogs, faLayerGroup, faSignOutAlt,
    faTerminal, faFolder, faDatabase,
    faClock, faRocket, faUsers, faWrench,
    faArchive, faNetworkWired, faSearch,
    faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { ApplicationStore } from '@/state';
import { ServerContext } from '@/state/server';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';
import { useStoreState } from 'easy-peasy';

const Sidebar = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 56px;
    background: rgba(10, 14, 26, 0.98);
    border-right: 1px solid rgba(167, 139, 250, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(12px);
    padding: 8px 0;
`;

const LogoBtn = styled.div`
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #7c3aed, #38bdf8);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    flex-shrink: 0;
    cursor: pointer;
`;

const Divider = styled.div`
    width: 32px;
    height: 1px;
    background: rgba(167, 139, 250, 0.15);
    margin: 4px 0;
`;

const IconBtn = styled(NavLink)`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #475569;
    text-decoration: none;
    transition: all 0.15s ease;
    margin: 2px 0;
    border: 1px solid transparent;
    font-size: 13px;
    &:hover {
        background: rgba(167, 139, 250, 0.12);
        color: #a78bfa;
        border-color: rgba(167, 139, 250, 0.2);
    }
    &.active {
        background: rgba(167, 139, 250, 0.18);
        color: #a78bfa;
        border-color: rgba(167, 139, 250, 0.35);
        box-shadow: 0 0 10px rgba(167,139,250,0.15);
    }
`;

const IconBtnA = styled.a`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #475569;
    text-decoration: none;
    transition: all 0.15s ease;
    margin: 2px 0;
    border: 1px solid transparent;
    font-size: 13px;
    &:hover {
        background: rgba(167, 139, 250, 0.12);
        color: #a78bfa;
        border-color: rgba(167, 139, 250, 0.2);
    }
`;

const LogoutIconBtn = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #475569;
    background: none;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.15s ease;
    margin: 2px 0;
    font-size: 13px;
    &:hover {
        background: rgba(248, 113, 113, 0.12);
        color: #f87171;
        border-color: rgba(248, 113, 113, 0.2);
    }
`;

const BottomGroup = styled.div`
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const AvatarBtn = styled(NavLink)`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: all 0.15s ease;
    margin: 2px 0;
    border: 1px solid transparent;
    overflow: hidden;
    &:hover { border-color: rgba(167, 139, 250, 0.3); }
    &.active { border-color: rgba(167, 139, 250, 0.4); }
`;

const ServerNavItems = ({ id }: { id: string }) => {
    const to = (value: string) => {
        return `/server/${id}/${value}`.replace(/\/\*$/, '');
    };

    return (
        <>
            <Divider />
            <Tooltip placement={'right'} content={'Console'}>
                <IconBtn to={`/server/${id}`} exact>
                    <FontAwesomeIcon icon={faTerminal} />
                </IconBtn>
            </Tooltip>
            <Tooltip placement={'right'} content={'Files'}>
                <IconBtn to={to('files')}>
                    <FontAwesomeIcon icon={faFolder} />
                </IconBtn>
            </Tooltip>
            <Tooltip placement={'right'} content={'Databases'}>
                <IconBtn to={to('databases')}>
                    <FontAwesomeIcon icon={faDatabase} />
                </IconBtn>
            </Tooltip>
            <Tooltip placement={'right'} content={'Schedules'}>
                <IconBtn to={to('schedules')}>
                    <FontAwesomeIcon icon={faClock} />
                </IconBtn>
            </Tooltip>
            <Tooltip placement={'right'} content={'Users'}>
                <IconBtn to={to('users')}>
                    <FontAwesomeIcon icon={faUsers} />
                </IconBtn>
            </Tooltip>
            <Tooltip placement={'right'} content={'Backups'}>
                <IconBtn to={to('backups')}>
                    <FontAwesomeIcon icon={faArchive} />
                </IconBtn>
            </Tooltip>
            <Tooltip placement={'right'} content={'Network'}>
                <IconBtn to={to('network')}>
                    <FontAwesomeIcon icon={faNetworkWired} />
                </IconBtn>
            </Tooltip>
            <Tooltip placement={'right'} content={'Startup'}>
                <IconBtn to={to('startup')}>
                    <FontAwesomeIcon icon={faRocket} />
                </IconBtn>
            </Tooltip>
            <Tooltip placement={'right'} content={'Settings'}>
                <IconBtn to={to('settings')}>
                    <FontAwesomeIcon icon={faWrench} />
                </IconBtn>
            </Tooltip>
            <Tooltip placement={'right'} content={'Activity'}>
                <IconBtn to={to('activity')}>
                    <FontAwesomeIcon icon={faChartBar} />
                </IconBtn>
            </Tooltip>
        </>
    );
};

export default () => {
    const location = useLocation();
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Detect if we're on a server page
    const serverMatch = location.pathname.match(/^\/server\/([^/]+)/);
    const serverId = serverMatch ? serverMatch[1] : null;

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <>
            <SpinnerOverlay visible={isLoggingOut} />
            <Sidebar>
                <Tooltip placement={'right'} content={'Dashboard'}>
                    <LogoBtn onClick={() => window.location.href = '/'}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </LogoBtn>
                </Tooltip>

                <Tooltip placement={'right'} content={'Dashboard'}>
                    <IconBtn to={'/'} exact>
                        <FontAwesomeIcon icon={faLayerGroup} />
                    </IconBtn>
                </Tooltip>

                <Tooltip placement={'right'} content={'Search'}>
                    <IconBtn to={'/search'}>
                        <FontAwesomeIcon icon={faSearch} />
                    </IconBtn>
                </Tooltip>

                {/* Server menu items - only show when on server page */}
                {serverId && <ServerNavItems id={serverId} />}

                {rootAdmin && (
                    <>
                        <Divider />
                        <Tooltip placement={'right'} content={'Admin Panel'}>
                            <IconBtnA href={'/admin'} rel={'noreferrer'}>
                                <FontAwesomeIcon icon={faCogs} />
                            </IconBtnA>
                        </Tooltip>
                    </>
                )}

                <BottomGroup>
                    <Divider />
                    <Tooltip placement={'right'} content={'Account Settings'}>
                        <AvatarBtn to={'/account'}>
                            <Avatar.User />
                        </AvatarBtn>
                    </Tooltip>
                    <Tooltip placement={'right'} content={'Sign Out'}>
                        <LogoutIconBtn onClick={onTriggerLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </LogoutIconBtn>
                    </Tooltip>
                </BottomGroup>
            </Sidebar>
        </>
    );
};
