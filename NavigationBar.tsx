import React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';
import { useStoreState } from 'easy-peasy';

const SidebarNav = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 220px;
    background: rgba(10, 14, 26, 0.98);
    border-right: 1px solid rgba(167, 139, 250, 0.15);
    display: flex;
    flex-direction: column;
    z-index: 50;
    backdrop-filter: blur(12px);
`;

const SidebarLogo = styled.div`
    padding: 16px;
    border-bottom: 1px solid rgba(167, 139, 250, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
`;

const LogoIcon = styled.div`
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #7c3aed, #38bdf8);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const LogoText = styled.div`
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    color: #e2e8f0;
    letter-spacing: 0.3px;
`;

const SidebarContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 12px 0;
    overflow-y: auto;
`;

const NavItem = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #94a3b8;
    text-decoration: none;
    transition: all 0.15s ease;
    border-left: 2px solid transparent;
    cursor: pointer;

    &:hover {
        background: rgba(167, 139, 250, 0.06);
        color: #e2e8f0;
    }

    &.active {
        background: linear-gradient(90deg, rgba(167,139,250,0.15), rgba(56,189,248,0.05));
        border-left-color: #a78bfa;
        color: #a78bfa;
    }
`;

const NavItemA = styled.a`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #94a3b8;
    text-decoration: none;
    transition: all 0.15s ease;
    border-left: 2px solid transparent;
    cursor: pointer;

    &:hover {
        background: rgba(167, 139, 250, 0.06);
        color: #e2e8f0;
    }
`;

const NavLabel = styled.div`
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #475569;
    padding: 8px 16px 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
`;

const SidebarBottom = styled.div`
    padding: 12px 0;
    border-top: 1px solid rgba(167, 139, 250, 0.1);
`;

const AvatarWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    cursor: pointer;
    transition: all 0.15s;
    border-left: 2px solid transparent;

    &:hover {
        background: rgba(167, 139, 250, 0.06);
        color: #e2e8f0;
    }
`;

const AvatarName = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #94a3b8;
`;

const LogoutBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 16px;
    width: 100%;
    background: none;
    border: none;
    border-left: 2px solid transparent;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;

    &:hover {
        background: rgba(248, 113, 113, 0.08);
        color: #f87171;
        border-left-color: #f87171;
    }
`;

const MainContent = styled.div`
    margin-left: 220px;
    min-height: 100vh;
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            window.location = '/' as any;
        });
    };

    return (
        <>
            <SpinnerOverlay visible={isLoggingOut} />
            <SidebarNav>
                <SidebarLogo>
                    <LogoIcon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </LogoIcon>
                    <div>
                        <LogoText>{name}</LogoText>
                    </div>
                </SidebarLogo>

                <SidebarContent>
                    <NavLabel>Navigation</NavLabel>
                    <Tooltip placement={'right'} content={'Dashboard'}>
                        <NavItem to={'/'} exact>
                            <FontAwesomeIcon icon={faLayerGroup} fixedWidth />
                            <span>Dashboard</span>
                        </NavItem>
                    </Tooltip>

                    <SearchContainer />

                    {rootAdmin && (
                        <>
                            <NavLabel>Admin</NavLabel>
                            <Tooltip placement={'right'} content={'Admin'}>
                                <NavItemA href={'/admin'} rel={'noreferrer'}>
                                    <FontAwesomeIcon icon={faCogs} fixedWidth />
                                    <span>Admin Panel</span>
                                </NavItemA>
                            </Tooltip>
                        </>
                    )}
                </SidebarContent>

                <SidebarBottom>
                    <Tooltip placement={'right'} content={'Account Settings'}>
                        <NavItem to={'/account'}>
                            <span style={{ display: 'flex', alignItems: 'center', width: '20px', height: '20px' }}>
                                <Avatar.User />
                            </span>
                            <AvatarName>Account</AvatarName>
                        </NavItem>
                    </Tooltip>

                    <Tooltip placement={'right'} content={'Sign Out'}>
                        <LogoutBtn onClick={onTriggerLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} fixedWidth />
                            <span>Sign Out</span>
                        </LogoutBtn>
                    </Tooltip>
                </SidebarBottom>
            </SidebarNav>
        </>
    );
};
