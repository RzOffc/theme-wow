import React, { memo } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import Console from '@/components/server/console/Console';
import StatGraphs from '@/components/server/console/StatGraphs';
import PowerButtons from '@/components/server/console/PowerButtons';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import { Alert } from '@/components/elements/alert';
import styled from 'styled-components/macro';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ConsoleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    font-family: 'JetBrains Mono', monospace;
`;

const TopRow = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: start;
`;

const ServerInfo = styled.div`
    background: rgba(15, 21, 38, 0.9);
    border: 1px solid rgba(167, 139, 250, 0.15);
    border-radius: 10px;
    padding: 14px 18px;
    backdrop-filter: blur(8px);
`;

const ServerName = styled.h1`
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #e2e8f0 !important;
    margin: 0 0 4px !important;
    letter-spacing: 0.3px;
`;

const ServerDesc = styled.p`
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 11px !important;
    color: #94a3b8 !important;
    margin: 0 !important;
`;

const PowerRow = styled.div`
    background: rgba(15, 21, 38, 0.9);
    border: 1px solid rgba(167, 139, 250, 0.15);
    border-radius: 10px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(8px);

    button {
        font-family: 'JetBrains Mono', monospace !important;
        font-size: 11px !important;
        padding: 7px 14px !important;
        border-radius: 7px !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
    }
`;

const ConsoleBox = styled.div`
    background: rgba(2, 4, 12, 0.98);
    border: 1px solid rgba(167, 139, 250, 0.15);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 30px rgba(0,0,0,0.5);

    .xterm {
        font-family: 'JetBrains Mono', monospace !important;
        font-size: 13px !important;
        padding: 8px !important;
    }
`;

const ConsoleDots = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(167, 139, 250, 0.08);
    background: rgba(10, 14, 26, 0.95);
`;

const Dot = styled.span<{ color: string }>`
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: ${props => props.color};
    display: inline-block;
`;

const ConsoleTitleText = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #475569;
    margin-left: 8px;
`;

const StatsRow = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;

    > div {
        background: rgba(15, 21, 38, 0.9) !important;
        border: 1px solid rgba(167, 139, 250, 0.12) !important;
        border-radius: 10px !important;
        backdrop-filter: blur(8px) !important;
        padding: 12px !important;
        transition: all 0.2s ease !important;

        &:hover {
            border-color: rgba(167, 139, 250, 0.35) !important;
            box-shadow: 0 0 15px rgba(167,139,250,0.06) !important;
        }
    }
`;

const DetailsRow = styled.div`
    > div {
        background: rgba(15, 21, 38, 0.9) !important;
        border: 1px solid rgba(167, 139, 250, 0.12) !important;
        border-radius: 10px !important;
        backdrop-filter: blur(8px) !important;
    }
`;

const ServerConsoleContainer = () => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const description = ServerContext.useStoreState((state) => state.server.data!.description);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);

    return (
        <ServerContentBlock title={'Console'}>
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className={'mb-4'}>
                    {isNodeUnderMaintenance
                        ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                        : isInstalling
                        ? 'This server is currently running its installation process and most actions are unavailable.'
                        : 'This server is currently being transferred to another node and all actions are unavailable.'}
                </Alert>
            )}

            <ConsoleWrapper>
                <TopRow>
                    <ServerInfo>
                        <ServerName>{name}</ServerName>
                        <ServerDesc>{description}</ServerDesc>
                    </ServerInfo>
                    <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                        <PowerRow>
                            <PowerButtons className={'flex sm:justify-end space-x-2'} />
                        </PowerRow>
                    </Can>
                </TopRow>

                <ConsoleBox>
                    <ConsoleDots>
                        <Dot color={'#f87171'} />
                        <Dot color={'#fbbf24'} />
                        <Dot color={'#34d399'} />
                        <ConsoleTitleText>{name} — Console</ConsoleTitleText>
                    </ConsoleDots>
                    <Spinner.Suspense>
                        <Console />
                    </Spinner.Suspense>
                </ConsoleBox>

                <DetailsRow>
                    <ServerDetailsBlock className={'col-span-4 lg:col-span-1 order-last lg:order-none'} />
                </DetailsRow>

                <StatsRow>
                    <Spinner.Suspense>
                        <StatGraphs />
                    </Spinner.Suspense>
                </StatsRow>

                <Features enabled={eggFeatures} />
            </ConsoleWrapper>
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
