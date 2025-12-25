import { createServerRpc } from '@tanstack/react-start/server-rpc';
import { createFileRoute } from '@tanstack/react-router';
import { createIsomorphicFn, createServerFn } from '@tanstack/react-start';
import { useState } from 'react';
const getEnv = createIsomorphicFn().server(() => 'server').client(() => 'client');
const getServerEnv_createServerFn_handler = createServerRpc({
  id: "eyJmaWxlIjoiL0BpZC9zcmMvdGVzdC50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJnZXRTZXJ2ZXJFbnZfY3JlYXRlU2VydmVyRm5faGFuZGxlciJ9",
  name: "getServerEnv",
  filename: "src/test.ts"
}, (opts, signal) => getServerEnv.__executeServer(opts, signal));
const getServerEnv = createServerFn().handler(getServerEnv_createServerFn_handler, () => getEnv());
const getEcho = createIsomorphicFn().server((input: string) => 'server received ' + input).client(input => 'client received ' + input);
const getServerEcho_createServerFn_handler = createServerRpc({
  id: "eyJmaWxlIjoiL0BpZC9zcmMvdGVzdC50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJnZXRTZXJ2ZXJFY2hvX2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ",
  name: "getServerEcho",
  filename: "src/test.ts"
}, (opts, signal) => getServerEcho.__executeServer(opts, signal));
const getServerEcho = createServerFn().inputValidator((input: string) => input).handler(getServerEcho_createServerFn_handler, ({
  data
}) => getEcho(data));
const Route = createFileRoute('/isomorphic-fns')({
  component: RouteComponent,
  loader() {
    return {
      envOnLoad: getEnv()
    };
  }
});
function RouteComponent() {
  const {
    envOnLoad
  } = Route.useLoaderData();
  const [results, setResults] = useState<Partial<Record<string, string>>>();
  async function handleClick() {
    const envOnClick = getEnv();
    const echo = getEcho('hello');
    const [serverEnv, serverEcho] = await Promise.all([getServerEnv(), getServerEcho({
      data: 'hello'
    })]);
    setResults({
      envOnClick,
      echo,
      serverEnv,
      serverEcho
    });
  }
  const {
    envOnClick,
    echo,
    serverEnv,
    serverEcho
  } = results || {};
  return <div>
      <button onClick={handleClick} data-testid="test-isomorphic-results-btn">
        Run
      </button>
      {!!results && <div>
          <h1>
            <code>getEnv</code>
          </h1>
          When we called the function on the server it returned:
          <pre data-testid="server-result">{JSON.stringify(serverEnv)}</pre>
          When we called the function on the client it returned:
          <pre data-testid="client-result">{JSON.stringify(envOnClick)}</pre>
          When we called the function during SSR it returned:
          <pre data-testid="ssr-result">{JSON.stringify(envOnLoad)}</pre>
          <br />
          <h1>
            <code>echo</code>
          </h1>
          When we called the function on the server it returned:
          <pre data-testid="server-echo-result">
            {JSON.stringify(serverEcho)}
          </pre>
          When we called the function on the client it returned:
          <pre data-testid="client-echo-result">{JSON.stringify(echo)}</pre>
        </div>}
    </div>;
}
export { getServerEnv_createServerFn_handler, getServerEcho_createServerFn_handler };