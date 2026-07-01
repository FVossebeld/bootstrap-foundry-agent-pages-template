import { CopilotKit, CopilotPopup } from "@copilotkit/react-core/v2";

const runtimeUrl = import.meta.env.VITE_COPILOT_RUNTIME_URL;

function SetupNotice() {
  return (
    <div className="alert alert-warning mt-4" role="alert">
      <strong>Set VITE_COPILOT_RUNTIME_URL first.</strong> Copy{" "}
      <code>.env.example</code> to <code>.env.local</code>, point it at the
      Copilot Runtime endpoint that calls your Foundry prompt agent, then
      restart the dev server.
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
                A tiny Bootstrap site for a Foundry prompt agent.
              </h1>
              <p className="lead text-white-50 mt-3">
                Copy this template, deploy the prompt agent and runtime API, then
                publish a static page that your users can chat with.
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
                    <li className="mb-2">GitHub Pages workflow</li>
                    <li>Foundry prompt agent and runtime API</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {!runtimeUrl && <SetupNotice />}
        </div>
      </section>

      <section className="container py-5" id="setup">
        <div className="row g-4">
          <div className="col-md-4">
            <h2 className="h4">1. Deploy agent</h2>
            <p>
              Use the included workflow to create a Foundry prompt agent version
              from <code>agent/prompt-agent.json</code>.
            </p>
          </div>
          <div className="col-md-4">
            <h2 className="h4">2. Connect runtime</h2>
            <p>
              Deploy the included Azure Functions runtime. It invokes your
              prompt agent securely with server-side identity.
            </p>
          </div>
          <div className="col-md-4">
            <h2 className="h4">3. Deploy</h2>
            <p>
              GitHub Pages serves <code>dist</code>. Users chat with the
              Copilot popup.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-body-tertiary py-5" id="agent">
        <div className="container">
          <h2 className="h3">Foundry prompt agent setup</h2>
          <p className="mb-0">
            The static site never stores Azure credentials. The included Azure
            Functions API uses server-side identity to call Foundry.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  if (!runtimeUrl) {
    return <Page />;
  }

  return (
    <CopilotKit runtimeUrl={runtimeUrl}>
      <Page />
      <CopilotPopup
        labels={{
          modalHeaderTitle: "Foundry agent",
          welcomeMessageText: "Hi. Ask me about this site or try your Foundry agent.",
        }}
      />
    </CopilotKit>
  );
}
