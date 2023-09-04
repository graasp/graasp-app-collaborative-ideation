import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Paper, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';

import { BUILDER_VIEW_CY } from '@/config/selectors';

import TabPanel from '../common/TabPanel';
import IdeasView from './ideasView/IdeasView';
import AdminControl from './ideationView/AdminControl';
import IdeationView from './ideationView/IdeationView';

const BuilderView = (): JSX.Element => {
  const [tab, setTab] = useState<number>(0);
  const { t } = useTranslation();
  const handleChange = (event: SyntheticEvent, value: number): void => {
    setTab(value);
  };
  const { permission } = useLocalContext();

  return (
    <Stack data-cy={BUILDER_VIEW_CY} direction="row" spacing={2}>
      <Paper elevation={0}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label={t('IDEATION_TAB')} />
            {/* {permission === PermissionLevel.Admin ?? ( */}
            {/* <Tab label={t('IDEAS_VIEW_TAB')} /> */}
            <Tab label={t('SETTINGS_TAB')} />
            {/* )} */}
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          <IdeationView />
        </TabPanel>
        {/* {permission === PermissionLevel.Admin ?? ( */}
        {/* <TabPanel value={tab} index={1}>
          <IdeasView />
        </TabPanel> */}
        {/* )} */}
      </Paper>
      <AdminControl />
    </Stack>
  );
};

export default BuilderView;
