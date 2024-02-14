import { SyntheticEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import {
  ACTIVITY_TAB_CY,
  BUILDER_VIEW_CY,
  RESPONSES_TAB_CY,
  SETTINGS_TAB_CY,
} from '@/config/selectors';

import AdminControl from '../adminPanel/AdminPanel';
import TabPanel from '../common/TabPanel';
import ResponsesView from '../responsesView/ResponsesView';
import SettingsView from '../settings/Settings';
import Activity from './Activity';

interface TabType {
  tabLabel: string;
  tabChild: JSX.Element;
  tabSelector: string;
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

  const activityTab = useMemo(
    () => ({
      tabLabel: t('ACTIVITY_TAB'),
      tabChild: <Activity />,
      tabSelector: ACTIVITY_TAB_CY,
    }),
    [t],
  );

  const settingsTab = useMemo(
    () => ({
      tabLabel: t('SETTINGS_TAB'),
      tabChild: <SettingsView />,
      tabSelector: SETTINGS_TAB_CY,
    }),
    [t],
  );

  const ideasViewTab = useMemo(
    () => ({
      tabLabel: t('RESPONSES_VIEW_TAB'),
      tabChild: <ResponsesView />,
      tabSelector: RESPONSES_TAB_CY,
    }),
    [t],
  );

  const tabs: TabType[] = useMemo(
    () => (isAdmin ? [activityTab, ideasViewTab, settingsTab] : [activityTab]),
    [isAdmin, activityTab, ideasViewTab, settingsTab],
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
              <Tab key={index} label={tab.tabLabel} data-cy={tab.tabSelector} />
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
