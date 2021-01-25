import { lazy, Suspense } from 'react';
import axios from 'axios';
import 'rsuite/dist/styles/rsuite-default.css';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './views/home/home';
import AcceptInvite from './views/accept_invite/accept_invite';
import { StateProvider } from './context/state';
import CustomLoader from './components/loader/loader';
import org_feed_v2 from './views/organization_feed_v2/org_feed';
import io  from 'socket.io-client';
// import OrganizationFeed from './views/organization/orgnization_feed';

const ViewOrganizations = lazy(() => import('./views/view_organizations/view_organizations'));
const Auth = lazy(() => import('./views/auth/auth'));
const CreateOrganization = lazy(() => import('./views/create_organization/createOrganization'));
axios.defaults.baseURL = 'http://localhost:4000/api/v1';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
export let socket = io('http://localhost:4000/');

function App() {

  return (
    <StateProvider>
      <Suspense fallback={<CustomLoader />}>
        <div className="App">
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/auth/:type" render={(props) => <Auth {...props} />} />
              <Route path="/accept/invite" component={AcceptInvite} />
              <Route path="/user/organization" component={ViewOrganizations} />
              <Route path="/organization/create" component={CreateOrganization} />
              <Route path="/organization/:orgId" component={org_feed_v2} />
            </Switch>
          </Router>
        </div>
      </Suspense>
    </StateProvider>
  );
}

export default App;
