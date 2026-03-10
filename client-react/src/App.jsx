import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const queryClient = new QueryClient();

const CurrentTime = ({ api }) => {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: [api],
    queryFn: () => axios.get(api).then((res) => res.data),
  });

  if (isLoading) return `Loading ${api}...`;
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <p>---</p>
      <p>API: {data.api}</p>
      <p>Time from DB: {data.now}</p>
      <div>{isFetching ? "Updating..." : ""}</div>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h1>Hey Team! 👋</h1>
      <CurrentTime api="/api/golang/" />
      <CurrentTime api="/api/node/" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;