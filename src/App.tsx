import { CopilotKit, CopilotPopup } from "@copilotkit/react-core/v2";
import { HttpAgent } from "@ag-ui/client";

const agentUrl = import.meta.env.VITE_AGENT_URL;
const agent = agentUrl ? new HttpAgent({ url: agentUrl }) : null;

function SetupNotice() {
  return (
    <div className="alert alert-warning mt-4" role="alert">
      <strong>Set VITE_AGENT_URL first.</strong> Copy <code>.env.example</code> to{" "}
      <code>.env.local</code>, point it at your hosted AG-UI agent, then restart
      the dev server.
    </div>
  );
}

function Page() {
  return (
    <main>
      <section className="hero py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge text-bg-light mb-3">GitHub Pages template</span>
              <h1 className="display-4 fw-bold text-white">
                A tiny Bootstrap site with a hosted agent built in.
              </h1>
              <p className="lead text-white-50 mt-3">
                Copy this template, set one environment variable, and deploy a static
                page that talks to your AG-UI-compatible hosted agent through
                CopilotKit.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-4">
                <a className="btn btn-light btn-lg" href="#setup">
                  Configure it
                </a>
                <a className="btn btn-outline-light btn-lg" href="#agent">
                  Agent requirements
                </a>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card shadow-lg border-0">
                <div className="card-body p-4">
                  <h2 className="h4">What you get</h2>
                  <ul className="list-unstyled mt-3 mb-0">
                    <li className="mb-2">Bootstrap 5 layout</li>
                    <li className="mb-2">Vite static build</li>
                    <li className="mb-2">CopilotKit popup</li>
                    <li>GitHub Pages workflow</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {!agent && <SetupNotice />}
        </div>
      </section>

      <section className="container py-5" id="setup">
        <div className="row g-4">
          <div className="col-md-4">
            <h2 className="h4">1. Configure</h2>
            <p>
              Set <code>VITE_AGENT_URL</code> to the public URL of your hosted
              AG-UI endpoint.
            </p>
          </div>
          <div className="col-md-4">
            <h2 className="h4">2. Build</h2>
            <p>
              Run <code>npm run build</code>. Vite writes the static site to{" "}
              <code>dist</code>.
            </p>
          </div>
          <div className="col-md-4">
            <h2 className="h4">3. Deploy</h2>
            <p>
              GitHub Pages serves <code>dist</code>. The agent stays hosted
              somewhere else.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-body-tertiary py-5" id="agent">
        <div className="container">
          <h2 className="h3">Hosted agent requirements</h2>
          <p className="mb-0">
            Your agent must speak AG-UI over HTTP and allow CORS from this Pages
            origin. Keep secrets on the agent host, not in this static frontend.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  if (!agent) {
    return <Page />;
  }

  return (
    <CopilotKit agent="hosted-agent" selfManagedAgents={{ "hosted-agent": agent }}>
      <Page />
      <CopilotPopup
        labels={{
          modalHeaderTitle: "Hosted agent",
          welcomeMessageText: "Hi. Ask me about this site or try your hosted agent.",
        }}
      />
    </CopilotKit>
  );
}
