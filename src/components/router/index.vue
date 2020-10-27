<script>
  import Vue from 'vue'
  import Router from 'vue-router'
  import PortalVue from 'portal-vue'
  import Broadcast from '@/components/Broadcast/Broadcast'
  import LoggedIn from '@/components/Authentication/LoggedIn'
  import Program from '@/components/Program/Program';
  import PgEpg from '@/components/ProgramMatches/PgEpg';
  import ChannelSettings from "@/components/SettingsView/ChannelSettings";

  Vue.use(PortalVue);
  Vue.use(Router);

  export default new Router({
    mode: 'history',
    routes: [
      {
        path: '/Broadcast',
        name: 'Broadcast',
        component: Broadcast,
        meta: {
          requireAuth: true,
        }
      },
      {
        path: '/LoggedIn',
        name: 'LoggedIn',
        component: LoggedIn,
      },         
      {
        path: '/PgLog',
        name: 'PgLog',
        component: PgEpg,
        meta: {
          requireAuth: true,
        }
      },
      {
        path: '/Program',
        name: 'Program',
        component: Program,
      },
      {
        path: '/ChannelSettings',
        name: 'ChannelSettings',
        component: ChannelSettings,
      },
    ]
  })
</script>
