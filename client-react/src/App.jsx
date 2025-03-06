import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import "./App.css";

const queryClient = new QueryClient();

const CurrentTime = ({ api }) => {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: [api],
    queryFn: () => axios.get(api).then((res) => res.data),
  });

  if (isLoading) return `Loading ${api}... `;

  if (error) return `An error has occurred: ${error.message}`;

  return (
    <div className="App">
      <p>---</p>
      <p>API: {data?.api}</p>
      <p>Time from DB: {data?.now}</p>
      <div>{isFetching ? "Updating..." : ""}</div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>Hey Team! 👋</h1>
      <CurrentTime api="/api/golang" />
      <CurrentTime api="/api/node" />
    </QueryClientProvider>
  );
};

export default App;
