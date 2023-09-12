import { SyntheticEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { BUILDER_VIEW_CY } from '@/config/selectors';

import TabPanel from '../common/TabPanel';
import AdminControl from './AdminControl';
import IdeasView from './ideasView/IdeasView';
import IdeationView from './ideationView/IdeationView';
import SettingsView from './settingsView/SettingsView';

interface TabType {
  tabLabel: string;
  tabChild: JSX.Element;
}

const BuilderView = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { t } = useTranslation();
  const handleChange = (event: SyntheticEvent, value: number): void => {
    setSelectedTab(value);
  };
  const { permission } = useLocalContext();

  const isAdmin = useMemo(
    () => permission === PermissionLevel.Admin,
    [permission],
  );

  const ideationTab = useMemo(
    () => ({
      tabLabel: t('IDEATION_TAB'),
      tabChild: <IdeationView />,
    }),
    [t],
  );

  const settingsTab = useMemo(
    () => ({
      tabLabel: t('SETTINGS_TAB'),
      tabChild: <SettingsView />,
    }),
    [t],
  );

  const ideasViewTab = useMemo(
    () => ({
      tabLabel: t('IDEAS_VIEW_TAB'),
      tabChild: <IdeasView />,
    }),
    [t],
  );

  const tabs: TabType[] = useMemo(
    () => (isAdmin ? [ideationTab, ideasViewTab, settingsTab] : [ideationTab]),
    [isAdmin, ideationTab, ideasViewTab, settingsTab],
  );

  return (
    <Stack data-cy={BUILDER_VIEW_CY} direction="row" spacing={2} width="100%">
      <Paper elevation={0} sx={{ width: isAdmin ? '66%' : '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            aria-label="Tabs in the builder view."
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.tabLabel} />
            ))}
          </Tabs>
        </Box>
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={selectedTab} index={index}>
            {tab.tabChild}
          </TabPanel>
        ))}
      </Paper>
      {isAdmin && <AdminControl width="33%" />}
    </Stack>
  );
};

export default BuilderView;
